import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Classification } from "@/types"

interface ClassificationTabsProps {
  classification: Classification
}

export function ClassificationTabs({ classification }: ClassificationTabsProps) {
  const categories = [
    { key: "legal" as keyof Classification, label: "Legal", items: classification.legal },
    { key: "tecnica" as keyof Classification, label: "Técnica", items: classification.tecnica },
    { key: "economica" as keyof Classification, label: "Económica", items: classification.economica },
  ]

  return (
    <Tabs defaultValue="legal" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {categories.map((category) => (
          <TabsTrigger key={category.key} value={category.key}>
            {category.label}
            <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">{category.items.length}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category.key} value={category.key}>
          <Card>
            <CardHeader>
              <CardTitle>Clasificación {category.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {category.items.length > 0 ? (
                  <div className="space-y-4">
                    {category.items.map((item, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg">
                        <p className="text-sm leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontró contenido para esta categoría
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
