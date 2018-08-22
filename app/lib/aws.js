const AWS = require('aws-sdk')
const Promise = require('bluebird')
const https = require('https')
const config = require('app/config')

AWS.config = new AWS.Config({
  accessKeyId: config.aws.key,
  secretAccessKey: config.aws.secret,
  region: 'us-east-1',
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true
    })
  }
})

// Setup promise
AWS.config.setPromisesDependency(Promise)

module.exports = AWS
