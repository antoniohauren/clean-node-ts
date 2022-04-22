import { AccountModel } from '../../../Domain/models/account'

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<AccountModel>

}
