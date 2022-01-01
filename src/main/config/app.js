const express = require('express')
const setupApp = require('./setup')

const app = express()
setupApp(app)

module.exports = app
