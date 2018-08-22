let should
let authService

before(() => {
  should = require('should')
  authService = require('modules/auth')
})

describe('unit', () => {
  describe('auth', () => {
    describe('#loginByEmail()', () => {

      let globalAuth

      let options = {
        email: "unit_auth_login_by_email_1@test.com",
        username: "unit_auth_login_by_email_1",
        password: "3cV63u84",
        firstName: "John",
        lastName: "Smith"
      }

      before(() => {
        return authService.registerByEmail(options)
          .tap(auth => globalAuth = auth)
      })

      it('should throw an error', () => {
        (() => authService.loginByEmail({})).should.throw()
      })

      it('should login a user', () => {
        return authService.loginByEmail(options.email, options.password).then(auth => {
          should.exist(auth)
          should.exist(auth.token)
          should.exist(auth.user)
          should.not.exist(auth.password)
          auth.user.should.equal(globalAuth.user)
        })
      })

      it('should not login a user with wrong password', () => {
        return authService.loginByEmail(options.email, 'bogus').then(result => {
          should.not.exist(result)
        }).catch(err => {
          should.exist(err)
        })
      })

      it('should not login a user with bad email password', () => {
        return authService.loginByEmail('bogus@test.com', options.password).then(result => {
          should.not.exist(result)
        }).catch(err => {
          should.exist(err)
        })
      })

    })
  })
})
