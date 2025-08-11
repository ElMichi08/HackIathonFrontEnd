"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type {
  DataMode,
  DocumentoClasificado,
  ValidacionRAG,
  AlertaRAG,
  Run,
  Results,
  CompareRow,
  KPIData,
} from "@/types"
import { apiClient } from "@/lib/api"
import {
  mockRuns,
  mockResults,
  mockCompareData,
  mockKPIs,
  mockDocumentoClasificado,
  mockValidaciones,
  mockAlertas,
} from "@/lib/mock-data"

interface DataContextType {
  mode: DataMode
  setMode: (mode: DataMode) => void

  // Current document state
  currentDocument: DocumentoClasificado | null
  setCurrentDocument: (doc: DocumentoClasificado | null) => void

  // API methods
  clasificarDocumento: (file: File) => Promise<DocumentoClasificado>
  crearBaseVectorial: () => Promise<{ message: string; count: number }>
  obtenerValidaciones: () => Promise<ValidacionRAG[]>
  obtenerAlertas: (documentoId: number) => Promise<AlertaRAG>

  // Mock methods
  getRuns: () => Promise<Run[]>
  getRunById: (id: string) => Promise<Run | null>
  getResults: (runId: string) => Promise<Results | null>
  getCompareData: () => Promise<CompareRow[]>
  getKPIs: () => Promise<KPIData>

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<DataMode>("MOCK")
  const [currentDocument, setCurrentDocument] = useState<DocumentoClasificado | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Persist mode in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("tendermind-mode") as DataMode
    if (savedMode && (savedMode === "MOCK" || savedMode === "API")) {
      setModeState(savedMode)
    }
  }, [])

  const setMode = (newMode: DataMode) => {
    setModeState(newMode)
    localStorage.setItem("tendermind-mode", newMode)
  }

  // API methods
  const clasificarDocumento = async (file: File): Promise<DocumentoClasificado> => {
    if (mode === "MOCK") {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return mockDocumentoClasificado
    }
    return apiClient.clasificarDocumento(file)
  }

  const crearBaseVectorial = async () => {
    if (mode === "MOCK") {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return { message: "Índice RAG creado exitosamente", count: 150 }
    }
    return apiClient.crearBaseVectorial()
  }

  const obtenerValidaciones = async (): Promise<ValidacionRAG[]> => {
    if (mode === "MOCK") {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return mockValidaciones
    }
    return apiClient.validarDocumentos()
  }

  const obtenerAlertas = async (documentoId: number): Promise<AlertaRAG> => {
    if (mode === "MOCK") {
      await new Promise((resolve) => setTimeout(resolve, 800))
      return mockAlertas
    }
    return apiClient.obtenerAlertas(documentoId)
  }

  // Mock methods (always use mock data)
  const getRuns = async (): Promise<Run[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockRuns
  }

  const getRunById = async (id: string): Promise<Run | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockRuns.find((run) => run.id === id) || null
  }

  const getResults = async (runId: string): Promise<Results | null> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return mockResults[runId] || null
  }

  const getCompareData = async (): Promise<CompareRow[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return mockCompareData
  }

  const getKPIs = async (): Promise<KPIData> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockKPIs
  }

  const value: DataContextType = {
    mode,
    setMode,
    currentDocument,
    setCurrentDocument,
    clasificarDocumento,
    crearBaseVectorial,
    obtenerValidaciones,
    obtenerAlertas,
    getRuns,
    getRunById,
    getResults,
    getCompareData,
    getKPIs,
    isLoading,
    setIsLoading,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
