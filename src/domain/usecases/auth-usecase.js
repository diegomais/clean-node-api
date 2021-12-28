const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor ({ encrypter, loadUserByEmailRepository }) {
    this.encrypter = encrypter
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      return null
    }
    await this.encrypter.compare(password, user.password)
    return null
  }
}

module.exports = AuthUseCase
