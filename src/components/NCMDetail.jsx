import { formatNCM, formatDate, formatAto, isActive } from '../utils/format'
import TaxGrid from './TaxGrid'

export default function NCMDetail({ ncm, onBack }) {
  const ato = formatAto(ncm)
  const active = isActive(ncm)

  return (
    <div className="space-y-4">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#1351b4] hover:text-blue-800 font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar aos resultados
        </button>
      )}

      {/* NCM Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-[#1351b4] px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-1">
              Código NCM
            </p>
            <h2 className="text-white font-mono text-3xl font-bold tracking-wider">
              {formatNCM(ncm.codigo)}
            </h2>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-1 shrink-0 ${
            active
              ? 'bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/40'
              : 'bg-red-500/20 text-red-100 ring-1 ring-red-400/40'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-300' : 'bg-red-300'}`} />
            {active ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        <div className="px-6 py-5">
          <p className="text-gray-800 font-medium leading-relaxed">{ncm.descricao}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            {ato && (
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-[#1351b4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-medium text-[#1351b4]">{ato}</span>
              </div>
            )}

            {ncm.data_inicio && (
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-600">
                  Vigência: {formatDate(ncm.data_inicio)}
                  {ncm.data_fim && ncm.data_fim !== '9999-12-31'
                    ? ` até ${formatDate(ncm.data_fim)}`
                    : ' (sem data de encerramento)'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <TaxGrid />
    </div>
  )
}
