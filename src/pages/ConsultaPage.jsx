import { useState, useCallback } from 'react'
import SearchBar from '../components/SearchBar'
import EmptyState from '../components/EmptyState'
import ResultsList from '../components/ResultsList'
import NCMDetail from '../components/NCMDetail'

const BRASIL_API = 'https://brasilapi.com.br/api/ncm/v1'

export default function ConsultaPage() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = useCallback(async (searchQuery) => {
    const q = searchQuery.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    setSelected(null)
    setResults([])
    setSearched(true)
    try {
      const digits = q.replace(/\D/g, '')
      const isCode = digits.length === 8
      const url = isCode
        ? `${BRASIL_API}/${digits}`
        : `${BRASIL_API}?search=${encodeURIComponent(q)}`
      const res = await fetch(url)
      if (!res.ok) {
        if (res.status === 404) throw new Error('NCM não encontrado. Verifique o código informado.')
        throw new Error(`Erro ao consultar a API (${res.status}). Tente novamente.`)
      }
      const data = await res.json()
      const list = Array.isArray(data) ? data : [data]
      if (list.length === 0) setError('Nenhum NCM encontrado para a busca informada.')
      else if (list.length === 1) setSelected(list[0])
      else setResults(list)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleReset = useCallback(() => {
    setQuery(''); setResults([]); setSelected(null); setError(null); setSearched(false)
  }, [])

  return (
    <div className="space-y-6">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        loading={loading}
        onReset={handleReset}
        hasResults={!!(selected || results.length > 0)}
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <span className="ml-3 text-gray-500 text-sm">Consultando BrasilAPI...</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!loading && !error && !searched && <EmptyState />}
      {!loading && !error && results.length > 1 && !selected && (
        <ResultsList results={results} onSelect={setSelected} />
      )}
      {!loading && !error && selected && (
        <NCMDetail ncm={selected} onBack={results.length > 1 ? () => setSelected(null) : null} />
      )}
    </div>
  )
}
