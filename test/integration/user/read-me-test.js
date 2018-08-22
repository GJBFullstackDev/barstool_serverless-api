let should
let agent
let mockData

before(() => {
  should = require('should')
  agent = require('test/lib/agent')
  mockData = require('test/lib/mock-data')
})

describe('integration', () => {
  describe('user', () => {
    describe('read-me', () => {

      let globalAuth

      let data = {
        email: "intuser_read_me_1@test.com"
      }

      before(() => {
        return mockData.mockAuthAndUser(data)
          .tap(result => globalAuth = result)
      })

      it('should read current user', () => {
        return agent.client()
          .get('/user/me')
          .set('x-access-token', globalAuth.token)
          .expect(200)
          .promise()
          .then(user => {
            should.exist(user)
            user.email.should.equal(data.email)
          })
      })

      it('should not read the current user', () => {
        return agent.client()
          .get('/user/me')
          .set('x-access-token', 'bogusauth')
          .expect(401)
          .promise()
      })

    })
  })
})
