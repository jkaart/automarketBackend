const itemsRouter = require('express').Router()
const Car = require('../models/car')

itemsRouter.get('/', async (request, response) => {
  /*
        #swagger.tags = ['Items']
        #swagger.summary = 'Response all announcements'
    */
  const cars = await Car.find({})
  if (!cars) {
    return response.status(204).end()
  }
  response.json(cars)

})

module.exports = itemsRouter