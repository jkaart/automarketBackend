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
  announcements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }],
  interestedAnnouncements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }],
  sendedMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  receivedMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  registrationDate: { type: Date, default: Date.now },

})

userSchema.pre('findByIdAndDelete', async (doc) => {
  mongoose.model('Item').deleteMany({ user: doc._id })
  mongoose.model('Message').deleteMany({ senderUser: doc._id })
  mongoose.model('Message').deleteMany({ recipientUser: doc._id })
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
