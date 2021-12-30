const LoadUserByEmailRepository = require('./load-user-by-email-repository')

const makeSut = () => {
  const sut = new LoadUserByEmailRepository()
  return { sut }
}

describe(LoadUserByEmailRepository.name, () => {
  it('should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid-email@domain.com')
    expect(user).toBeNull()
  })
})
