import { MissingParamError } from '../../errors'
import { badRequest, okResponse, serverError, unauthorized } from '../../helpers/http/http-helper'
import { SigninController } from './signin'
import { Authentication, AuthenticationModel, HttpRequest, Validation } from './signin-protocols'

interface SutTypes {
  sut: SigninController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return 'my_token'
    }
  }
  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'my_email@mail.com',
    password: 'my_password'
  }
})

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new SigninController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('signin Controller', () => {
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeHttpRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'my_email@mail.com', password: 'my_password' })
  })

  it('Should return 401 if invalid credentails are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null as any)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if valid credentails are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(okResponse({ accessToken: 'my_token' }))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError(''))
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('')))
  })
})
