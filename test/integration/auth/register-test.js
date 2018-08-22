let should
let agent

before(() => {
  should = require('should')
  agent = require('test/lib/agent')
})

describe('integration', () => {
  describe('auth', () => {
    describe('register', () => {

      describe('with username', () => {
        let data = {
          email: `int_auth_reg@test.com`,
          username: "int_auth_reg",
          password: "Xxx123$!&",
          firstName: "Andrew",
          lastName: "Test"
        }

        it('should register a new user', () => {
          return agent.client()
            .post('/auth/register')
            .send(data)
            .expect(201)
            .promise()
            .then(auth => {
              should.exist(auth)
              should.exist(auth.token)
              should.not.exist(auth.password)
              should.exist(auth.user)
              auth.user.email.should.equal(data.email)
              auth.user.username.should.equal(data.username)
              auth.user.firstName.should.equal(data.firstName)
              auth.user.lastName.should.equal(data.lastName)
            })
        })

        it('should not register a new user', () => {
          return agent.client()
            .post('/auth/register')
            .send(data)
            .expect(400)
            .promise()
        })
      })

      describe('without username', () => {
        it('should register a new user', () => {
          let data = {
            email: `int_auth_reg_2@test.com`,
            password: "Xxx123$!&",
            firstName: "Andrew",
            lastName: "Test"
          }

          return agent.client()
            .post('/auth/register')
            .send(data)
            .expect(201)
            .promise()
            .then(auth => {
              should.exist(auth)
              should.exist(auth.token)
              should.not.exist(auth.password)
              should.exist(auth.user)
              auth.user.email.should.equal(data.email)
              auth.user.firstName.should.equal(data.firstName)
              auth.user.lastName.should.equal(data.lastName)
              auth.user.username.should.equal('andrew.test')
            })
        })

        it('should register another new user', () => {
          let data = {
            email: `int_auth_reg_3@test.com`,
            password: "Xxx123$!&",
            firstName: "Andrew",
            lastName: "Test"
          }

          return agent.client()
            .post('/auth/register')
            .send(data)
            .expect(201)
            .promise()
            .then(auth => {
              should.exist(auth)
              should.exist(auth.token)
              should.not.exist(auth.password)
              should.exist(auth.user)
              auth.user.email.should.equal(data.email)
              auth.user.firstName.should.equal(data.firstName)
              auth.user.lastName.should.equal(data.lastName)
              auth.user.username.should.equal('andrew.test1')
            })
        })

        it('should not register a new user', () => {
          let data = {
            email: `int_auth_reg_2@test.com`,
            password: "Xxx123$!&",
            firstName: "Andrew",
            lastName: "Test"
          }

          return agent.client()
            .post('/auth/register')
            .send(data)
            .expect(400)
            .promise()
        })
      })

    })
  })
})
