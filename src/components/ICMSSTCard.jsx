import { formatCEST } from '../utils/icmsST'

function Row({ label, value, highlight }) {
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${highlight ? 'bg-emerald-50' : 'bg-gray-50'}`}>
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-emerald-700' : 'text-gray-800'}`}>{value}</span>
    </div>
  )
}

export default function ICMSSTCard({ st }) {
  return (
    <div className="rounded-xl border-2 border-emerald-400 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-emerald-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-white text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md">ICMS-ST</span>
          <span className="text-white text-sm font-medium">Substituição Tributária — MS</span>
        </div>
        <span className="text-emerald-100 text-xs bg-emerald-700/50 px-2 py-0.5 rounded-full">
          {st.segmento}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Descrição ST */}
        <p className="text-sm text-gray-700 leading-snug">{st.descricao}</p>

        {/* CEST + MVAs */}
        <div className="space-y-1.5">
          <Row
            label="CEST (Convênio ICMS 142/2018)"
            value={formatCEST(st.cest)}
            highlight
          />
          <Row
            label="MVA Interno (MS → MS)"
            value={`${st.mva_interno.toFixed(2).replace('.', ',')}%`}
          />
          <Row
            label="MVA Externo (outro estado → MS)"
            value={`${st.mva_externo.toFixed(2).replace('.', ',')}%`}
          />
        </div>

        {/* Rodapé legislação */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Decreto Estadual nº 9.203/1998 — Anexo III
          </span>
          <a
            href="https://www.sefaz.ms.gov.br/legislacao/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-emerald-600 hover:underline flex items-center gap-0.5"
          >
            SEFAZ/MS
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
