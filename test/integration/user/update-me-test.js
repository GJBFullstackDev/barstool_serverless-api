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
    describe('update-me', () => {

      let globalAuth

      let data = {
        email: "intuser_update_me_1@test.com"
      }

      before(() => {
        return mockData.mockAuthAndUser(data)
          .tap(result => globalAuth = result)
      })

      it('should update current user', () => {
        let newData = {
          firstName: 'Newfirstname',
          lastName: 'Newlastname',
          email: 'Newemail_uPdaTe_me@test.com',
          username: 'Newemail_Update_Me'
        }
        return agent.client()
          .put('/user/me')
          .set('x-access-token', globalAuth.token)
          .send(newData)
          .expect(200)
          .promise()
          .then(user => {
            should.exist(user)
            user.firstName.should.equal(newData.firstName)
            user.lastName.should.equal(newData.lastName)
            user.email.should.equal(newData.email.toLowerCase())
            user.username.should.equal(newData.username.toLowerCase())
          })
      })

      it('should partially update current user', () => {
        let newData = {
          username: 'Newemail_Update_Me_foo_bar'
        }
        return agent.client()
          .put('/user/me')
          .set('x-access-token', globalAuth.token)
          .send(newData)
          .expect(200)
          .promise()
          .then(user => {
            should.exist(user)
            user.username.should.equal(newData.username.toLowerCase())
          })
      })

      it('should partially update current user', () => {
        let newData = {
          firstName: '    Andrew      '
        }
        return agent.client()
          .put('/user/me')
          .set('x-access-token', globalAuth.token)
          .send(newData)
          .expect(200)
          .promise()
          .then(user => {
            should.exist(user)
            user.firstName.should.equal(newData.firstName.trim())
          })
      })

      it('should not update the current user', () => {
        return agent.client()
          .put('/user/me')
          .set('x-access-token', 'bogusauth')
          .expect(401)
          .promise()
      })

    })
  })
})
