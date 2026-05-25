import { useState } from 'react'

export default function EconetButton({ ncm, size = 'sm' }) {
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(ncm.replace(/\D/g, ''))
    } catch {
      // clipboard pode falhar em http — ignora silenciosamente
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
    window.open('https://www.econeteditora.com.br/', '_blank', 'noopener')
  }

  const base = size === 'xs'
    ? 'px-2.5 py-1 text-xs gap-1.5'
    : 'px-4 py-2 text-sm gap-2'

  return (
    <button
      onClick={handleClick}
      title={`Abre a ECONET e copia o NCM ${ncm} para a área de transferência`}
      className={`inline-flex items-center ${base} bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors`}
    >
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      {copied ? '✓ NCM copiado — cole na ECONET' : 'Consultar na ECONET'}
    </button>
  )
}
