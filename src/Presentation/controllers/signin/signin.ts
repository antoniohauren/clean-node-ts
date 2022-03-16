import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class SigninController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamError('email'))
  }
}
