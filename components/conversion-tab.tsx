"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { validateInput, convertNumber, type NumberSystem } from "@/lib/number-utils"

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

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value)

    if (validateInput(value, inputSystem)) {
      setError(null)
      const newConversions = convertNumber(value, inputSystem)
      setConversions(newConversions)
    } else {
      setError(`Invalid ${inputSystem} number. Please check your input.`)
    }
  }

  // Handle system change
  const handleSystemChange = (system: NumberSystem) => {
    setInputSystem(system)
    setInputValue("")
    setError(null)
    setConversions({
      binary: "",
      octal: "",
      decimal: "",
      hexadecimal: "",
    })
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, system: NumberSystem) => {
    navigator.clipboard.writeText(text)
    setCopied(system)
    setTimeout(() => setCopied(null), 2000)
  }

  // Reset copied state when input changes
  useEffect(() => {
    setCopied(null)
  }, [inputValue, inputSystem])

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="number-system">Number System</Label>
        <Select value={inputSystem} onValueChange={(value) => handleSystemChange(value as NumberSystem)}>
          <SelectTrigger id="number-system">
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
        <Label htmlFor="input-value">Enter {inputSystem} number</Label>
        <Input
          id="input-value"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={`Enter a ${inputSystem} number`}
          className={cn(error && "border-red-500")}
        />
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-medium mb-3">Conversion Results</h3>
        <div className="space-y-3">
          {(["binary", "octal", "decimal", "hexadecimal"] as const).map((system) => {
            if (system === inputSystem) return null

            return (
              <div key={system} className="flex items-center justify-between">
                <div>
                  <Label className="capitalize">{system}</Label>
                  <div className="text-sm font-mono mt-1 bg-muted p-2 rounded-md min-h-[2rem] min-w-[8rem]">
                    {conversions[system] || "-"}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(conversions[system], system)}
                  disabled={!conversions[system]}
                  className="ml-2"
                >
                  {copied === system ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy {system} value</span>
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
