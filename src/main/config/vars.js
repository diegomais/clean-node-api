module.exports = {
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY || 'secret',
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 3333
}
