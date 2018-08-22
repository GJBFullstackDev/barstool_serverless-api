process.env.NODE_ENV = 'test'

before(() => {
  return require('test/lib/mock-data').setupStubs()
})

before(() => {
  return require('test/lib/mock-db').reset()
})

require('require-directory')(module)
