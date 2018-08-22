/**
 * Modules
 *
 * @class Modules
 */
class Modules {

  /**
   * @constructor
   */
  constructor() {
    require('./auth')
    require('./email')
    require('./user')
  }
}

module.exports = new Modules()
