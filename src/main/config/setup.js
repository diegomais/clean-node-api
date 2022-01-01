const contentType = require('../middlewares/content-type')
const cors = require('../middlewares/cors')
const jsonParser = require('../middlewares/json-parser')

const setupApp = app => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(jsonParser)
  app.use(contentType)
}

module.exports = setupApp
