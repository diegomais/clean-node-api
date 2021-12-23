class LoginRouter {
  route (httpRequest) {
    if (!httpRequest) {
      return { statusCode: 500 }
    }
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return { statusCode: 400 }
    }
  }
}

module.exports = LoginRouter
