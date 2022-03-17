import { CompareFieldValidation } from '../../Presentation/helpers/validators/compare-field-validation'
import { RequiredFieldValidation } from '../../Presentation/helpers/validators/required-field-validation'
import { Validation } from '../../Presentation/helpers/validators/validation'
import { ValidationComposite } from '../../Presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldValidation('password', 'passwordConfirm'))
  return new ValidationComposite(validations)
}