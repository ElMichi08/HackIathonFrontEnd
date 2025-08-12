// API client for TenderMind backend

const API_BASE_URL = "http://localhost:8000"

type DocumentoClasificado = {}

type ValidacionRAG = {}

type AlertaRAG = {}

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
