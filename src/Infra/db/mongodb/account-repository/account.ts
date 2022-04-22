import { AddAccountRepository } from '../../../../Data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../Data/protocols/db/load-account-email-by-repository'
import { AccountModel } from '../../../../Domain/models/account'
import { AddAccountModel } from '../../../../Domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const { value: result } = await accountCollection.findOneAndUpdate(accountData,
      {
        $setOnInsert: accountData
      }, {
        upsert: true,
        returnDocument: 'after'
      })
    return MongoHelper.map(result)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')

    // CHECK LATER

    // const email_mock = 'my_email@mail.com'
    // const email_copy = email
    // const email_deep = `${email}`

    // console.log(email)

    // const account = await accountCollection.findOne({ email: email_mock })
    const account = await accountCollection.findOne()
    // console.log(account)
    return account && MongoHelper.map(account)
  }
}
