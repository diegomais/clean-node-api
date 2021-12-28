const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = { id: 'user-id', password: 'hashed-password' }
  return loadUserByEmailRepositorySpy
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const sut = new AuthUseCase({ loadUserByEmailRepository: loadUserByEmailRepositorySpy })
  return { loadUserByEmailRepositorySpy, sut }
}

describe(AuthUseCase.name, () => {
  it('should throw MissingParamError if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('should throw MissingParamError if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('foo@bar.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  it('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const email = 'foo@bar.com'
    await sut.auth(email, 'password')
    expect(loadUserByEmailRepositorySpy.email).toBe(email)
  })

  it('should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('foo@bar.com', 'password')
    expect(promise).rejects.toThrow()
  })

  it('should throw if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({ loadUserByEmailRepository: {} })
    const promise = sut.auth('foo@bar.com', 'password')
    expect(promise).rejects.toThrow()
  })

  it('should return null if non-existent user is provided', async () => {
    const { loadUserByEmailRepositorySpy, sut } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('non-existent-user@mail.com', 'password')
    expect(accessToken).toBeNull()
  })

  it('should return null if an invalid password is provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('foo@bar.com', 'invalid-password')
    expect(accessToken).toBeNull()
  })
})
