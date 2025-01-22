const usersRouter = require('express').Router()
const User = require('../models/user')
const { auth, checkUserRole } = require('../utils/middleware')

usersRouter.get('/:index', auth, checkUserRole(['admin']), async (request, response) => {
  /*@swagger
    #swagger.tags = ['Users']
    #swagger.summary = 'All users profile data'
    #swagger.security = [{
      "bearerAuth": []
    }]
    */
  const index = request.params.index

  const users = await User.find({})
    .sort({ 'registrationDate': 1 })
    .skip(index * 10)
    .limit(10)

  if (users.length === 0) {
    return response.status(404).end()
  }
  response.json(users)
})

module.exports = usersRouter