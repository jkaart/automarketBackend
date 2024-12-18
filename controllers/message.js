const messageRouter = require('express').Router()
const { Messages } = require('../models/message')
const User = require('../models/user')
const { auth } = require('../utils/middleware')
const mongoose = require('mongoose')

messageRouter.post('/', auth, async (request, response) => {
  /*@swagger
    #swagger.tags = ['User']
    #swagger.summary = 'Messages between users'
    */

  const senderUser = request.user
  const { message, recipientUserId, announcementId, announcementType } = request.body

  if (!message || message.length === 0) {
    return response.status(400).json({ error: 'message missing' })
  }
  if (!recipientUserId) {
    return response.status(400).json({ error: 'recipientUserId missing' })
  }
  if (!announcementId) {
    return response.status(400).json({ error: 'announcementId missing' })
  }
  if (!announcementType) {
    return response.status(400).json({ error: 'announcementType missing' })
  }
  const recipientUser = await User.findById(recipientUserId)

  if (!recipientUser) {
    return response.status(400).json({ error: 'Recipient user not found' })
  }

  const msg = new Messages({
    message,
    senderUser: senderUser.id,
    recipientUser: recipientUserId,
    announcementId,
    announcementType,
  })

  const savedMessage = await msg.save()
  recipientUser.receivedMessages = recipientUser.receivedMessages.concat(savedMessage._id)
  senderUser.sendedMessages = senderUser.sendedMessages.concat(savedMessage._id)

  await recipientUser.save()
  await senderUser.save()

  response.status(200).json({ message: 'Message saved and sended' })
})

messageRouter.get('/', auth, async (request, response) => {
  console.log(request.user.id)
  const messages = await Messages.aggregate([
    {
      '$match': {
        '$or': [
          {
            'senderUser': request.user._id
          }, {
            'recipientUser': request.user._id
          }
        ]
      }
    }, {
      '$addFields': {
        'messageType': {
          '$cond': [
            {
              '$eq': [
                '$senderId', request.user._id
              ]
            }, 'sent', 'received'
          ]
        }
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'recipientUser',
        'foreignField': '_id',
        'as': 'recipientUser'
      }
    }, {
      '$lookup': {
        'from': 'sellcars',
        'localField': 'announcementId',
        'foreignField': '_id',
        'as': 'announcement'
      }
    }, {
      '$addFields': {
        'recipientUser': {
          '$arrayElemAt': [
            '$recipientUser.username', 0
          ]
        }
      }
    }, {
      '$addFields': {
        'announcement': {
          '$arrayElemAt': [
            '$announcement', 0
          ]
        }
      }
    }, {
      '$addFields': {
        'date': {
          '$dateToString': {
            'format': '%Y-%m-%d',
            'date': '$sendDate'
          }
        }
      }
    }, {
      '$group': {
        '_id': {
          'messageType': '$messageType',
          'recipientUser': '$recipientUser',
          'announcement': '$announcementId',
          'date': '$date'
        },
        'messages': {
          '$push': '$message'
        },
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$sort': {
        '_id.messageType': 1,
        '_id.date': 1
      }
    }
  ])
  console.log(messages)

  if (messages.length === 0) {
    return response.status(204).end()
  }

  response.json(messages)
})

messageRouter.get('/received', auth, async (request, response) => {
  const messages = await Messages.find({ 'receiverUser': request.user.id })
    .populate({ path: 'recipientUser', select: 'username' })
    .populate({ path: 'senderUser', select: 'username' })

  console.log(messages)
  if (messages.length === 0) {
    return response.status(204).end()
  }

  response.json(messages)
})


module.exports = messageRouter