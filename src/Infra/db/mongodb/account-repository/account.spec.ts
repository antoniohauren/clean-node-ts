import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongodb Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'my_name',
      email: 'my_email@mail.com',
      password: 'my_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('my_name')
    expect(account.email).toBe('my_email@mail.com')
    expect(account.password).toBe('my_password')
  })

  it('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'my_name',
      email: 'my_email@mail.com',
      password: 'my_password'
    })
    const account = await sut.loadByEmail('my_mail@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('my_name')
    expect(account.email).toBe('my_email@mail.com')
    expect(account.password).toBe('my_password')
  })

  it('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('my_mail@mail.com')
    expect(account).toBeFalsy()
})
