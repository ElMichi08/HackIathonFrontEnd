"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Wrench,
  DollarSign,
  RefreshCw,
  FileText,
  Shield,
} from "lucide-react"
import { useData } from "@/contexts/data-context"
import type { Results, ValidacionRAG, AlertaRAG, AlertSeverity } from "@/types"

interface RunResultsProps {
  runId: string
}

export function RunResults({ runId }: RunResultsProps) {
  const { getResults, obtenerValidaciones, obtenerAlertas, currentDocument } = useData()
  const [results, setResults] = useState<Results | null>(null)
  const [validaciones, setValidaciones] = useState<ValidacionRAG[]>([])
  const [alertas, setAlertas] = useState<AlertaRAG | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadResults = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load basic results
      const resultsData = await getResults(runId)
      setResults(resultsData)

      // Load validations and alerts if we have a current document
      if (currentDocument) {
        try {
          const [validacionesData, alertasData] = await Promise.all([
            obtenerValidaciones(),
            obtenerAlertas(currentDocument.id),
          ])
          setValidaciones(validacionesData)
          setAlertas(alertasData)
        } catch (err) {
          console.warn("Could not load validations/alerts:", err)
        }
      }
    } catch (err) {
      setError("No se pudieron cargar los resultados.")
      console.error("Error loading results:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadResults()
  }, [runId, currentDocument])

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "HIGH":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "MEDIUM":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "LOW":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
  }

  const getSeverityBadgeVariant = (severity: AlertSeverity) => {
    switch (severity) {
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "secondary"
      case "LOW":
        return "outline"
    }
  }

  const getSectionIcon = (section: string) => {
    switch (section) {
      case "LEGAL":
        return <Scale className="h-5 w-5 text-blue-600" />
      case "TECHNICAL":
        return <Wrench className="h-5 w-5 text-green-600" />
      case "ECONOMIC":
        return <DollarSign className="h-5 w-5 text-purple-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={loadResults} className="ml-4 bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando resultados...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin resultados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se detectaron secciones clasificadas</h3>
            <p className="text-muted-foreground">
              El documento no pudo ser procesado o no contiene secciones reconocibles.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {results.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Resumen Ejecutivo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{results.summary}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="sections" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">Secciones</TabsTrigger>
          <TabsTrigger value="validations">Validaciones</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4">
          {Object.entries(results.sections).map(([sectionKey, items]) => (
            <Card key={sectionKey}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getSectionIcon(sectionKey)}
                  <span>
                    {sectionKey === "LEGAL"
                      ? "Aspectos Legales"
                      : sectionKey === "TECHNICAL"
                        ? "Aspectos Técnicos"
                        : "Aspectos Económicos"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {items.length > 0 ? (
                  <ul className="space-y-2">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">No se encontraron elementos en esta sección.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="validations" className="space-y-4">
          {validaciones.length > 0 ? (
            validaciones.map((validacion, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>{validacion.resultado_validacion}</span>
                    </CardTitle>
                    <Badge variant={getSeverityBadgeVariant(validacion.semaforo)}>
                      {getSeverityIcon(validacion.semaforo)}
                      <span className="ml-1">{validacion.semaforo}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tipo de documento: {validacion.tipo_documento}</p>
                    <div>
                      <p className="text-sm font-medium mb-2">Observaciones:</p>
                      {Array.isArray(validacion.observaciones) ? (
                        <ul className="space-y-1">
                          {validacion.observaciones.map((obs, obsIndex) => (
                            <li key={obsIndex} className="text-sm text-muted-foreground flex items-start space-x-2">
                              <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                              <span>{obs}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">{validacion.observaciones}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Sin validaciones disponibles</h3>
                <p className="text-muted-foreground">
                  No se pudieron obtener las validaciones. Asegúrate de que el índice RAG esté construido.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alertas ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <span>Sugerencias y Alertas</span>
                  </CardTitle>
                  <Badge variant={getSeverityBadgeVariant(alertas.semaforo_alerta)}>
                    {getSeverityIcon(alertas.semaforo_alerta)}
                    <span className="ml-1">{alertas.semaforo_alerta}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {alertas.recomendaciones.split("\n").map((line, index) => (
                    <p key={index} className="text-sm mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Sin alertas disponibles</h3>
                <p className="text-muted-foreground">No se pudieron obtener las sugerencias/alertas.</p>
              </CardContent>
            </Card>
          )}

          {/* Document-based alerts */}
          {results.alerts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Alertas del Documento</h3>
                {results.alerts.map((alert) => (
                  <Card key={alert.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{alert.title}</CardTitle>
                        <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                          {getSeverityIcon(alert.severity)}
                          <span className="ml-1">{alert.severity}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      {alert.references && (
                        <div className="text-xs text-muted-foreground">
                          <p>
                            Referencia: Página {alert.references.page} - "{alert.references.fragment}"
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
