const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const mongoose = require('mongoose')

const carsRouter = require('./controllers/cars')
const carRouter = require('./controllers/car')

const logger = require('./utils/logger')

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

app.use('/api/cars', carsRouter)
app.use('/api/car', carRouter)

module.exports = app