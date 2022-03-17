import { RequiredFieldValidation } from '../../Presentation/helpers/validators/required-field-validation'
import { Validation } from '../../Presentation/helpers/validators/validation'
import { ValidationComposite } from '../../Presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../Presentation/helpers/validators/validation-composite')

describe('SignupValidation Factory', () => {
  it('Should call validation with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
