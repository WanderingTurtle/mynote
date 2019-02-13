const config = require('./logConfig.js')
const logger = require('log4js')

logger.configure(config)

module.exports = logger