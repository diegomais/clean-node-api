const validator = require('validator')
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

  it('should return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isValid = sut.isValid('invalid-email')
    expect(isValid).toBe(false)
  })

  it('should call validator with correct email', () => {
    const email = 'foo@bar.com'
    const sut = makeSut()
    sut.isValid(email)
    expect(validator.email).toBe(email)
  })
})
