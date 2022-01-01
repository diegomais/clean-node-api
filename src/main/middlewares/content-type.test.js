const request = require('supertest')
const app = require('../config/app')

describe('Content-Type middleware', () => {
  it('should return Content-Type as JSON by default', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send('')
    })

    await request(app).get('/test-content-type').expect('content-type', /json/)
  })

  it('should return Content-Type as XML when forced', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml').send('')
    })

    await request(app).get('/test-content-type-xml').expect('content-type', /xml/)
  })
})
