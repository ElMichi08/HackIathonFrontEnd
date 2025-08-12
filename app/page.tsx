"use client"

import { useState } from "react"
import { PDFDropzone } from "@/components/classification/pdf-dropzone"
import { RucInfoCard } from "@/components/classification/ruc-info-card"
import { ClassificationTabs } from "@/components/classification/classification-tabs"
import type { ClassificationResponse } from "@/types"

// Updated to use client component for state management
export default function HomePage() {
  const [classificationResult, setClassificationResult] = useState<ClassificationResponse | null>(null)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Clasificar Documentos</h1>
        <p className="text-muted-foreground">
          Sube un documento PDF para extraer información del RUC y clasificar el contenido
        </p>
      </div>

      <PDFDropzone onClassificationComplete={setClassificationResult} />

      {classificationResult && (
        <div className="space-y-6">
          <RucInfoCard ruc={classificationResult.ruc_encontrado} rucInfo={classificationResult.ruc_info} />
          <ClassificationTabs classification={classificationResult.clasificacion} />
        </div>
      )}
    </div>
  )
}
