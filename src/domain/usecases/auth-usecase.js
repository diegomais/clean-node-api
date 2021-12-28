const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor ({ encrypter, loadUserByEmailRepository, tokenGenerator }) {
    this.encrypter = encrypter
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.tokenGenerator = tokenGenerator
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
    const isValid = await this.encrypter.compare(password, user.password)
    if (isValid) {
      await this.tokenGenerator.generate(user.id)
    }
    return null
  }
}

module.exports = AuthUseCase
