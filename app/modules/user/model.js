const _ = require('lodash')
const CommonModel = require('modules/common').Model

const REVIEW_STATS_SCHEMA = require('modules/common/schemas/review-stats')
const TYPE = require('./type')

/**
 * @class UserModel
 */
class UserModel extends CommonModel {

  schema() {
    return {
      firstName: {
        type: String,
        trim: true,
        required: true
      },
      lastName: {
        type: String,
        trim: true,
        required: true
      },
      username: {
        type: String,
        trim: true,
        required: true,
        index: {
          unique: true
        }
      },
      email: {
        type: String,
        trim: true,
        required: true,
        index: { unique: true }
      },
      imageUrl: {
        type: String,
        trim: true,
        required: true
      },
      facebookId: {
        type: String,
        index: { sparse: true }
      },
      type: {
        type: String,
        default: TYPE.REGULAR,
        enum: _.values(TYPE),
        required: true
      },
      followerCount: {
        type: Number,
        default: 0
      },
      reviewStats: _.cloneDeep(REVIEW_STATS_SCHEMA),
      admin: {
        type: Boolean,
        default: false,
        required: true
      }
    }
  }
}

module.exports = UserModel
