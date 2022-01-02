const bcrypt = require('bcrypt')
const request = require('supertest')
const app = require('../config/app')
const MongoHelper = require('../../infra/helpers/mongo-helper')

let userModel

describe('Login Routes', () => {
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

  it('should return 200 when valid credentials are provided', async () => {
    const email = 'foo@bar.com'
    const password = '123456'
    await userModel.insertOne({
      email,
      password: await bcrypt.hashSync(password, 10)
    })

    await request(app).post('/api/login').send({ email, password }).expect(200)
  })

  it('should return 401 when invalid credentials are provided', async () => {
    await request(app).post('/api/login').send({ email: 'foo@bar.com', password: 'invalid' }).expect(401)
  })
})
