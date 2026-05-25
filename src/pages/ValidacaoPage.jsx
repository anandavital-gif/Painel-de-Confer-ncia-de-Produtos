import { useState } from 'react'
import SheetUploader from '../components/SheetUploader'
import ValidationTable from '../components/ValidationTable'
import { useValidation } from '../hooks/useValidation'

export default function ValidacaoPage() {
  const [rows, setRows] = useState(null)
  const { results, progress, total, running, done, run, reset } = useValidation()

  function handleLoad(parsed) {
    setRows(parsed)
  }

  function handleStart() {
    if (rows) run(rows)
  }

  function handleReset() {
    setRows(null)
    reset()
  }

  return (
    <div className="space-y-5">
      {/* Instrução + status da carga */}
      {!done && !running && (
        <>
          <SheetUploader onLoad={handleLoad} />

          {rows && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {rows.length} produtos carregados — prontos para validar
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  A validação consulta a BrasilAPI e o Anexo III do RICMS/MS para cada NCM
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStart}
                  className="px-5 py-2 bg-[#1351b4] text-white text-sm font-medium rounded-xl hover:bg-blue-800 transition-colors"
                >
                  Iniciar validação
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ValidationTable
        results={results}
        running={running}
        progress={progress}
        total={total}
        done={done}
        onReset={handleReset}
      />
    </div>
  )
}
