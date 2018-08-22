const mongodb = require('lib/mongodb')

class MockDB {

  reset() {
    return mongodb.createConnection()
      .tap(({ db }) => db.dropDatabase())
      .tap(({ client }) => client.close())
  }
}

module.exports = new MockDB()
