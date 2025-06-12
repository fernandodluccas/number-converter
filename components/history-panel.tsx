"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Copy, Clock } from "lucide-react"
import { useHistory } from "@/contexts/history-context"
import { formatDistanceToNow } from "@/lib/date-utils"

export function HistoryPanel() {
  const { history, clearHistory } = useHistory()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "conversion":
        return "bg-blue-100 text-blue-800"
      case "math":
        return "bg-green-100 text-green-800"
      case "matrix":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "conversion":
        return "Conversão"
      case "math":
        return "Matemática"
      case "matrix":
        return "Matriz"
      default:
        return "Desconhecido"
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Histórico de Operações</h2>
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearHistory}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {history.length} operaç{history.length !== 1 ? "ões" : "ão"} registrada{history.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma operação ainda</p>
              <p className="text-sm text-muted-foreground">Seu histórico de cálculos aparecerá aqui</p>
            </div>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="bg-card border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className={getTypeColor(entry.type)}>
                    {getTypeLabel(entry.type)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium">{entry.operation}</p>
                  <p className="text-xs text-muted-foreground mt-1">Input: {entry.input}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono bg-muted p-2 rounded text-foreground whitespace-pre-wrap break-all">
                      {entry.result}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(entry.result)}
                    className="ml-2 flex-shrink-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                {entry.details && <p className="text-xs text-muted-foreground border-t pt-2">{entry.details}</p>}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
