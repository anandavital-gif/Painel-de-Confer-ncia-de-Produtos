import { ANEXO3_MS } from '../data/ricmsMs'

export function lookupST(ncmCode) {
  if (!ncmCode) return null
  const clean = ncmCode.replace(/\D/g, '').padStart(8, '0').slice(0, 8)
  return ANEXO3_MS.find(item =>
    item.ncms.some(ncm => {
      const n = ncm.replace(/\D/g, '')
      // Exact match or prefix match (partial NCMs in the decree are chapter/heading prefixes)
      return n.length === 8 ? n === clean : clean.startsWith(n)
    })
  ) ?? null
}

export function formatCEST(cest) {
  const d = String(cest).replace(/\D/g, '').padStart(7, '0')
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
}
