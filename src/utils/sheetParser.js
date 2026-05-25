import * as XLSX from 'xlsx'

const STOPWORDS = new Set(['de','e','ou','para','com','sem','do','da','dos','das','um','uma','o','a','os','as','em','no','na','nos','nas','por','ao','aos','às','se'])

export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
        resolve(detectColumns(rows))
      } catch (err) {
        reject(new Error('Não foi possível ler o arquivo. Verifique se é um Excel (.xlsx) ou CSV válido.'))
      }
    }
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseGoogleSheets(url) {
  const id = extractSheetId(url)
  if (!id) throw new Error('Link inválido. Use um link do Google Planilhas.')
  const csvUrl = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`
  const res = await fetch(csvUrl)
  if (!res.ok) throw new Error('Não foi possível acessar a planilha. Verifique se está compartilhada como "Qualquer pessoa com o link".')
  const text = await res.text()
  const rows = parseCSVText(text)
  return detectColumns(rows)
}

function extractSheetId(url) {
  const m = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return m ? m[1] : null
}

function parseCSVText(text) {
  return text.split('\n').map(line =>
    line.split(',').map(cell => cell.replace(/^"|"$/g, '').trim())
  ).filter(row => row.some(c => c))
}

function detectColumns(rows) {
  if (!rows.length) throw new Error('Planilha vazia.')

  const header = rows[0].map(h => String(h).toLowerCase())
  let prodIdx = header.findIndex(h => /produto|nome|descri|item/i.test(h))
  let ncmIdx  = header.findIndex(h => /ncm|c.?digo|codigo/i.test(h))

  const hasHeader = prodIdx !== -1 || ncmIdx !== -1
  if (!hasHeader) {
    prodIdx = 0
    ncmIdx  = 1
  }

  const dataRows = hasHeader ? rows.slice(1) : rows

  const items = dataRows
    .map((row, i) => ({
      linha: hasHeader ? i + 2 : i + 1,
      produto: String(row[prodIdx] ?? '').trim(),
      ncm:     String(row[ncmIdx]  ?? '').trim(),
    }))
    .filter(r => r.produto || r.ncm)

  if (!items.length) throw new Error('Nenhuma linha com dados encontrada.')
  return items
}

export function computeCoherence(produto, descricaoNCM) {
  if (!descricaoNCM) return 0
  const palavras = produto.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w))
  if (!palavras.length) return 0
  const desc = descricaoNCM.toLowerCase()
  const matches = palavras.filter(w => desc.includes(w))
  return matches.length / palavras.length
}

export function exportEnrichedExcel(results, originalRows) {
  const header = [
    'Linha',
    'Produto (planilha)',
    'NCM',
    'Descrição NCM (BrasilAPI)',
    'Validação',
    'Vigência',
    'Ato Normativo',
    'ICMS — Regime MS',
    'CEST',
    'MVA Interno (%)',
    'MVA Externo (%)',
  ]

  const data = results.map(r => [
    r.linha,
    r.produto,
    r.ncmFormatado,
    r.descricaoNCM ?? '',
    r.statusLabel,
    r.vigencia ?? '',
    r.atoNormativo ?? '',
    r.icmsRegime,
    r.cest ?? '',
    r.mvaInterno != null ? r.mvaInterno.toFixed(2).replace('.', ',') + '%' : '',
    r.mvaExterno != null ? r.mvaExterno.toFixed(2).replace('.', ',') + '%' : '',
  ])

  const ws = XLSX.utils.aoa_to_sheet([header, ...data])

  // Larguras de coluna
  ws['!cols'] = [6, 30, 14, 40, 16, 24, 24, 30, 12, 16, 16].map(w => ({ wch: w }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Validação NCM')
  XLSX.writeFile(wb, 'validacao-ncm.xlsx')
}
