"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KPICard } from "./kpi-card"
import { ActivityChart } from "./activity-chart"
import { useData } from "@/contexts/data-context"
import type { KPIData } from "@/types"
import { AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export function DashboardContent() {
  const { getKPIs } = useData()
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadKPIs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getKPIs()
      setKpiData(data)
    } catch (err) {
      setError("No se pudieron cargar las métricas. Reintenta.")
      console.error("Error loading KPIs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadKPIs()
  }, [])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={loadKPIs} className="ml-4 bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!kpiData && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin datos disponibles</CardTitle>
          <CardDescription>
            No hay actividad registrada aún. Sube tus primeros documentos para ver KPIs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/analyze">Comenzar análisis</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total de Ejecuciones"
          value={kpiData?.totalRuns ?? 0}
          subtitle="documentos procesados"
          isLoading={isLoading}
        />
        <KPICard
          title="Alertas Críticas"
          value={`${kpiData?.highAlertPercentage ?? 0}%`}
          subtitle="con alertas HIGH"
          trend={kpiData && kpiData.highAlertPercentage > 15 ? "up" : "neutral"}
          isLoading={isLoading}
        />
        <KPICard
          title="Tiempo Promedio"
          value={`${kpiData?.averageTime ?? 0} min`}
          subtitle="por análisis"
          trend="neutral"
          isLoading={isLoading}
        />
        <KPICard
          title="Última Actividad"
          value={kpiData?.recentActivity?.[0]?.count ?? 0}
          subtitle="hoy"
          isLoading={isLoading}
        />
      </div>

      {/* Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart data={kpiData?.recentActivity ?? []} isLoading={isLoading} />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/analyze">Nuevo Análisis</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/runs">Ver Historial</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/compare">Comparar Ofertas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      {kpiData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Actividad</CardTitle>
            <CardDescription>Últimos 7 días de procesamiento de documentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {kpiData.recentActivity.reduce((sum, day) => sum + day.count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total procesados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(kpiData.recentActivity.reduce((sum, day) => sum + day.count, 0) / 7)}
                </div>
                <div className="text-sm text-muted-foreground">Promedio diario</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.max(...kpiData.recentActivity.map((day) => day.count))}
                </div>
                <div className="text-sm text-muted-foreground">Día más activo</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{kpiData.recentActivity.length}</div>
                <div className="text-sm text-muted-foreground">Días con actividad</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
