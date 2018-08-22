let agent
let mockData
let authService

before(() => {
  agent = require('test/lib/agent')
  mockData = require('test/lib/mock-data')
  authService = require('modules/auth')
})

describe('integration', () => {
  describe('auth', () => {
    describe('reset-password', () => {

      let globalAuth
      let resetToken

      let data = {
        email: "intauth_reset_password1@test.com",
        password: "57dhA953g"
      }

      let newData = {
        password: "48309dkle"
      }

      before(() => {
        return mockData.mockAuthAndUser(data)
          .tap(result => globalAuth = result)
      })

      before(() => {
        return authService.requestPasswordResetByEmail(data.email)
          .tap(result => resetToken = result.resetToken)
      })

      it('should not reset password', () => {
        return agent.client()
          .post('/auth/reset-password')
          .set('x-access-token', globalAuth.token)
          .send({
            resetToken: 'bogus',
            newPassword: '123456'
          })
          .expect(401)
          .promise()
      })

      it('should reset password', () => {
        return agent.client()
          .post('/auth/reset-password')
          .set('x-access-token', globalAuth.token)
          .send({
            resetToken,
            newPassword: newData.password
          })
          .expect(200)
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

      it('should not reset password', () => {
        return agent.client()
          .post('/auth/reset-password')
          .send({
            resetToken,
            newPassword: newData.password
          })
          .expect(401)
          .promise()
      })

    })
  })
})
