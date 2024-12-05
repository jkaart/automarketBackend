const registrationRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

registrationRouter.post('/', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Users']
    #swagger.summary = "User registration"
    */
  const { username, password } = request.body
  if (!password) {
    return response.status(400).json({ error: 'Password missing' })
  }
  if (password.length < 8) {
    return response.status(422).json({ error: 'Password is too short. Min length is 8 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash
  })

  const savedUser = await user.save()

  response
    .status(201)
    .json({ savedUser, message: 'User registered successfully' })

})

module.exports = registrationRouter
