import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './SignUp'

const makeSut = (): SignUpController => {
  return new SignUpController()
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: 'my_email@mail.com',
        password: 'my_password',
        passwordConfirm: 'my_password_confirm'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'my_name',
        password: 'my_password',
        passwordConfirm: 'my_password_confirm'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'my_name',
        email: 'my_email@mail.com',
        passwordConfirm: 'my_password_confirm'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no password confirmation is provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'my_name',
        email: 'my_email@mail.com',
        password: 'my_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })
})
