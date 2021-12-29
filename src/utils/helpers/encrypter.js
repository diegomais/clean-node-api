const bcrypt = require('bcrypt')
const { MissingParamError } = require('../errors')

class Encrypter {
  async compare (value, hash) {
    if (!value) {
      throw new MissingParamError('value')
    }
    if (!hash) {
      throw new MissingParamError('hash')
    }
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}

module.exports = Encrypter
