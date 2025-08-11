// Mock data for TenderMind demo mode

import type {
  Run,
  LogEntry,
  Results,
  CompareRow,
  KPIData,
  DocumentoClasificado,
  ValidacionRAG,
  AlertaRAG,
} from "@/types"

export const mockRuns: Run[] = [
  {
    id: "run-001",
    createdAt: "2024-01-15T10:30:00Z",
    status: "COMPLETED",
    progressPercent: 100,
    currentStep: null,
    files: [
      { id: "file-001", name: "propuesta-empresa-a.pdf", size: 2048576 },
      { id: "file-002", name: "documentos-legales.pdf", size: 1536000 },
    ],
  },
  {
    id: "run-002",
    createdAt: "2024-01-14T14:20:00Z",
    status: "FAILED",
    progressPercent: 45,
    currentStep: "VALIDATE",
    files: [{ id: "file-003", name: "oferta-tecnica.pdf", size: 3072000 }],
  },
  {
    id: "run-003",
    createdAt: "2024-01-14T09:15:00Z",
    status: "RUNNING",
    progressPercent: 75,
    currentStep: "ANALYZE",
    files: [{ id: "file-004", name: "propuesta-completa.pdf", size: 4096000 }],
  },
]

export const mockLogs: Record<string, LogEntry[]> = {
  "run-001": [
    { ts: "2024-01-15T10:30:05Z", step: "EXTRACT", level: "INFO", message: "Iniciando extracción de texto del PDF" },
    {
      ts: "2024-01-15T10:30:12Z",
      step: "EXTRACT",
      level: "INFO",
      message: "Texto extraído correctamente: 1,245 palabras",
    },
    { ts: "2024-01-15T10:30:15Z", step: "CLASSIFY", level: "INFO", message: "Clasificando secciones del documento" },
    {
      ts: "2024-01-15T10:30:28Z",
      step: "CLASSIFY",
      level: "INFO",
      message: "Secciones identificadas: Legal, Técnica, Económica",
    },
    { ts: "2024-01-15T10:30:30Z", step: "INDEX", level: "INFO", message: "Creando índice vectorial" },
    { ts: "2024-01-15T10:30:45Z", step: "VALIDATE", level: "INFO", message: "Validando contra base de conocimiento" },
    {
      ts: "2024-01-15T10:30:52Z",
      step: "VALIDATE",
      level: "WARN",
      message: "Detectada inconsistencia en términos de pago",
    },
    { ts: "2024-01-15T10:31:00Z", step: "ANALYZE", level: "INFO", message: "Análisis completado exitosamente" },
  ],
}

export const mockResults: Record<string, Results> = {
  "run-001": {
    runId: "run-001",
    sections: {
      LEGAL: [
        "Cumplimiento de requisitos legales básicos",
        "Documentación societaria completa",
        "Certificados vigentes de no estar en listas restrictivas",
        "Pólizas de seguro según especificaciones",
      ],
      TECHNICAL: [
        "Propuesta técnica alineada con términos de referencia",
        "Metodología clara y detallada",
        "Cronograma realista de implementación",
        "Equipo técnico con experiencia comprobada",
      ],
      ECONOMIC: [
        "Presupuesto dentro del rango esperado",
        "Desglose detallado de costos",
        "Términos de pago estándar",
        "Garantías económicas apropiadas",
      ],
    },
    alerts: [
      {
        id: "alert-001",
        title: "Inconsistencia en términos de pago",
        severity: "MEDIUM",
        category: "ECONOMIC",
        description: "Los términos de pago mencionados en la sección económica no coinciden con los del anexo legal.",
        references: { docId: "file-001", page: 15, fragment: "Términos de pago: 30 días..." },
      },
      {
        id: "alert-002",
        title: "Certificado próximo a vencer",
        severity: "LOW",
        category: "LEGAL",
        description: "El certificado de no estar en centrales de riesgo vence en 45 días.",
        references: { docId: "file-002", page: 3, fragment: "Válido hasta: 28/02/2024" },
      },
    ],
    summary:
      "Propuesta técnicamente sólida con documentación legal completa. Se identificaron alertas menores que requieren aclaración.",
  },
}

export const mockCompareData: CompareRow[] = [
  {
    vendor: "Empresa A S.A.",
    complianceScore: 95,
    riskHigh: 0,
    riskMedium: 2,
    riskLow: 1,
    budget: 150000,
    terms: { deliveryDays: 90, payment: "30 días", penalties: "0.1% diario" },
    notes: "Propuesta sólida con experiencia comprobada",
  },
  {
    vendor: "Consultora B Ltda.",
    complianceScore: 87,
    riskHigh: 1,
    riskMedium: 1,
    riskLow: 3,
    budget: 135000,
    terms: { deliveryDays: 120, payment: "45 días", penalties: "0.05% diario" },
    notes: "Precio competitivo, mayor tiempo de entrega",
  },
  {
    vendor: "Soluciones C Corp.",
    complianceScore: 78,
    riskHigh: 2,
    riskMedium: 3,
    riskLow: 2,
    budget: 125000,
    terms: { deliveryDays: 75, payment: "60 días", penalties: "0.2% diario" },
    notes: "Menor precio pero mayor riesgo identificado",
  },
]

export const mockKPIs: KPIData = {
  totalRuns: 24,
  highAlertPercentage: 12.5,
  averageTime: 4.2,
  recentActivity: [
    { date: "2024-01-15", count: 3 },
    { date: "2024-01-14", count: 5 },
    { date: "2024-01-13", count: 2 },
    { date: "2024-01-12", count: 4 },
    { date: "2024-01-11", count: 1 },
    { date: "2024-01-10", count: 6 },
    { date: "2024-01-09", count: 3 },
  ],
}

// Mock API responses
export const mockDocumentoClasificado: DocumentoClasificado = {
  id: 1,
  ruc_encontrado: "1234567890001",
  razon_social: "EMPRESA DEMO S.A.",
  estado_contribuyente_ruc: "ACTIVO",
  actividad_economica_principal: "Consultoría en tecnología",
  tipo_contribuyente: "SOCIEDADES",
  regimen: "GENERAL",
  categoria: "GRANDE",
  obligado_llevar_contabilidad: "SI",
  agente_retencion: "NO",
  contribuyente_especial: "NO",
  inicio_actividades: "2020-03-15",
  actualizacion: "2024-01-10",
  representante_identificacion: "0987654321",
  representante_nombre: "Juan Pérez García",
  contribuyente_fantasma: "NO",
  transacciones_inexistente: "NO",
  clasificacion_legal:
    "Documentación legal completa. Cumple con requisitos básicos de habilitación. Certificados vigentes.",
  clasificacion_tecnica: "Propuesta técnica detallada. Metodología clara. Equipo calificado con experiencia relevante.",
  clasificacion_economica: "Presupuesto competitivo. Desglose detallado de costos. Términos de pago estándar.",
  texto_pdf_completo: "Contenido completo del PDF...",
  fecha_registro: "2024-01-15T10:30:00Z",
}

export const mockValidaciones: ValidacionRAG[] = [
  {
    tipo_documento: "propuesta",
    resultado_validacion: "Validación exitosa",
    observaciones: ["Cumple con términos de referencia", "Documentación completa"],
    semaforo: "LOW",
  },
]

export const mockAlertas: AlertaRAG = {
  recomendaciones:
    "• Verificar vigencia de certificados\n• Aclarar términos de pago\n• Confirmar disponibilidad del equipo técnico",
  semaforo_alerta: "MEDIUM",
}
