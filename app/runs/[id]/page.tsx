"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RunStatusBadge } from "@/components/runs/run-status-badge"
import { RunLogs } from "@/components/runs/run-logs"
import { RunResults } from "@/components/runs/run-results"
import { useData } from "@/contexts/data-context"
import type { Run } from "@/types"
import { ArrowLeft, AlertCircle, RefreshCw, FileText, Calendar, Clock } from "lucide-react"

export default function RunDetailPage() {
  const params = useParams()
  const runId = params.id as string
  const { getRunById } = useData()
  const [run, setRun] = useState<Run | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRun = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getRunById(runId)
      setRun(data)
    } catch (err) {
      setError("No se pudo obtener el estado.")
      console.error("Error loading run:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRun()
  }, [runId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm" className="bg-transparent">
            <Link href="/runs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Detalle de Ejecución</h1>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={loadRun} className="ml-4 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm" className="bg-transparent">
            <Link href="/runs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Cargando...</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!run) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm" className="bg-transparent">
            <Link href="/runs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Ejecución no encontrada</h1>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Ejecución no encontrada</h3>
            <p className="text-muted-foreground mb-4">La ejecución solicitada no existe o no está disponible.</p>
            <Button asChild>
              <Link href="/runs">Volver al listado</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button asChild variant="outline" size="sm" className="bg-transparent">
          <Link href="/runs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Detalle de Ejecución</h1>
      </div>

      {/* Run Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>ID: {run.id}</span>
            </CardTitle>
            <RunStatusBadge status={run.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Archivos procesados</p>
                <div className="space-y-2">
                  {run.files.map((file) => (
                    <div key={file.id} className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(file.size)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Progreso</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${run.progressPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{run.progressPercent}%</span>
                  </div>
                  {run.currentStep && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Paso actual: {run.currentStep}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Información temporal</p>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(run.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="status" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status">Estado</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Estado de la Ejecución</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Estado actual</h3>
                    <p className="text-sm text-muted-foreground">
                      {run.status === "COMPLETED"
                        ? "La ejecución se completó exitosamente"
                        : run.status === "RUNNING"
                          ? "La ejecución está en progreso"
                          : run.status === "FAILED"
                            ? "La ejecución falló durante el procesamiento"
                            : "La ejecución está pendiente de iniciar"}
                    </p>
                  </div>
                  <RunStatusBadge status={run.status} />
                </div>

                {run.currentStep && (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Paso en progreso</h3>
                    <Badge variant="outline">{run.currentStep}</Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {run.currentStep === "EXTRACT"
                        ? "Extrayendo texto del documento PDF"
                        : run.currentStep === "CLASSIFY"
                          ? "Clasificando secciones del documento"
                          : run.currentStep === "INDEX"
                            ? "Creando índice vectorial"
                            : run.currentStep === "VALIDATE"
                              ? "Validando contra base de conocimiento"
                              : "Realizando análisis final"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <RunLogs runId={run.id} />
        </TabsContent>

        <TabsContent value="results">
          <RunResults runId={run.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
