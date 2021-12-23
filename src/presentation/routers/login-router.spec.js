const LoginRouter = require('./login-router')

describe(LoginRouter.name, () => {
  it('should return 400 if no email is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = { body: { password: 'foo' } }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
