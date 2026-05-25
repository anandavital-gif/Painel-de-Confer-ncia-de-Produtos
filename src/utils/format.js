export function formatNCM(code) {
  if (!code) return ''
  const d = code.replace(/\D/g, '')
  if (d.length !== 8) return code
  return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}`
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function formatAto(ncm) {
  if (!ncm.tipo_ato) return null
  return `${ncm.tipo_ato} nº ${ncm.numero_ato}/${ncm.ano_ato}`
}

export function isActive(ncm) {
  if (!ncm.data_fim) return true
  return new Date(ncm.data_fim) >= new Date()
}
