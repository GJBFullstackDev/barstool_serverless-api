const Promise = require('bluebird')
const request = require('supertest')
const app = require('app/')

class Agent {

  constructor() {
    this._server = require('app/server').server
  }

  client() {
    return request.agent(this._server)
  }

  start() {
    return app.api.start()
  }
}

request.Test.prototype.promise = function() {
  return Promise.fromCallback(callback => this.end(callback))
    .then(result => result.body)
}

module.exports = new Agent()
