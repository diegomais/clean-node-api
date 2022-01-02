const { jwtPrivateKey } = require('../config/vars')
const AuthUseCase = require('../../domain/usecases/auth-usecase')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository')
const LoginRouter = require('../../presentation/routers/login-router')
const EmailValidator = require('../../utils/helpers/email-validator')
const Encrypter = require('../../utils/helpers/encrypter')
const TokenGenerator = require('../../utils/helpers/token-generator')

const emailValidator = new EmailValidator()
const encrypter = new Encrypter()
const loadUserByEmailRepository = new LoadUserByEmailRepository()
const tokenGenerator = new TokenGenerator(jwtPrivateKey)
const updateAccessTokenRepository = new UpdateAccessTokenRepository()
const authUseCase = new AuthUseCase({
  encrypter,
  loadUserByEmailRepository,
  tokenGenerator,
  updateAccessTokenRepository
})
const loginRouter = new LoginRouter(
  authUseCase,
  emailValidator
)

module.exports = loginRouter
