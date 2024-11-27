const itemRouter = require('express').Router()
const Car = require('../models/car')

itemRouter.post('/', async (request, response) => {
    const { mark, model, fuelType, mileage, gearBoxType, description } = request.body

    const car = new Car({
        mark,
        model,
        fuelType,
        mileage,
        gearBoxType,
        description
    })

    const savedCar = await car.save()

    response
        .status(201)
        .json({ savedCar, message: 'Announcement registered successfully' })
})

itemRouter.get('/:id', async (request, response) => {
    const itemId = request.params.id
    const car = await Car.findById(itemId)

    if (!car) {
        return response.status(404).json({ message: 'Announcement not found' })
    }
    response.json(car)

})

itemRouter.delete('/:id', async (request, response) => {
    const itemId = request.params.id
    const deletedCar = await Car.findByIdAndDelete(itemId)

    if (!deletedCar) {
        return response.statusCode(404).end()
    }
    response.status(204).end()

})

module.exports = itemRouter