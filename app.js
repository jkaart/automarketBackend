const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const mongoose = require('mongoose')

const itemsRouter = require('./controllers/items')
const itemRouter = require('./controllers/item')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/items', itemsRouter)
app.use('/api/item', itemRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app