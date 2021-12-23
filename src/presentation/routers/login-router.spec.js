const { MissingParamError, ServerError, UnauthorizedError } = require('../errors')
const LoginRouter = require('./login-router')

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    auth ({ email, password }) {
      this.email = email
      this.password = password
    }
  }
  return new AuthUseCaseSpy()
}

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const sut = new LoginRouter(authUseCaseSpy)
  return { authUseCaseSpy, sut }
}

describe(LoginRouter.name, () => {
  it('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = { body: { password: 'foo' } }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = { body: { email: 'foo@bar.com' } }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return 500 if no httpRequest is provided', () => {
    const { sut } = makeSut()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 500 if httpRequest has no body', () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should call AuthUseCase with correct params', () => {
    const { authUseCaseSpy, sut } = makeSut()
    const httpRequest = { body: { email: 'foo@bar.com', password: 'foo' } }
    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('should return 401 if invalid credentials are provided', () => {
    const { sut } = makeSut()
    const httpRequest = { body: { email: 'foo@bar.com', password: 'invalid' } }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })
})
