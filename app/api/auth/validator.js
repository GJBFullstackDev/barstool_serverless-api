const { Validator } = require('api/common')

class AuthValidator extends Validator {

  registerByEmail(req) {
    req.checkBody('email').notEmpty().isString().isEmail()
    req.checkBody('password').notEmpty().isString().len(6, 64)
    req.checkBody('firstName').notEmpty().isString().len(1, 64)
    req.checkBody('lastName').notEmpty().isString().len(1, 64)
    req.checkBody('username').optional().len(4, 32)
    req.checkBody('imageUrl').optional().isString().isURL()
    // Sanitize
    req.sanitizeBody('email').toLowerCase()
    req.sanitizeBody('firstName').trim()
    req.sanitizeBody('lastName').trim()
    if ('username' in req.body) {
      req.sanitizeBody('username').toUsername()
    }
    return this.validate(req)
  }

  registerByFacebook(req) {
    req.checkBody('accessToken').notEmpty().isString()
    return this.validate(req)
  }

  loginByEmail(req) {
    req.checkBody('email').notEmpty().isString().isEmail()
    req.checkBody('password').notEmpty().isString().len(0, 64)
    // Sanitize
    req.sanitizeBody('email').toLowerCase()
    return this.validate(req)
  }

  loginByFacebook(req) {
    req.checkBody('accessToken').notEmpty().isString()
    return this.validate(req)
  }

  loginOrRegisterByFacebook(req) {
    req.checkBody('accessToken').notEmpty().isString()
    return this.validate(req)
  }

  changePassword(req) {
    req.checkBody('oldPassword').notEmpty().isString().len(1, 64)
    req.checkBody('newPassword').notEmpty().isString().len(6, 64)
    return this.validate(req)
  }

  requestPasswordReset(req) {
    req.checkBody('email').notEmpty().isString().isEmail()
    // Sanitize
    req.sanitizeBody('email').toLowerCase()
    return this.validate(req)
  }

  resetPassword(req) {
    req.checkBody('resetToken').notEmpty().isString().len(1, 64)
    req.checkBody('newPassword').notEmpty().isString().len(6, 64)
    return this.validate(req)
  }

  setAdmin(req) {
    req.checkBody('userId').notEmpty().isString()
    req.checkBody('admin').notEmpty().isBoolean()
    return this.validate(req)
  }
}

module.exports = new AuthValidator()
