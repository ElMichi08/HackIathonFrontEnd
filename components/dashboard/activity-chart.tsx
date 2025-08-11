"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface ActivityData {
  date: string
  count: number
}

interface ActivityChartProps {
  data: ActivityData[]
  isLoading?: boolean
}

export function ActivityChart({ data, isLoading }: ActivityChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    ...item,
    day: new Date(item.date).toLocaleDateString("es-ES", { weekday: "short" }),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis hide />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
