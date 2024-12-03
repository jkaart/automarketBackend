const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/:id', async (request, response) => {
    const { id } = request.params
    const user = await User.findById({ '_id': id }).populate('messages')
    if (!user) {
        return response.status(404)
    }
    response.json(user)


})

module.exports = userRouter