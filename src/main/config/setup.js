const cors = require('../middlewares/cors')

const setupApp = app => {
  app.disable('x-powered-by')
  app.use(cors)
}

module.exports = setupApp
