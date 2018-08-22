const pkg = require('../../../package.json')

module.exports = {
  app: {
    name: pkg.name,
    version: pkg.version
  },
  aws: {
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SEC
  },
  express: {
    port: process.env.PORT || 3000,
    ssl: process.env.SSL === 'true'
  },
  iopipe: {
    token: process.env.IOPIPE_TOKEN
  },
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
    db: 'local',
    ssl: true,
    poolSize: 1
  },
  postmark: {
    apiKey: process.env.POSTMARK_KEY,
    sender: process.env.POSTMARK_SENDER
  },
  web: {
    url: 'https://localhost'
  },
  winston: {
    console: {
      level: 'debug',
      colorize: true
    },
    colors: {
      info: 'blue',
      warn: 'yellow',
      error: 'red'
    }
  }
}