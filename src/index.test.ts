import { createValidatorFor, ValidateError, TestFunc } from "."

interface Example {
  n: number
  s: string
  b: boolean
  obj: { [key: string]: string }
  nested: { [key: string]: { [inner: string]: number[] } }
}

describe("createValidatorFor", () => {
  it("should return validator function", () => {
    const validator = createValidatorFor<{ value: string }>({
      value: value => typeof value === "string",
    })

    expect(validator).toEqual(expect.any(Function))
  })

  it("should throw error when pass a not function", () => {
    const fake: any = "aaa"

    expect(() => {
      createValidatorFor<{ value: string }>({
        value: fake,
      })
    }).toThrow(/^The validator for value must be a function.$/)
  })
})

describe("validator", () => {
  const validator = createValidatorFor<Example>({
    n: value => typeof value === "number",
    s: value => typeof value === "string",
    b: value => typeof value === "boolean",
    obj: value => typeof value === "object",
    nested: value => typeof value === "object",
  })

  it("should return true", () => {
    expect(
      validator({
        n: 0,
        s: "",
        b: true,
        obj: {},
        nested: {},
      }),
    ).toBeTruthy()
  })
  it("should throw exception with message", () => {
    expect(() => validator({})).toThrow(
      /^The value type of key "n, s, b, obj, nested" are invalid.$/,
    )

    expect(() =>
      validator({
        s: "",
        b: true,
        obj: {},
        nested: {},
      }),
    ).toThrow(/^The value type of key "n" is invalid.$/)
  })
})

// TODO: Test validateChild, validateFn
