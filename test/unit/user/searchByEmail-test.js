let should
let userService

before(() => {
  should = require('should')
  userService = require('modules/user')
})

describe('unit', () => {
  describe('user', () => {
    describe('#searchByEmail()', () => {

      let options = {
        email: "unit_user_search_by_email_1@test.com",
        username: "unit_user_search_by_email_1",
        firstName: "John",
        lastName: "Smith"
      }

      before(() => {
        return userService.create(options)
      })

      it('should throw an error', () => {
        (() => userService.searchByEmail()).should.throw()
      })

      it('should find a user by email', () => {
        return userService.searchByEmail("search_by_email").then(users => {
          should.exist(users)
          users.length.should.equal(1)
          users[0].email.should.equal(options.email)
          users[0].firstName.should.equal(options.firstName)
          users[0].lastName.should.equal(options.lastName)
        })
      })

      it('should not find any users by email', () => {
        return userService.searchByEmail('bogus').then(users => {
          should.exist(users)
          users.length.should.equal(0)
        })
      })

    })
  })
})
