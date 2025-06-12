"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MatrixOperationsTab } from "@/components/matrix-operations-tab"

export function MatricesSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <MatrixOperationsTab />
        </CardContent>
      </Card>
    </div>
  )
}
