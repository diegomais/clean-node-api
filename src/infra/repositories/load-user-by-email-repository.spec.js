const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

let userModel

const makeSut = () => {
  const sut = new LoadUserByEmailRepository()
  return { sut }
}

describe(LoadUserByEmailRepository.name, () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid-email@domain.com')
    expect(user).toBeNull()
  })

  it('should return an user if user is found', async () => {
    const { sut } = makeSut()
    const email = 'foo@bar.com'
    const fakeUser = await userModel.insertOne({
      email,
      name: 'Foo Bar',
      password: 'hashed_password'
    })
    const user = await sut.load(email)
    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })

  it('should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
