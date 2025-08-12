"use client"

import { useState } from "react"
import { PDFDropzone } from "../components/classification/PDFDropzone"
import { RucInfoCard } from "../components/classification/RucInfoCard"
import { ClassificationTabs } from "../components/classification/ClassificationTabs"
import { BaseVectorial } from "../components/classification/BaseVectorial"
import type { ClassificationResponse } from "../types"

export default function ClasificarPage() {
  const [classificationResult, setClassificationResult] = useState<ClassificationResponse | null>(null)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Clasificar Documentos</h1>
        <p className="text-muted-foreground">
          Sube un documento PDF para extraer información del RUC y clasificar el contenido
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PDFDropzone onClassificationComplete={setClassificationResult} />
        </div>
        <div>
          <BaseVectorial />
        </div>
      </div>

      {classificationResult && (
        <div className="space-y-6">
          <RucInfoCard ruc={classificationResult.ruc_encontrado} rucInfo={classificationResult.ruc_info} />
          <ClassificationTabs classification={classificationResult.clasificacion} />
        </div>
      )}
    </div>
  )
}
