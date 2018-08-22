const Promise = require('bluebird')
const venueStatsService = require('modules/venue-stats')
const userStatsService = require('modules/user-stats')

module.exports = ({ venueId, userId }) => {
  if (!venueId) throw new Error('venueId is required')
  if (!userId) throw new Error('userId is required')

  return Promise.join(
    updateVenueStats(venueId).reflect(),
    updateUserStats(userId).reflect()
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
