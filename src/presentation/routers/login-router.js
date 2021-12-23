const HttpResponse = require('../helpers/http-response')

class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return HttpResponse.badRequest()
    }
  }
}

module.exports = LoginRouter
