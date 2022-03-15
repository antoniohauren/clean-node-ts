import { Controller, HttpRequest, HttpResponse } from '../../Presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutType {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 200,
        body: {
          name: 'AHaureN'
        }
      }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutType => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub
  }
}

describe('LogController Decorator', () => {
  it('Should call Controller handle ', async () => {
    const { sut, controllerStub } = makeSut()
    const httpRequest = {
      body: {
        email: 'my_email@mail.com',
        name: 'my_name',
        password: 'my_password',
        passwordConfirm: 'my_password'
      }
    }
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('Should return the same result of Controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'my_email@mail.com',
        name: 'my_name',
        password: 'my_password',
        passwordConfirm: 'my_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'AHaureN'
      }
    })
  })
})
