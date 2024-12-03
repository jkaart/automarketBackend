const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    date: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

messageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
        delete returnedObject.__v
    }
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message