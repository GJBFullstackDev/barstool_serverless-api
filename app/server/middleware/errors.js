const config = require('app/config')
const logger = require('app/logger')
const edgeCache = require('api/common/edge-cache')

module.exports = function() {
  return (err, req, res, next) => { // eslint-disable-line no-unused-vars
    let statusCode = err.statusCode || 500
    let message = err.message
    let title = err.title
    let stack = statusCode < 500 ? null : err.stack

    logger.error(`${statusCode} - ${message}`)
    if (stack) logger.error(stack)

    let result = {
      title,
      message
    }

    if (!config.ENV_PROD && stack) {
      result.stack = stack
    }

    edgeCache.none(req, res)

    res.status(statusCode).json(result)
  }
}
