import axios from "axios"
import type { ClassificationResponse, ValidatedDocument, DocumentImprovement, VectorBaseResponse } from "../types"

const API_BASE_URL = "http://localhost:8000"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error("API Request Error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error("API Response Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export const classifyDocument = async (file: File): Promise<ClassificationResponse> => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await apiClient.post<ClassificationResponse>("/clasificacion/clasificar/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const createVectorBase = async (): Promise<VectorBaseResponse> => {
  const response = await apiClient.post<VectorBaseResponse>("/deteccion/crear_base_vectorial")
  return response.data
}

export const getValidatedDocuments = async (): Promise<ValidatedDocument[]> => {
  const response = await apiClient.get<ValidatedDocument[]>("/deteccion/validar_documentos")
  return response.data
}

export const getDocumentImprovements = async (documentId: number): Promise<DocumentImprovement> => {
  const response = await apiClient.get<DocumentImprovement>(`/deteccion/sugerir_mejoras_alertas/${documentId}`)
  return response.data
}
