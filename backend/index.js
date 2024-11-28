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

// ROUTES
const userRoutes = require('./routes/users')
server.use('/user', userRoutes)

const celestialBodiesRoutes = require('./routes/celestialbodies')
server.use('/celestial-bodies', celestialBodiesRoutes)

const postRoutes = require('./routes/posts')
server.use('/post', postRoutes)

// ERROR MW
const notFoundErrorHandler = require('./middlewares/notFoundErrorHandler')
server.use(notFoundErrorHandler)

const genericErrorHandler = require('./middlewares/genericErrorHandler')
server.use(genericErrorHandler)

dbInit()

server.listen(PORT, () => {
    const now = new Date().toISOString()
    console.log(`[${now}] - Heavenscopes-Server is now up and running on port ${PORT}.`)
})