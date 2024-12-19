const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  sellAnnouncements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }],
  buyAnnouncements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ByeCar'
  }],
  interestedAnnouncements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }],
  sendedMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Messages'
  }],
  receivedMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Messages'
  }],
  registrationDate: { type: Date, default: Date.now },

})

userSchema.pre('findByIdAndDelete', async (doc) => {
  mongoose.model('Item').deleteMany({ user: doc._id })
  mongoose.model('Messages').deleteMany({ senderUser: doc._id })
  mongoose.model('Messages').deleteMany({ recipientUser: doc._id })
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
