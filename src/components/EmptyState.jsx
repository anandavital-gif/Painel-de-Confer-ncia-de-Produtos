const EXAMPLES = [
  { code: '8471.30.19', desc: 'Notebooks / Computadores portáteis' },
  { code: '2106.90.10', desc: 'Preparações alimentícias diversas' },
  { code: '3004.90.99', desc: 'Medicamentos diversos' },
  { code: '8703.23.10', desc: 'Automóveis de passageiros' },
]

export default function EmptyState() {
  return (
    <div className="text-center py-10">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
        <svg className="w-8 h-8 text-[#1351b4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <h2 className="text-gray-700 font-semibold text-base mb-1">
        Consulte a tributação de qualquer produto
      </h2>
      <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
        Informe o código NCM de 8 dígitos ou a descrição do produto para visualizar
        a legislação tributária aplicável (IPI, ICMS, PIS, COFINS e II).
      </p>

      <div className="max-w-lg mx-auto">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Exemplos de NCM</p>
        <div className="grid grid-cols-2 gap-2">
          {EXAMPLES.map((ex) => (
            <div key={ex.code} className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-left">
              <span className="block font-mono text-sm font-bold text-[#1351b4]">{ex.code}</span>
              <span className="block text-xs text-gray-500 mt-0.5 truncate">{ex.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
