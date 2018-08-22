const _ = require('lodash')
const Promise = require('bluebird')
const config = require('app/config')
const logger = require('app/logger')
const mongoose = require('mongoose')
const { MongoClient, ReadPreference } = require('mongodb')

// Set default promise library
mongoose.Promise = Promise

/**
 * @class MongoDB
 */
class MongoDB {

  /**
   * @constructor
   */
  constructor() {
    this.connect()
  }

  /**
   * @param {MongooseSchema} Schema
   */
  get Schema() {
    return mongoose.Schema
  }

  /**
   * @param {Boolean} disconnected
   */
  get disconnected() {
    return mongoose.connection.readyState === 0
  }

  /**
   * @param {Boolean} connected
   */
  get connected() {
    return mongoose.connection.readyState === 1
  }

  /**
   * @param {Boolean} connecting
   */
  get connecting() {
    return mongoose.connection.readyState === 2
  }

  /**
   * @param {Boolean} disconnecting
   */
  get disconnecting() {
    return mongoose.connection.readyState === 3
  }

  /**
   * @method connect
   * @return {Promise}
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (!this.disconnected) return reject(new Error('MongoDB - already connecting/connected'))

      let options = {
        dbName: config.mongodb.db,
        ssl: config.mongodb.ssl,
        poolSize: Number(config.mongodb.poolSize),
        readPreference: ReadPreference.PRIMARY_PREFERRED,
        keepAlive: 1000,
        autoReconnect: true,
        reconnectInterval: 250,
        reconnectTries: Number.MAX_VALUE,
        connectTimeoutMS: 360000,
        socketTimeoutMS: 360000,
        validateOptions: true,
        promiseLibrary: Promise
      }

      mongoose.connect(config.mongodb.uri, options)

      mongoose.connection.once('open', () => {
        logger.info('MongoDB: connected', _.pick(options, 'dbName', 'ssl', 'poolSize'))
        resolve()
      })

      mongoose.connection.on('error', err => {
        logger.error('MongoDB: error', err)
        reject(err)
      })
    })
  }

  /**
   * @method disconnect
   * @return {Promise}
   */
  disconnect() {
    return Promise.fromCallback(callback => {
      if (this.disconnected) return callback(new Error('MongoDB - already disconnecting/disconnected'))
      mongoose.connection.close(callback)
    })
  }

  /**
   * @method createModel
   * @return {MongooseModel}
   */
  createModel() {
    return mongoose.model(...arguments)
  }

  /**
   * @method getModel
   * @return {MongooseModel}
   */
  getModel(name) {
    return mongoose.model(name)
  }

  /**
   * @method createConnection
   * @return {Connection}
   */
  createConnection(uri = config.mongodb.uri, options = {}) {
    options.promiseLibrary = Promise

    let client = new MongoClient(uri, options)

    return client.connect()
      .then(() => ({ client, db: client.db(config.mongodb.db) }))
  }
}

module.exports = new MongoDB()
