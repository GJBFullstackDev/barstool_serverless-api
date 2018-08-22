const Promise = require('bluebird')
const uuid = require('uuid/v4')
const { s3: s3Config } = require('app/config')
const { NotFoundError } = require('app/errors')
const AWS = require('./aws')
const s3 = new AWS.S3({
  useAccelerateEndpoint: true
})

class S3Lib {

  /**
   * @method readObjectMetadata
   * @param {String} key
   * @param {String} bucket
   * @return {Promise}
   */
  readObjectMetadata(key, bucket) {
    if (!key) throw new Error('key is required')
    if (!bucket) throw new Error('bucket is required')

    let options = {
      Key: key,
      Bucket: bucket
    }

    return Promise.resolve(s3.headObject(options).promise())
      .then(() => ({
        url: `https://s3.amazonaws.com/${bucket}/${key}`,
        accelerateUrl: `https://${bucket}.s3-accelerate.amazonaws.com/${key}`
      }))
      .catch(() => {
        throw new NotFoundError(`Object does not exist in bucket`)
      })
  }

  /**
   * @method requestSignedUploadUrl
   * @return {Promise}
   */
  requestSignedUploadUrl({ contentType='video/mp4', extension='mp4', cacheControl='public, max-age=31536000' }={}) {
    let key = `${generateUniqueUploadKey()}.${extension}`

    let cdn = `${s3Config.mediaCdn}/${key}`

    let options = {
      Bucket: s3Config.mediaBucket,
      Key: key,
      ACL: 'public-read',
      ContentType: contentType,
      CacheControl: cacheControl,
      Expires: 120
    }

    return Promise.fromCallback(cb => s3.getSignedUrl('putObject', options, cb))
      .then(url => ({ key, url, cdn }))
  }

  /**
   * @method videoSourceUrlForKey
   * @return {String}
   */
  videoSourceUrlForKey(key) {
    if (!key) throw new Error('key is required')
    return `https://${s3Config.mediaBucket}.s3-accelerate.amazonaws.com/${key}`
  }
}

function generateUniqueUploadKey(id=uuid()) {
  let parts = [
    id.slice(0, 2),
    id.slice(2, 4),
    id.slice(4, 6),
    id.slice(6, 8),
    id
  ]
  return parts.join('/')
}

module.exports = new S3Lib()
