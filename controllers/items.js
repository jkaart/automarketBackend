const itemsRouter = require('express').Router()
const {Car, BuyCar} = require('../models/car')

itemsRouter.get('/', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Items']
    #swagger.summary = 'Response all sell announcements'
  */
  const cars = await Car.find({})
  if (!cars) {
    return response.status(204).end()
  }
  response.json(cars)

})

itemsRouter.get('/buy', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Items']
    #swagger.summary = 'Response all buy announcements'
  */
  const cars = await BuyCar.find({})
  if (!cars) {
    return response.status(204).end()
  }
  response.json(cars)

})

module.exports = itemsRouter