import { AccountModel } from '../../../Domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-email-by-repository'
import { DbAuthentication } from './db-authentication'

describe('DB Authentication usecase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_mail@mail.com',
          password: 'any_password'
        }
        return await new Promise((resolve) => resolve(account))
      }
    }

    const loadAccountByEmailRepositoryStub =
      new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'my_mail@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('my_mail@mail.com')
  })
})
