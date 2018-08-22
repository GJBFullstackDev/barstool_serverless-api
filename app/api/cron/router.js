const server = require('app/server')
const controller = require('./controller')
// const validator = require('./validator')

server.get('/cron/something', (req, res, next) => {
  controller.somethingFetch(req, res)
    .catch(next)
})
