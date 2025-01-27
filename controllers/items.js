const itemsRouter = require('express').Router()
const { SellCar, BuyCar, Car } = require('../models/car')
const { auth, checkUserRole } = require('../utils/middleware')

itemsRouter.get('/admin/:index', auth, checkUserRole(['admin']), async (request, response) => {
  /*@swagger
    #swagger.tags = ['Sell items']
    #swagger.summary = 'Response all announcements for admin'
  */
  const index = request.params.index
  const cars = await Car.find({})
    .sort({ 'createdDate': 1 })
    .skip(index * 10)
    .limit(10)
    .populate({ path: 'user', select: '_id username' })

  if (cars.length === 0) {
    return response.status(204).end()
  }
  response.json(cars)

})

itemsRouter.get('/', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Sell items']
    #swagger.summary = 'Response all active announcements'
  */
  //const index = request.params.index
  const cars = await Car.find({ onActive: true })
    .sort({ 'createdDate': 1 })
  // .skip(index * 10)
  // .limit(10)

  if (cars.length === 0) {
    return response.status(204).end()
  }
  response.json(cars)

})

itemsRouter.get('/sell/:index', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Sell items']
    #swagger.summary = 'Response all sell announcements'
  */
  const index = request.params.index
  const cars = await SellCar.find({ onActive: true })
    .sort({ 'createdDate': -1 })
    .skip(index * 10)
    .limit(10)

  if (cars.length === 0) {
    return response.status(204).end()
  }
  response.json(cars)

})

itemsRouter.get('/buy/:index', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Buy items']
    #swagger.summary = 'Response all buy announcements'
  */
  const index = request.params.index
  const cars = await BuyCar.find({ onActive: true })
    .sort({ 'createdDate': -1 })
    .skip(index * 10)
    .limit(10)

  if (cars.length === 0) {
    return response.status(204).end()
  }
  response.json(cars)

})

module.exports = itemsRouter