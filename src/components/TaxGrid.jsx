import { useState } from 'react'

const TAXES = [
  {
    id: 'ipi',
    name: 'IPI',
    fullName: 'Imposto sobre Produtos Industrializados',
    color: 'blue',
    badgeClass: 'bg-blue-600 text-white',
    rateLabel: '0% a 365% conforme TIPI',
    legislation: [
      { label: 'Decreto 7.212/2010', note: 'RIPI — Regulamento do IPI' },
      { label: 'TIPI vigente', note: 'Decreto 11.158/2022' },
    ],
    note: 'Incide sobre produtos industrializados nacionais e importados. Pode ser NT (Não Tributado) ou isento para cesta básica. Verifique Ex-tarifários para reduções específicas.',
    authority: 'Receita Federal do Brasil',
    linkLabel: 'Consultar TIPI',
    link: 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/documentos-e-recursos/tipi',
  },
  {
    id: 'icms',
    name: 'ICMS',
    fullName: 'Imposto sobre Circulação de Mercadorias e Serviços',
    color: 'emerald',
    badgeClass: 'bg-emerald-600 text-white',
    rateLabel: 'Alíquota interna MS: 17%',
    legislation: [
      { label: 'Lei Complementar 87/1996', note: 'Lei Kandir' },
      { label: 'Convênios ICMS — CONFAZ', note: 'Protocolos interestaduais' },
      { label: 'Decreto Estadual nº 9.203/1998 — Anexo III', note: 'RICMS/MS — Substituição Tributária' },
    ],
    note: 'Para ICMS-ST: base de cálculo, MVA e alíquotas definidas no Anexo III do RICMS/MS. Verifique o CEST do produto para identificar sujeição ao regime.',
    authority: 'SEFAZ/MS',
    linkLabel: 'SEFAZ/MS',
    link: 'https://www.sefaz.ms.gov.br/',
  },
  {
    id: 'pis',
    name: 'PIS',
    fullName: 'Programa de Integração Social',
    color: 'amber',
    badgeClass: 'bg-amber-500 text-white',
    rateLabel: 'Cumulativo 0,65% · Não-cumulativo 1,65%',
    legislation: [
      { label: 'Lei 10.637/2002', note: 'Regime não-cumulativo' },
      { label: 'Lei 10.147/2000', note: 'Monofásico: fármacos, cosméticos' },
      { label: 'Lei 9.715/1998', note: 'Regime cumulativo' },
    ],
    note: 'Produtos sujeitos à alíquota monofásica têm recolhimento concentrado no fabricante/importador. Verifique o enquadramento conforme a Lei 10.147/2000.',
    authority: 'Receita Federal do Brasil',
    linkLabel: 'RFB',
    link: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/contribuicoes-sociais/pis-pasep',
  },
  {
    id: 'cofins',
    name: 'COFINS',
    fullName: 'Contribuição para Financiamento da Seguridade Social',
    color: 'orange',
    badgeClass: 'bg-orange-500 text-white',
    rateLabel: 'Cumulativo 3,00% · Não-cumulativo 7,60%',
    legislation: [
      { label: 'Lei 10.833/2003', note: 'Regime não-cumulativo' },
      { label: 'Lei 10.147/2000', note: 'Monofásico: fármacos, cosméticos' },
      { label: 'Lei 9.718/1998', note: 'Regime cumulativo' },
    ],
    note: 'Mesmo regime do PIS. Para alíquota zero ou isenção, verifique legislação específica de cada categoria de produto.',
    authority: 'Receita Federal do Brasil',
    linkLabel: 'RFB',
    link: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/contribuicoes-sociais/cofins',
  },
  {
    id: 'ii',
    name: 'II',
    fullName: 'Imposto de Importação',
    color: 'violet',
    badgeClass: 'bg-violet-600 text-white',
    rateLabel: 'Alíquota conforme TEC (Tarifa Externa Comum)',
    legislation: [
      { label: 'TEC — Tarifa Externa Comum', note: 'Resolução CAMEX' },
      { label: 'Decreto-Lei 37/1966', note: 'Código Tributário de Importação' },
    ],
    note: 'Base de cálculo: valor aduaneiro (CIF). Aplica-se somente a produtos importados do exterior. Sujeito a Ex-tarifário para bens de capital.',
    authority: 'CAMEX / MDIC',
    linkLabel: 'MDIC',
    link: 'https://www.gov.br/mdic/pt-br',
  },
]

const BORDER = {
  blue:    'border-blue-200',
  emerald: 'border-emerald-200',
  amber:   'border-amber-200',
  orange:  'border-orange-200',
  violet:  'border-violet-200',
}
const RATE_BG = {
  blue:    'bg-blue-50 text-blue-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber:   'bg-amber-50 text-amber-700',
  orange:  'bg-orange-50 text-orange-700',
  violet:  'bg-violet-50 text-violet-700',
}

function TaxCard({ tax, extraNote }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`bg-white rounded-xl border ${BORDER[tax.color]} overflow-hidden shadow-sm`}>
      {/* Cabeçalho — sempre visível */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${tax.badgeClass}`}>
          {tax.name}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">{tax.fullName}</p>
          <p className={`text-xs mt-0.5 font-semibold px-2 py-0.5 rounded-md inline-block ${RATE_BG[tax.color]}`}>
            {tax.rateLabel}
          </p>
        </div>
        {extraNote && (
          <span className="shrink-0 w-2 h-2 rounded-full bg-orange-400" title="Atenção" />
        )}
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Corpo expansível */}
      {open && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-3">
          {/* Legislação */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
              Legislação de referência
            </p>
            <ul className="space-y-1">
              {tax.legislation.map(leg => (
                <li key={leg.label} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                  <span className="text-xs text-gray-700">
                    <strong>{leg.label}</strong>
                    <span className="text-gray-400"> — {leg.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Observação */}
          <div className="bg-gray-50 rounded-lg px-3 py-2.5">
            <p className="text-xs text-gray-600 leading-relaxed">{tax.note}</p>
          </div>

          {/* Alerta ECONET */}
          {extraNote && (
            <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">
              <svg className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-orange-800 leading-relaxed">{extraNote}</p>
            </div>
          )}

          {/* Rodapé */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-400">{tax.authority}</span>
            <a
              href={tax.link}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-[#1351b4] hover:underline flex items-center gap-1"
            >
              {tax.linkLabel}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TaxGrid({ hasST = false }) {
  const visibleTaxes = hasST ? TAXES.filter(t => t.id !== 'icms') : TAXES

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Tributação aplicável</h3>
        <span className="text-xs text-gray-400">Clique em cada imposto para ver os detalhes</span>
      </div>

      <div className="space-y-2">
        {visibleTaxes.map(tax => (
          <TaxCard
            key={tax.id}
            tax={tax}
            extraNote={
              tax.id === 'icms' && !hasST
                ? 'Este produto não consta no Anexo III do RICMS/MS — sujeito à tributação integral de ICMS (17%). Analise o caso manualmente junto à ECONET.'
                : undefined
            }
          />
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Reforma Tributária (EC 132/2023 · LC 214/2025):</strong> A partir de 2026, o IVA Dual (CBS + IBS)
          substituirá progressivamente o PIS/COFINS (federal) e o ICMS/ISS (subnacional).
          A transição ocorre entre 2026 e 2033.
        </p>
      </div>
    </div>
  )
}
