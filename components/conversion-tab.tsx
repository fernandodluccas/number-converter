"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Copy, Check, Calculator } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { validateInput, convertNumber, type NumberSystem } from "@/lib/number-utils"
import { Card, CardContent } from "@/components/ui/card"
import { useHistory } from "@/contexts/history-context"

export function ConversionTab() {
  const [inputValue, setInputValue] = useState("")
  const [inputSystem, setInputSystem] = useState<NumberSystem>("decimal")
  const [error, setError] = useState<string | null>(null)
  const [conversions, setConversions] = useState({
    binary: "",
    octal: "",
    decimal: "",
    hexadecimal: "",
  })
  const [copied, setCopied] = useState<NumberSystem | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  const { addToHistory } = useHistory()

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value)
    setHasCalculated(false)

    // Clear previous results and errors
    setConversions({
      binary: "",
      octal: "",
      decimal: "",
      hexadecimal: "",
    })

    // Only validate, don't convert automatically
    if (value && !validateInput(value, inputSystem)) {
      setError(`Número ${getSystemName(inputSystem)} inválido. Verifique sua entrada.`)
    } else {
      setError(null)
    }
  }

  // Handle system change
  const handleSystemChange = (system: NumberSystem) => {
    setInputSystem(system)
    setInputValue("")
    setError(null)
    setHasCalculated(false)
    setConversions({
      binary: "",
      octal: "",
      decimal: "",
      hexadecimal: "",
    })
  }

  // Calculate conversions
  const calculateConversions = () => {
    if (!inputValue) {
      setError("Por favor, digite um número para converter")
      return
    }

    if (!validateInput(inputValue, inputSystem)) {
      setError(`Número ${getSystemName(inputSystem)} inválido. Verifique sua entrada.`)
      return
    }

    const newConversions = convertNumber(inputValue, inputSystem)
    setConversions(newConversions)
    setHasCalculated(true)
    setError(null)

    // Add to history
    addToHistory({
      type: "conversion",
      operation: `Converter ${getSystemName(inputSystem)} para outras bases`,
      input: `${inputValue} (${getSystemName(inputSystem)})`,
      result: `${getSystemName("binary")}: ${newConversions.binary}\n${getSystemName("octal")}: ${newConversions.octal}\n${getSystemName("decimal")}: ${newConversions.decimal}\n${getSystemName("hexadecimal")}: ${newConversions.hexadecimal}`,
      details: `Convertido do sistema ${getSystemName(inputSystem)}`,
    })
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, system: NumberSystem) => {
    navigator.clipboard.writeText(text)
    setCopied(system)
    setTimeout(() => setCopied(null), 2000)
  }

  const getSystemName = (system: NumberSystem): string => {
    const names = {
      binary: "Binário",
      octal: "Octal",
      decimal: "Decimal",
      hexadecimal: "Hexadecimal",
    }
    return names[system]
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="number-system">Sistema Numérico</Label>
              <Select value={inputSystem} onValueChange={(value) => handleSystemChange(value as NumberSystem)}>
                <SelectTrigger id="number-system" className="mt-1">
                  <SelectValue placeholder="Selecione o sistema numérico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="binary">Binário (Base 2)</SelectItem>
                  <SelectItem value="octal">Octal (Base 8)</SelectItem>
                  <SelectItem value="decimal">Decimal (Base 10)</SelectItem>
                  <SelectItem value="hexadecimal">Hexadecimal (Base 16)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="input-value">Número {getSystemName(inputSystem)}</Label>
              <Input
                id="input-value"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`Digite um número ${getSystemName(inputSystem)}`}
                className={cn("mt-1", error && "border-red-500")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    calculateConversions()
                  }
                }}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={calculateConversions} className="w-full" disabled={!inputValue || !!error} size="lg">
              <Calculator className="mr-2 h-4 w-4" />
              Converter
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {!hasCalculated ? (
            <Card className="h-64">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Digite um número e clique em "Converter"</p>
                  <p className="text-sm">para ver os resultados aqui</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {(["binary", "octal", "decimal", "hexadecimal"] as const).map((system) => {
                if (system === inputSystem) return null

                return (
                  <Card key={system} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Label className="capitalize font-medium">{getSystemName(system)}</Label>
                          <div className="text-lg font-mono mt-2 bg-muted p-3 rounded-md min-h-[3rem] overflow-x-auto flex items-center">
                            {conversions[system] || "-"}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(conversions[system], system)}
                          disabled={!conversions[system]}
                          className="ml-3 flex-shrink-0"
                        >
                          {copied === system ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span className="sr-only">Copiar valor {getSystemName(system)}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
