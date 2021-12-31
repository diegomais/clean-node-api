const MongoHelper = require('../helpers/mongo-helper')

class UpdateAccessTokenRepository {
  async update (userId, accessToken) {
    const userModel = await MongoHelper.getCollection('users')
    await userModel.updateOne({ _id: userId }, { $set: { accessToken } })
  }
}

module.exports = UpdateAccessTokenRepository
