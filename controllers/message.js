const messageRouter = require('express').Router()
const Message = require('../models/message')
const User = require('../models/user')
const { auth } = require('../utils/middleware')

messageRouter.post('/', auth, async (request, response) => {
  /*@swagger
    #swagger.tags = ['User']
    #swagger.summary = 'Messages between users'
    */

  const senderUser = request.user
  const { message, recipientUserId, announcementId } = request.body

  if (!message || message.length === 0) {
    return response.status(400).json({ error: 'Content missing' })
  }
  if (!recipientUserId) {
    return response.status(400).json({ error: 'recipientUserId missing' })
  }

  const recipientUser = await User.findById(recipientUserId)

  if (!recipientUser) {
    return response.status(400).json({ error: 'Recipient user not found' })
  }

  const msg = new Message({
    message,
    senderUser: senderUser.id,
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