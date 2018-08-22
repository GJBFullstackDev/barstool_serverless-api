const Promise = require('bluebird')
const followService = require('modules/follow')
const pushService = require('modules/push')
const reviewService = require('modules/review')
const userService = require('modules/user')
const venueService = require('modules/venue')
const venueStatsService = require('modules/venue-stats')
const userStatsService = require('modules/user-stats')

module.exports = ({ venueId, userId, reviewId }) => {
  if (!venueId) throw new Error('venueId is required')
  if (!userId) throw new Error('userId is required')
  if (!reviewId) throw new Error('reviewId is required')

  return Promise.join(
    updateVenueStats(venueId).reflect(),
    updateUserStats(userId).reflect(),
    notifyUsers({ venueId, userId, reviewId }).reflect()
  )
}

/**
 * @desc Updates a venues review stats
 */
function updateVenueStats(venueId) {
  return venueStatsService.updateReviewsById(venueId)
}

/**
 * @desc Updates a users review stats
 */
function updateUserStats(userId) {
  return userStatsService.updateReviewsById(userId)
}

/**
 * @desc Notifies user who posted review and all his/her followers that a new review is live
 */
function notifyUsers({ venueId, userId, reviewId }) {
  let props = {
    user: userService.read(userId),
    venue: venueService.read(venueId),
    review: reviewService.read(reviewId),
    followers: followService.distinct('user', { following: userId })
  }

  return Promise.props(props)
    .tap(({ user, venue, review }) => {
      return pushService.sendUserReviewVisible(user.id, { user, venue, review }).reflect()
    })
    .then(({ user, venue, review, followers }) => {
      return Promise.map(followers, toUserId => {
        return pushService.sendUserPostedReview(toUserId, { user, venue, review }).reflect()
      }, {
        concurrency: 32
      })
    })
}
