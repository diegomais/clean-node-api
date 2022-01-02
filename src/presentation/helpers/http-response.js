const { ServerError, UnauthorizedError } = require('../errors')

class HttpResponse {
  static badRequest (error) {
    return { statusCode: 400, body: { error: error.message } }
  }

  static ok (body) {
    return { statusCode: 200, body }
  }

  static serverError () {
    return { statusCode: 500, body: { error: new ServerError().message } }
  }

  static unauthorized () {
    return { statusCode: 401, body: { error: new UnauthorizedError().message } }
  }
}

module.exports = HttpResponse
