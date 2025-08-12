// Core data types for TenderMind application

export type DataMode = "MOCK" | "API"

export type RunStatus = "PENDING" | "RUNNING" | "FAILED" | "COMPLETED"
export type AnalysisStep = "EXTRACT" | "CLASSIFY" | "INDEX" | "VALIDATE" | "ANALYZE"
export type LogLevel = "INFO" | "WARN" | "ERROR"
export type AlertSeverity = "HIGH" | "MEDIUM" | "LOW"
export type SectionType = "LEGAL" | "TECHNICAL" | "ECONOMIC"

// Backend API Types
export interface DocumentoClasificado {
  id: number
  ruc_encontrado: string
  razon_social: string
  estado_contribuyente_ruc: string
  actividad_economica_principal: string
  tipo_contribuyente: string
  regimen: string
  categoria?: string
  obligado_llevar_contabilidad: string
  agente_retencion: string
  contribuyente_especial: string
  inicio_actividades: string
  cese?: string
  reinicio_actividades?: string
  actualizacion: string
  representante_identificacion: string
  representante_nombre: string
  motivo_cancelacion_suspension?: string
  contribuyente_fantasma: string
  transacciones_inexistente: string
  clasificacion_legal: string
  clasificacion_tecnica: string
  clasificacion_economica: string
  texto_pdf_completo: string
  fecha_registro: string
}

export interface ValidacionRAG {
  tipo_documento: string
  resultado_validacion: string
  observaciones: string | string[]
  semaforo: AlertSeverity
}

export interface AlertaRAG {
  recomendaciones: string
  semaforo_alerta: AlertSeverity
}

// Mock Types
export interface Run {
  id: string
  createdAt: string
  status: RunStatus
  progressPercent: number
  currentStep: AnalysisStep | null
  files: Array<{
    id: string
    name: string
    size: number
  }>
}

export interface LogEntry {
  ts: string
  step: AnalysisStep
  level: LogLevel
  message: string
}

export interface Alert {
  id: string
  title: string
  severity: AlertSeverity
  category: SectionType
  description: string
  references?: {
    docId: string
    page: number
    fragment: string
  }
}

export interface Results {
  runId: string
  sections: {
    LEGAL: string[]
    TECHNICAL: string[]
    ECONOMIC: string[]
  }
  alerts: Alert[]
  summary: string
}

export interface CompareRow {
  vendor: string
  complianceScore: number
  riskHigh: number
  riskMedium: number
  riskLow: number
  budget: number
  terms: {
    deliveryDays: number
    payment: string
    penalties: string
  }
  notes: string
}

export interface KPIData {
  totalRuns: number
  highAlertPercentage: number
  averageTime: number
  recentActivity: Array<{
    date: string
    count: number
  }>
}
