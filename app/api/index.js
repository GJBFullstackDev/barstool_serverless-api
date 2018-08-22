const server = require('app/server')
const config = require('app/config')

/**
 * Server
 *
 * @class Server
 */
class Api {

  /**
   * @constructor
   */
  constructor() {
    require('./auth')
    require('./cron')
    require('./user')
  }

  /**
   * Starts the Api server
   *
   * @method start
   * @return {Promise}
   */
  start() {
    return server.start(config.express.port)
  }
}

module.exports = new Api()
