let should
let agent
let mockData
let Stub
let facebookService
let facebookStub

before(() => {
  should = require('should')
  agent = require('test/lib/agent')
  mockData = require('test/lib/mock-data')
  Stub = require('test/lib/stub')
  facebookService = require('lib/facebook')
  facebookStub = new Stub(facebookService)
})

describe('integration', () => {
  describe('auth', () => {
    describe('login-facebook', () => {

      let globalUser
      let globalAuth
      let facebookId

      before(() => {
        facebookId = mockData.uuid().replace(/-/gi, '')
      })

      before(() => {
        facebookStub.yields('me', () => ({
          id: facebookId,
          first_name: "Justin",
          last_name: "Bieber",
          email: "justin_kiwnuqj_bieber@tfbnw.net",
          picture: {
            data: {
              url: "https://image.png"
            }
          }
        }))
      })

      after(() => {
        facebookStub.restore()
      })

      before(() => {
        return mockData.mockUser({ facebookId: facebookId })
          .tap(result => globalUser = result)
      })

      before(() => {
        return mockData.mockAuth({ user: globalUser.id })
          .tap(result => globalAuth = result)
      })

      it('should login a user', () => {
        let data = {
          accessToken: mockData.facebookAccessToken
        }

        return agent.client()
          .post('/auth/login-facebook')
          .send(data)
          .expect(200)
          .promise()
          .then(auth => {
            should.exist(auth)
            should.exist(auth.token)
            should.not.exist(auth.password)
            should.exist(auth.user)
            auth.token.should.equal(globalAuth.token)
            auth.user.email.should.equal(globalUser.email)
            auth.user.firstName.should.equal(globalUser.firstName)
            auth.user.lastName.should.equal(globalUser.lastName)
            auth.user.facebookId.should.equal(facebookId)
            auth.user.username.should.equal(globalUser.username)
          })
      })

    })
  })
})
