const bcrypt = require('bcrypt')
const Encrypter = require('./encrypter')

jest.mock('bcrypt', () => ({
  isValid: true,

  async compare (value, hash) {
    this.value = value
    this.hash = hash
    return this.isValid
  }
}))

const makeSut = () => {
  return new Encrypter()
}

describe(Encrypter.name, () => {
  it('should return true if bcrypt returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('some-value', 'hashed-value')
    expect(isValid).toBe(true)
  })

  it('should return false if bcrypt returns false', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('some-value', 'hashed-value')
    expect(isValid).toBe(false)
  })
})
