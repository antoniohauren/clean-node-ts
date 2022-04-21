import { Authentication, AuthenticationModel } from '../../../Domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-email-by-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return ''
  }
}
