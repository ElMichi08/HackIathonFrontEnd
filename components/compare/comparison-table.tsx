"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Building2,
  DollarSign,
  Calendar,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import type { CompareRow } from "@/types"
import { cn } from "@/lib/utils"

interface ComparisonTableProps {
  data: CompareRow[]
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export function ComparisonTable({ data, isLoading, error, onRetry }: ComparisonTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<keyof CompareRow>("complianceScore")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [highlightDifferences, setHighlightDifferences] = useState(false)

  const filteredData = data
    .filter((row) => row.vendor.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      return 0
    })

  const handleVendorSelect = (vendor: string, checked: boolean) => {
    if (checked) {
      setSelectedVendors([...selectedVendors, vendor])
    } else {
      setSelectedVendors(selectedVendors.filter((v) => v !== vendor))
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getComplianceIcon = (score: number) => {
    if (score >= 90) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (score >= 75) return <Minus className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getRiskBadgeVariant = (count: number, type: "high" | "medium" | "low") => {
    if (count === 0) return "outline"
    switch (type) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const shouldHighlight = (field: keyof CompareRow, value: any) => {
    if (!highlightDifferences || filteredData.length < 2) return false

    const values = filteredData.map((row) => row[field])
    const uniqueValues = new Set(values)

    return uniqueValues.size > 1
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="ml-4 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preparando comparador...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparador de Ofertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Sin datos para comparar</h3>
            <p className="text-muted-foreground mb-4">Selecciona al menos dos documentos para comparar.</p>
            <Button asChild>
              <a href="/analyze">Analizar documentos</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle>Comparador de Ofertas</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                Demo
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar oferente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as keyof CompareRow)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complianceScore">Cumplimiento</SelectItem>
                  <SelectItem value="budget">Presupuesto</SelectItem>
                  <SelectItem value="vendor">Oferente</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="bg-transparent"
              >
                {sortOrder === "asc" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="highlight-differences"
              checked={highlightDifferences}
              onCheckedChange={setHighlightDifferences}
            />
            <label htmlFor="highlight-differences" className="text-sm font-medium cursor-pointer">
              Resaltar diferencias
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <span className="sr-only">Seleccionar</span>
                  </TableHead>
                  <TableHead>Oferente</TableHead>
                  <TableHead>Cumplimiento</TableHead>
                  <TableHead>Riesgos</TableHead>
                  <TableHead>Presupuesto</TableHead>
                  <TableHead>Términos</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={index} className={selectedVendors.includes(row.vendor) ? "bg-muted/50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedVendors.includes(row.vendor)}
                        onCheckedChange={(checked) => handleVendorSelect(row.vendor, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{row.vendor}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "flex items-center space-x-2",
                          shouldHighlight("complianceScore", row.complianceScore) && "bg-yellow-100 px-2 py-1 rounded",
                        )}
                      >
                        {getComplianceIcon(row.complianceScore)}
                        <span className={cn("font-medium", getComplianceColor(row.complianceScore))}>
                          {row.complianceScore}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {row.riskHigh > 0 && (
                          <Badge variant={getRiskBadgeVariant(row.riskHigh, "high")} className="text-xs">
                            {row.riskHigh} HIGH
                          </Badge>
                        )}
                        {row.riskMedium > 0 && (
                          <Badge variant={getRiskBadgeVariant(row.riskMedium, "medium")} className="text-xs">
                            {row.riskMedium} MED
                          </Badge>
                        )}
                        {row.riskLow > 0 && (
                          <Badge variant={getRiskBadgeVariant(row.riskLow, "low")} className="text-xs">
                            {row.riskLow} LOW
                          </Badge>
                        )}
                        {row.riskHigh === 0 && row.riskMedium === 0 && row.riskLow === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Sin riesgos
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "flex items-center space-x-1",
                          shouldHighlight("budget", row.budget) && "bg-yellow-100 px-2 py-1 rounded",
                        )}
                      >
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatCurrency(row.budget)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{row.terms.deliveryDays} días</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="h-3 w-3 text-muted-foreground" />
                          <span>{row.terms.payment}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                          <span>{row.terms.penalties}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground max-w-48 truncate" title={row.notes}>
                        {row.notes}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Selected Vendors Summary */}
      {selectedVendors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Selección ({selectedVendors.length} oferentes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(
                    filteredData
                      .filter((row) => selectedVendors.includes(row.vendor))
                      .reduce((sum, row) => sum + row.complianceScore, 0) / selectedVendors.length,
                  )}
                  %
                </p>
                <p className="text-sm text-muted-foreground">Cumplimiento promedio</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    Math.round(
                      filteredData
                        .filter((row) => selectedVendors.includes(row.vendor))
                        .reduce((sum, row) => sum + row.budget, 0) / selectedVendors.length,
                    ),
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Presupuesto promedio</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(
                    filteredData
                      .filter((row) => selectedVendors.includes(row.vendor))
                      .reduce((sum, row) => sum + row.terms.deliveryDays, 0) / selectedVendors.length,
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Días promedio de entrega</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
