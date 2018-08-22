let should
let userService

before(() => {
  should = require('should')
  userService = require('modules/user')
})

describe('unit', () => {
  describe('user', () => {
    describe('#create()', () => {

      let options = {
        email: "unit_user_create_1@test.com",
        username: "unit_user_create_1",
        firstName: "John",
        lastName: "Smith"
      }

      it('should throw an error', () => {
        (() => userService.create({})).should.throw()
      })

      it('should create a user', () => {
        return userService.create(options).then(user => {
          should.exist(user)
          user.email.should.equal(options.email)
          user.username.should.equal(options.username)
          user.firstName.should.equal(options.firstName)
          user.lastName.should.equal(options.lastName)
        })
      })

      it('should not create a duplicate user', () => {
        return userService.create(options).then(result => {
          should.not.exist(result)
        }).catch(err => {
          should.exist(err)
        })
      })

    })
  })
})
