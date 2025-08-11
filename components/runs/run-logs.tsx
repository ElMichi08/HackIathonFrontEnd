"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Search, AlertCircle, Info, AlertTriangle, RefreshCw } from "lucide-react"
import type { LogEntry, LogLevel } from "@/types"
import { mockLogs } from "@/lib/mock-data"

interface RunLogsProps {
  runId: string
}

export function RunLogs({ runId }: RunLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadLogs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const runLogs = mockLogs[runId] || []
      setLogs(runLogs)
      setFilteredLogs(runLogs)
    } catch (err) {
      setError("No se pudieron cargar los logs. Reintenta.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [runId])

  useEffect(() => {
    const filtered = logs.filter((log) => log.message.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredLogs(filtered)
  }, [logs, searchTerm])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case "ERROR":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "WARN":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "INFO":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getLogBadgeVariant = (level: LogLevel) => {
    switch (level) {
      case "ERROR":
        return "destructive"
      case "WARN":
        return "secondary"
      case "INFO":
      default:
        return "outline"
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={loadLogs} className="ml-4 bg-transparent">
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
          <CardTitle>Cargando logs...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Logs de Ejecución</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Sin logs disponibles</h3>
            <p className="text-muted-foreground">Aún no hay logs para esta ejecución.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle>Logs de Ejecución</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLogs.map((log, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
              <div className="flex-shrink-0 mt-0.5">{getLogIcon(log.level)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant={getLogBadgeVariant(log.level)} className="text-xs">
                    {log.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {log.step}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{formatTime(log.ts)}</span>
                </div>
                <p className="text-sm">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
        {filteredLogs.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No se encontraron logs que coincidan con "{searchTerm}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
