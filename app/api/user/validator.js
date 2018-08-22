const { Validator } = require('api/common')

class UserValidator extends Validator {

  update(req) {
    req.checkBody('email').optional().isEmail()
    req.checkBody('firstName').optional().len(1, 64)
    req.checkBody('lastName').optional().len(1, 64)
    req.checkBody('username').optional().len(4, 32)
    req.checkBody('imageUrl').optional().len(1, 256)
    // Sanitize
    req.sanitizeBody('email').toLowerCase()
    req.sanitizeBody('username').toUsername()
    req.sanitizeBody('username').trim()
    req.sanitizeBody('firstName').trim()
    req.sanitizeBody('lastName').trim()
    return this.validate(req)
  }

  updateType(req) {
    req.checkBody('type').notEmpty().isString()
    return this.validate(req)
  }
}

module.exports = new UserValidator()
