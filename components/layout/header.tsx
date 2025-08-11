"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FileText, BarChart3, Upload, GitCompare, List } from "lucide-react"
import { useData } from "@/contexts/data-context"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Analizar", href: "/analyze", icon: Upload },
  { name: "Ejecuciones", href: "/runs", icon: List },
  { name: "Comparar", href: "/compare", icon: GitCompare },
]

export function Header() {
  const pathname = usePathname()
  const { mode, setMode } = useData()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TenderMind</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="data-mode" className="text-sm font-medium">
                Fuente de datos:
              </Label>
              <div className="flex items-center space-x-2">
                <span className={cn("text-xs", mode === "MOCK" ? "font-medium" : "text-muted-foreground")}>MOCK</span>
                <Switch
                  id="data-mode"
                  checked={mode === "API"}
                  onCheckedChange={(checked) => setMode(checked ? "API" : "MOCK")}
                />
                <span className={cn("text-xs", mode === "API" ? "font-medium" : "text-muted-foreground")}>API</span>
              </div>
              <Badge variant={mode === "API" ? "default" : "secondary"} className="ml-2">
                {mode}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
