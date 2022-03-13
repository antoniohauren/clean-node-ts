import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  }
}))

const SALT = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT)
}

describe('Bcrypt Adapter', () => {
  it('Should calls bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('my_value')
    expect(hashSpy).toHaveBeenCalledWith('my_value', SALT)
  })

  it('Should returns a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('my_value')
    expect(hash).toBe('hashed_value')
  })
})
