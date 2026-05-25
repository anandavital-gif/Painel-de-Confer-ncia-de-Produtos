import { useState } from 'react'
import Header from './components/Header'
import ConsultaPage from './pages/ConsultaPage'
import ValidacaoPage from './pages/ValidacaoPage'

const TABS = [
  {
    key: 'consulta',
    label: 'Consulta NCM',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    key: 'validacao',
    label: 'Validar Planilha',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
]

export default function App() {
  const [tab, setTab] = useState('consulta')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex gap-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-[#1351b4] text-[#1351b4]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {tab === 'consulta'  && <ConsultaPage />}
        {tab === 'validacao' && <ValidacaoPage />}
      </main>

      <footer className="border-t border-gray-200 bg-white py-4 mt-8">
        <p className="text-center text-xs text-gray-400">
          Dados de classificação:{' '}
          <a href="https://brasilapi.com.br" target="_blank" rel="noreferrer" className="underline hover:text-gray-600">
            BrasilAPI
          </a>{' '}
          · Legislação: Receita Federal / CONFAZ / SEFAZ-MS · ICMS-ST: Decreto Estadual nº 9.203/1998
        </p>
      </footer>
    </div>
  )
}
