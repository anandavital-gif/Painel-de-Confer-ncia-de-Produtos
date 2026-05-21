const TAXES = [
  {
    id: 'ipi',
    name: 'IPI',
    fullName: 'Imposto sobre Produtos Industrializados',
    colorClass: 'bg-blue-50 border-blue-200',
    badgeClass: 'bg-[#1351b4] text-white',
    iconColor: 'text-[#1351b4]',
    legislation: [
      { label: 'Decreto 7.212/2010', note: 'RIPI — Regulamento do IPI' },
      { label: 'TIPI vigente', note: 'Decreto 11.158/2022' },
    ],
    rates: 'Alíquota definida por posição na TIPI (0% a 365%). Pode ser NT (Não Tributado) ou isento.',
    authority: 'Receita Federal do Brasil',
    note: 'Incide sobre produtos industrializados nacionais e importados. Verifique Ex tarifários para reduções específicas.',
    linkLabel: 'Consultar TIPI',
    link: 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/documentos-e-recursos/tipi',
  },
  {
    id: 'icms',
    name: 'ICMS',
    fullName: 'Imposto sobre Circulação de Mercadorias e Serviços',
    colorClass: 'bg-emerald-50 border-emerald-200',
    badgeClass: 'bg-emerald-600 text-white',
    iconColor: 'text-emerald-600',
    legislation: [
      { label: 'Lei Complementar 87/1996', note: 'Lei Kandir' },
      { label: 'Convênios ICMS — CONFAZ', note: 'Protocolos interestaduais' },
      { label: 'Decreto Estadual nº 9.203/1998 — Anexo III', note: 'RICMS/MS — Substituição Tributária' },
    ],
    rates: 'Alíquota interna MS: 17% (geral). ST: MVA e alíquotas conforme Anexo III do RICMS/MS.',
    authority: 'SEFAZ/MS — Secretaria de Estado de Fazenda do Mato Grosso do Sul',
    note: 'Para ICMS-ST: base de cálculo, MVA e alíquotas definidas no Anexo III do RICMS/MS (Decreto Estadual nº 9.203/1998). Verifique o CEST do produto para identificar sujeição ao regime.',
    linkLabel: 'SEFAZ/MS — Legislação',
    link: 'https://www.sefaz.ms.gov.br/',
  },
  {
    id: 'pis',
    name: 'PIS',
    fullName: 'Programa de Integração Social',
    colorClass: 'bg-amber-50 border-amber-200',
    badgeClass: 'bg-amber-500 text-white',
    iconColor: 'text-amber-600',
    legislation: [
      { label: 'Lei 10.637/2002', note: 'Regime não-cumulativo' },
      { label: 'Lei 10.147/2000', note: 'Monofásico: fármacos, cosméticos' },
      { label: 'Lei 9.715/1998', note: 'Regime cumulativo' },
    ],
    rates: 'Cumulativo (Simples / Presumido): 0,65% · Não-cumulativo (Lucro Real): 1,65%',
    authority: 'Receita Federal do Brasil',
    note: 'Produtos sujeitos à alíquota monofásica concentrada no fabricante/importador. Verifique enquadramento conforme a Lei 10.147/2000.',
    linkLabel: 'RFB — PIS/COFINS',
    link: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/contribuicoes-sociais/pis-pasep',
  },
  {
    id: 'cofins',
    name: 'COFINS',
    fullName: 'Contribuição para o Financiamento da Seguridade Social',
    colorClass: 'bg-orange-50 border-orange-200',
    badgeClass: 'bg-orange-500 text-white',
    iconColor: 'text-orange-500',
    legislation: [
      { label: 'Lei 10.833/2003', note: 'Regime não-cumulativo' },
      { label: 'Lei 10.147/2000', note: 'Monofásico: fármacos, cosméticos' },
      { label: 'Lei 9.718/1998', note: 'Regime cumulativo' },
    ],
    rates: 'Cumulativo (Simples / Presumido): 3,00% · Não-cumulativo (Lucro Real): 7,60%',
    authority: 'Receita Federal do Brasil',
    note: 'Mesmo regime e produtos do PIS. Para alíquota zero ou isenção, verifique legislação específica de cada categoria.',
    linkLabel: 'RFB — PIS/COFINS',
    link: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/tributos/contribuicoes-sociais/cofins',
  },
  {
    id: 'ii',
    name: 'II',
    fullName: 'Imposto de Importação',
    colorClass: 'bg-violet-50 border-violet-200',
    badgeClass: 'bg-violet-600 text-white',
    iconColor: 'text-violet-600',
    legislation: [
      { label: 'TEC — Tarifa Externa Comum', note: 'Resolução CAMEX' },
      { label: 'Decreto-Lei 37/1966', note: 'Código Tributário de Importação' },
    ],
    rates: 'Alíquota varia conforme a posição tarifária (TEC). Sujeito a Ex-tarifário para bens de capital e informática.',
    authority: 'CAMEX / Ministério do Desenvolvimento, Indústria e Comércio',
    note: 'Base de cálculo: valor aduaneiro (CIF). Aplica-se somente a produtos importados do exterior.',
    linkLabel: 'Siscomex — MDIC',
    link: 'https://www.gov.br/mdic/pt-br',
  },
]

function TaxCard({ tax, extraNote }) {
  return (
    <div className={`rounded-xl border p-4 ${tax.colorClass}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide ${tax.badgeClass}`}>
            {tax.name}
          </span>
          <p className="text-xs text-gray-500 mt-1 leading-tight">{tax.fullName}</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Legislação</p>
          <ul className="space-y-0.5">
            {tax.legislation.map((leg) => (
              <li key={leg.label} className="flex items-baseline gap-1.5">
                <span className="text-xs font-medium text-gray-700">{leg.label}</span>
                <span className="text-xs text-gray-400">— {leg.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Alíquotas</p>
          <p className="text-xs text-gray-700">{tax.rates}</p>
        </div>

        <div className="bg-white/70 rounded-lg px-3 py-2 border border-white/80">
          <p className="text-xs text-gray-600 leading-relaxed">{tax.note}</p>
        </div>

        {extraNote && (
          <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
            <svg className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-orange-800 leading-relaxed">{extraNote}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-gray-400">{tax.authority}</span>
          <a
            href={tax.link}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-[#1351b4] hover:underline flex items-center gap-0.5"
          >
            {tax.linkLabel}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function TaxGrid({ hasST = false }) {
  const visibleTaxes = hasST ? TAXES.filter(t => t.id !== 'icms') : TAXES

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Tributação aplicável</h3>
        <span className="text-xs text-gray-400">Legislação federal e estadual vigente</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visibleTaxes.map((tax) => (
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
          A transição ocorre entre 2026 e 2033. Monitore a legislação de implementação.
        </p>
      </div>
    </div>
  )
}
