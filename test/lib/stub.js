const _ = require('lodash')
const Promise = require('bluebird')

class Stub {

  constructor(object) {
    this._object = object
    this._original = {}
  }

  yields(func, resultGetter) {
    this._original[func] = this._object[func]
    this._object[func] = arg1 => Promise.resolve(resultGetter(arg1))
  }

  restore() {
    _.each(this._original, (func, key) => {
      this._object[key] = func
    })
  }
}

module.exports = Stub
