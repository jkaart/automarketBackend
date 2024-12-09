const messageRouter = require('express').Router()
const Message = require('../models/message')
const User = require('../models/user')

messageRouter.post('/', async (request, response) => {
  /*@swagger
    #swagger.tags = ['User']
    #swagger.summary = 'Messages between users'
    */

  const { message, userId, recipientUserId, announcementId } = request.body

  if (!message || message.length === 0) {
    return response.status(400).json({ error: 'Content missing' })
  }
  if (!userId) {
    return response.status(400).json({ error: 'UserId missing' })
  }

  const recipientUser = await User.findOne({ '_id': recipientUserId})
  const senderUser = await User.findOne({ '_id': userId })

  if (!recipientUser) {
    return response.status(400).json({ error: 'Recipient user not found' })
  }

  const msg = new Message({
    message,
    senderUser: userId,
    recipientUser: recipientUserId,
    announcementId,
  })
  const savedMessage = await msg.save()

  recipientUser.receivedMessages = recipientUser.receivedMessages.concat(savedMessage._id)
  senderUser.sendedMessages = senderUser.sendedMessages.concat(savedMessage._id)
  await recipientUser.save()
  await senderUser.save()

  response.status(200).json({ savedMessage, message: 'Message saved and sended' })
})

module.exports = messageRouter