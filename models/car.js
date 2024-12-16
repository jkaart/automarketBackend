const config = require('../utils/config')
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
  price: {
    type: Number,
    require: true
  },
  onSale: {
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
    ref: 'User',
  }
})

const buyCarSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createDate: {
    type: Date,
    default: Date.now
  },
})

carSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.photoURLs = returnedObject.photoFileNames.map(fileName => `${config.SERVER_URL}/api/photo/${fileName}`)
    returnedObject.thumbnailURLs = returnedObject.photoFileNames.map(fileName => `${config.SERVER_URL}/api/photo/thumb_${fileName}`)
    delete returnedObject._id
    delete returnedObject._v
    delete returnedObject.__v
    delete returnedObject.photoFileNames
  }
})

buyCarSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
    delete returnedObject.__v 
  }
})

const Car = mongoose.model('Car', carSchema)
const BuyCar = mongoose.model('BuyCar', buyCarSchema)

module.exports = { Car, BuyCar }