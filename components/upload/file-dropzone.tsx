"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileDropzoneProps {
  onFileSelect: (file: File) => void
  isUploading?: boolean
  uploadProgress?: number
  error?: string | null
  disabled?: boolean
}

export function FileDropzone({ onFileSelect, isUploading, uploadProgress, error, disabled }: FileDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        return // Error will be handled by react-dropzone
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: disabled || isUploading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  const validationError = fileRejections[0]?.errors[0]?.message

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragActive || dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          (disabled || isUploading) && "cursor-not-allowed opacity-50",
          error && "border-destructive",
        )}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <input {...getInputProps()} />

          {isUploading ? (
            <>
              <FileText className="h-12 w-12 text-primary mb-4 animate-pulse" />
              <h3 className="text-lg font-medium mb-2">Procesando documento...</h3>
              <p className="text-sm text-muted-foreground mb-4">Esto puede tardar unos segundos</p>
              {uploadProgress !== undefined && (
                <div className="w-full max-w-xs">
                  <Progress value={uploadProgress} className="mb-2" />
                  <p className="text-xs text-muted-foreground">{uploadProgress}% completado</p>
                </div>
              )}
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Arrastra y suelta tu PDF aquí</h3>
              <p className="text-sm text-muted-foreground mb-4">o haz clic para seleccionar un archivo</p>
              <Button variant="outline" disabled={disabled} className="bg-transparent">
                Seleccionar archivo
              </Button>
              <p className="text-xs text-muted-foreground mt-4">Máximo 10 MB • Solo archivos PDF</p>
            </>
          )}
        </CardContent>
      </Card>

      {(error || validationError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || validationError}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
