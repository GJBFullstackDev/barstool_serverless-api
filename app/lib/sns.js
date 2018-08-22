const Promise = require('bluebird')
const config = require('app/config')
const logger = require('app/logger')
const AWS = require('./aws')
const sns = new AWS.SNS()

class SnsLib {

  constructor() {
    this._cache = {}
  }

  /**
   * @method publish
   * @param {String} name
   * @param {Object} message
   * @return {Promise}
   */
  publish(name, message) {
    if (config.ENV_TEST) {
      logger.info('[TEST] Posting SNS Event:', name, message)
      return Promise.resolve()
    }

    let params = {
      Message: JSON.stringify(message)
    }

    return this._loadTopic(name, params)
      .then(options => sns.publish(options).promise())
  }

  /**
   * @private
   * @param {String} name
   */
  _loadTopic(name, options) {
    if (this._cache[name]) {
      options.TopicArn = this._cache[name]
      return Promise.resolve(options)
    }

    let params = {
      Name: name
    }

    return sns.createTopic(params).promise()
      .then(({ TopicArn }) => {
        options.TopicArn = TopicArn
        this._cache[name] = TopicArn
        return options
      })
  }
}

module.exports = new SnsLib()
