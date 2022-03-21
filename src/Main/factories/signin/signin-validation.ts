import { EmailFieldValidation, RequiredFieldValidation, ValidationComposite } from '../../../Presentation/helpers/validators'
import { Validation } from '../../../Presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../Utils/email-validator-adapter'

export const makeSignInValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
