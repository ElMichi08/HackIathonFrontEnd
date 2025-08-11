"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down" | "neutral"
  isLoading?: boolean
  className?: string
}

export function KPICard({ title, value, subtitle, trend, isLoading, className }: KPICardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p
            className={cn(
              "text-xs text-muted-foreground",
              trend === "up" && "text-green-600",
              trend === "down" && "text-red-600",
            )}
          >
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
