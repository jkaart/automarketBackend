const mongoose = require('mongoose')

const messagesSchema = mongoose.Schema({
  message: String,
  recipientUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  announcementId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  announcementType: {
    type: String,
    enum: ['buy', 'sell'],
    required: true,
  },
  sendDate: { type: Date, default: Date.now },
})

messagesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
    delete returnedObject.__v
  }
})

const Messages = mongoose.model('Messages', messagesSchema)

module.exports = { Messages }