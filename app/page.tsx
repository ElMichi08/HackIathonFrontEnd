import type { Metadata } from "next"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard - TenderMind",
  description: "Panel principal de análisis de licitaciones con KPIs y métricas",
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de actividad y métricas del sistema de análisis de licitaciones</p>
      </div>

      <DashboardContent />
    </div>
  )
}
