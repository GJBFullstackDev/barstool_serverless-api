process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.TZ = 'UTC'

// Dependencies
const _ = require('lodash')
const assert = require('assert')

// Environments
const defaultEnv = require('./env/default')
const devEnv = require('./env/development')
const prodEnv = require('./env/production')
const localEnv = require('./env/local')
const testEnv = require('./env/test')

// Constants
const ENVIRONMENT = require('./environment')
const ENV = (process.env.NODE_ENV || ENVIRONMENT.DEVELOPMENT).toLowerCase()

// Base config object
const config = {
  ENV
}

// Configure environment
switch (ENV) {
  case ENVIRONMENT.PRODUCTION:
    _.extend(config, defaultEnv, prodEnv)
    assert(config.ENV_PROD)
    break
  case ENVIRONMENT.DEVELOPMENT:
    _.extend(config, defaultEnv, devEnv)
    assert(config.ENV_DEV)
    break
  case ENVIRONMENT.LOCAL:
    _.extend(config, defaultEnv, devEnv, localEnv)
    assert(config.ENV_LOCAL)
    break
  case ENVIRONMENT.TEST:
    _.extend(config, defaultEnv, devEnv, testEnv)
    assert(config.ENV_TEST)
    break
  default:
    throw new Error(`Invalid environment: ${ENV}`)
}

module.exports = config
