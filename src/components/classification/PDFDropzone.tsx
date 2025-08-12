"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { useToast } from "../../hooks/useToast"
import { classifyDocument } from "../../lib/api"
import type { ClassificationResponse } from "../../types"

interface PDFDropzoneProps {
  onClassificationComplete: (result: ClassificationResponse) => void
}

export function PDFDropzone({ onClassificationComplete }: PDFDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Validate file type
      if (file.type !== "application/pdf") {
        toast({
          title: "Error",
          description: "Solo se permiten archivos PDF",
          variant: "destructive",
        })
        return
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "El archivo no puede superar los 10MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      setIsUploading(true)
      setUploadProgress(0)

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })
        }, 200)

        const result = await classifyDocument(file)

        clearInterval(progressInterval)
        setUploadProgress(100)

        setTimeout(() => {
          onClassificationComplete(result)
          toast({
            title: "Éxito",
            description: "Documento clasificado correctamente",
          })
          setIsUploading(false)
          setUploadProgress(0)
        }, 500)
      } catch (error) {
        setIsUploading(false)
        setUploadProgress(0)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Error al procesar el documento",
          variant: "destructive",
        })
      }
    },
    [onClassificationComplete, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  const removeFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
          ${isUploading ? "pointer-events-none opacity-50" : "hover:border-primary hover:bg-primary/5"}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-lg">Suelta el archivo PDF aquí...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-lg">Arrastra un archivo PDF aquí o haz clic para seleccionar</p>
            <p className="text-sm text-muted-foreground">Máximo 10MB</p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          {!isUploading && (
            <Button variant="ghost" size="sm" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Procesando documento...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}
    </div>
  )
}
