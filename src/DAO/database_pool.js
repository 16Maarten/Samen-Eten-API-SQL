const mysql = require('mysql')
const logger = require('./database_config').logger
const dbconfig = require('./database_config').dbconfig

const pool = mysql.createPool(dbconfig)

pool.on('connection', function (connection) {
  logger.trace('Database connection established')
})

pool.on('acquire', function (connection) {
  logger.trace('Database connection aquired')
})

pool.on('release', function (connection) {
  logger.trace('Database connection released')
})

module.exports = pool
