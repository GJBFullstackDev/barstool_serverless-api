const winston = require('winston')
const Papertrailtransport = require('winston-papertrail').Papertrail
const { winston: winstonConfig } = require('app/config')
winston.addColors(winstonConfig.colors)

/**
 * Logger
 *
 * @class Logger
 */
class Logger extends winston.Logger {

  /**
   * @constructor
   */
  constructor() {
    let transports = [
      new winston.transports.Console(winstonConfig.console)
    ]

    if (winstonConfig.papertrail) {
      transports.push(new Papertrailtransport(winstonConfig.papertrail))
    }

    super({ transports })
  }
}

module.exports = new Logger()
