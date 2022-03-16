import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { SigninController } from './signin'

interface SutTypes {
  sut: SigninController
}

const makeSut = (): SutTypes => {
  const sut = new SigninController()
  return {
    sut
  }
}

describe('signin Controller', () => {
  it('Should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'my_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if passowrd is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'my_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
