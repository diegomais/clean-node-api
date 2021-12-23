const { MissingParamError, ServerError, UnauthorizedError } = require('../errors')

class HttpResponse {
  static badRequest (paramName) {
    return { statusCode: 400, body: new MissingParamError(paramName) }
  }

  static serverError () {
    return { statusCode: 500, body: new ServerError() }
  }

  static unauthorized () {
    return { statusCode: 401, body: new UnauthorizedError() }
  }
}

module.exports = HttpResponse
