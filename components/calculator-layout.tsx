"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { HistoryPanel } from "@/components/history-panel"
import { NumberBasesSection } from "@/components/number-bases-section"
import { MatricesSection } from "@/components/matrices-section"
import { Button } from "@/components/ui/button"
import { History, X } from "lucide-react"

export type ActiveSection = "number-bases" | "matrices"

export function CalculatorLayout() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("number-bases")
  const [showHistory, setShowHistory] = useState(false)

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        <SidebarInset className="flex-1 flex flex-col">
          <main className="flex-1 flex overflow-hidden relative">
            <div className="flex-1 overflow-auto p-4 md:p-6">
              {activeSection === "number-bases" && <NumberBasesSection />}
              {activeSection === "matrices" && <MatricesSection />}
            </div>

            {/* Desktop History Panel */}
            <div className="hidden lg:block w-80 border-l bg-muted/30">
              <HistoryPanel />
            </div>

            {/* Mobile History Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowHistory(!showHistory)}
                className="fixed bottom-4 right-4 z-50 shadow-lg"
              >
                <History className="h-4 w-4" />
              </Button>

              {/* Mobile History Panel */}
              {showHistory && (
                <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
                  <div className="fixed right-0 top-0 h-full w-80 max-w-[90vw] border-l bg-background shadow-lg">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h2 className="text-lg font-semibold">Histórico</h2>
                      <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="h-[calc(100%-4rem)]">
                      <HistoryPanel />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
