const Promise = require('bluebird')
const { FB } = require('fb')

FB.options({
  Promise
})

class FacebookLib {

  /**
   * @method me
   * @param {String} accessToken
   * @return {Promise}
   */
  me(accessToken) {
    let fb = FB.withAccessToken(accessToken)

    let options = {
      fields: ['id', 'first_name', 'last_name', 'email', 'picture.width(512).height(512)']
    }

    return fb.api('me', options)
  }
}

module.exports = new FacebookLib()
