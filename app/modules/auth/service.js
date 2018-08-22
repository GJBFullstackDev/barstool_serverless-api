const _ = require('lodash')
const bcrypt = require('bcrypt')
const { DateTime } = require('luxon')
const { Service } = require('modules/common')
const errors = require('app/errors')
const Promise = require('bluebird')
const facebookService = require('lib/facebook')
const userService = require('modules/user')
const utils = require('lib/utils')
const emailService = require('modules/email')

// Constants
const MIN_PASSWORD_LENGTH = 6
const MAX_PASSWORD_LENGTH = 64
const SALT_WORK_FACTOR = 10

/**
 * @class AuthService
 */
class AuthService extends Service {

  /**
   * @method readWithPassword
   * @param {String|Object} idOrQuery
   */
  readWithPassword(idOrQuery) {
    let options = { select: '+password' }
    return this.read(idOrQuery, options)
  }

  /**
   * Read auth by token
   *
   * @method readByToken
   * @param {String} token
   */
  readByToken(token, options={}) {
    if (!token) throw new Error('token is required')
    let query = { token }
    return this.read(query, options)
  }

  /**
   * Read auth by user id
   *
   * @method readByUserId
   * @param {String} userId
   */
  readByUserId(userId) {
    if (!userId) throw new Error('userId is required')
    let query = { user: userId }
    return this.readWithPassword(query)
  }

  /**
   * Register a new user by email and password
   *
   * @method registerByEmail
   * @param {Object} options
   * @param {String} options.email
   * @param {String} options.password
   * @param {String} options.firstName
   * @param {String} options.lastName
   * @return {Promise<Auth>}
   */
  registerByEmail(options) {
    if (!options) throw new Error('options is required')
    if (!options.email) throw new Error('options.email is required')
    if (!options.password) throw new Error('options.password is required')
    if (!options.firstName) throw new Error('options.firstName is required')
    if (!options.lastName) throw new Error('options.lastName is required')

    // Sanitize password
    let password = options.password

    return userService.create(options)
      .then(user => [user, generateAuthToken(), hashPassword(password)])
      .spread((user, token, hash) => this.create({
        user: user.id,
        token: token,
        password: hash,
        admin: options.admin === true
      }))
      .then(auth => this.readByToken(auth.token))
  }

  /**
   * @method registerByFacebookToken
   * @param {String} accessToken
   * @return {Promise}
   */
  registerByFacebookToken(accessToken) {
    if (!accessToken) throw new Error('accessToken is required')

    let password = utils.randomHexSync(16)

    return facebookService.me(accessToken)
      .then(buildFacebookUserData)
      .then(data => userService.create(data))
      .then(user => [user, generateAuthToken(), hashPassword(password)])
      .spread((user, token, hash) => this.create({
        user: user.id,
        token: token,
        password: hash,
        admin: false
      }))
      .then(auth => this.readByToken(auth.token))
  }

  /**
   * @method loginOrRegisterByFacebookToken
   * @param {String} accessToken
   * @return {Promise}
   */
  loginOrRegisterByFacebookToken(accessToken) {
    return this.loginByFacebookToken(accessToken)
      .catch(() => this.registerByFacebookToken(accessToken))
  }

  /**
   * Login a user by email and password
   *
   * @method loginByEmail
   * @param {String} email
   * @param {String} password
   * @return {Promise<Auth>}
   */
  loginByEmail(email, password) {
    if (!email) throw new Error('email is required')
    if (!password) throw new Error('password is required')

    return userService.readByEmail(email)
      .tap(user => {
        if (!user) throw new errors.BadRequestError('This email does not exist, please Sign Up for a new account or Login with Facebook.')
      })
      .then(user => this.readByUserId(user.id))
      .then(auth => comparePassword(auth, password))
      .then(auth => this.readByToken(auth.token))
  }

  /**
   * @method loginByFacebookToken
   * @param {String} accessToken
   * @return {Promise}
   */
  loginByFacebookToken(accessToken) {
    if (!accessToken) throw new Error('accessToken is required')

    return facebookService.me(accessToken)
      .then(res => userService.readAndUpdate({
        $or: [{
          facebookId: res.id
        }, {
          email: res.email
        }]
      }, {
        facebookId: res.id
      }))
      .then(user => this.read({ user: user.id }))
      .catch(() => {
        throw new errors.UnauthorizedError('Invalid access token')
      })
  }

