let agent
let mockData

before(() => {
  agent = require('test/lib/agent')
  mockData = require('test/lib/mock-data')
})

describe('integration', () => {
  describe('auth', () => {
    describe('request-password-reset', () => {

      let globalAuth

      let data = {
        email: "intauth_request_password_reset_1@test.com",
        password: "57dhA953g"
      }

      before(() => {
        return mockData.mockAuthAndUser(data)
          .tap(result => globalAuth = result)
      })

      it('should request reset', () => {
        return agent.client()
          .post('/auth/request-password-reset')
          .set('x-access-token', globalAuth.token)
          .send({
            email: data.email
          })
          .expect(200)
          .promise()
      })

      it('should not request password reset', () => {
        return agent.client()
          .post('/auth/request-password-reset')
          .send({
            email: 'bogus@bogus.com'
          })
          .expect(400)
          .promise()
      })

    })
  })
})
