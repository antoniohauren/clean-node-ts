import { CompareFieldValidation } from '../../../Presentation/helpers/validators/compare-field-validation'
import { EmailFieldValidation } from '../../../Presentation/helpers/validators/email-field-validation'
import { RequiredFieldValidation } from '../../../Presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../Presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../Presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../Presentation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../../Presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignupValidation Factory', () => {
  it('Should call validation with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldValidation('password', 'passwordConfirm'))
    validations.push(new EmailFieldValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
