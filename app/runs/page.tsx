"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RunsTable } from "@/components/runs/runs-table"
import { useData } from "@/contexts/data-context"
import type { Run } from "@/types"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function RunsPage() {
  const { getRuns } = useData()
  const [runs, setRuns] = useState<Run[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRuns = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getRuns()
      setRuns(data)
    } catch (err) {
      setError("No se pudieron cargar las ejecuciones. Reintenta.")
      console.error("Error loading runs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRuns()
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Historial de Ejecuciones</h1>
        <p className="text-muted-foreground">Revisa el historial completo de análisis de documentos realizados</p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={loadRuns} className="ml-4 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <RunsTable runs={runs} isLoading={isLoading} />
      )}
    </div>
  )
}
