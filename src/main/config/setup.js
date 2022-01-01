const cors = require('../middlewares/cors')
const jsonParser = require('../middlewares/json-parser')

const setupApp = app => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(jsonParser)
}

module.exports = setupApp
