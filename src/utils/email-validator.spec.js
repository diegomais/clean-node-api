const EmailValidator = require('./email-validator')

jest.mock('validator', () => ({
  isEmailValid: true,

  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
}))

const makeSut = () => {
  return new EmailValidator()
}

describe(EmailValidator.name, () => {
  it('should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('foo@bar.com')
    expect(isValid).toBe(true)
  })
})
