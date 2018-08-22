const reviewService = require('modules/review')
const venueStatsService = require('modules/venue-stats')

module.exports = ({ reviewId }) => {
  if (!reviewId) throw new Error('reviewId is required')

  return reviewService.read(reviewId)
    .then(review => venueStatsService.updateReviewsById(review.venue))
}
