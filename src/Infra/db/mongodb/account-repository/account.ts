import { AddAccountRepository } from '../../../../Data/protocols/add-account-repository'
import { AccountModel } from '../../../../Domain/models/account'
import { AddAccountModel } from '../../../../Domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
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
}
