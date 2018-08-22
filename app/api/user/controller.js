const _ = require('lodash')
const userService = require('modules/user')

const KEYS = [
  'email',
  'username',
  'firstName',
  'lastName',
  'imageUrl'
]

/**
 * @method readMe
 */
exports.readMe = (req, res) => {
  let { userId } = req

  return userService.read(userId)
    .then(user => res.status(200).json(user))
}

/**
 * @method read
 */
exports.read = (req, res) => {
  let { id } = req.params

  return userService.read(id)
    .then(user => res.status(200).json(user))
}

/**
 * @method usernameExists
 */
exports.usernameExists = (req, res) => {
  let { username } = req.params

  return userService.readByUsername(username)
    .then(user => ({ exists: !!user }))
    .then(result => res.status(200).json(result))
}

/**
 * @method updateMe
 */
exports.updateMe = (req, res) => {
  let { userId, body } = req

  let options = _.pick(body, KEYS)

  return userService.readAndUpdate(userId, options)
    .then(user => res.status(200).json(user))
}

/**
 * @method update
 */
exports.update = (req, res) => {
  let { body, params: { id }} = req

  let options = _.pick(body, KEYS)

  return userService.readAndUpdate(id, options)
    .then(user => res.status(200).json(user))
}

/**
 * @method updateType
 */
exports.updateType = (req, res) => {
  let { body, params: { id }} = req

  let options = _.pick(body, ['type'])

  return userService.readAndUpdate(id, options)
    .then(user => res.status(200).json(user))
}
