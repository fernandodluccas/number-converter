"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConversionTab } from "@/components/conversion-tab"
import { MathOperationsTab } from "@/components/math-operations-tab"

export function NumberConverter() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Number System Tool</CardTitle>
        <CardDescription>Convert between number systems and perform math operations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="conversion" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="math">Math Operations</TabsTrigger>
          </TabsList>
          <TabsContent value="conversion">
            <ConversionTab />
          </TabsContent>
          <TabsContent value="math">
            <MathOperationsTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
