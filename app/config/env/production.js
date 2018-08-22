module.exports = {
  ENV_PROD: true,
  logger: {
    level: 'info'
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
    db: 'production',
    ssl: true,
    poolSize: 1
  }
  // winston: {
  //   console: {
  //     level: 'debug',
  //     colorize: true
  //   },
  //   papertrail: {
  //     host: 'xxxxx.papertrailapp.com',
  //     port: 00000,
  //     colorize: true,
  //     hostname: `serverless-api-${process.env.NODE_ENV}`,
  //     program: process.env.PROGRAM_NAME || process.argv[1].split('/').pop().replace('.js', '')
  //   },
  //   colors: {
  //     info: 'blue',
  //     warn: 'yellow',
  //     error: 'red'
  //   }
  // }
}
