import type { Metadata } from "next"
import { DocumentSelector } from "@/components/alerts/document-selector"

export const metadata: Metadata = {
  title: "Mejoras y Alertas - Licitaciones IA",
  description: "Consulta mejoras y alertas para documentos de licitaciones",
}

export default function MejorasPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Mejoras y Alertas</h1>
        <p className="text-muted-foreground">
          Selecciona un documento para ver las mejoras sugeridas y alertas de riesgo
        </p>
      </div>

      <DocumentSelector />
    </div>
  )
}
