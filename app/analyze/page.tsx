"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileDropzone } from "@/components/upload/file-dropzone"
import { DocumentSummary } from "@/components/upload/document-summary"
import { RAGIndexBuilder } from "@/components/upload/rag-index-builder"
import { useData } from "@/contexts/data-context"
import type { DocumentoClasificado } from "@/types"
import { AlertCircle, Upload } from "lucide-react"

export default function AnalyzePage() {
  const { clasificarDocumento, mode, setCurrentDocument } = useData()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [document, setDocument] = useState<DocumentoClasificado | null>(null)

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true)
      setError(null)
      setUploadProgress(0)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await clasificarDocumento(file)
      setDocument(result)
      setCurrentDocument(result)
      setUploadProgress(100)

      // Clear progress after a moment
      setTimeout(() => {
        setUploadProgress(0)
      }, 1000)
    } catch (err) {
      setError("No se pudo clasificar el documento. Revisa el archivo o inténtalo de nuevo.")
      console.error("Error uploading file:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "El archivo debe ser PDF."
    }
    if (file.size > 10 * 1024 * 1024) {
      return "El archivo no debe superar 10 MB."
    }
    return null
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analizar Documentos</h1>
        <p className="text-muted-foreground">
          Sube documentos PDF de licitaciones para obtener análisis detallados con IA
        </p>
      </div>

      {/* Mode indicator */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Modo actual: <strong>{mode}</strong>
          {mode === "API" ? " - Conectado al backend en localhost:8000" : " - Usando datos de demostración"}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-primary" />
                <CardTitle>Subir Documento</CardTitle>
              </div>
              <CardDescription>Arrastra y suelta tu PDF o haz clic para seleccionar</CardDescription>
            </CardHeader>
            <CardContent>
              <FileDropzone
                onFileSelect={handleFileSelect}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                error={error}
                disabled={!!document}
              />
            </CardContent>
          </Card>

          {/* Document Summary */}
          {document && <DocumentSummary document={document} />}
        </div>

        <div className="space-y-6">
          {/* RAG Index Builder */}
          <RAGIndexBuilder />

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instrucciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-xs">1</span>
                </div>
                <p>Sube un documento PDF de licitación (máximo 10 MB)</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-xs">2</span>
                </div>
                <p>El sistema clasificará automáticamente el contenido</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-xs">3</span>
                </div>
                <p>Construye el índice RAG para validaciones avanzadas</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-xs">4</span>
                </div>
                <p>Revisa los resultados detallados y alertas</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
