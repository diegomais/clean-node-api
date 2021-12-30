const { MongoClient } = require('mongodb')

const mongoClient = {
  async connect (uri) {
    this.uri = uri
    this.client = await MongoClient.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = this.client.db()
  },

  async disconnect () {
    await this.client.close()
    this.client = null
    this.db = null
  },

  async getCollection (name) {
    if (!this.client) {
      await this.connect(this.uri)
    }
    return this.db.collection(name)
  }
}

module.exports = mongoClient
