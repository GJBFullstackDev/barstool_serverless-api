process.env.PROGRAM_NAME = 'events'

require('../module-paths')

const Promise = require('bluebird')
const { events, logger, config } = require('app/')
const iopipe = require('@iopipe/core')(config.iopipe)

exports.handler = iopipe((event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false

  Promise.try(() => JSON.parse(event.Records[0].Sns.Message))
    .then(message => events.handle(message))
    .catch(err => logger.error(err))
    .asCallback(callback)
})
