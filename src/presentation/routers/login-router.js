const HttpResponse = require('../helpers/http-response')

class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!this.authUseCase || !this.authUseCase.auth || !httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }
    if (!password) {
      return HttpResponse.badRequest('password')
    }
    const accessToken = this.authUseCase.auth({ email, password })
    if (!accessToken) {
      return HttpResponse.unauthorized()
    }
    return HttpResponse.ok({ accessToken })
  }
}

module.exports = LoginRouter
