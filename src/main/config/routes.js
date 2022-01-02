const fs = require('fs')
const path = require('path')
const router = require('express').Router()

const setupRoutes = app => {
  app.use('/api', router)

  fs.readdir(path.resolve(__dirname, '..', 'routes'), (err, files) => {
    if (err) {
      throw err
    }

    files.forEach(file => {
      const basename = path.basename(file, '.js')
      if (!/test$/.test(basename)) {
        require(`../routes/${basename}`)(router)
      }
    })
  })
}

module.exports = setupRoutes
