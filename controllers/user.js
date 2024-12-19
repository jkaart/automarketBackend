const userRouter = require('express').Router()
const User = require('../models/user')
const { auth, checkUserRole } = require('../utils/middleware')

userRouter.get('/', auth, async (request, response) => {
  /*@swagger
    #swagger.tags = ['User']
    #swagger.summary = 'Single user profile data'
    #swagger.security = [{"bearerAuth": []}]
    */
  const id = request.user.id
  const user = await User.findById({ '_id': id })

  if (!user) {
    return response.status(404).end()
  }
  response.json(user)

})

userRouter.delete('/:id', auth, checkUserRole(['admin']), async (request, response) => {
  /*@swagger
    #swagger.tags = ['User']
    #swagger.summary = 'Delete single user profile and all user announcements'
    #swagger.security = [{"bearerAuth": []}]
    */
  const userId = request.params.id
  const deletedUser = await User.findByIdAndDelete(userId)
  if (!deletedUser) {
    return response.status(404).end()
  }
  response.status(204).end()

})

module.exports = userRouter