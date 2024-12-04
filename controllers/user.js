const userRouter = require('express').Router()
const User = require('../models/user')
const { auth } = require('../utils/middleware')

userRouter.get('/', auth, async (request, response) => {
    /*@swagger
    #swagger.tags = ['User']
    #swagger.summary = 'Single user profile data'
    */
    const id = request.user.id
    const user = await User.findById({ '_id': id }).populate(['sendedMessages', 'receivedMessages'])
    if (!user) {
        return response.status(404)
    }
    response.json(user)


})

module.exports = userRouter