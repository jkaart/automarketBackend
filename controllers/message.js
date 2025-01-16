const messageRouter = require('express').Router()
const { Message, Topic } = require('../models/message')
const User = require('../models/user')
const { auth } = require('../utils/middleware')

messageRouter.post('/', auth, async (request, response) => {
  /*@swagger
    #swagger.tags = ['User']
    #swagger.summary = 'Messages between users'
  */

  const senderUser = request.user
  let recipientUserId = request.body.recipientUserId
  const { message, announcementId, topicId } = request.body

  if (!message || message.length === 0) {
    return response.status(400).json({ error: 'message missing' })
  }

  let topic = null

  if (topicId === 'undefined' || topicId === null) {
    if (!recipientUserId) {
      return response.status(400).json({ error: 'recipientUserId missing' })
    }
    if (!announcementId) {
      return response.status(400).json({ error: 'announcementId missing' })
    }
    topic = new Topic({
      announcement: announcementId,
      senderUser: senderUser._id,
      recipientUser: recipientUserId,
    })
    const savedTopic = await topic.save()
    senderUser.sendedMessages = senderUser.sendedMessages.concat(savedTopic.id)
    await senderUser.save()
    const recipientUser = await User.findById(recipientUserId)
    recipientUser.receivedMessages = recipientUser.receivedMessages.concat(savedTopic.id)
    await recipientUser.save()
  }
  else {
    topic = await Topic.findById(topicId)
    if (!topic) {
      return response.status(400).json({ error: 'Topic not found' })
    }
  }

  if (recipientUserId) {
    const userExists = await User.exists({ '_id': recipientUserId })
    if (!userExists) {
      return response.status(400).json({ error: 'Recipient user not found' })
    }
  }
  else {
    recipientUserId = topic.recipientUser
  }

  const msg = new Message({
    message,
    topic: topic.id,
    senderUser: senderUser.id,
    recipientUser: recipientUserId
  })

  const savedMessage = await msg.save()

  topic.messages = topic.messages.concat(savedMessage.id)
  await topic.save()
  response.status(200).json({ message: 'Message saved and sended' })
})

messageRouter.get('/topics/:index', auth, async (request, response) => {
  const index = request.params.index
  const totalCount = await Topic.find({ $or: [{ recipientUser: request.user.id }, { senderUser: request.user.id }] }).countDocuments()
  if (totalCount === 0) {
    return response.status(204).end()
  }
  const topics = await Topic.find({ $or: [{ recipientUser: request.user.id }, { senderUser: request.user.id }] })
    .sort({ 'sendDate': -1 })
    .skip(index * 10)
    .limit(10)
    .populate({ path: 'recipientUser', select: '-_id username' })
    .populate({ path: 'senderUser', select: '-_id username' })
    .populate({ path: 'announcement', select: '-_id announcementType mark model mileage price' })

  const result = {topics, totalCount}
  response.json(result)
})

messageRouter.get('/topics/:id/:index', auth, async (request, response) => {
  const { id, index } = request.params
  const user = request.user
  if (!user.sendedMessages.includes(id) && !user.receivedMessages.includes(id)) {
    return response.status(403).json({ message: 'Access denied. No permissions.' })
  }
  const rawMessages = await Message.find({ 'topic': id })
    .select('-_id message sendDate')
    .sort({ 'sendDate': -1 })
    .skip(index * 10)
    .limit(10)
    .populate({ path: 'senderUser', select: '-_id username' })
    .lean()

  const messages = rawMessages.map(element => ({
    senderUser: element.senderUser?.username || null,
    message: element.message,
    sendDate: element.sendDate,
  }))

  if (messages.length === 0) {
    return response.status(204).end()
  }

  response.json(messages)
})

module.exports = messageRouter