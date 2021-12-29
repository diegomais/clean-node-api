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
    if (!payload) {
      throw new MissingParamError('payload')
    }
    return jwt.sign(payload, this.privateKey)
  }
}

module.exports = TokenGenerator
