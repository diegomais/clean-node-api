const app = require('./config/app')
const { port } = require('./config/vars')

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
