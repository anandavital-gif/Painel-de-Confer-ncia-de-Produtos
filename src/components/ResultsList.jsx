import { formatNCM } from '../utils/format'

export default function ResultsList({ results, onSelect }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">{results.length}</span> NCMs encontrados — selecione para ver a tributação:
      </p>
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
        {results.map((ncm) => (
          <button
            key={ncm.codigo}
            onClick={() => onSelect(ncm)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-blue-50 text-left transition-colors group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="font-mono text-sm font-bold text-[#1351b4] shrink-0">
                {formatNCM(ncm.codigo)}
              </span>
              <span className="text-sm text-gray-700 truncate">{ncm.descricao}</span>
            </div>
            <svg
              className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0 ml-3 transition-colors"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
