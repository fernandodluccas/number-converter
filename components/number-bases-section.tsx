"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConversionTab } from "@/components/conversion-tab"
import { MathOperationsTab } from "@/components/math-operations-tab"

export function NumberBasesSection() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="conversion" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="conversion">Conversão de Números</TabsTrigger>
          <TabsTrigger value="math">Operações Matemáticas</TabsTrigger>
        </TabsList>

        <TabsContent value="conversion" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <ConversionTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="math" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <MathOperationsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
