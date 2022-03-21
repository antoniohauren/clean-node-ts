import { EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from '../../../Presentation/helpers/validators'
import { EmailValidator } from '../../../Presentation/protocols/email-validator'
import { Validation } from '../../../Presentation/protocols/validation'
import { makeSignInValidation } from './signin-validation'

jest.mock('../../../Presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SigninValidation Factory', () => {
  it('Should call validation with all validations', () => {
    makeSignInValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailFieldValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
