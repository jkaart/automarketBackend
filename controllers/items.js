const itemsRouter = require('express').Router()
const Car = require('../models/car')

itemsRouter.get('/', async (request, response) => {
    const cars = await Car.find({})
    if (cars.length > 0) {
        return response.json(cars)
    }
    response.status(204).end()

})

module.exports = itemsRouter