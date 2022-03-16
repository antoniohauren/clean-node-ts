import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { EmailValidator } from '../signup/signup-protocols'
import { SigninController } from './signin'
import { HttpRequest } from '../../protocols/http'
import { Authentication } from '../../../Domain/usecases/authentication'

interface SutTypes {
  sut: SigninController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return 'my_token'
    }
  }
  return new AuthenticationStub()
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'my_email@mail.com',
    password: 'my_password'
  }
})

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new SigninController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeHttpRequest())
    expect(isValidSpy).toHaveBeenCalledWith('my_email@mail.com')
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeHttpRequest())
    expect(authSpy).toHaveBeenCalledWith('my_email@mail.com', 'my_password')
  })

  it('Should return 401 if invalid credentails are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null as any)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
})
