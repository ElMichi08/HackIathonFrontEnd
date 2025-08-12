import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { ModeToggle } from "../ModeToggle"

const navItems = [
  { href: "/clasificar", label: "Clasificar" },
  { href: "/validar", label: "Validar Documentos" },
  { href: "/mejoras", label: "Mejoras y Alertas" },
]

export function Navigation() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/clasificar" className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-primary" />
            <span className="font-bold">Licitaciones IA</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === item.href ? "text-foreground" : "text-foreground/60",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
