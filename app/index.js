const config = require('./config')
const logger = require('./logger')
const modules = require('./modules')
const api = require('./api')
const events = require('./events')
const server = require('./server')

/**
 * App
 *
 * @class App
 */
class App {

  /**
   * @property {Object} api
   */
  get api() {
    return api
  }

  /**
   * @property {Object} events
   */
  get events() {
    return events
  }

  /**
   * @property {Object} config
   */
  get config() {
    return config
  }

  /**
   * @property {Object} logger
   */
  get logger() {
    return logger
  }

  /**
   * @property {Object} modules
   */
  get modules() {
    return modules
  }

  /**
   * @property {Object} server
   */
  get server() {
    return server
  }
}

module.exports = new App()
