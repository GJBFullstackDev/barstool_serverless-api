process.env.PROGRAM_NAME = 'http'

require('../module-paths')

const config = require('app/config')
const iopipe = require('@iopipe/core')(config.iopipe)
const http = require('serverless-http')
const { server } = require('app/')
const proxy = http(server.router, { callbackWaitsForEmptyEventLoop: false })

exports.handler = iopipe(proxy)
