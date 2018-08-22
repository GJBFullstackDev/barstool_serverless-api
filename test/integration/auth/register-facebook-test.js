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
    describe('register-facebook', () => {

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

      it('should register a new user', () => {
        let data = {
          accessToken: mockData.facebookAccessToken
        }

        return agent.client()
          .post('/auth/register-facebook')
          .send(data)
          .expect(201)
          .promise()
          .then(auth => {
            should.exist(auth)
            should.exist(auth.token)
            should.not.exist(auth.password)
            should.exist(auth.user)
            auth.user.email.should.equal("justin_kiwnuqj_bieber@tfbnw.net")
            auth.user.firstName.should.equal("Justin")
            auth.user.lastName.should.equal("Bieber")
            auth.user.facebookId.should.equal(facebookId)
            auth.user.imageUrl.should.equal("https://image.png")
          })
      })

    })
  })
})
