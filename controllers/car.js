const carRouter = require('express').Router()
const Car = require('../models/car')

carRouter.post('/', async (request, response) => {
    console.log(request.body)
    const { mark, model, fuelType, mileage, gearBoxType, description } = request.body

    const car = new Car({
        mark,
        model,
        fuelType,
        mileage,
        gearBoxType,
        description
    })
    console.log(car)

    const savedCar = await car.save()

    return response
        .status(201)
        .json({ savedCar, message: 'Announcement registered successfully' })
})

module.exports = carRouter