"use client"

import { Grid3X3, Binary } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { ActiveSection } from "./calculator-layout"

interface AppSidebarProps {
  activeSection: ActiveSection
  setActiveSection: (section: ActiveSection) => void
}

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const menuItems = [
    {
      id: "number-bases" as ActiveSection,
      title: "Bases Numéricas",
      icon: Binary,
      description: "Conversões e operações matemáticas",
    },
    {
      id: "matrices" as ActiveSection,
      title: "Matrizes",
      icon: Grid3X3,
      description: "Operações matriciais e determinantes",
    },
  ]

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar">
        <div className="flex items-center justify-between px-4 py-3">
          <SidebarTrigger className="h-6 w-6" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
            Ferramentas
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-sidebar-accent"
                    size="lg"
                  >
                    <item.icon className="h-5 w-5 text-sidebar-foreground/70" />
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-medium text-sidebar-foreground">{item.title}</span>
                      <span className="text-xs text-sidebar-foreground/60 leading-tight">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