  /**
   * Requests a password reset
   *
   * @method requestPasswordResetByEmail
   * @param {String} email
   * @return {Promise}
   */
  requestPasswordResetByEmail(email) {
    if (!email) throw new Error('email is required')

    const resetToken = generateResetToken()
    const resetExpirationDate = DateTime.utc().plus({ hours: 1 }).toJSDate()

    return userService.readByEmail(email)
      .then(user => this.readByUserId(user.id))
      .then(auth => this.readAndUpdate(auth.id, { resetToken, resetExpirationDate }))
      .then(() => ({ resetToken }))
      .tap(() => emailService.sendResetPasswordEmail(email, resetToken))
      .catch(() => {
        throw new errors.BadRequestError('Invalid email')
      })
  }

  /**
   * Changes password by reset token
   *
   * @method changePasswordByResetToken
   * @param {String} resetToken
   * @param {String} newPassword
   * @return {Promise}
   */
  changePasswordByResetToken(resetToken, newPassword) {
    if (!resetToken) throw new Error('resetToken is required')
    if (!newPassword) throw new Error('newPassword is required')

    let options = {
      resetToken,
      resetExpirationDate: {
        $gte: new Date()
      }
    }

    return this.read(options)
      .then(auth => [auth, generateAuthToken(), hashPassword(newPassword)])
      .spread((auth, token, hash) => this.readAndUpdate(auth.id, {
        token: token,
        password: hash,
        resetToken: null,
        resetExpirationDate: null
      }))
      .catch(() => {
        throw new errors.UnauthorizedError('Invalid token')
      })
  }

  /**
   * Updates a password
   *
   * @method changePasswordById
   * @param {String} id
   * @param {String} oldPassword
   * @param {String} newPassword
   * @return {Promise<Auth>}
   */
  changePasswordById(id, oldPassword, newPassword) {
    if (!id) throw new Error('id is required')
    if (!oldPassword) throw new Error('oldPassword is required')
    if (!newPassword) throw new Error('newPassword is required')

    return this.readWithPassword(id)
      .then(auth => comparePassword(auth, oldPassword))
      .then(() => [generateAuthToken(), hashPassword(newPassword)])
      .spread((token, hash) => this.readAndUpdate(id, {
        token: token,
        password: hash
      }))
  }

  /**
   * @method setAdminByUserId
   * @param {String} userId
   * @param {Boolean} admin
   * @return {Promise}
   */
  setAdminByUserId(userId, admin=true) {
    if (!userId) throw new Error('userId is required')

    return Promise.props({
      auth: this.readAndUpdate({ user: userId }, { admin }),
      user: userService.readAndUpdate(userId, { admin })
    })
  }
}

function generateAuthToken() {
  return utils.randomHex(64)
}

function generateResetToken() {
  return utils.randomHexSync(32)
}

function sanitizePassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
  if (password.length > MAX_PASSWORD_LENGTH) throw new Error(`password must be ${MAX_PASSWORD_LENGTH} characters or less.`)
  return Promise.resolve(password)
}

function hashPassword(password) {
  return sanitizePassword(password).then(() => {
    return Promise.fromCallback(callback => {
      bcrypt.hash(password, SALT_WORK_FACTOR, callback)
    })
  })
}

function comparePassword(auth, password) {
  return sanitizePassword(password)
    .then(() => {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, auth.password, (err, match) => {
          if (err) return reject(err)
          if (!match) return reject(new errors.UnauthorizedError('Password does not match'))
          resolve(auth)
        })
      })
    })
}

function buildFacebookUserData(res) {
  if (!res || !res.email || !res.first_name || !res.last_name) {
    throw new errors.BadRequestError("We could not get an email address from your Facebook account. Please signup using an email address and password.")
  }

  return {
    firstName: res.first_name,
    lastName: res.last_name,
    email: res.email,
    facebookId: res.id,
    imageUrl: _.get(res, 'picture.data.url', null)
  }
}

module.exports = AuthService
