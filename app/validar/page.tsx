import type { Metadata } from "next"
import { ValidationTable } from "@/components/validation/validation-table"

export const metadata: Metadata = {
  title: "Validar Documentos - Licitaciones IA",
  description: "Consulta y valida documentos de licitaciones procesados",
}

export default function ValidarPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Validar Documentos</h1>
        <p className="text-muted-foreground">
          Consulta el estado de validación de los documentos procesados en el sistema
        </p>
      </div>

      <ValidationTable />
    </div>
  )
}
