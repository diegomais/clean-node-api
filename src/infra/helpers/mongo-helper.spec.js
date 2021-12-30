const sut = require('./mongo-helper')

describe('MongoHelper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  describe('getCollection()', () => {
    it('should reconnect when client is disconnected', async () => {
      expect(sut.db).toBeTruthy()
      await sut.disconnect()
      expect(sut.db).toBeFalsy()
      await sut.getCollection('users')
      expect(sut.db).toBeTruthy()
    })
  })
})
