const jwt = require('jsonwebtoken')
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
  return new TokenGenerator()
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
})
