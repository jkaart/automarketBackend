const mongoose = require('mongoose')

const topicSchema = mongoose.Schema({
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
  announcement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
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
  sendDate: { type: Date, default: Date.now },
})

const messageSchema = mongoose.Schema({
  message: String,
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  senderUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sendDate: { type: Date, default: Date.now },
})

topicSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
    }
    delete returnedObject._v
    delete returnedObject.__v
  }
})

messageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
    }
    delete returnedObject._v
    delete returnedObject.__v
  }
})

const Topic = mongoose.model('Topic', topicSchema)
const Message = mongoose.model('Message', messageSchema)

module.exports = { Topic, Message }