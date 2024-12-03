const messageRouter = require('express').Router()
const Message = require('../models/message')
const User = require('../models/user')

messageRouter.post('/:recipientId', async (request, response) => {
    const { recipientId } = request.params
    const { message, userId } = request.body

    if (!message || message.length === 0) {
        return response.status(400).json({ error: 'Content missing' })
    }
    if (!userId) {
        return response.status(400).json({ error: 'UserId missing' })
    }

    const recipient = await User.findOne({ '_id': recipientId })
    const sender = await User.findOne({ '_id': userId })

    if (!recipient) {
        return response.status(400).json({ error: 'Recipient user not found' })
    }

    const msg = new Message({
        message,
        user: userId,
        recipientUser: recipientId
    })
    const savedMessage = await msg.save()

    recipient.receivedMessages = recipient.receivedMessages.concat(savedMessage._id)
    await recipient.save()

    response.status(200).json({ savedMessage, message: 'Message saved and sended' })
})

module.exports = messageRouter