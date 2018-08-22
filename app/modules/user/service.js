const Promise = require('bluebird')
const errors = require('app/errors')
// const { defaultAvatars } = require('app/config').media
const { Service } = require('modules/common')

/**
 * @class UserService
 */
class UserService extends Service {

  /**
   * Read a user by their email address
   *
   * @method readByEmail
   * @return {Promise<User>}
   */
  readByEmail(email) {
    if (!email) throw new Error('email is required')

    let query = {
      email: email.toLowerCase()
    }

    return this.findOne(query)
      .exec()
  }

  /**
   * Read a user by their username
   *
   * @method readByUsername
   * @return {Promise<User>}
   */
  readByUsername(username) {
    if (!username) throw new Error('username is required')

    let query = {
      username: username.toLowerCase()
    }

    return this.findOne(query)
      .exec()
  }

  /**
   * Search for a user by their email address
   *
   * @method searchByEmail
   * @return {Promise<[User]>}
   */
  searchByEmail(email, options={}) {
    if (!email) throw new Error('email is required')

    let query = {
      email: {
        $regex: email.toLowerCase(),
        $options: "gi"
      }
    }

    options.limit = 1

    return this.readMany(query, options)
  }

  /**
   * Create a new user
   *
   * @method create
   * @param {Object} options
   * @param {String} options.email
   * @param {String} options.firstName
   * @param {String} options.lastName
   * @param {Promise}
   */
  create(options) {
    if (!options) throw new Error('options is required')
    if (!options.email) throw new Error('options.email is required')
    if (!options.firstName) throw new Error('options.firstName is required')
    if (!options.lastName) throw new Error('options.lastName is required')

    // Default image url
    if (!options.imageUrl) {
      // options.imageUrl = _.sample(defaultAvatars)
      options.imageUrl = 'hello'
    }

    // Sanitize email and username
    options.email = options.email.toLowerCase()
    if (options.username) options.username = options.username.toLowerCase()

    let existing = {
      email: this.count({ email: options.email }),
      username: options.username ? this.count({ username: options.username }) : null
    }

    return Promise.props(existing)
      .tap(throwIfExists)
      .then(() => options.username || this._generateUsername(options))
      .tap(username => options.username = username)
      .then(() => super.create(options))
  }

  /**
   * Updates the users follow count, atomic
   *
   * @method incrementFollowerCountById
   * @param {String} userId
   * @param {Number} increment
   * @return {Promise}
   */
  incrementFollowerCountById(userId, increment) {
    let updates = {
      $inc: {
        followerCount: increment
      }
    }
    return this.readAndUpdate(userId, updates)
  }

  /**
   * @private
   * @method _generateUsername
   * @param {Object} options
   * @return {Promise}
   */
  _generateUsername(options, count=0) {
    let { firstName, lastName } = options
    let suffix = count ? `${count}` : ''
    let username = `${firstName}.${lastName}${suffix}`.toLowerCase()
    return this.count({ username })
      .then(exists => !exists ? username : this._generateUsername(options, count + 1))
  }
}

function throwIfExists({ email, username }) {
  if (email) throw new errors.BadRequestError('User already exists with this email address')
  if (username) throw new errors.BadRequestError('User already exists with this username')
}

module.exports = UserService
