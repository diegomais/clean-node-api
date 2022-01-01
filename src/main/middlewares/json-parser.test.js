const request = require('supertest')
const app = require('../config/app')

describe('JSON Parser Middleware', () => {
  it('should parse request body as JSON', async () => {
    app.post('/test-json-parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test-json-parser')
      .send({ name: 'John Doe' })
      .expect(200)
      .expect({ name: 'John Doe' })
  })
})
