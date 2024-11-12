const express = require('express')
require('dotenv').config()
const cors = require('cors')
const dbInit = require('./database')
const logger = require('./middlewares/logger')

const PORT = process.env.PORT
const server = express()

server.use(cors({
    exposedHeaders: ['Authorization']
}))
server.use(express.json())
server.use(logger)

dbInit()

server.listen(PORT, () => {
    const now = new Date().toISOString()
    console.log(`[${now}] - Heavenscopes-Server is now up and running on port ${PORT}.`)
})