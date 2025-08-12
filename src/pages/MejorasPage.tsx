"use client"

import { DocumentSelector } from "../components/alerts/DocumentSelector"

export default function MejorasPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Mejoras y Alertas</h1>
        <p className="text-muted-foreground">
          Consulta las recomendaciones y alertas generadas para cada documento validado
        </p>
      </div>

      <DocumentSelector />
    </div>
  )
}
