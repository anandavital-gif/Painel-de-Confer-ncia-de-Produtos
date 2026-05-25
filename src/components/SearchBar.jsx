import { useRef } from 'react'

export default function SearchBar({ value, onChange, onSearch, loading, onReset, hasResults }) {
  const inputRef = useRef(null)

  function handleKeyDown(e) {
    if (e.key === 'Enter') onSearch(value)
  }

  function handleChange(e) {
    let v = e.target.value
    const digits = v.replace(/\D/g, '')
    if (digits.length <= 8 && /^\d[\d.\s-]*$/.test(v)) {
      if (digits.length === 8) {
        v = `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`
      }
    }
    onChange(v)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Informe o código NCM ou descrição do produto
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ex: 8471.30.19 ou &quot;notebook&quot;"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
        <button
          onClick={() => onSearch(value)}
          disabled={loading || !value.trim()}
          className="px-5 py-2.5 bg-[#1351b4] text-white text-sm font-medium rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Buscar
        </button>
        {hasResults && (
          <button
            onClick={onReset}
            className="px-4 py-2.5 border border-gray-300 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
          >
            Limpar
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Digite 8 dígitos para busca por código (ex: 8471.30.19) ou texto para busca por descrição
      </p>
    </div>
  )
}
