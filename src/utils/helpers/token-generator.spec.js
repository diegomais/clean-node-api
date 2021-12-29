const TokenGenerator = require('./token-generator')

const makeSut = () => {
  return new TokenGenerator()
}

describe(TokenGenerator.name, () => {
  it('should return null if JWT returns null', async () => {
    const sut = makeSut()
    const token = await sut.generate('some-payload')
    expect(token).toBeNull()
  })
})
