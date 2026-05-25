export default function Header() {
  return (
    <header className="bg-[#1351b4] text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-5 flex items-center gap-4">
        <div className="bg-white/15 rounded-xl p-2.5">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">Painel de Tributação NCM</h1>
          <p className="text-blue-200 text-sm mt-0.5">
            Consulta de tributação de produtos com base na legislação vigente
          </p>
        </div>
      </div>
    </header>
  )
}
