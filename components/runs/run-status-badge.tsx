import { Badge } from "@/components/ui/badge"
import type { RunStatus } from "@/types"
import { CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react"

interface RunStatusBadgeProps {
  status: RunStatus
  className?: string
}

export function RunStatusBadge({ status, className }: RunStatusBadgeProps) {
  const getStatusConfig = (status: RunStatus) => {
    switch (status) {
      case "COMPLETED":
        return {
          variant: "default" as const,
          icon: CheckCircle2,
          label: "Completado",
          className: "bg-green-100 text-green-800 border-green-200",
        }
      case "RUNNING":
        return {
          variant: "secondary" as const,
          icon: Loader2,
          label: "En progreso",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        }
      case "PENDING":
        return {
          variant: "outline" as const,
          icon: Clock,
          label: "Pendiente",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        }
      case "FAILED":
        return {
          variant: "destructive" as const,
          icon: AlertCircle,
          label: "Fallido",
          className: "bg-red-100 text-red-800 border-red-200",
        }
      default:
        return {
          variant: "outline" as const,
          icon: Clock,
          label: status,
          className: "",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      <Icon className={`h-3 w-3 mr-1 ${status === "RUNNING" ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  )
}
