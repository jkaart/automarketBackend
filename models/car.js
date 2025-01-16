const config = require('../utils/config')
const mongoose = require('mongoose')

const baseOptions = {
  discriminatorKey: 'type',
  collection: 'cars'
}

const carSchema = mongoose.Schema({
  announcementType: String
}, baseOptions
)

const sellCarSchema = mongoose.Schema({
  announcementType: {
    type: String,
    required: true
  },
  mark: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },
  gearBoxType: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  onActive: {
    type: Boolean,
    default: true
  },
  description: String,
  photoFileNames: Array,
  createdDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const buyCarSchema = mongoose.Schema({
  announcementType: {
    type: String,
    required: true
  },
  mark: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  gearBoxType: {
    type: String,
    required: true
  },
  year: {
    type: Number,
  },
  price: {
    type: Number,
    required: true
  },
  onActive: {
    type: Boolean,
    default: true
  },
  description: String,
  photoFileNames: Array,
  createdDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})


sellCarSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
    }
    if (returnedObject.photoFileNames) {
      returnedObject.photoURLs = returnedObject.photoFileNames.map(fileName => `${config.SERVER_URL}/api/photo/${fileName}`)
      returnedObject.thumbnailURLs = returnedObject.photoFileNames.map(fileName => `${config.SERVER_URL}/api/photo/thumb_${fileName}`)
      delete returnedObject.photoFileNames
    }
    delete returnedObject.type
    delete returnedObject._v
    delete returnedObject.__v
  }
})

buyCarSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
    }
    if (returnedObject.photoFileNames) {
      returnedObject.photoURLs = returnedObject.photoFileNames.map(fileName => `${config.SERVER_URL}/api/photo/${fileName}`)
      returnedObject.thumbnailURLs = returnedObject.photoFileNames.map(fileName => `${config.SERVER_URL}/api/photo/thumb_${fileName}`)
      delete returnedObject.photoFileNames
    }
    delete returnedObject._v
    delete returnedObject.__vd
    delete returnedObject.type
  }
})

const options = { discriminatorKey: 'kind', collection: 'cars' }
const BaseSchema = new mongoose.Schema({ name: String }, options)

const Car = mongoose.model('Car', BaseSchema)

const SellCar = Car.discriminator('SellCar', sellCarSchema)
const BuyCar = Car.discriminator('BuyCar', buyCarSchema)

module.exports = { SellCar, BuyCar, Car }