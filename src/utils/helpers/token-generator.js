const jwt = require('jsonwebtoken')
const { MissingParamError } = require('../errors')

class TokenGenerator {
  constructor (privateKey) {
    this.privateKey = privateKey
  }

  async generate (payload) {
    if (!this.privateKey) {
      throw new MissingParamError('privateKey')
    }
    return jwt.sign(payload, this.privateKey)
  }
}

module.exports = TokenGenerator
