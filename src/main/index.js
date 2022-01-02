const MongoHelper = require('../infra/helpers/mongo-helper')
const { mongoUrl, port } = require('./config/vars')

MongoHelper.connect(mongoUrl)
  .then(() => {
    const app = require('./config/app')

    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`)
    })
  })
  .catch(console.error)
