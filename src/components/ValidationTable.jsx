import { useState } from 'react'
import { exportEnrichedExcel } from '../utils/sheetParser'
import EconetButton from './EconetButton'

const STATUS_CONFIG = {
  valid:   { label: 'Coerente',     bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  warning: { label: 'Verificar',    bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  invalid: { label: 'NCM Inválido', bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-400'     },
}

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] ?? STATUS_CONFIG.warning
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

function Summary({ results }) {
  const v = results.filter(r => r.status === 'valid').length
  const w = results.filter(r => r.status === 'warning').length
  const i = results.filter(r => r.status === 'invalid').length
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Coerentes',    n: v, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
        { label: 'A verificar',  n: w, color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200'     },
        { label: 'NCM inválido', n: i, color: 'text-red-600',     bg: 'bg-red-50 border-red-200'         },
      ].map(s => (
        <div key={s.label} className={`rounded-xl border px-4 py-3 ${s.bg}`}>
          <p className={`text-2xl font-bold ${s.color}`}>{s.n}</p>
          <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export default function ValidationTable({ results, running, progress, total, done, originalHeaders, onReset }) {
  const [filter, setFilter] = useState('all')

  const visible = filter === 'all' ? results : results.filter(r => r.status === filter)

  return (
    <div className="space-y-4">
      {running && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Validando via BrasilAPI...</span>
            <span className="text-sm text-gray-500">{progress} / {total}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-[#1351b4] h-2 rounded-full transition-all duration-300"
              style={{ width: `${total ? (progress / total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {done && (
        <>
          <Summary results={results} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1.5">
              {[['all','Todos'],['warning','A verificar'],['invalid','Inválidos']].map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === k ? 'bg-[#1351b4] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => exportEnrichedExcel(results, originalHeaders)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-xl hover:bg-emerald-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar Excel
              </button>
              <button onClick={onReset}
                className="px-4 py-2 border border-gray-300 text-gray-600 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Nova validação
              </button>
            </div>
          </div>
        </>
      )}

      {visible.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-3 py-3 text-left w-8">#</th>
                  <th className="px-3 py-3 text-left">Descrição (planilha)</th>
                  <th className="px-3 py-3 text-left w-28">NCM</th>
                  <th className="px-3 py-3 text-left w-24">Status</th>
                  {/* Colunas de saída — mesma ordem do Excel */}
                  <th className="px-3 py-3 text-left w-28 bg-blue-50">NCM Correto</th>
                  <th className="px-3 py-3 text-left w-28 bg-blue-50">CEST Correto</th>
                  <th className="px-3 py-3 text-left w-36 bg-blue-50">CST PIS/COFINS</th>
                  <th className="px-3 py-3 text-left bg-blue-50">Regime ICMS/MS</th>
                  <th className="px-3 py-3 text-left w-20 bg-blue-50">MVA Int.</th>
                  <th className="px-3 py-3 text-left w-20 bg-blue-50">MVA Ext.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map(r => (
                  <tr key={r.linha}
                    className={`hover:bg-gray-50 ${
                      r.status === 'invalid' ? 'bg-red-50/40' :
                      r.status === 'warning' ? 'bg-amber-50/30' : ''
                    }`}>
                    <td className="px-3 py-2.5 text-xs text-gray-400">{r.linha}</td>
                    <td className="px-3 py-2.5 font-medium text-gray-800 max-w-[200px]">
                      <span className="line-clamp-2 text-xs">{r.produto || '—'}</span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs font-bold text-[#1351b4]">
                      {r.ncmFormatado || r.ncm}
                    </td>
                    <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>

                    {/* E — NCM Correto */}
                    <td className="px-3 py-2.5 bg-blue-50/40">
                      {r.status === 'invalid'
                        ? <span className="text-xs text-red-500 font-medium">Não encontrado</span>
                        : <span className="font-mono text-xs font-bold text-emerald-700">{r.ncmFormatado}</span>
                      }
                    </td>

                    {/* F — CEST Correto */}
                    <td className="px-3 py-2.5 bg-blue-50/40">
                      {r.cest
                        ? <span className="font-mono text-xs font-bold text-emerald-700">{r.cest}</span>
                        : <span className="text-xs text-orange-600">Sem ST</span>
                      }
                    </td>

                    {/* G — CST PIS/COFINS */}
                    <td className="px-3 py-2.5 bg-blue-50/40">
                      <span className="text-xs text-gray-700">
                        {r.status === 'invalid' ? '—' : '01 — Tributável *'}
                      </span>
                    </td>

                    {/* H — Regime ICMS */}
                    <td className="px-3 py-2.5 bg-blue-50/40">
                      {r.cest
                        ? <span className="text-xs text-emerald-700 font-medium">ST — Anexo III RICMS/MS</span>
                        : <EconetButton ncm={r.ncm} size="xs" />
                      }
                    </td>

                    {/* I/J — MVA */}
                    <td className="px-3 py-2.5 bg-blue-50/40 text-xs text-gray-700">
                      {r.mvaInterno != null ? `${r.mvaInterno.toFixed(2).replace('.', ',')}%` : '—'}
                    </td>
                    <td className="px-3 py-2.5 bg-blue-50/40 text-xs text-gray-700">
                      {r.mvaExterno != null ? `${r.mvaExterno.toFixed(2).replace('.', ',')}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              * CST 01 é o padrão — verifique o regime fiscal da empresa (Simples, Presumido, Real) e possível tributação monofásica (Lei 10.147/2000).
              Colunas em azul correspondem às colunas E em diante na planilha exportada.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
