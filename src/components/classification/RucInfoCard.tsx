import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import type { RucInfo } from "../../types"

interface RucInfoCardProps {
  ruc: string
  rucInfo: RucInfo
}

export function RucInfoCard({ ruc, rucInfo }: RucInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Información del RUC
          <Badge variant="outline">{ruc}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Razón Social</h4>
            <p className="font-medium">{rucInfo.razonSocial}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Estado</h4>
            <Badge variant={rucInfo.estadoContribuyenteRuc === "ACTIVO" ? "default" : "destructive"}>
              {rucInfo.estadoContribuyenteRuc}
            </Badge>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Tipo de Contribuyente</h4>
            <p>{rucInfo.tipoContribuyente}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Régimen</h4>
            <p>{rucInfo.regimen}</p>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-1">Actividad Económica Principal</h4>
          <p>{rucInfo.actividadEconomicaPrincipal}</p>
        </div>
      </CardContent>
    </Card>
  )
}
