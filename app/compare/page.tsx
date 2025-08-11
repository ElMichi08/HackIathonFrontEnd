"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ComparisonTable } from "@/components/compare/comparison-table"
import { useData } from "@/contexts/data-context"
import type { CompareRow } from "@/types"
import { AlertCircle, RefreshCw, Info } from "lucide-react"

export default function ComparePage() {
  const { getCompareData } = useData()
  const [compareData, setCompareData] = useState<CompareRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCompareData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getCompareData()
      setCompareData(data)
    } catch (err) {
      setError("No se pudo generar la comparación. Reintenta.")
      console.error("Error loading compare data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCompareData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Comparador de Ofertas</h1>
        <p className="text-muted-foreground">
          Compara múltiples propuestas lado a lado para tomar decisiones informadas
        </p>
      </div>

      {/* Demo Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Modo Demo:</strong> La comparación utiliza datos de demostración. Pronto se conectará al backend para
          comparar documentos reales analizados.
        </AlertDescription>
      </Alert>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={loadCompareData} className="ml-4 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <ComparisonTable data={compareData} isLoading={isLoading} error={error} onRetry={loadCompareData} />
      )}
    </div>
  )
}
