const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    /*@swagger
    #swagger.tags = ['Users']
    #swagger.summary = 'All users profile data'
    */
    const users = await User.find({}).populate(['sendedMessages', 'receivedMessages'])
    if (users.length > 0) {
        return response.json(users)
    }
    response.status(404)

})

module.exports = usersRouter