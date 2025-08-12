"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getDocumentImprovements } from "@/lib/api"
import { AlertBadge } from "./alert-badge"
import type { DocumentImprovement } from "@/types"

interface ImprovementsModalProps {
  documentId: number
  documentType?: string
}

export function ImprovementsModal({ documentId, documentType }: ImprovementsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [improvements, setImprovements] = useState<DocumentImprovement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadImprovements = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getDocumentImprovements(documentId)
      setImprovements(data)
    } catch (err) {
      setError("Error al cargar las mejoras y alertas")
      toast({
        title: "Error",
        description: "No se pudieron cargar las mejoras y alertas del documento",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && !improvements) {
      loadImprovements()
    }
  }, [isOpen])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset state when closing
      setImprovements(null)
      setError(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Ver Mejoras
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mejoras y Alertas</DialogTitle>
          <DialogDescription>
            Documento #{documentId} {documentType && `- ${documentType}`}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Cargando mejoras y alertas...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <p className="text-destructive text-center">{error}</p>
            <Button onClick={loadImprovements} variant="outline" size="sm">
              Reintentar
            </Button>
          </div>
        )}

        {improvements && (
          <div className="space-y-6">
            {/* Alert Level */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Nivel de Alerta</h3>
              <AlertBadge level={improvements.semaforo_alerta} />
            </div>

            <Separator />

            {/* Document Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Información del Documento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Tipo de Documento</h4>
                  <p className="capitalize">{improvements.tipo_documento}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Observaciones</h4>
                  <p className="text-sm leading-relaxed">{improvements.observaciones}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{improvements.recomendaciones}</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cerrar
              </Button>
              <Button onClick={() => toast({ title: "Funcionalidad en desarrollo" })}>Aplicar Mejoras</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
