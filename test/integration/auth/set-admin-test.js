let should
let agent
let mockData
let authService
let userService

before(() => {
  should = require('should')
  agent = require('test/lib/agent')
  mockData = require('test/lib/mock-data')
  authService = require('modules/auth')
  userService = require('modules/user')
})

describe('integration', () => {
  describe('auth', () => {
    describe('set-admin', () => {

      let globalAdminAuth
      let globalAuth

      before(() => {
        return mockData.mockAuthAndUser({ admin: true })
          .tap(result => globalAdminAuth = result)
      })

      before(() => {
        return mockData.mockAuthAndUser({})
          .tap(result => globalAuth = result)
      })

      it('should not set a admin user', () => {
        return agent.client()
          .put('/auth/update-admin')
          .send({})
          .expect(401)
          .promise()
      })

      it('should set a admin user true', () => {
        return agent.client()
          .put('/auth/update-admin')
          .set('x-access-token', globalAdminAuth.token)
          .send({
            userId: globalAuth.user,
            admin: true
          })
          .expect(200)
          .promise()
          .then(() => userService.read(globalAuth.user))
          .then(user => {
            should.exist(user)
            user.admin.should.equal(true)
          })
          .then(() => authService.read({ user: globalAuth.user }))
          .then(auth => {
            should.exist(auth)
            auth.admin.should.equal(true)
          })
      })

      it('should set a admin user false', () => {
        return agent.client()
          .put('/auth/update-admin')
          .set('x-access-token', globalAdminAuth.token)
          .send({
            userId: globalAuth.user,
            admin: false
          })
          .expect(200)
          .promise()
          .then(() => userService.read(globalAuth.user))
          .then(user => {
            should.exist(user)
            user.admin.should.equal(false)
          })
          .then(() => authService.read({ user: globalAuth.user }))
          .then(auth => {
            should.exist(auth)
            auth.admin.should.equal(false)
          })
      })

    })
  })
})
