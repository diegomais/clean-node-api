const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor ({ loadUserByEmailRepository }) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    await this.loadUserByEmailRepository.load(email)
  }
}

module.exports = AuthUseCase
