const logger = require('app/logger')
const mediaService = require('modules/media')

module.exports = ({ mediaId }) => {
  if (!mediaId) throw new Error('mediaId is required')

  return mediaService.read(mediaId)
    .then(media => {
      logger.warn(`Media Processing Failed: id=${media.id} asset=${media.assetId}`)
    })
}
