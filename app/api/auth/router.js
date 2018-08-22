const controller = require('./controller')
const server = require('app/server')
const auth = require('./auth')
const validator = require('./validator')

server.post('/auth/register', (req, res, next) => {
  validator.registerByEmail(req)
    .then(() => controller.registerByEmail(req, res))
    .catch(next)
})

server.post('/auth/login', (req, res, next) => {
  validator.loginByEmail(req)
    .then(() => controller.loginByEmail(req, res))
    .catch(next)
})

server.post('/auth/register-facebook', (req, res, next) => {
  validator.registerByFacebook(req)
    .then(() => controller.registerByFacebook(req, res))
    .catch(next)
})

server.post('/auth/login-facebook', (req, res, next) => {
  validator.loginByFacebook(req)
    .then(() => controller.loginByFacebook(req, res))
    .catch(next)
})

server.post('/auth/facebook', (req, res, next) => {
  validator.loginOrRegisterByFacebook(req)
    .then(() => controller.loginOrRegisterByFacebook(req, res))
    .catch(next)
})

server.post('/auth/register-admin', (req, res, next) => {
  auth.requiresAdmin(req)
    .then(() => validator.registerByEmail(req))
    .then(() => controller.registerAdminByEmail(req, res))
    .catch(next)
})

server.put('/auth/update-admin', (req, res, next) => {
  auth.requiresAdmin(req)
    .then(() => validator.setAdmin(req))
    .then(() => controller.setAdmin(req, res))
    .catch(next)
})

server.post('/auth/change-password', (req, res, next) => {
  auth.requiresLogin(req)
    .then(() => validator.changePassword(req))
    .then(() => controller.changePassword(req, res))
    .catch(next)
})

server.post('/auth/request-password-reset', (req, res, next) => {
  validator.requestPasswordReset(req)
    .then(() => controller.requestPasswordReset(req, res))
    .catch(next)
})

server.post('/auth/reset-password', (req, res, next) => {
  validator.resetPassword(req)
    .then(() => controller.resetPassword(req, res))
    .catch(next)
})
