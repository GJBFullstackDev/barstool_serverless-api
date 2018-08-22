const reviewService = require('modules/review')

module.exports = ({ mediaId }) => {
  if (!mediaId) throw new Error('mediaId is required')

  return reviewService.readMany({ media: mediaId })
    .mapSeries(review => {
      return reviewService.updateStatusVisible(review.id)
        .then(review => reviewService.publishVisibleEvent(review))
    })
}
