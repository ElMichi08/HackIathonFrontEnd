"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RunStatusBadge } from "./run-status-badge"
import { Search, FileText, Calendar } from "lucide-react"
import type { Run, RunStatus } from "@/types"

interface RunsTableProps {
  runs: Run[]
  isLoading?: boolean
}

export function RunsTable({ runs, isLoading }: RunsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<RunStatus | "ALL">("ALL")

  const filteredRuns = runs.filter((run) => {
    const matchesSearch = run.files.some((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "ALL" || run.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando ejecuciones...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle>Historial de Ejecuciones</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre de archivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RunStatus | "ALL")}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="COMPLETED">Completado</SelectItem>
                <SelectItem value="RUNNING">En progreso</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="FAILED">Fallido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredRuns.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {runs.length === 0 ? "Sin ejecuciones" : "No se encontraron resultados"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {runs.length === 0
                ? "Aún no hay ejecuciones registradas en la demo. Sube un PDF en 'Analizar'."
                : "Intenta ajustar los filtros de búsqueda."}
            </p>
            {runs.length === 0 && (
              <Button asChild>
                <Link href="/analyze">Comenzar análisis</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Archivos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-mono text-sm">{run.id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {run.files.map((file) => (
                          <div key={file.id} className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate max-w-48">{file.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {formatFileSize(file.size)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <RunStatusBadge status={run.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${run.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{run.progressPercent}%</span>
                      </div>
                      {run.currentStep && <p className="text-xs text-muted-foreground mt-1">Paso: {run.currentStep}</p>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(run.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm" className="bg-transparent">
                        <Link href={`/runs/${run.id}`}>Ver detalles</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
