const Promise = require('bluebird')
const errors = require('app/errors')
const authService = require('modules/auth')

const AUTH_HEADER_KEY = 'x-access-token'

/**
 * @class CommonAuth
 */
class CommonAuth {

  /**
   * Ensures all promises pass
   * 
   * @method all
   * @param {Array<Proimse>} promises
   * @return {Promise} 
   */
  all(promises) {
    return Promise.all(promises)
  }

  /**
   * Requires a valid user auth token
   *
   * @method requiresLogin
   */
  requiresLogin(req) {
    let token = parseAccessToken(req)
    
    if (!token) return Promise.reject(new errors.UnauthorizedError())

    let options = {
      select: '_id user admin'
    }

    return authService.readByToken(token, options)
      .tap(auth => {
        if (!auth) throw new errors.UnauthorizedError()
        req.authId = auth.id
        req.userId = auth.user
        req.admin = auth.admin === true
      })
      .catch(() => {
        throw new errors.UnauthorizedError()
      })
  }

  /**
   * Requires a valid auth token and logged in user
   * must be the same as the user id in the url
   *
   * @method requiresCurrentUser
   */
  requiresCurrentUser(req) {
    return this.requiresLogin(req)
      .tap(() => {
        let userId = req.params.userId || req.params.id
        if (!userId || userId !== req.userId) throw new errors.ForbiddenError()
      })
  }

  /**
   * @method requiresAdmin
   */
  requiresAdmin(req) {
    return this.requiresLogin(req)
      .tap(() => {
        if (req.admin !== true) throw new errors.ForbiddenError()
      })
  }
}

function parseAccessToken(req) {
  // Check authorization
  let authorization = (req.headers.authorization || "").split(" ")[1]
  if (authorization && authorization.length) {
    return authorization
  }

  // Check custom header
  let token = req.headers[AUTH_HEADER_KEY]
  if (token && token.length) {
    return token
  }

  return null
}

module.exports = CommonAuth
