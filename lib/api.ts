// API client for TenderMind backend

const API_BASE_URL = "http://localhost:8000"

type DocumentoClasificado = {}

type ValidacionRAG = {}

type AlertaRAG = {}

const mockClassificationResponse: ClassificationResponse = {
  id: 1,
  ruc_encontrado: "1790012345001",
  ruc_info: {
    razonSocial: "Constructora Ejemplo S.A.",
    estadoContribuyenteRuc: "ACTIVO",
    actividadEconomicaPrincipal: "Construcción de edificios",
    tipoContribuyente: "Sociedad",
    regimen: "General",
  },
  clasificacion: {
    legal: [
      "Cumplimiento de normativas de construcción según el Código de la Construcción vigente.",
      "Requisitos de licencias municipales y permisos de construcción debidamente tramitados.",
      "Obligaciones laborales y de seguridad social para trabajadores de la construcción.",
    ],
    tecnica: [
      "Especificaciones técnicas de materiales de construcción certificados.",
      "Planos arquitectónicos y estructurales aprobados por profesionales competentes.",
      "Cronograma de obra con hitos técnicos y entregables específicos.",
    ],
    economica: [
      "Presupuesto detallado con análisis de precios unitarios de construcción.",
      "Garantías de cumplimiento y calidad de obra por el 10% del valor total.",
      "Forma de pago: 30% anticipo, 60% contra avance de obra, 10% contra entrega final.",
    ],
  },
}

const mockValidatedDocuments: ValidatedDocument[] = [
  { id: 1, tipo_documento: "pliego", observaciones: "Cumple con todos los requisitos técnicos y legales establecidos" },
  {
    id: 2,
    tipo_documento: "contrato",
    observaciones: "Faltan cláusulas de penalización por incumplimiento de cronograma",
  },
  { id: 3, tipo_documento: "propuesta", observaciones: "Documentación técnica completa y presupuesto ajustado" },
  { id: 4, tipo_documento: "garantia", observaciones: "Póliza de cumplimiento vigente y suficiente" },
]

const mockDocumentImprovements: Record<number, DocumentImprovement> = {
  1: {
    id: 1,
    tipo_documento: "pliego",
    observaciones: "Cumple con todos los requisitos técnicos y legales establecidos",
    recomendaciones: "Considerar incluir especificaciones adicionales para materiales sostenibles",
    semaforo_alerta: "verde",
  },
  2: {
    id: 2,
    tipo_documento: "contrato",
    observaciones: "Faltan cláusulas de penalización por incumplimiento de cronograma",
    recomendaciones:
      "Incluir sección de penalización por incumplimiento: 0.1% del valor total por cada día de retraso, con un máximo del 10% del valor del contrato",
    semaforo_alerta: "rojo",
  },
  3: {
    id: 3,
    tipo_documento: "propuesta",
    observaciones: "Documentación técnica completa y presupuesto ajustado",
    recomendaciones: "Revisar la metodología de construcción propuesta para optimizar tiempos de ejecución",
    semaforo_alerta: "amarillo",
  },
  4: {
    id: 4,
    tipo_documento: "garantia",
    observaciones: "Póliza de cumplimiento vigente y suficiente",
    recomendaciones: "La garantía cumple con los requisitos mínimos establecidos",
    semaforo_alerta: "verde",
  },
}

export class TenderMindAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  async clasificarDocumento(file: File): Promise<DocumentoClasificado> {
    const formData = new FormData()
    formData.append("file", file)

    return this.request<DocumentoClasificado>("/clasificacion/clasificar/", {
      method: "POST",
      body: formData,
    })
  }

  async crearBaseVectorial(): Promise<{ message: string; count: number }> {
    return this.request("/deteccion/crear_base_vectorial", {
      method: "POST",
    })
  }

  async validarDocumentos(): Promise<ValidacionRAG[]> {
    return this.request("/deteccion/validar_documentos")
  }

  async obtenerAlertas(documentoId: number): Promise<AlertaRAG> {
    return this.request(`/alert/sugerir_mejoras_alertas/${documentoId}`)
  }
}

export const apiClient = new TenderMindAPI()

import type { ClassificationResponse, ValidatedDocument, DocumentImprovement } from "@/types"

export async function classifyDocument(file: File): Promise<ClassificationResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // In production, this would call the real API
  // return apiClient.clasificarDocumento(file)

  // For now, return mock data
  return mockClassificationResponse
}

export async function getValidatedDocuments(): Promise<ValidatedDocument[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In production, this would call the real API
  // return apiClient.validarDocumentos()

  // For now, return mock data
  return mockValidatedDocuments
}

export async function getDocumentImprovements(documentId: number): Promise<DocumentImprovement> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In production, this would call the real API
  // return apiClient.obtenerAlertas(documentId)

  // For now, return mock data
  const improvement = mockDocumentImprovements[documentId]
  if (!improvement) {
    throw new Error(`No se encontraron mejoras para el documento ${documentId}`)
  }

  return improvement
}

export async function createVectorBase(): Promise<{ mensaje: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // In production, this would call the real API
  // return apiClient.crearBaseVectorial()

  // For now, return mock data
  return { mensaje: "Base vectorial creada con 128 fragmentos" }
}
