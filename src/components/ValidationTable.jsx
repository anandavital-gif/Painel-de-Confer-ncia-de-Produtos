import { useState } from 'react'
import { exportEnrichedExcel } from '../utils/sheetParser'

const STATUS_CONFIG = {
  valid:   { label: 'Coerente',     bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  warning: { label: 'Verificar',    bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  invalid: { label: 'NCM Inválido', bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-400'     },
}

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] ?? STATUS_CONFIG.warning
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

function Summary({ results }) {
  const valid   = results.filter(r => r.status === 'valid').length
  const warning = results.filter(r => r.status === 'warning').length
  const invalid = results.filter(r => r.status === 'invalid').length

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {[
        { label: 'Coerentes',    count: valid,   color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
        { label: 'A verificar',  count: warning, color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200'     },
        { label: 'NCM inválido', count: invalid, color: 'text-red-600',     bg: 'bg-red-50 border-red-200'         },
      ].map(s => (
        <div key={s.label} className={`rounded-xl border px-4 py-3 ${s.bg}`}>
          <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
          <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export default function ValidationTable({ results, running, progress, total, done, onReset }) {
  const [filter, setFilter] = useState('all')

  const visible = filter === 'all'
    ? results
    : results.filter(r => r.status === filter)

  return (
    <div className="space-y-4">
      {/* Progresso */}
      {running && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Validando via BrasilAPI...</span>
            <span className="text-sm text-gray-500">{progress} / {total}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-[#1351b4] h-2 rounded-full transition-all duration-300"
              style={{ width: `${total ? (progress / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Resumo + ações */}
      {done && (
        <>
          <Summary results={results} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Filtros */}
            <div className="flex gap-1.5">
              {[
                { key: 'all',     label: 'Todos' },
                { key: 'warning', label: 'A verificar' },
                { key: 'invalid', label: 'Inválidos' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === f.key
                      ? 'bg-[#1351b4] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Exportar + Nova validação */}
            <div className="flex gap-2">
              <button
                onClick={() => exportEnrichedExcel(results)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-xl hover:bg-emerald-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar Excel
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2 border border-gray-300 text-gray-600 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Nova validação
              </button>
            </div>
          </div>
        </>
      )}

      {/* Tabela */}
      {visible.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Produto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">NCM</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Descrição BrasilAPI</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">ICMS — MS</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">CEST</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">MVA Int.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">MVA Ext.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map((r) => (
                  <tr key={r.linha} className={`hover:bg-gray-50 ${r.status === 'invalid' ? 'bg-red-50/40' : r.status === 'warning' ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-3 text-xs text-gray-400">{r.linha}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs">
                      <span className="line-clamp-2">{r.produto || '—'}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[#1351b4] font-bold">{r.ncmFormatado || r.ncm}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-sm">
                      <span className="line-clamp-2 text-xs">{r.descricaoNCM ?? <span className="text-red-400 italic">Não encontrado</span>}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {r.cest
                        ? <span className="text-emerald-700 font-medium">ST — Anexo III RICMS/MS</span>
                        : <span className="text-orange-600">Integral (17%) — ECONET</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-700">{r.cest ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{r.mvaInterno != null ? `${r.mvaInterno.toFixed(2).replace('.', ',')}%` : '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{r.mvaExterno != null ? `${r.mvaExterno.toFixed(2).replace('.', ',')}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
