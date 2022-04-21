import { AccountModel } from '../../../Domain/models/account'
import { AuthenticationModel } from '../../../Domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-email-by-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_mail@mail.com',
  password: 'hashed_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'my_mail@mail.com',
  password: 'any_password'
})

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }

  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }

  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashCompareStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, tokenGeneratorStub, updateAccessTokenRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DB Authentication usecase', () => {
  it('Should call LoadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('my_mail@mail.com')
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null as any)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  it('Should call HashCompare with correct password', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if hashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  it('Should call tokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if tokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('Should return a token if everything is ok', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  it('Should call updateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  it('Should throw if updateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
