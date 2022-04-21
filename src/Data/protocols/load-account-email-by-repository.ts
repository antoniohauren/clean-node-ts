import { AccountModel } from '../../Domain/models/account'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<AccountModel>

}
