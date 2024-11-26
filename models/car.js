const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
    mark: {
        type: String,
        require: true
    },
    model: {
        type: String,
        require: true
    },
    fuelType: {
        type: String,
        require: true
    },
    mileage: {
        type: Number,
        require: true
    },
    gearBoxType: {
        type: String,
        require: true
    },
    price: Number,
    onSale: {
        type:Boolean,
        default:true
    },
    description: String
})

carSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
        delete returnedObject.__v
    }
})

const Car = mongoose.model('Car', carSchema)

module.exports = Car