"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "../../hooks/useToast"
import { getValidatedDocuments } from "../../lib/api"
import type { ValidatedDocument } from "../../types"

const ITEMS_PER_PAGE = 10

interface ValidationTableProps {
  onDocumentSelect?: (document: ValidatedDocument) => void
}

export function ValidationTable({ onDocumentSelect }: ValidationTableProps) {
  const [documents, setDocuments] = useState<ValidatedDocument[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<ValidatedDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [documents, typeFilter, searchQuery])

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getValidatedDocuments()
      setDocuments(data)
    } catch (err) {
      setError("Error al cargar los documentos validados")
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos validados",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterDocuments = () => {
    let filtered = documents

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.tipo_documento === typeFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          doc.observaciones.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.tipo_documento.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredDocuments(filtered)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex)

  const documentTypes = Array.from(new Set(documents.map((doc) => doc.tipo_documento)))

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Cargando documentos validados...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={loadDocuments} variant="outline">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar en observaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Documentos Validados
            <Badge variant="outline">{filteredDocuments.length} documentos</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentDocuments.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo de Documento</TableHead>
                    <TableHead>Observaciones</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">#{document.id}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {document.tipo_documento.charAt(0).toUpperCase() + document.tipo_documento.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate" title={document.observaciones}>
                          {document.observaciones}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => onDocumentSelect?.(document)}>
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredDocuments.length)} de{" "}
                    {filteredDocuments.length} documentos
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <span className="text-sm">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron documentos que coincidan con los filtros</p>
              {(typeFilter !== "all" || searchQuery) && (
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setTypeFilter("all")
                    setSearchQuery("")
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
