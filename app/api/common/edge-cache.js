const Promise = require('bluebird')

/**
 * @const {Number} NONE
 * @desc Disable edge caching
 */
const NONE = 0

/**
 * @const {Number} SHORT
 * @desc Caches at edge for 10 seconds
 */
const SHORT = 10

/**
 * @const {Number} MEDIUM
 * @desc Caches at edge for 30 seconds
 */
const MEDIUM = 30

/**
 * @const {Number} LONG
 * @desc Caches at edge for 60 seconds
 */
const LONG = 60

/**
 * @class EdgeCache
 */
class EdgeCache {

  /**
   * Short cache at edge
   * @param {Request} req
   * @param {Response} res
   */
  short(req, res, keys=[]) {
    return this._applyCache(req, res, SHORT, keys)
  }

  /**
   * Medium cache at edge
   * @param {Request} req
   * @param {Response} res
   */
  medium(req, res, keys=[]) {
    return this._applyCache(req, res, MEDIUM, keys)
  }

  /**
   * Long cache at edge
   * @param {Request} req
   * @param {Response} res
   */
  long(req, res, keys=[]) {
    return this._applyCache(req, res, LONG, keys)
  }

  /**
   * Removes any edge caching
   * @param {Request} req
   * @param {Response} res
   */
  none(req, res, keys=[]) {
    return this._applyCache(req, res, NONE, keys)
  }

  /**
   * @private
   * @param {Request} req
   * @param {Response} res
   * @param {Number} seconds
   */
  _applyCache(req, res, seconds, keys=[]) {
    let value = (seconds && seconds > 0) ? `max-age=${seconds}` : `no-cache`
    res.setHeader('Surrogate-Control', value)
    res.setHeader('X-Surrogate-Control', value)
    if (keys.length) {
      res.setHeader('Surrogate-Key', keys.join(' '))
      res.setHeader('X-Surrogate-Key', keys.join(' '))
    }
    return Promise.resolve()
  }
}

module.exports = new EdgeCache()
