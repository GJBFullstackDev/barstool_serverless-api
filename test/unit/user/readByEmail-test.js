let should
let userService

before(() => {
  should = require('should')
  userService = require('modules/user')
})

describe('unit', () => {
  describe('user', () => {
    describe('#readByEmail()', () => {

      let options = {
        email: "unit_user_readByEmail_1@test.com",
        username: "unit_user_readByEmail_1",
        firstName: "John",
        lastName: "Smith"
      }

      before(() => {
        return userService.create(options)
      })

      it('should throw an error', () => {
        (() => userService.readByEmail()).should.throw()
      })

      it('should read a user by email', () => {
        return userService.readByEmail(options.email).then(user => {
          should.exist(user)
          user.email.should.equal(options.email)
          user.firstName.should.equal(options.firstName)
          user.lastName.should.equal(options.lastName)
        })
      })

      it('should not read a user by email', () => {
        return userService.readByEmail('bogus@test.com').then(result => {
          should.not.exist(result)
        }).catch(err => {
          should.exist(err)
        })
      })

    })
  })
})
