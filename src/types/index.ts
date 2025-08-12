export interface RucInfo {
  razonSocial: string
  estadoContribuyenteRuc: string
  actividadEconomicaPrincipal: string
  tipoContribuyente: string
  regimen: string
}

export interface Classification {
  legal: string[]
  tecnica: string[]
  economica: string[]
}

export interface ClassificationResponse {
  id: number
  ruc_encontrado: string
  ruc_info: RucInfo
  clasificacion: Classification
}

export interface ValidatedDocument {
  id: number
  tipo_documento: string
  observaciones: string
}

export interface DocumentImprovement {
  id: number
  tipo_documento: string
  observaciones: string
  recomendaciones: string
  semaforo_alerta: "verde" | "amarillo" | "rojo"
}

export interface VectorBaseResponse {
  mensaje: string
}
