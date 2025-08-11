import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { DataProvider } from "@/contexts/data-context"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "TenderMind - Análisis Inteligente de Licitaciones",
  description: "Plataforma de análisis automatizado de documentos de licitación con IA",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <DataProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
          <Toaster />
        </DataProvider>
      </body>
    </html>
  )
}
