"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, Calculator, Plus, Minus, X, Grid3X3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type Matrix,
  createEmptyMatrix,
  validateAddSubtract,
  validateMultiply,
  addMatrices,
  subtractMatrices,
  multiplyMatrices,
  calculateDeterminant,
  isSquareMatrix,
} from "@/lib/matrix-utils"
import { useHistory } from "@/contexts/history-context"

type MatrixOperation = "add" | "subtract" | "multiply"

// Matrizes predefinidas
const predefinedMatrices = {
  identity2x2: [
    [1, 0],
    [0, 1],
  ],
  identity3x3: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  zero2x2: [
    [0, 0],
    [0, 0],
  ],
  zero3x3: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  example2x2: [
    [1, 2],
    [3, 4],
  ],
  example3x3: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ],
}

export function MatrixOperationsTab() {
  const [operation, setOperation] = useState<MatrixOperation>("add")
  const [matrix1Rows, setMatrix1Rows] = useState(2)
  const [matrix1Cols, setMatrix1Cols] = useState(2)
  const [matrix2Rows, setMatrix2Rows] = useState(2)
  const [matrix2Cols, setMatrix2Cols] = useState(2)
  const [matrix1, setMatrix1] = useState<Matrix>(createEmptyMatrix(2, 2))
  const [matrix2, setMatrix2] = useState<Matrix>(createEmptyMatrix(2, 2))
  const [resultMatrix, setResultMatrix] = useState<Matrix | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { addToHistory } = useHistory()

  // Aplicar matriz predefinida
  // const applyPredefinedMatrix = (matrixKey: string, matrixNumber: 1 | 2) => {
  //   const predefined = predefinedMatrices[matrixKey as keyof typeof predefinedMatrices]
  //   if (!predefined) return

  //   const rows = predefined.length
  //   const cols = predefined[0].length

  //   if (matrixNumber === 1) {
  //     setMatrix1Rows(rows)
  //     setMatrix1Cols(cols)
  //     setMatrix1(predefined.map((row) => [...row]))

  //     // Ajustar matriz 2 se necessário para operações de adição/subtração
  //     if (operation === "add" || operation === "subtract") {
  //       setMatrix2Rows(rows)
  //       setMatrix2Cols(cols)
  //       setMatrix2(createEmptyMatrix(rows, cols))
  //     }
  //   } else {
  //     setMatrix2Rows(rows)
  //     setMatrix2Cols(cols)
  //     setMatrix2(predefined.map((row) => [...row]))
  //   }

  //   setResultMatrix(null)
  // }

  // Atualiza as dimensões da matriz 1
  const updateMatrix1Dimensions = (rows: number, cols: number) => {
    setMatrix1Rows(rows)
    setMatrix1Cols(cols)
    setMatrix1(createEmptyMatrix(rows, cols))

    // Sempre sincronizar matriz B com matriz A
    setMatrix2Rows(rows)
    setMatrix2Cols(cols)
    setMatrix2(createEmptyMatrix(rows, cols))

    setResultMatrix(null)
  }

  // Atualiza as dimensões da matriz 2
  const updateMatrix2Dimensions = (rows: number, cols: number) => {
    setMatrix2Rows(rows)
    setMatrix2Cols(cols)
    setMatrix2(createEmptyMatrix(rows, cols))

    // Sempre sincronizar matriz A com matriz B
    setMatrix1Rows(rows)
    setMatrix1Cols(cols)
    setMatrix1(createEmptyMatrix(rows, cols))

    setResultMatrix(null)
  }

  // Atualiza a operação
  const updateOperation = (op: MatrixOperation) => {
    setOperation(op)
    setResultMatrix(null)

    // Ajusta as dimensões para compatibilidade
    if (op === "add" || op === "subtract") {
      // Para adição e subtração, as matrizes devem ter as mesmas dimensões
      setMatrix2Rows(matrix1Rows)
      setMatrix2Cols(matrix1Cols)
      setMatrix2(createEmptyMatrix(matrix1Rows, matrix1Cols))
    }
  }

  // Atualiza um valor na matriz 1
  const updateMatrix1Value = (rowIndex: number, colIndex: number, value: string) => {
    const newValue = value === "" ? 0 : Number(value)
    if (isNaN(newValue)) return

    const newMatrix = [...matrix1]
    newMatrix[rowIndex][colIndex] = newValue
    setMatrix1(newMatrix)
    setResultMatrix(null)
  }

  // Atualiza um valor na matriz 2
  const updateMatrix2Value = (rowIndex: number, colIndex: number, value: string) => {
    const newValue = value === "" ? 0 : Number(value)
    if (isNaN(newValue)) return

    const newMatrix = [...matrix2]
    newMatrix[rowIndex][colIndex] = newValue
    setMatrix2(newMatrix)
    setResultMatrix(null)
  }

  // Calcula o resultado
  const calculateResult = () => {
    try {
      let result: Matrix | null = null

      if (operation === "add" || operation === "subtract") {
        if (!validateAddSubtract(matrix1, matrix2)) {
          setError("As matrizes devem ter as mesmas dimensões para adição ou subtração")
          return
        }

        result = operation === "add" ? addMatrices(matrix1, matrix2) : subtractMatrices(matrix1, matrix2)
      } else if (operation === "multiply") {
        if (!validateMultiply(matrix1, matrix2)) {
          setError("O número de colunas da primeira matriz deve ser igual ao número de linhas da segunda matriz")
          return
        }

        result = multiplyMatrices(matrix1, matrix2)
      }

      setResultMatrix(result)
      setError(null)

      // Add to history
      if (result) {
        const matrixAStr = matrix1.map((row) => `[${row.join(", ")}]`).join(", ")
        const matrixBStr = matrix2.map((row) => `[${row.join(", ")}]`).join(", ")
        const resultStr = result.map((row) => `[${row.join(", ")}]`).join(", ")

        addToHistory({
          type: "matrix",
          operation: `${getOperationName(operation)} de Matrizes`,
          input: `A: ${matrixAStr} ${getOperationName(operation)} B: ${matrixBStr}`,
          result: resultStr,
          details: `${matrix1.length}×${matrix1[0].length} ${getOperationName(operation)} ${matrix2.length}×${matrix2[0].length} = ${result.length}×${result[0].length}`,
        })
      }
    } catch (err) {
      setError("Erro ao calcular o resultado")
      setResultMatrix(null)
    }
  }

  // Copia o resultado para a área de transferência
  const copyToClipboard = () => {
    if (!resultMatrix) return

    const matrixText = resultMatrix.map((row) => row.join("\t")).join("\n")
    navigator.clipboard.writeText(matrixText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Renderiza uma matriz de entrada
  const renderMatrixInput = (
    matrix: Matrix,
    rows: number,
    cols: number,
    updateValue: (row: number, col: number, value: string) => void,
  ) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {Array(rows)
              .fill(0)
              .map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array(cols)
                    .fill(0)
                    .map((_, colIndex) => (
                      <td key={colIndex} className="p-1">
                        <Input
                          type="number"
                          value={matrix[rowIndex][colIndex] || ""}
                          onChange={(e) => updateValue(rowIndex, colIndex, e.target.value)}
                          className="w-16 text-center"
                        />
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Renderiza a matriz de resultado
  const renderResultMatrix = (matrix: Matrix) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, colIndex) => (
                  <td key={colIndex} className="p-2 border border-muted">
                    <div className="w-16 text-center font-mono">{value}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Obtém o símbolo da operação
  const getOperationSymbol = (op: MatrixOperation) => {
    switch (op) {
      case "add":
        return <Plus className="h-6 w-6" />
      case "subtract":
        return <Minus className="h-6 w-6" />
      case "multiply":
        return <X className="h-6 w-6" />
    }
  }

  // Obtém o nome da operação
  const getOperationName = (op: MatrixOperation): string => {
    switch (op) {
      case "add":
        return "Adição"
      case "subtract":
        return "Subtração"
      case "multiply":
        return "Multiplicação"
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuração da Operação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            Configuração da Operação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="matrix-operation">Tipo de Operação</Label>
              <Select value={operation} onValueChange={(value) => updateOperation(value as MatrixOperation)}>
                <SelectTrigger id="matrix-operation" className="mt-1">
                  <SelectValue placeholder="Selecione a operação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Adição (A + B)</SelectItem>
                  <SelectItem value="subtract">Subtração (A - B)</SelectItem>
                  <SelectItem value="multiply">Multiplicação (A × B)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Matriz A */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Matriz A</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label>Dimensões da Matriz</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    variant={matrix1Rows === 2 && matrix1Cols === 2 ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateMatrix1Dimensions(2, 2)}
                    className="flex-1"
                  >
                    2×2
                  </Button>
                  <Button
                    variant={matrix1Rows === 3 && matrix1Cols === 3 ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateMatrix1Dimensions(3, 3)}
                    className="flex-1"
                  >
                    3×3
                  </Button>
                  <Button
                    variant={matrix1Rows === 4 && matrix1Cols === 4 ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateMatrix1Dimensions(4, 4)}
                    className="flex-1"
                  >
                    4×4
                  </Button>
                </div>
              </div>

              {/*<div>
                <Label>Matrizes Predefinidas</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPredefinedMatrix("identity2x2", 1)}
                    className="text-xs"
                  >
                    Identidade 2×2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPredefinedMatrix("identity3x3", 1)}
                    className="text-xs"
                  >
                    Identidade 3×3
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPredefinedMatrix("zero2x2", 1)}
                    className="text-xs"
                  >
                    Zero 2×2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPredefinedMatrix("example2x2", 1)}
                    className="text-xs"
                  >
                    Exemplo 2×2
                  </Button>
                </div>
              </div>*/}

              <div className="mt-4">{renderMatrixInput(matrix1, matrix1Rows, matrix1Cols, updateMatrix1Value)}</div>

              {isSquareMatrix(matrix1) && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <Label className="text-sm font-medium">Determinante da Matriz A</Label>
                  <div className="font-mono text-lg mt-1">{calculateDeterminant(matrix1)}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Operação */}
        <div className="flex items-center justify-center xl:mt-16">
          <div className="text-4xl font-bold text-muted-foreground">{getOperationSymbol(operation)}</div>
        </div>

        {/* Matriz B */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Matriz B</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label>Dimensões da Matriz</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    variant={matrix2Rows === 2 && matrix2Cols === 2 ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateMatrix2Dimensions(2, 2)}
                    className="flex-1"
                  >
                    2×2
                  </Button>
                  <Button
                    variant={matrix2Rows === 3 && matrix2Cols === 3 ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateMatrix2Dimensions(3, 3)}
                    className="flex-1"
                  >
                    3×3
                  </Button>
                  <Button
                    variant={matrix2Rows === 4 && matrix2Cols === 4 ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateMatrix2Dimensions(4, 4)}
                    className="flex-1"
                  >
                    4×4
                  </Button>
                </div>
              </div>

              {/*<div>
                <Label>Matrizes Predefinidas</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPredefinedMatrix("identity2x2", 2)}
                    className="text-xs"
                  >
                    Identidade 2×2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPredefinedMatrix("identity3x3", 2)}
                    className="text-xs"
                  >
                    Identidade 3×3
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPredefinedMatrix("zero2x2", 2)}
                    className="text-xs"
                  >
                    Zero 2×2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPredefinedMatrix("example2x2", 2)}
                    className="text-xs"
                  >
                    Exemplo 2×2
                  </Button>
                </div>
              </div>*/}

              <div className="mt-4">{renderMatrixInput(matrix2, matrix2Rows, matrix2Cols, updateMatrix2Value)}</div>

              {isSquareMatrix(matrix2) && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <Label className="text-sm font-medium">Determinante da Matriz B</Label>
                  <div className="font-mono text-lg mt-1">{calculateDeterminant(matrix2)}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botão de Cálculo */}
      <div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={calculateResult} className="w-full" size="lg">
          <Calculator className="mr-2 h-5 w-5" />
          Calcular {getOperationName(operation)} de Matrizes
        </Button>
      </div>

      {/* Resultado */}
      {resultMatrix && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resultado da {getOperationName(operation)}</CardTitle>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">{renderResultMatrix(resultMatrix)}</div>

            {isSquareMatrix(resultMatrix) && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <Label className="text-sm font-medium">Determinante da Matriz Resultante</Label>
                <div className="font-mono text-lg mt-1">{calculateDeterminant(resultMatrix)}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
