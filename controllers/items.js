const itemsRouter = require('express').Router()
const {SellCar, BuyCar} = require('../models/car')

itemsRouter.get('/', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Sell items']
    #swagger.summary = 'Response all sell announcements'
  */
  const cars = await SellCar.find({})
  if (!cars) {
    return response.status(204).end()
  }
  response.json(cars)

})

itemsRouter.get('/buy', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Buy items']
    #swagger.summary = 'Response all buy announcements'
  */
  const cars = await BuyCar.find({})
  if (!cars) {
    return response.status(204).end()
  }
  response.json(cars)

})

module.exports = itemsRouter