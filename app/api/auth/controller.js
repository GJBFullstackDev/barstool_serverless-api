const config = require('app/config')
const email = require('lib/email')
const authService = require('modules/auth')
const userService = require('modules/user')

/**
 * Register a new user
 *
 * @method registerByEmail
 */
exports.registerByEmail = (req, res) => {

  let options = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }

  return email.validate(options.email)
    .then(() => authService.registerByEmail(options))
    .tap(_populateUser)
    .then(auth => res.status(201).json(auth))
}

/**
 * Register user by facebook access token
 *
 * @method registerByFacebook
 */
exports.registerByFacebook = (req, res) => {
  let { accessToken } = req.body

  return authService.registerByFacebookToken(accessToken)
    .tap(_populateUser)
    .then(auth => res.status(201).json(auth))
}

/**
 * Register a new admin user
 *
 * @method registerAdminByEmail
 */
exports.registerAdminByEmail = (req, res) => {
  let options = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    admin: true
  }

  return email.validate(options.email)
    .then(() => authService.registerByEmail(options))
    .tap(_populateUser)
    .then(auth => res.status(201).json(auth))
}

/**
 * Login an existing user
 *
 * @method loginByEmail
 */
exports.loginByEmail = (req, res) => {

  let { email, password } = req.body

  return authService.loginByEmail(email.toString(), password.toString())
    .tap(_populateUser)
    .then(auth => res.status(200).json(auth))
}

/**
 * Login an existing user by facebook access token
 *
 * @method loginByFacebook
 */
exports.loginByFacebook = (req, res) => {
  let { accessToken } = req.body

  return authService.loginByFacebookToken(accessToken)
    .tap(_populateUser)
    .then(auth => res.status(200).json(auth))
}

/**
 * Login or register an existing user by facebook access token
 *
 * @method loginOrRegisterByFacebook
 */
exports.loginOrRegisterByFacebook = (req, res) => {
  let { accessToken } = req.body

  return authService.loginOrRegisterByFacebookToken(accessToken)
    .tap(_populateUser)
    .then(auth => res.status(200).json(auth))
}

/**
 * Change password
 *
 * @method changePassword
 */
exports.changePassword = (req, res) => {
  let { authId } = req
  let { oldPassword, newPassword } = req.body
  return authService.changePasswordById(authId, oldPassword.toString(), newPassword.toString())
    .then(auth => res.status(200).json(auth))
}

/**
 * Request password reset
 *
 * @method requestPasswordReset
 */
exports.requestPasswordReset = (req, res) => {
  let { email } = req.body

  return authService.requestPasswordResetByEmail(email.toString())
    .then(() => res.status(200).json(null))
    .catch(err => {
      if (!config.ENV_PROD) throw err
      res.status(200).json(null)
    })
}

/**
 * Resets a password by token
 *
 * @method resetPassword
 */
exports.resetPassword = (req, res) => {
  let { resetToken, newPassword } = req.body

  return authService.changePasswordByResetToken(resetToken.toString(), newPassword.toString())
    .then(auth => res.status(200).json(auth))
}

/**
 * Sets admin
 *
 * @method setAdmin
 */
exports.setAdmin = (req, res) => {
  let { userId, admin } = req.body

  return authService.setAdminByUserId(userId, admin)
    .then(() => res.status(200).json(null))
}

/**
 * @private
 * @param {Auth} auth
 */
function _populateUser(auth) {
  return userService.read(auth.user)
    .then(user => auth.user = user)
}
