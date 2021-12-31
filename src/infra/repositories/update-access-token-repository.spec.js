const UpdateAccessTokenRepository = require('./update-access-token-repository')
const MongoHelper = require('../helpers/mongo-helper')

let fakeUserId, userModel

const makeSut = () => {
  return new UpdateAccessTokenRepository()
}

describe(UpdateAccessTokenRepository.name, () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
    const fakeUser = await userModel.insertOne({
      email: 'foo@bar.com',
      name: 'Foo Bar',
      password: 'hashed_password'
    })
    fakeUserId = fakeUser.ops[0]._id
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should update user with new accessToken', async () => {
    const sut = makeSut()
    const accessToken = 'valid-token'
    await sut.update(fakeUserId, accessToken)
    const user = await userModel.findOne({ _id: fakeUserId })
    expect(user.accessToken).toBe(accessToken)
  })
})
