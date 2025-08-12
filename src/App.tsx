import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./providers/theme-provider"
import { Navigation } from "./components/layout/Navigation"
import { Toaster } from "./components/ui/toaster"
import ClasificarPage from "./pages/ClasificarPage"
import ValidarPage from "./pages/ValidarPage"
import MejorasPage from "./pages/MejorasPage"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ClasificarPage />} />
            <Route path="/clasificar" element={<ClasificarPage />} />
            <Route path="/validar" element={<ValidarPage />} />
            <Route path="/mejoras" element={<MejorasPage />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
