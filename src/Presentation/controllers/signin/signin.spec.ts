import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { EmailValidator } from '../signup/signup-protocols'
import { SigninController } from './signin'
import { HttpRequest } from '../../protocols/http'

interface SutTypes {
  sut: SigninController
  emailValidator: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'my_email@mail.com',
    password: 'my_password'
  }
})

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator()
  const sut = new SigninController(emailValidator)
  return {
    sut,
    emailValidator
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

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')
    await sut.handle(makeHttpRequest())
    expect(isValidSpy).toHaveBeenCalledWith('my_email@mail.com')
  })
})
