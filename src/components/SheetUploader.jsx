import { useState, useRef } from 'react'
import { parseExcel, parseGoogleSheets } from '../utils/sheetParser'

export default function SheetUploader({ onLoad }) {
  const [mode, setMode]         = useState('excel') // 'excel' | 'sheets'
  const [sheetsUrl, setSheetsUrl] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  async function handleFile(file) {
    if (!file) return
    setError(null)
    setLoading(true)
    try {
      const rows = await parseExcel(file)
      onLoad(rows)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSheets() {
    if (!sheetsUrl.trim()) return
    setError(null)
    setLoading(true)
    try {
      const rows = await parseGoogleSheets(sheetsUrl.trim())
      onLoad(rows)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'excel', label: '📊 Upload Excel / CSV' },
          { key: 'sheets', label: '🔗 Google Planilhas' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setMode(t.key); setError(null) }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === t.key
                ? 'bg-[#1351b4] text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {mode === 'excel' && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={e => handleFile(e.target.files[0])}
            />
            <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium text-gray-600">
              {loading ? 'Processando...' : 'Arraste o arquivo ou clique para selecionar'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Excel (.xlsx, .xls) ou CSV</p>
          </div>
        )}

        {mode === 'sheets' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Link do Google Planilhas
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={sheetsUrl}
                  onChange={e => setSheetsUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSheets()}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSheets}
                  disabled={loading || !sheetsUrl.trim()}
                  className="px-4 py-2.5 bg-[#1351b4] text-white text-sm font-medium rounded-xl hover:bg-blue-800 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Carregando...' : 'Carregar'}
                </button>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700 space-y-1">
              <p className="font-medium">Para conectar ao Google Planilhas:</p>
              <p>1. Abra a planilha → Compartilhar → "Qualquer pessoa com o link"</p>
              <p>2. Cole o link acima e clique em Carregar</p>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="mt-5 bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Colunas necessárias na planilha
          </p>
          <div className="flex gap-3">
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600">
              <span className="w-2 h-2 bg-blue-400 rounded-full" /> Nome / Produto
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" /> NCM (8 dígitos)
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            As colunas são detectadas automaticamente pelo cabeçalho. Demais colunas são mantidas na exportação.
          </p>
        </div>
      </div>
    </div>
  )
}
