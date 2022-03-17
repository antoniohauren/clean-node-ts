import { DbAddAccount } from '../../Data/usecases/db-add-account/db-add-account'
import { BcryptAdapter } from '../../Infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../Infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../Infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../Presentation/controllers/signup/signup'
import { Controller } from '../../Presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const SALT = 12
  const bcryptAdapter = new BcryptAdapter(SALT)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddaccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(dbAddaccount, makeSignUpValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
