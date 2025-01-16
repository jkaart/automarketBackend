const itemsRouter = require('express').Router()
const { SellCar, BuyCar, Car } = require('../models/car')

itemsRouter.get('/', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Sell items']
    #swagger.summary = 'Response all announcements'
  */
  const cars = await Car.find({}).sort({ 'sendDate': 1 })
  //const buyCars = await BuyCar.find({}).sort({ 'sendDate': 1 })
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
  const cars = await SellCar.find({ announcementType: 'sell' })
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
  const cars = await BuyCar.find({ announcementType: 'buy' })
  console.log(cars)
  if (cars.length === 0) {
    return response.status(204).end()
  }
  response.json(cars)

})

module.exports = itemsRouter