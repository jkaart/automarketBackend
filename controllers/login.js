const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Users']
    #swagger.summary = 'Users login endpoint'
    #swagger.responses[200] = {
        description: 'Responses user login details in JSONWebToken',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        token: {type: 'string', example:'eyJhbGciplJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RpIiwicm9sZeI6InVzZXIiLCJpZCI6xjY3NTAxYjMzODAxNjU4MDliMjUxMzRlNSIsImlhdCI6MTczMzMwMzcwMSwiZXhwIjoxNzMzMzA3MzAxfQ.aLJeXX_VINMwL1i_n9ad0OOJflObUTZHbzQiljt01Jw'},
                    }
                }
            }
        }
    }
    
    */
  const { username, password } = request.body
  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    name: user.name,
    username: user.username,
    role: user.role,
    id: user.id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )

  response
    .status(200)
    .send({ token })
})

module.exports = loginRouter