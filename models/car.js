const config = require('../utils/config')
const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
  announcementType: {
    type: String,
    enum: ['sell', 'buy']
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
    delete returnedObject.__v
  }
})

const Car = mongoose.model('Car', carSchema)

module.exports = Car