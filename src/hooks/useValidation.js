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
      icmsRegime: '—',
      cest: null,
      mvaInterno: null,
      mvaExterno: null,
    }
  }

  const coerencia = computeCoherence(row.produto, ncmData.descricao)
  const st = lookupST(row.ncm)

  const vigencia = ncmData.data_inicio
    ? `${formatDate(ncmData.data_inicio)}${ncmData.data_fim && ncmData.data_fim !== '9999-12-31' ? ` até ${formatDate(ncmData.data_fim)}` : ''}`
    : null

  return {
    ...row,
    ncmFormatado,
    descricaoNCM: ncmData.descricao,
    vigencia,
    atoNormativo: formatAto(ncmData),
    status: coerencia >= 0.35 ? 'valid' : 'warning',
    statusLabel: coerencia >= 0.35 ? 'Coerente' : 'Verificar',
    coerencia,
    icmsRegime: st
      ? `ST — Anexo III RICMS/MS`
      : 'Tributação Integral (17%) — Consultar ECONET',
    cest: st ? formatCEST(st.cest) : null,
    mvaInterno: st ? st.mva_interno : null,
    mvaExterno: st ? st.mva_externo : null,
  }
}

export function useValidation() {
  const [results, setResults]     = useState([])
  const [progress, setProgress]   = useState(0)
  const [total, setTotal]         = useState(0)
  const [running, setRunning]     = useState(false)
  const [done, setDone]           = useState(false)

  const run = useCallback(async (rows) => {
    setRunning(true)
    setDone(false)
    setResults([])
    setProgress(0)
    setTotal(rows.length)

    // Deduplica NCMs para não chamar a API duas vezes pelo mesmo código
    const cache = new Map()

    const final = []
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const clean = row.ncm.replace(/\D/g, '')

      let ncmData = null
      let error = null

      if (clean.length !== 8) {
        error = 'NCM inválido'
      } else if (cache.has(clean)) {
        ncmData = cache.get(clean)
      } else {
        try {
          const res = await fetch(`${BRASIL_API}/${clean}`)
          if (res.ok) {
            ncmData = await res.json()
            cache.set(clean, ncmData)
          } else {
            error = `HTTP ${res.status}`
          }
        } catch {
          error = 'Erro de rede'
        }
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
    setResults([])
    setProgress(0)
    setTotal(0)
    setRunning(false)
    setDone(false)
  }, [])

  return { results, progress, total, running, done, run, reset }
}
