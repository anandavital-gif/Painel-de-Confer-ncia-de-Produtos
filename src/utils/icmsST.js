import { ANEXO3_MS } from '../data/ricmsMs'

export function lookupST(ncmCode) {
  if (!ncmCode) return null
  const clean = ncmCode.replace(/\D/g, '')
  return ANEXO3_MS.find(item =>
    item.ncms.some(ncm => ncm.replace(/\D/g, '') === clean)
  ) ?? null
}

export function formatCEST(cest) {
  const d = String(cest).replace(/\D/g, '').padStart(7, '0')
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
}
