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
    describe('login', () => {

      let globalAuth

      let data = {
        email: "intauth_login_1@test.com",
        password: "57dhA953g"
      }

      before(() => {
        return mockData.mockAuthAndUser(data)
          .tap(result => globalAuth = result)
      })

      it('should login a new user', () => {
        return agent.client()
          .post('/auth/login')
          .send({
            email: data.email,
            password: data.password
          })
          .expect(200)
          .promise()
          .then(auth => {
            should.exist(auth)
            auth.token.should.equal(globalAuth.token)
            should.not.exist(auth.password)
            should.exist(auth.user)
            auth.user.email.should.equal(data.email)
          })
      })

      it('should not login a new user', () => {
        return agent.client()
          .post('/auth/login')
          .send({
            email: data.email,
            password: "wrong password"
          })
          .expect(401)
          .promise()
      })

    })
  })
})
