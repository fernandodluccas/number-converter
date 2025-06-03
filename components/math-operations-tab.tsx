"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"
import { type NumberSystem, type Operation, validateInput, performOperation } from "@/lib/number-utils"

export function MathOperationsTab() {
  const [numberSystem, setNumberSystem] = useState<NumberSystem>("decimal")
  const [operation, setOperation] = useState<Operation>("add")
  const [num1, setNum1] = useState("")
  const [num2, setNum2] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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
      setError(`Invalid ${numberSystem} number in first input`)
    } else {
      setError(null)
    }
  }

  const handleNum2Change = (value: string) => {
    setNum2(value)
    if (value && !validateInput(value, numberSystem)) {
      setError(`Invalid ${numberSystem} number in second input`)
    } else {
      setError(null)
    }
  }

  const calculateResult = () => {
    if (!validateInput(num1, numberSystem) || !validateInput(num2, numberSystem)) {
      setError(`Invalid ${numberSystem} number format`)
      return
    }

    const { result: calculatedResult, error: calculationError } = performOperation(num1, num2, operation, numberSystem)

    if (calculationError) {
      setError(calculationError)
      setResult("")
    } else {
      setError(null)
      setResult(calculatedResult)
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

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="math-number-system">Number System</Label>
        <Select value={numberSystem} onValueChange={(value) => handleNumberSystemChange(value as NumberSystem)}>
          <SelectTrigger id="math-number-system">
            <SelectValue placeholder="Select number system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="binary">Binary</SelectItem>
            <SelectItem value="octal">Octal</SelectItem>
            <SelectItem value="decimal">Decimal</SelectItem>
            <SelectItem value="hexadecimal">Hexadecimal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="operation">Operation</Label>
        <Select value={operation} onValueChange={(value) => setOperation(value as Operation)}>
          <SelectTrigger id="operation">
            <SelectValue placeholder="Select operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="add">Addition (+)</SelectItem>
            <SelectItem value="subtract">Subtraction (-)</SelectItem>
            <SelectItem value="multiply">Multiplication (×)</SelectItem>
            <SelectItem value="divide">Division (÷)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="num1">First Number</Label>
          <Input
            id="num1"
            value={num1}
            onChange={(e) => handleNum1Change(e.target.value)}
            placeholder={`${numberSystem} number`}
            className={cn(error?.includes("first") && "border-red-500")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="num2">Second Number</Label>
          <Input
            id="num2"
            value={num2}
            onChange={(e) => handleNum2Change(e.target.value)}
            placeholder={`${numberSystem} number`}
            className={cn(error?.includes("second") && "border-red-500")}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={calculateResult} className="w-full" disabled={!num1 || !num2 || !!error}>
        <Calculator className="mr-2 h-4 w-4" />
        Calculate
      </Button>

      {result && (
        <div className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Result ({numberSystem})</Label>
              <div className="flex items-center mt-1">
                <div className="text-lg font-mono bg-muted p-2 rounded-md min-h-[2.5rem] min-w-[8rem]">
                  {num1} {getOperationSymbol(operation)} {num2} = {result}
                </div>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={copyToClipboard} className="ml-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy result</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
