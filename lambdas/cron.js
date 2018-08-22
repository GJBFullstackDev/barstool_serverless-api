process.env.PROGRAM_NAME = 'cron'

require('../module-paths')

const { config, logger } = require('app/')
const iopipe = require('@iopipe/core')(config.iopipe)

exports.handler = iopipe((event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  logger.info('Do something...', callback)

  // somethingService.cron()
  //   .then(data => {
  //     should.exist(data)
  //   })
  
})
