const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor ({
    encrypter,
    loadUserByEmailRepository,
    tokenGenerator,
    updateAccessTokenRepository
  } = {}) {
    this.encrypter = encrypter
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth ({ email, password } = {}) {
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
      const accessToken = await this.tokenGenerator.generate(user._id)
      await this.updateAccessTokenRepository.update(user._id, accessToken)
      return accessToken
    }
    return null
  }
}

module.exports = AuthUseCase
