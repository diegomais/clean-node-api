const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

const makeSut = () => {
  const sut = new AuthUseCase()
  return { sut }
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
})
