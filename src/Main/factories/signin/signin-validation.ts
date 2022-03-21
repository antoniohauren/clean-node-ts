import { EmailFieldValidation } from '../../../Presentation/helpers/validators/email-field-validation'
import { RequiredFieldValidation } from '../../../Presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../Presentation/protocols/validation'
import { ValidationComposite } from '../../../Presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../Utils/email-validator-adapter'

export const makeSignInValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
