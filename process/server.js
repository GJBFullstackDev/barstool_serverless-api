const { api, config, logger } = require('app')

api.start().then(() => {
  logger.info(`HTTP server listening on port ${config.express.port}`)
})

process.on('uncaughtException', err => {
  logger.error(err)
  process.exit(1)
})
