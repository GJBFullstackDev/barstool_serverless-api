module.exports = {
  ENV_TEST: true,
  mongodb: {
    uri: `mongodb://${process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost'}:${process.env.MONGO_PORT_27017_TCP_PORT || 27017}/database`
    db: 'test',
    ssl: true,
    poolSize: 1
  }
}
