export type NumberSystem = "binary" | "octal" | "decimal" | "hexadecimal"
export type Operation = "add" | "subtract" | "multiply" | "divide"

// Get base number for the number system
export const getBase = (system: NumberSystem): number => {
  switch (system) {
    case "binary":
      return 2
    case "octal":
      return 8
    case "decimal":
      return 10
    case "hexadecimal":
      return 16
    default:
      return 10
  }
}

// Validate input based on selected number system
export const validateInput = (value: string, system: NumberSystem): boolean => {
  if (!value) return true

  const patterns = {
    binary: /^[01]+$/,
    octal: /^[0-7]+$/,
    decimal: /^[0-9]+$/,
    hexadecimal: /^[0-9A-Fa-f]+$/,
  }

  return patterns[system].test(value)
}

// Convert between number systems
export const convertNumber = (value: string, fromSystem: NumberSystem) => {
  if (!value) {
    return {
      binary: "",
      octal: "",
      decimal: "",
      hexadecimal: "",
    }
  }

  try {
    // Convert to decimal first
    const base = getBase(fromSystem)
    const decimalValue = Number.parseInt(value, base)

    if (isNaN(decimalValue)) {
      throw new Error("Invalid conversion")
    }

    // Convert from decimal to all other systems
    return {
      binary: decimalValue.toString(2),
      octal: decimalValue.toString(8),
      decimal: decimalValue.toString(10),
      hexadecimal: decimalValue.toString(16).toUpperCase(),
    }
  } catch (err) {
    return {
      binary: "",
      octal: "",
      decimal: "",
      hexadecimal: "",
    }
  }
}

// Perform math operation
export const performOperation = (
  num1: string,
  num2: string,
  operation: Operation,
  system: NumberSystem,
): { result: string; error: string | null } => {
  try {
    if (!num1 || !num2) {
      return { result: "", error: "Both numbers are required" }
    }

    const base = getBase(system)
    const decimalNum1 = Number.parseInt(num1, base)
    const decimalNum2 = Number.parseInt(num2, base)

    if (isNaN(decimalNum1) || isNaN(decimalNum2)) {
      return { result: "", error: "Invalid number format" }
    }

    let result: number

    switch (operation) {
      case "add":
        result = decimalNum1 + decimalNum2
        break
      case "subtract":
        result = decimalNum1 - decimalNum2
        break
      case "multiply":
        result = decimalNum1 * decimalNum2
        break
      case "divide":
        if (decimalNum2 === 0) {
          return { result: "", error: "Cannot divide by zero" }
        }
        result = Math.floor(decimalNum1 / decimalNum2)
        break
      default:
        return { result: "", error: "Invalid operation" }
    }

    // Convert result back to the original number system
    return { result: result.toString(base).toUpperCase(), error: null }
  } catch (err) {
    return { result: "", error: "Calculation error" }
  }
}
