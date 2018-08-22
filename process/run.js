const { logger } = require('app')
const { handler } = require(`../${process.argv[2]}`)

let start = Date.now()

handler()
  .then(() => {
    let diff = (Date.now() - start) / 1000
    logger.info(`Script Completed in ${diff.toFixed(2)} seconds`)
    process.exit(0)
  })
  .catch(err => {
    logger.error(err)
    process.exit(1)
  })
