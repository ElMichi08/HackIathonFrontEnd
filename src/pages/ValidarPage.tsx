"use client"

import { ValidationTable } from "../components/validation/ValidationTable"
import type { ValidatedDocument } from "../types"

export default function ValidarPage() {
  const handleDocumentSelect = (document: ValidatedDocument) => {
    // This will be used when we implement the improvements modal
    console.log("Selected document:", document)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Validar Documentos</h1>
        <p className="text-muted-foreground">Consulta y filtra los documentos que han sido validados por el sistema</p>
      </div>

      <ValidationTable onDocumentSelect={handleDocumentSelect} />
    </div>
  )
}
