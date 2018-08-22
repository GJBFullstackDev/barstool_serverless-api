const crypto = require('crypto')
const Promise = require('bluebird')
const { NotFoundError } = require('app/errors')

/**
 * Utilities
 *
 * @class Utils
 */
class Utils {

  /**
   * @method errorNotFound
   */
  errorNotFound(ErrorClass = NotFoundError, message = "Not found") {
    return result => {
      if (!result) throw new ErrorClass(message)
      return Promise.resolve(result)
    }
  }

  /**
   * Produces a random string of alphanumeric characters
   *
   * @method randomHex
   * @param {Number} length
   * @return {Promise<String>}
   */
  randomHex(length) {
    return Promise.fromCallback(callback => {
      let hexLength = Math.ceil(length / 2.0)
      crypto.randomBytes(hexLength, callback)
    }).then(buffer => {
      let hex = buffer.toString('hex')
      return Promise.resolve(hex)
    })
  }

  /**
   * Produces a random string of alphanumeric characters
   *
   * @method randomHex
   * @param {Number} length
   * @return {Promise<String>}
   */
  randomHexSync(length) {
    let hexLength = Math.ceil(length / 2.0)
    return crypto.randomBytes(hexLength).toString('hex')
  }
}

module.exports = new Utils()
