const jwt = require('jsonwebtoken')

class TokenGenerator {
  constructor (privateKey) {
    this.privateKey = privateKey
  }

  async generate (payload) {
    return jwt.sign(payload, this.privateKey)
  }
}

module.exports = TokenGenerator
