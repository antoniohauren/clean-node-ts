import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  }
}))

describe('Bcrypt Adapter', () => {
  it('Should calls bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('my_value')
    expect(hashSpy).toHaveBeenCalledWith('my_value', salt)
  })

  it('Should returns a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hash = await sut.encrypt('my_value')
    expect(hash).toBe('hashed_value')
  })
})
