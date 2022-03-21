import { CompareFieldValidation, EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from '../../../Presentation/helpers/validators'
import { Validation } from '../../../Presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../Utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldValidation('password', 'passwordConfirm'))
  validations.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
