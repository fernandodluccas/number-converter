"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConversionTab } from "@/components/conversion-tab"
import { MathOperationsTab } from "@/components/math-operations-tab"
import { MatrixOperationsTab } from "@/components/matrix-operations-tab"

export function NumberConverter() {
  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="text-2xl">Sistema de Cálculos Avançados</CardTitle>
        <CardDescription>Conversão de bases numéricas, operações matemáticas e cálculos matriciais</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="conversion" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-48">
              <TabsList className="flex flex-col h-auto w-full">
                <TabsTrigger value="conversion" className="w-full justify-start px-4 py-3">
                  Conversão de Base
                </TabsTrigger>
                <TabsTrigger value="math" className="w-full justify-start px-4 py-3">
                  Operações Matemáticas
                </TabsTrigger>
                <TabsTrigger value="matrix" className="w-full justify-start px-4 py-3">
                  Operações Matriciais
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex-1">
              <TabsContent value="conversion" className="m-0">
                <ConversionTab />
              </TabsContent>
              <TabsContent value="math" className="m-0">
                <MathOperationsTab />
              </TabsContent>
              <TabsContent value="matrix" className="m-0">
                <MatrixOperationsTab />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
