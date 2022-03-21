import { CompareFieldValidation, EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from '../../../Presentation/helpers/validators'
import { EmailValidator } from '../../../Presentation/protocols/email-validator'
import { Validation } from '../../../Presentation/protocols/validation'
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
