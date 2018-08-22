const CommonModel = require('modules/common').Model

/**
 * @class AuthModel
 */
class AuthModel extends CommonModel {

  schema() {
    return {
      token: {
        type: String,
        required: true,
        index: { unique: true }
      },
      user: {
        type: String,
        ref: 'User',
        required: true,
        index: true
      },
      password: {
        type: String,
        select: false,
        required: true
      },
      admin: {
        type: Boolean,
        default: false,
        required: true
      },
      resetToken: {
        type: String,
        select: false,
        required: false,
        index: {
          sparse: true
        }
      },
      resetExpirationDate: {
        type: Date,
        select: false,
        required: false,
        index: {
          sparse: true
        }
      }
    }
  }
}

module.exports = AuthModel
