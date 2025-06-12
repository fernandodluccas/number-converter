export type Matrix = number[][]

// Cria uma matriz vazia com as dimensões especificadas
export const createEmptyMatrix = (rows: number, cols: number): Matrix => {
  return Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(0))
}

// Valida se uma matriz tem as dimensões corretas
export const validateMatrix = (matrix: Matrix, rows: number, cols: number): boolean => {
  if (matrix.length !== rows) return false
  return matrix.every((row) => row.length === cols)
}

// Valida se duas matrizes podem ser somadas ou subtraídas
export const validateAddSubtract = (matrix1: Matrix, matrix2: Matrix): boolean => {
  if (matrix1.length !== matrix2.length) return false
  return matrix1.every((row, i) => row.length === matrix2[i].length)
}

// Valida se duas matrizes podem ser multiplicadas
export const validateMultiply = (matrix1: Matrix, matrix2: Matrix): boolean => {
  if (matrix1.length === 0 || matrix2.length === 0) return false
  return matrix1[0].length === matrix2.length
}

// Soma duas matrizes
export const addMatrices = (matrix1: Matrix, matrix2: Matrix): Matrix => {
  return matrix1.map((row, i) => row.map((val, j) => val + matrix2[i][j]))
}

// Subtrai duas matrizes
export const subtractMatrices = (matrix1: Matrix, matrix2: Matrix): Matrix => {
  return matrix1.map((row, i) => row.map((val, j) => val - matrix2[i][j]))
}

// Multiplica duas matrizes
export const multiplyMatrices = (matrix1: Matrix, matrix2: Matrix): Matrix => {
  const result = createEmptyMatrix(matrix1.length, matrix2[0].length)

  for (let i = 0; i < matrix1.length; i++) {
    for (let j = 0; j < matrix2[0].length; j++) {
      let sum = 0
      for (let k = 0; k < matrix2.length; k++) {
        sum += matrix1[i][k] * matrix2[k][j]
      }
      result[i][j] = sum
    }
  }

  return result
}

// Verifica se uma matriz é quadrada (mesmo número de linhas e colunas)
export const isSquareMatrix = (matrix: Matrix): boolean => {
  if (matrix.length === 0) return false
  return matrix.every((row) => row.length === matrix.length)
}

// Calcula o determinante de uma matriz 2x2
const determinant2x2 = (matrix: Matrix): number => {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
}

// Obtém a submatriz removendo uma linha e uma coluna específicas
const getSubmatrix = (matrix: Matrix, rowToRemove: number, colToRemove: number): Matrix => {
  return matrix
    .filter((_, rowIndex) => rowIndex !== rowToRemove)
    .map((row) => row.filter((_, colIndex) => colIndex !== colToRemove))
}

// Calcula o determinante de uma matriz usando expansão por cofatores
export const calculateDeterminant = (matrix: Matrix): number | null => {
  // Verifica se a matriz é quadrada
  if (!isSquareMatrix(matrix)) {
    return null
  }

  const n = matrix.length

  // Caso base: matriz 1x1
  if (n === 1) {
    return matrix[0][0]
  }

  // Caso base: matriz 2x2
  if (n === 2) {
    return determinant2x2(matrix)
  }

  // Expansão por cofatores na primeira linha
  let det = 0
  for (let j = 0; j < n; j++) {
    const submatrix = getSubmatrix(matrix, 0, j)
    const cofactor = matrix[0][j] * (j % 2 === 0 ? 1 : -1)
    det += cofactor * (calculateDeterminant(submatrix) || 0)
  }

  return det
}

// Formata uma matriz para exibição
export const formatMatrix = (matrix: Matrix): string => {
  return matrix.map((row) => row.join("\t")).join("\n")
}
