const itemsRouter = require('express').Router()
const Car = require('../models/car')

itemsRouter.get('/', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Sell items']
    #swagger.summary = 'Response all announcements'
  */
  const cars = await Car.find()
  if (cars.length === 0) {
    return response.status(204).end()
  }
  response.json(cars)

})

itemsRouter.get('/sell', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Sell items']
    #swagger.summary = 'Response all sell announcements'
  */
  const cars = await Car.find({ announcementType: 'sell' })
  if (cars.length === 0) {
    return response.status(204).end()
  }
  response.json(cars)

})

itemsRouter.get('/buy', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Buy items']
    #swagger.summary = 'Response all buy announcements'
  */
  const cars = await Car.find({ announcementType: 'buy' })
  console.log(cars)
  if (cars.length === 0) {
    return response.status(204).end()
  }
  response.json(cars)

})

module.exports = itemsRouter