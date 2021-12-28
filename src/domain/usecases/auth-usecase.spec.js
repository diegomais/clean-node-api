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

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'valid-token'
  return tokenGeneratorSpy
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepositorySpy {
    async update (userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }
  return new UpdateAccessTokenRepositorySpy()
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()
  const sut = new AuthUseCase({
    encrypter: encrypterSpy,
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  })
  return {
    encrypterSpy,
    loadUserByEmailRepositorySpy,
    sut,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
  }
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

  it('should return null if non-existent user is provided', async () => {
    const { loadUserByEmailRepositorySpy, sut } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('non-existent-user@mail.com', 'password')
    expect(accessToken).toBeNull()
  })

  it('should return null if an invalid password is provided', async () => {
    const { encrypterSpy, sut } = makeSut()
    encrypterSpy.isValid = false
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

  it('should call TokenGenerator with correct values', async () => {
    const { loadUserByEmailRepositorySpy, sut, tokenGeneratorSpy } = makeSut()
    await sut.auth('foo@bar.com', 'password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  it('should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('foo@bar.com', 'password')
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toEqual(expect.any(String))
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      loadUserByEmailRepositorySpy,
      sut,
      tokenGeneratorSpy,
      updateAccessTokenRepositorySpy
    } = makeSut()
    await sut.auth('foo@bar.com', 'password')
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  it('should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const encrypter = makeEncrypter()
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const tokenGenerator = makeTokenGenerator()
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({
        encrypter: invalid
      }),
      new AuthUseCase({
        encrypter
      }),
      new AuthUseCase({
        encrypter,
        loadUserByEmailRepository: invalid
      }),
      new AuthUseCase({
        encrypter,
        loadUserByEmailRepository
      }),
      new AuthUseCase({
        encrypter,
        loadUserByEmailRepository,
        tokenGenerator: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        tokenGenerator,
        encrypter
      }),
      new AuthUseCase({
        encrypter,
        loadUserByEmailRepository,
        tokenGenerator,
        updateAccessTokenRepository: invalid
      })
    )
    for (const sut of suts) {
      const promise = sut.auth('foo@bar.com', 'password')
      expect(promise).rejects.toThrow()
    }
  })
})
