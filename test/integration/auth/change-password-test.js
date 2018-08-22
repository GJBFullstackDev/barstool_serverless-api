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
    describe('change-password', () => {

      let globalAuth

      let data = {
        email: "intauth_change_password_1@test.com",
        password: "57dhA953g"
      }

      let newData = {
        password: "7947fjndh"
      }

      before(() => {
        return mockData.mockAuthAndUser(data)
          .tap(result => globalAuth = result)
      })

      it('should change password', () => {
        return agent.client()
          .post('/auth/change-password')
          .set('x-access-token', globalAuth.token)
          .send({
            oldPassword: data.password,
            newPassword: newData.password
          })
          .expect(200)
          .promise()
          .then(auth => {
            should.exist(auth)
            auth.token.should.not.equal(globalAuth.token)
            should.not.exist(auth.password)
            should.exist(auth.user)
          })
      })

      it('should not login user', () => {
        return agent.client()
          .post('/auth/login')
          .send({
            email: data.email,
            password: data.password
          })
          .expect(401)
          .promise()
      })

      it('should login user', () => {
        return agent.client()
          .post('/auth/login')
          .send({
            email: data.email,
            password: newData.password
          })
          .expect(200)
          .promise()
      })

    })
  })
})
