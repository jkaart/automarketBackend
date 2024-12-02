const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')

const swaggerDocs = require('./docs/swagger-output.json')

const itemsRouter = require('./controllers/items')
const itemRouter = require('./controllers/item')
const photoRouter = require('./controllers/photo')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)
logger.info('Oracle object storage', config.OCI_URI)

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
app.use('/api/photo', photoRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app