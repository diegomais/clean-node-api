class LoginRouter {
  route (httpRequest) {
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return { statusCode: 400 }
    }
  }
}

module.exports = LoginRouter
