const express = require('express')
const app = express()
require('express-async-errors')

const usersRouter = require('./controllers/cars')

app.use(express.json())

app.use('/api/cars', carsRouter)

module.exports = app