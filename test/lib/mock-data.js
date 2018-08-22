const _ = require('lodash')
const uuid = require('uuid/v4')
const authService = require('modules/auth')
const userService = require('modules/user')
const email = require('lib/email')
const Stub = require('./stub')

class MockData {

  /**
   * @method uuid
   */
  uuid() {
    return uuid(...arguments)
  }

  /**
   * @param {String} facebookAccessToken
   */
  get facebookAccessToken() {
    return "fb_test_access_token"
  }

  /**
   * @method setupStubs
   */
  setupStubs() {
    // let muxStub = new Stub(mux)
    // muxStub.yields('createAsset', () => ({
    //   id: uuid()
    // }))
    // muxStub.yields('readAsset', id => ({
    //   id,
    //   duration: '16.75',
    //   playback_ids: [{ id }]
    // }))

    let emailStub = new Stub(email)
    emailStub.yields('send', () => ({}))
  }

  /**
   * @method mockAuthAndUser
   */
  mockAuthAndUser(options={}) {
    let guid = uuid()

    let data = _.extend({
      password: "password",
      firstName: "John",
      lastName: "Smith",
      email: `mock_user_${guid}@test.com`,
      username: `mock_user_${guid}`
    }, options)

    return authService.registerByEmail(data)
  }

  /**
   * @method mockAuth
   */
  mockAuth(options={}) {
    let data = _.extend({
      token: uuid(),
      user: uuid(),
      password: uuid()
    }, options)

    return authService.create(data)
  }

  /**
   * @method mockUser
   */
  mockUser(options={}) {
    let guid = uuid()

    let data = _.extend({
      firstName: "John",
      lastName: "Smith",
      email: `mock_user_${guid}@test.com`,
      username: `mock_user_${guid}`,
      imageUrl: 'https://image.png'
    }, options)

    return userService.create(data)
  }

}

module.exports = new MockData()
