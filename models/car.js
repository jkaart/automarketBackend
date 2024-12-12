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

const Car = mongoose.model('Car', carSchema)

module.exports = Car