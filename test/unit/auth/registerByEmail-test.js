let should
let authService

before(() => {
  should = require('should')
  authService = require('modules/auth')
})

describe('unit', () => {
  describe('auth', () => {
    describe('#registerByEmail()', () => {

      let options = {
        email: "unit_auth_register_by_email_1@test.com",
        username: "unit_auth_register_by_email_1",
        password: "3cV63u84",
        firstName: "John",
        lastName: "Smith"
      }

      it('should throw an error', () => {
        (() => authService.registerByEmail({})).should.throw()
      })

      it('should register a user', () => {
        return authService.registerByEmail(options).then(auth => {
          should.exist(auth)
          should.exist(auth.token)
          should.exist(auth.user)
          should.not.exist(auth.password)
        })
      })

      it('should not register a duplicate user', () => {
        return authService.registerByEmail(options).then(result => {
          should.not.exist(result)
        }).catch(err => {
          should.exist(err)
        })
      })

    })
  })
})
