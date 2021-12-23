class MissingParamError extends Error {
  constructor (paramName) {
    super(`Missing parameter: ${paramName}`)
    this.name = 'MissingParamError'
  }
}

module.exports = MissingParamError
