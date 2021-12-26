const { ServerError, UnauthorizedError } = require('../errors')

class HttpResponse {
  static badRequest (error) {
    return { statusCode: 400, body: error }
  }

  static ok (body) {
    return { statusCode: 200, body }
  }

  static serverError () {
    return { statusCode: 500, body: new ServerError() }
  }

  static unauthorized () {
    return { statusCode: 401, body: new UnauthorizedError() }
  }
}

module.exports = HttpResponse
