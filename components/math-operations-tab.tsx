"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { type NumberSystem, type Operation, validateInput, performOperation } from "@/lib/number-utils"
import { useHistory } from "@/contexts/history-context"

export function MathOperationsTab() {
  const [numberSystem, setNumberSystem] = useState<NumberSystem>("decimal")
  const [operation, setOperation] = useState<Operation>("add")
  const [num1, setNum1] = useState("")
  const [num2, setNum2] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { addToHistory } = useHistory()

  const handleNumberSystemChange = (value: NumberSystem) => {
    setNumberSystem(value)
    setNum1("")
    setNum2("")
    setResult("")
    setError(null)
  }

  const handleNum1Change = (value: string) => {
    setNum1(value)
    if (value && !validateInput(value, numberSystem)) {
      setError(`Número ${numberSystem} inválido no primeiro campo`)
    } else {
      setError(null)
    }
  }

  const handleNum2Change = (value: string) => {
    setNum2(value)
    if (value && !validateInput(value, numberSystem)) {
      setError(`Número ${numberSystem} inválido no segundo campo`)
    } else {
      setError(null)
    }
  }

  const calculateResult = () => {
    if (!validateInput(num1, numberSystem) || !validateInput(num2, numberSystem)) {
      setError(`Invalid ${numberSystem} number format`)
      setError(`Formato de número ${numberSystem} inválido`)
      return
    }

    const { result: calculatedResult, error: calculationError } = performOperation(num1, num2, operation, numberSystem)

    if (calculationError) {
      setError(calculationError)
      setResult("")
    } else {
      setError(null)
      setResult(calculatedResult)

      // Add to history
      addToHistory({
        type: "math",
        operation: `${getOperationName(operation)} em ${getSystemName(numberSystem)}`,
        input: `${num1} ${getOperationSymbol(operation)} ${num2}`,
        result: calculatedResult,
        details: `Calculado no sistema numérico ${getSystemName(numberSystem)}`,
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getOperationSymbol = (op: Operation): string => {
    switch (op) {
      case "add":
        return "+"
      case "subtract":
        return "-"
      case "multiply":
        return "×"
      case "divide":
        return "÷"
    }
  }

  const getOperationName = (op: Operation): string => {
    switch (op) {
      case "add":
        return "Adição"
      case "subtract":
        return "Subtração"
      case "multiply":
        return "Multiplicação"
      case "divide":
        return "Divisão"
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="math-number-system">Sistema Numérico</Label>
                <Select value={numberSystem} onValueChange={(value) => handleNumberSystemChange(value as NumberSystem)}>
                  <SelectTrigger id="math-number-system" className="mt-1">
                    <SelectValue placeholder="Selecione o sistema numérico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="binary">Binário</SelectItem>
                    <SelectItem value="octal">Octal</SelectItem>
                    <SelectItem value="decimal">Decimal</SelectItem>
                    <SelectItem value="hexadecimal">Hexadecimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="operation">Operação</Label>
                <Select value={operation} onValueChange={(value) => setOperation(value as Operation)}>
                  <SelectTrigger id="operation" className="mt-1">
                    <SelectValue placeholder="Selecione a operação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Adição (+)</SelectItem>
                    <SelectItem value="subtract">Subtração (-)</SelectItem>
                    <SelectItem value="multiply">Multiplicação (×)</SelectItem>
                    <SelectItem value="divide">Divisão (÷)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="num1">Primeiro Número ({getSystemName(numberSystem)})</Label>
                <Input
                  id="num1"
                  value={num1}
                  onChange={(e) => handleNum1Change(e.target.value)}
                  placeholder={`Número ${getSystemName(numberSystem)}`}
                  className={cn("mt-1", error?.includes("primeiro") && "border-red-500")}
                />
              </div>

              <div>
                <Label htmlFor="num2">Segundo Número ({getSystemName(numberSystem)})</Label>
                <Input
                  id="num2"
                  value={num2}
                  onChange={(e) => handleNum2Change(e.target.value)}
                  placeholder={`Número ${getSystemName(numberSystem)}`}
                  className={cn("mt-1", error?.includes("segundo") && "border-red-500")}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="mt-2 py-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={calculateResult} className="w-full" disabled={!num1 || !num2 || !!error}>
                <Calculator className="mr-2 h-4 w-4" />
                Calcular {getOperationName(operation)}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="min-h-[200px]">
            <CardContent className="p-4">
              {result ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <Label>Resultado em {getSystemName(numberSystem)}</Label>
                    <Button variant="outline" size="icon" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span className="sr-only">Copiar resultado</span>
                    </Button>
                  </div>
                  <div className="flex-1 flex items-center justify-center my-8">
                    <div className="text-2xl font-mono bg-muted p-4 rounded-md overflow-x-auto max-w-full">
                      {num1} {getOperationSymbol(operation)} {num2} = {result}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  O resultado será exibido aqui
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
