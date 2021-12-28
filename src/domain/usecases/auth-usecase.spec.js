const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (value, hash) {
      this.value = value
      this.hash = hash
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

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
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const sut = new AuthUseCase({ encrypter: encrypterSpy, loadUserByEmailRepository: loadUserByEmailRepositorySpy })
  return { encrypterSpy, loadUserByEmailRepositorySpy, sut }
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

  it('should call Encrypter with correct values', async () => {
    const { encrypterSpy, loadUserByEmailRepositorySpy, sut } = makeSut()
    const password = 'password'
    await sut.auth('foo@bar.com', password)
    expect(encrypterSpy.value).toBe(password)
    expect(encrypterSpy.hash).toBe(loadUserByEmailRepositorySpy.user.password)
  })
})
