"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Building2, FileText, Calendar, User, AlertTriangle } from "lucide-react"
import type { DocumentoClasificado } from "@/types"
import Link from "next/link"

interface DocumentSummaryProps {
  document: DocumentoClasificado
}

export function DocumentSummary({ document }: DocumentSummaryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRiskBadgeVariant = (value: string) => {
    return value === "SI" ? "destructive" : "secondary"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Documento Clasificado</CardTitle>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Procesado exitosamente
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Información del Oferente</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Razón Social</p>
              <p className="font-medium">{document.razon_social}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">RUC</p>
              <p className="font-mono">{document.ruc_encontrado}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge variant={document.estado_contribuyente_ruc === "ACTIVO" ? "default" : "secondary"}>
                {document.estado_contribuyente_ruc}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Contribuyente</p>
              <p>{document.tipo_contribuyente}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Régimen</p>
              <p>{document.regimen}</p>
            </div>
            {document.categoria && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categoría</p>
                <p>{document.categoria}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Representative Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Representante Legal</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p>{document.representante_nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Identificación</p>
              <p className="font-mono">{document.representante_identificacion}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Compliance Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Información de Cumplimiento</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Obligado a llevar contabilidad</p>
              <Badge variant={getRiskBadgeVariant(document.obligado_llevar_contabilidad)}>
                {document.obligado_llevar_contabilidad}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Agente de retención</p>
              <Badge variant={getRiskBadgeVariant(document.agente_retencion)}>{document.agente_retencion}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contribuyente especial</p>
              <Badge variant={getRiskBadgeVariant(document.contribuyente_especial)}>
                {document.contribuyente_especial}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contribuyente fantasma</p>
              <Badge variant={getRiskBadgeVariant(document.contribuyente_fantasma)}>
                {document.contribuyente_fantasma}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Dates */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Fechas Importantes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inicio de actividades</p>
              <p>{formatDate(document.inicio_actividades)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Última actualización</p>
              <p>{formatDate(document.actualizacion)}</p>
            </div>
            {document.reinicio_actividades && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reinicio de actividades</p>
                <p>{formatDate(document.reinicio_actividades)}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <Button asChild size="lg">
            <Link href={`/runs/doc-${document.id}`}>Ver Resultados Detallados</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
