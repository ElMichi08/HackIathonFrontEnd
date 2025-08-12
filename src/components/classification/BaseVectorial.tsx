"use client"

import { useState } from "react"
import { Database, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useToast } from "../../hooks/useToast"
import { createVectorBase } from "../../lib/api"

export function BaseVectorial() {
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreateBase = async () => {
    setIsCreating(true)
    try {
      const result = await createVectorBase()

      toast({
        title: "Éxito",
        description: result.mensaje,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear la base vectorial",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Base Vectorial</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Crea o actualiza la base vectorial para mejorar la precisión del análisis de documentos.
        </p>
        <Button onClick={handleCreateBase} disabled={isCreating} className="w-full">
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando base vectorial...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Crear/Actualizar Base Vectorial
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
