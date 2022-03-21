import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class CompareFieldValidation implements Validation {
  private readonly fieldName: string
  private readonly fildToCompare: string

  constructor (fieldName: string, fildToCompare: string) {
    this.fieldName = fieldName
    this.fildToCompare = fildToCompare
  }

  validate (input: any): Error | null {
    if (input[this.fieldName] !== input[this.fildToCompare]) {
      return new InvalidParamError(this.fildToCompare)
    }
    return null
  }
}
