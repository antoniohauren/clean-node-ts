import { DbAddAccount } from '../../Data/usecases/db-add-account/db-add-account'
import { BcryptAdapter } from '../../Infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../Infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../Presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../Utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
  const SALT = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(SALT)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddaccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  return new SignUpController(emailValidatorAdapter, dbAddaccount)
}
