const usersRouter = require('express').Router()
const User = require('../models/user')
const { auth, checkUserRole } = require('../utils/middleware')

usersRouter.get('/', auth, checkUserRole(['admin']), async (request, response) => {
  /*@swagger
    #swagger.tags = ['Users']
    #swagger.summary = 'All users profile data'
    #swagger.security = [{
      "bearerAuth": []
    }]
    */
  const users = await User.find({}).populate(['sendedMessages', 'receivedMessages'])
  if (users.length > 0) {
    return response.json(users)
  }
  response.status(404)

})

module.exports = usersRouter