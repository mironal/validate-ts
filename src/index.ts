export type TestFunc<T> = ((value: any, key: keyof T) => boolean)

export type Scheme<T> = {
  [key: string]: ((key: keyof T, value: any) => boolean)
} & { [k in keyof T]: TestFunc<T> }

export class ValidateError extends Error {
  constructor(keys: string[], public input: any) {
    super(
      `The value type of key "${keys.join(", ")}" ${
        keys.length > 1 ? "are" : "is"
      } invalid.`,
    )

    Object.setPrototypeOf(this, ValidateError.prototype)
  }
}

export const createValidatorFor = <T extends {}>(scheme: Scheme<T>) => {
  Object.keys(scheme).forEach(k => {
    const f = scheme[k]
    if (typeof f !== "function") {
      throw new Error(`The validator for ${k} must be a function.`)
    }
  })
  return (input: any): input is T => {
    const invalidKeys = Object.keys(scheme).filter(
      key => !scheme[key](input[key], key as keyof T),
    )

    if (invalidKeys.length > 0) {
      throw new ValidateError(invalidKeys, input)
    }

    return true
  }
}

export const validateChild = <T extends {}>(
  validator: (input: any) => input is T,
) => (object: any): object is { [key: string]: T } => {
  const keys = Object.keys(object)
  return keys.filter(key => validator(object[key])).length === keys.length
}

export const validateFn = <T extends {}>(fn: (value: any) => boolean) => (
  value: any,
): value is T => fn(value)
