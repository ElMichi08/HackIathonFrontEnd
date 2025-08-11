"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useData } from "@/contexts/data-context"

export function RAGIndexBuilder() {
  const { crearBaseVectorial } = useData()
  const [isBuilding, setIsBuilding] = useState(false)
  const [isBuilt, setIsBuilt] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [indexInfo, setIndexInfo] = useState<{ message: string; count: number } | null>(null)

  const handleBuildIndex = async () => {
    try {
      setIsBuilding(true)
      setError(null)
      const result = await crearBaseVectorial()
      setIndexInfo(result)
      setIsBuilt(true)
    } catch (err) {
      setError("No se pudo construir el índice. Intenta nuevamente.")
      console.error("Error building RAG index:", err)
    } finally {
      setIsBuilding(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Índice RAG</CardTitle>
          </div>
          {isBuilt && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Listo
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Construye el índice vectorial de referencia para habilitar validaciones y sugerencias avanzadas con RAG.
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {indexInfo && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              {indexInfo.message} - {indexInfo.count} documentos indexados
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={handleBuildIndex} disabled={isBuilding || isBuilt} className="w-full">
          {isBuilding ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Construyendo índice...
            </>
          ) : isBuilt ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Índice RAG construido
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Construir índice RAG
            </>
          )}
        </Button>

        {!isBuilt && (
          <p className="text-xs text-muted-foreground">
            Nota: El índice RAG debe construirse al menos una vez antes de poder obtener validaciones y alertas
            avanzadas.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
