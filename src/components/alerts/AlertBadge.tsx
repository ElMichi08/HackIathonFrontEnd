import { Badge } from "../ui/badge"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface AlertBadgeProps {
  level: "verde" | "amarillo" | "rojo"
  className?: string
}

export function AlertBadge({ level, className }: AlertBadgeProps) {
  const config = {
    verde: {
      variant: "default" as const,
      icon: CheckCircle,
      label: "Bajo Riesgo",
      className: "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300",
    },
    amarillo: {
      variant: "secondary" as const,
      icon: AlertTriangle,
      label: "Riesgo Medio",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300",
    },
    rojo: {
      variant: "destructive" as const,
      icon: XCircle,
      label: "Alto Riesgo",
      className: "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300",
    },
  }

  const { icon: Icon, label, className: badgeClassName } = config[level]

  return (
    <Badge className={`${badgeClassName} ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  )
}
