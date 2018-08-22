const { sns: snsConfig } = require('app/config')
const sns = require('lib/sns')
const logger = require('app/logger')

/**
 * @const {Object} EVENTS
 */
const EVENTS = require('./events')

/**
 * @const {Object} HANDLERS
 * @desc Lazily instantiates handlers to prevent circular dependencies
 */
const HANDLERS = {
  // Media
  [EVENTS.MEDIA.PROCESSED]: () => require('./handlers/media/processed'),
  [EVENTS.MEDIA.FAILED]: () => require('./handlers/media/failed'),
  // Review
  [EVENTS.REVIEW.CREATED]: () => require('./handlers/review/created'),
  [EVENTS.REVIEW.VISIBLE]: () => require('./handlers/review/visible'),
  [EVENTS.REVIEW.DELETED]: () => require('./handlers/review/deleted')
}

class AppEvents {

  /**
   * @param {Object} EVENTS
   */
  get EVENTS() {
    return EVENTS
  }

  /**
   * Publishes an event to SNS
   *
   * @method publish
   * @param {String} event
   * @param {Object} data
   * @return {Promise}
   */
  publish(event, data) {
    logger.info(`Events - Publishing ${event}`, data)
    return sns.publish(snsConfig.appEvent, { event, data })
  }

  /**
   * Handles an event from SNS
   *
   * @method handle
   * @param {Object} message
   * @return {Promise}
   */
  handle({ event, data }) {
    logger.info(`Events - Handling ${event}`, data)
    if (!HANDLERS[event]) throw new Error(`Received unhandled job event: ${event}`, data)
    let handler = HANDLERS[event]()
    return handler(data)
  }
}

module.exports = new AppEvents()
