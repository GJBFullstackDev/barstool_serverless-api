const Promise = require('bluebird')
const { key, service } = require('app/config').fastly
const fastly = require('fastly')(key)
const logger = require('app/logger')

class FastlyLib {

  /**
   * Purge cacge keys
   *
   * @method purgeKey
   * @param {String} cacheKey
   * @return {Promise}
   */
  purgeKey(cacheKey) {
    return Promise.fromCallback(cb => fastly.purgeKey(service, cacheKey, cb))
      .catch(err => logger.error(`Fastly - Failed to purge ${cacheKey}:`, err))
  }

  /**
   * Purge cacge keys
   *
   * @method purgeKeys
   * @param {Array<String>} cacheKeys
   * @return {Promise}
   */
  purgeKeys(cacheKeys) {
    return Promise.map(cacheKeys, cacheKey => this.purgeKey(cacheKey))
  }
}

module.exports = new FastlyLib()
