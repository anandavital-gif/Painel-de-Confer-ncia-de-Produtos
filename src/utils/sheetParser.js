import * as XLSX from 'xlsx'

const STOPWORDS = new Set(['de','e','ou','para','com','sem','do','da','dos','das','um','uma','o','a','os','as','em','no','na','nos','nas','por','ao','aos','às','se'])

// ─── Detecção de colunas ─────────────────────────────────────────────────────

function findNCMColumn(headers) {
  // Só aceita colunas cujo cabeçalho é exatamente "ncm" ou contém "ncm"
  // como palavra isolada. Evita pegar "código" ou "cest".
  let idx = headers.findIndex(h => h.trim() === 'ncm')
  if (idx === -1) idx = headers.findIndex(h => /\bncm\b/.test(h) && !/cest/i.test(h))
  return idx
}

function findDescricaoColumn(headers) {
  // Prioridade: "descrição", "descrição do produto", "nome do produto", "produto"
  // Exclui colunas que contenham "código", "cod", "cest" ou "ncm"
  const exclude = /c[oó]d(igo)?|cest|\bncm\b/i
  let idx = headers.findIndex(h => /descri/i.test(h) && !exclude.test(h))
  if (idx === -1) idx = headers.findIndex(h => /\bproduto\b|\bnome\b|\bitem\b/i.test(h) && !exclude.test(h))
  return idx
}

function findCESTColumn(headers) {
  return headers.findIndex(h => /\bcest\b/i.test(h))
}

function detectColumns(rawHeaders, dataRows) {
  const headers = rawHeaders.map(h => String(h ?? '').toLowerCase().trim())

  let ncmIdx   = findNCMColumn(headers)
  let prodIdx  = findDescricaoColumn(headers)
  let cestIdx  = findCESTColumn(headers)

  // Fallback sem cabeçalho reconhecido: assume col 0 = produto, col 1 = NCM
  if (prodIdx === -1 && ncmIdx === -1) { prodIdx = 0; ncmIdx = 1 }

  const items = dataRows
    .map((row, i) => ({
      linha:        i + 2,
      produto:      String(row[prodIdx] ?? '').trim(),
      ncm:          String(row[ncmIdx]  ?? '').trim(),
      cestOriginal: cestIdx !== -1 ? String(row[cestIdx] ?? '').trim() : '',
      _row:         row,
    }))
    .filter(r => r.produto || r.ncm)

  return { items, originalHeaders: rawHeaders, ncmIdx, prodIdx, cestIdx }
}

// ─── Parsers ─────────────────────────────────────────────────────────────────

export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb   = XLSX.read(e.target.result, { type: 'array' })
        const ws   = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
        if (rows.length < 2) throw new Error('Planilha sem dados.')
        resolve(detectColumns(rows[0], rows.slice(1)))
      } catch (err) {
        reject(new Error(err.message || 'Não foi possível ler o arquivo.'))
      }
    }
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseGoogleSheets(url) {
  const { id, gid } = extractSheetParams(url)
  if (!id) throw new Error('Link inválido. Use um link do Google Planilhas.')

  let csvUrl = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`
  if (gid) csvUrl += `&gid=${gid}`

  const res = await fetch(csvUrl)
  if (!res.ok) throw new Error('Não foi possível acessar a planilha. Verifique se está compartilhada como "Qualquer pessoa com o link".')

  const text = await res.text()
  const rows = parseCSVText(text)
  if (rows.length < 2) throw new Error('Planilha vazia ou sem dados.')
  return detectColumns(rows[0], rows.slice(1))
}

function extractSheetParams(url) {
  const idMatch  = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  const gidMatch = url.match(/[?&#]gid=(\d+)/)
  return {
    id:  idMatch  ? idMatch[1]  : null,
    gid: gidMatch ? gidMatch[1] : null,
  }
}

function parseCSVText(text) {
  // RFC-4180 básico: lida com campos entre aspas contendo vírgulas
  return text.split(/\r?\n/).map(line => {
    const cells = []
    let cur = '', inQuote = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') { inQuote = !inQuote }
      else if (ch === ',' && !inQuote) { cells.push(cur.trim()); cur = '' }
      else { cur += ch }
    }
    cells.push(cur.trim())
    return cells
  }).filter(row => row.some(c => c))
}

// ─── Coerência ───────────────────────────────────────────────────────────────

export function computeCoherence(produto, descricaoNCM) {
  if (!descricaoNCM) return 0
  const palavras = produto.toLowerCase().split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w))
  if (!palavras.length) return 0
  const desc = descricaoNCM.toLowerCase()
  return palavras.filter(w => desc.includes(w)).length / palavras.length
}

// ─── Exportação ──────────────────────────────────────────────────────────────

const OUTPUT_HEADERS = [
  'NCM Correto',
  'CEST Correto',
  'CST PIS e COFINS',
  'Regime ICMS/MS',
  'Segmento ST',
  'MVA Interno (%)',
  'MVA Externo (%)',
  'Descrição NCM (BrasilAPI)',
  'Vigência',
  'Ato Normativo',
  'Validação Descrição',
]

const OUTPUT_WIDTHS = [16, 16, 22, 36, 20, 16, 16, 44, 22, 26, 18]

export function exportEnrichedExcel(results, originalHeaders) {
  const origHeaders = (originalHeaders ?? []).map(h => String(h ?? ''))

  // Cabeçalho: colunas originais + colunas de saída
  const headerRow = [...origHeaders, ...OUTPUT_HEADERS]

  const dataRows = results.map(r => {
    const orig = (r._row ?? []).map(c => c ?? '')

    const ncmCorreto = r.status === 'invalid'
      ? 'NCM NÃO ENCONTRADO'
      : r.ncmFormatado

    const cestCorreto = r.cest
      ? r.cest
      : 'SEM ST — Tributação Integral'

    const cstPisCofins = r.status === 'invalid'
      ? '—'
      : '01 — Operação tributável (verificar regime fiscal)'

    const regimeICMS = r.cest
      ? `ST — Anexo III RICMS/MS (Dec. 9.203/1998)`
      : 'Tributação Integral (17%) — Consultar ECONET'

    const segmento   = r.segmento ?? ''
    const mvaInt     = r.mvaInterno  != null ? `${r.mvaInterno.toFixed(2).replace('.', ',')}%` : ''
    const mvaExt     = r.mvaExterno  != null ? `${r.mvaExterno.toFixed(2).replace('.', ',')}%` : ''
    const descBrasil = r.descricaoNCM ?? ''
    const vigencia   = r.vigencia ?? ''
    const ato        = r.atoNormativo ?? ''
    const validacao  = r.statusLabel ?? ''

    return [...orig, ncmCorreto, cestCorreto, cstPisCofins, regimeICMS,
      segmento, mvaInt, mvaExt, descBrasil, vigencia, ato, validacao]
  })

  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows])

  // Larguras: originais (30 cada) + saídas
  const origWidths = origHeaders.map(() => ({ wch: 28 }))
  ws['!cols'] = [...origWidths, ...OUTPUT_WIDTHS.map(w => ({ wch: w }))]

  // Estilo de cabeçalho nas colunas de saída (fundo azul — requer xlsx-style ou workaround)
  const lastOrigCol = origHeaders.length
  for (let c = lastOrigCol; c < lastOrigCol + OUTPUT_HEADERS.length; c++) {
    const cellAddr = XLSX.utils.encode_cell({ r: 0, c })
    if (ws[cellAddr]) ws[cellAddr].s = { font: { bold: true } }
  }

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Validação NCM')
  XLSX.writeFile(wb, 'validacao-ncm.xlsx')
}
