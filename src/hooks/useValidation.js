import { useState, useCallback } from 'react'
import { computeCoherence } from '../utils/sheetParser'
import { lookupST, formatCEST } from '../utils/icmsST'
import { formatNCM, formatDate, formatAto } from '../utils/format'

const BRASIL_API = 'https://brasilapi.com.br/api/ncm/v1'
const DELAY_MS = 150

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function buildResult(row, ncmData, error) {
  const ncmFormatado = formatNCM(row.ncm.replace(/\D/g, ''))

  if (error || !ncmData) {
    return {
      ...row,
      ncmFormatado,
      descricaoNCM: null,
      vigencia: null,
      atoNormativo: null,
      status: 'invalid',
      statusLabel: 'NCM Inválido',
      coerencia: 0,
      segmento: null,
      cest: null,
      cestOriginalOk: false,
      mvaInterno: null,
      mvaExterno: null,
      icmsRegime: '—',
    }
  }

  const st = lookupST(row.ncm)
  const coerencia = computeCoherence(row.produto, ncmData.descricao)

  const vigencia = ncmData.data_inicio
    ? `${formatDate(ncmData.data_inicio)}${
        ncmData.data_fim && ncmData.data_fim !== '9999-12-31'
          ? ` até ${formatDate(ncmData.data_fim)}`
          : ''
      }`
    : null

  const cestCorreto = st ? formatCEST(st.cest) : null
  const cestOriginalOk = cestCorreto
    ? row.cestOriginal.replace(/\D/g, '') === st.cest.replace(/\D/g, '')
    : !row.cestOriginal

  return {
    ...row,
    ncmFormatado,
    descricaoNCM: ncmData.descricao,
    vigencia,
    atoNormativo: formatAto(ncmData),
    status: coerencia >= 0.35 ? 'valid' : 'warning',
    statusLabel: coerencia >= 0.35 ? 'Coerente' : 'Verificar',
    coerencia,
    segmento: st?.segmento ?? null,
    cest: cestCorreto,
    cestOriginalOk,
    mvaInterno: st?.mva_interno ?? null,
    mvaExterno: st?.mva_externo ?? null,
    icmsRegime: st ? 'ST — Anexo III RICMS/MS' : 'Tributação Integral (17%) — Consultar ECONET',
  }
}

export function useValidation() {
  const [results, setResults]   = useState([])
  const [progress, setProgress] = useState(0)
  const [total, setTotal]       = useState(0)
  const [running, setRunning]   = useState(false)
  const [done, setDone]         = useState(false)

  // parseResult = { items, originalHeaders }
  const run = useCallback(async (parseResult) => {
    const rows = parseResult.items ?? parseResult
    setRunning(true)
    setDone(false)
    setResults([])
    setProgress(0)
    setTotal(rows.length)

    const cache = new Map()
    const final = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const clean = row.ncm.replace(/\D/g, '')
      let ncmData = null, error = null

      if (clean.length !== 8) {
        error = 'NCM inválido'
      } else if (cache.has(clean)) {
        ncmData = cache.get(clean)
      } else {
        try {
          const res = await fetch(`${BRASIL_API}/${clean}`)
          if (res.ok) { ncmData = await res.json(); cache.set(clean, ncmData) }
          else error = `HTTP ${res.status}`
        } catch { error = 'Erro de rede' }
        await sleep(DELAY_MS)
      }

      final.push(buildResult(row, ncmData, error))
      setProgress(i + 1)
      setResults([...final])
    }

    setRunning(false)
    setDone(true)
  }, [])

  const reset = useCallback(() => {
    setResults([]); setProgress(0); setTotal(0); setRunning(false); setDone(false)
  }, [])

  return { results, progress, total, running, done, run, reset }
}
