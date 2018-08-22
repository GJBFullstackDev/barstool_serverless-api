let should
let agent
let mockData

before(() => {
  should = require('should')
  agent = require('test/lib/agent')
  mockData = require('test/lib/mock-data')
})

describe('integration', () => {
  describe('auth', () => {
    describe('register-admin', () => {

      let globalAdminAuth

      let data = {
        email: `int_auth_reg_admin@test.com`,
        username: `int_auth_reg_admin`,
        password: "Xxx123$!&",
        firstName: "Andrew",
        lastName: "Test"
      }

      before(() => {
        return mockData.mockAuthAndUser({ admin: true })
          .tap(result => globalAdminAuth = result)
      })

      it('should not register a new user', () => {
        return agent.client()
          .post('/auth/register-admin')
          .send(data)
          .expect(401)
          .promise()
      })

      it('should register a new user', () => {
        return agent.client()
          .post('/auth/register-admin')
          .set('x-access-token', globalAdminAuth.token)
          .send(data)
          .expect(201)
          .promise()
          .then(auth => {
            should.exist(auth)
            should.exist(auth.token)
            should.not.exist(auth.password)
            should.exist(auth.user)
            auth.admin.should.equal(true)
            auth.user.email.should.equal(data.email)
            auth.user.username.should.equal(data.username)
            auth.user.firstName.should.equal(data.firstName)
            auth.user.lastName.should.equal(data.lastName)
            auth.user.admin.should.equal(true)
          })
      })

    })
  })
})
