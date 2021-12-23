const { MissingParamError, ServerError } = require('../errors')

class HttpResponse {
  static badRequest (paramName) {
    return { statusCode: 400, body: new MissingParamError(paramName) }
  }

  static serverError () {
    return { statusCode: 500, body: new ServerError() }
  }
}

module.exports = HttpResponse
