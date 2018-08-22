const server = require('app/server')
const controller = require('./controller')
const auth = require('./auth')
const validator = require('./validator')

server.get('/user/me', (req, res, next) => {
  auth.requiresLogin(req)
    .then(() => controller.readMe(req, res))
    .catch(next)
})

server.get('/username/:username', (req, res, next) => {
  controller.usernameExists(req, res)
    .catch(next)
})

server.get('/user/:id', (req, res, next) => {
  controller.read(req, res)
    .catch(next)
})

server.put('/user/me', (req, res, next) => {
  auth.requiresLogin(req)
    .then(() => validator.update(req))
    .then(() => controller.updateMe(req, res))
    .catch(next)
})

server.put('/user/:id', (req, res, next) => {
  auth.requiresCurrentUser(req)
    .then(() => validator.update(req))
    .then(() => controller.update(req, res))
    .catch(next)
})

server.put('/user/:id/type', (req, res, next) => {
  auth.requiresAdmin(req)
    .then(() => validator.updateType(req))
    .then(() => controller.updateType(req, res))
    .catch(next)
})
