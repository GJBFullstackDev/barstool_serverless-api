process.env.NODE_ENV = 'test'

before(() => {
  return require('test/lib/mock-data').setupStubs()
})

before(() => {
  return require('test/lib/mock-db').reset()
})

before(() => {
  return require('test/lib/agent').start()
})

require('require-directory')(module)
