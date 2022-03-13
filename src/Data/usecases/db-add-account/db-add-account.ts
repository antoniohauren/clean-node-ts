import { AccountModel } from '../../../Domain/models/account'
import { AddAccount, AddAccountModel } from '../../../Domain/usecases/add-account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrpyter: Encrypter) {
    this.encrypter = encrpyter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve(null as any))
  }
}
