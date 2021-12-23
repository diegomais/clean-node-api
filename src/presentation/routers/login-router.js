const HttpResponse = require('../helpers/http-response')

class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }
    if (!httpRequest.body.email) {
      return HttpResponse.badRequest('email')
    }
    if (!httpRequest.body.password) {
      return HttpResponse.badRequest('password')
    }
  }
}

module.exports = LoginRouter
