import { AddAccountModel } from '../../../Domain/usecases/add-account'
import { AccountModel } from '../../../Domain/models/account'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
