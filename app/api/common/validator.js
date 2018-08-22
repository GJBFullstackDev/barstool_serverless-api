const { ValidationError } = require('app/errors')

/**
 * @class CommonValidator
 */
class CommonValidator {

  /**
   * @method validate
   */
  validate(req) {
    return req.getValidationResult()
      .then(result => {
        if (result.isEmpty()) return

        let error = result.array({ onlyFirstError: true })[0]
        let message = `${error.msg} for ${error.param} - ${error.value}`

        throw new ValidationError(message)
      })
  }
}

module.exports = CommonValidator
