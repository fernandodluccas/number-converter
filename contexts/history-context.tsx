"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface HistoryEntry {
  id: string
  timestamp: Date
  type: "conversion" | "math" | "matrix"
  operation: string
  input: string
  result: string
  details?: string
}

interface HistoryContextType {
  history: HistoryEntry[]
  addToHistory: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void
  clearHistory: () => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  const addToHistory = (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }
    setHistory((prev) => [newEntry, ...prev].slice(0, 50)) // Keep only last 50 entries
  }

  const clearHistory = () => {
    setHistory([])
  }

  return <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>{children}</HistoryContext.Provider>
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider")
  }
  return context
}
