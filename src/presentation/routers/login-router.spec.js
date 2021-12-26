const { InvalidParamError, MissingParamError, ServerError, UnauthorizedError } = require('../errors')
const LoginRouter = require('./login-router')

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    auth ({ email, password }) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  return new AuthUseCaseSpy()
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    auth () {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  return new EmailValidatorSpy()
}

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  authUseCaseSpy.accessToken = 'valid_token'

  const emailValidatorSpy = makeEmailValidator()
  emailValidatorSpy.isEmailValid = true

  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return { authUseCaseSpy, emailValidatorSpy, sut }
}

describe(LoginRouter.name, () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = { body: { password: 'foo' } }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = { body: { email: 'foo@bar.com' } }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should call AuthUseCase with correct params', async () => {
    const { authUseCaseSpy, sut } = makeSut()
    const httpRequest = { body: { email: 'foo@bar.com', password: 'foo' } }
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { authUseCaseSpy, sut } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = { body: { email: 'foo@bar.com', password: 'invalid' } }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('should return 500 if no AuthUseCase is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = { body: { email: 'foo@bar.com', password: 'foo' } }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 500 if AuthUseCase has no auth', async () => {
    class AuthUseCaseSpy {}
    const authUseCaseSpy = new AuthUseCaseSpy()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = { body: { email: 'foo@bar.com', password: 'foo' } }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { authUseCaseSpy, sut } = makeSut()
    const httpRequest = { body: { email: 'foo@bar.com', password: 'invalid' } }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toBe(authUseCaseSpy.accessToken)
  })

  it('should return 500 if AuthUseCase throws an error', async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = { body: { email: 'foo@bar.com', password: 'foo' } }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 400 if an invalid email is provided', async () => {
    const { emailValidatorSpy, sut } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = { body: { email: 'invalid_email', password: 'foo' } }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('should call EmailValidator with correct email', async () => {
    const { emailValidatorSpy, sut } = makeSut()
    const httpRequest = { body: { email: 'foo@bar.com', password: 'foo' } }
    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })
})
