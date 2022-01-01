const request = require('supertest')
const app = require('../config/app')

describe('CORS Middleware', () => {
  it('should CORS headers are enabled', async () => {
    app.get('/test-cors', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/test-cors')

    expect(res.headers['access-control-allow-headers']).toBe('*')
    expect(res.headers['access-control-allow-methods']).toBe('*')
    expect(res.headers['access-control-allow-origin']).toBe('*')
  })
})
