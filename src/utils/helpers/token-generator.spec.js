const jwt = require('jsonwebtoken')
const { MissingParamError } = require('../errors')
const TokenGenerator = require('./token-generator')

jest.mock('jsonwebtoken', () => ({
  token: 'valid-token',
  sign (payload, privateKey) {
    this.payload = payload
    this.privateKey = privateKey
    return this.token
  }
}))

const makeSut = () => {
  return new TokenGenerator('some-secret')
}

describe(TokenGenerator.name, () => {
  it('should return null if JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('some-payload')
    expect(token).toBeNull()
  })

  it('should return a token if JWT returns a token', async () => {
    const sut = makeSut()
    const token = await sut.generate('some-payload')
    expect(token).toBe(jwt.token)
  })

  it('should call JWT with correct values', async () => {
    const sut = makeSut()
    const payload = 'some-payload'
    await sut.generate(payload)
    expect(jwt.payload).toBe(payload)
    expect(jwt.privateKey).toBe(sut.privateKey)
  })

  it('should throw if no privateKey is provided', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('some-payload')
    expect(promise).rejects.toThrow(new MissingParamError('privateKey'))
  })
})
