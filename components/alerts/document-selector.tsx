"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getValidatedDocuments } from "@/lib/api"
import { ImprovementsModal } from "./improvements-modal"
import type { ValidatedDocument } from "@/types"

export function DocumentSelector() {
  const [documents, setDocuments] = useState<ValidatedDocument[]>([])
  const [selectedDocument, setSelectedDocument] = useState<ValidatedDocument | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getValidatedDocuments()
      setDocuments(data)
      if (data.length > 0) {
        setSelectedDocument(data[0])
      }
    } catch (err) {
      setError("Error al cargar los documentos")
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Cargando documentos...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-muted-foreground text-center">
            {error || "No hay documentos disponibles para mostrar mejoras y alertas"}
          </p>
          {error && (
            <button onClick={loadDocuments} className="text-primary hover:underline">
              Reintentar
            </button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Document Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Documento</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedDocument?.id.toString()}
            onValueChange={(value) => {
              const doc = documents.find((d) => d.id.toString() === value)
              setSelectedDocument(doc || null)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un documento" />
            </SelectTrigger>
            <SelectContent>
              {documents.map((doc) => (
                <SelectItem key={doc.id} value={doc.id.toString()}>
                  <div className="flex items-center space-x-2">
                    <span>#{doc.id}</span>
                    <Badge variant="secondary" className="text-xs">
                      {doc.tipo_documento}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Selected Document Details */}
      {selectedDocument && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Documento Seleccionado
              <ImprovementsModal documentId={selectedDocument.id} documentType={selectedDocument.tipo_documento} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">ID del Documento</h4>
                <p className="font-medium">#{selectedDocument.id}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Tipo de Documento</h4>
                <Badge variant="secondary">{selectedDocument.tipo_documento}</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Observaciones</h4>
              <p className="text-sm leading-relaxed bg-muted p-3 rounded-lg">{selectedDocument.observaciones}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
