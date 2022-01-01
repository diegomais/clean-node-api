const request = require('supertest')
const app = require('../config/app')

describe('Content-Type middleware', () => {
  it('should return Content-Type as JSON by default', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send('')
    })

    await request(app).get('/test-content-type').expect('content-type', /json/)
  })
})
