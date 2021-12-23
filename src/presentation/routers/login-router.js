class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.body.email) {
      return { statusCode: 400 }
    }
  }
}

module.exports = LoginRouter
