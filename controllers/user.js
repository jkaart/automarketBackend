const userRouter = require('express').Router()
const config = require('../utils/config')
const axios = require('axios')
const User = require('../models/user')
const { Car } = require('../models/car')
const { auth, checkUserRole } = require('../utils/middleware')
const getOCIAuthHeaders = require('../utils/oci')

userRouter.get('/', auth, async (request, response) => {
  /*@swagger
    #swagger.tags = ['User']
    #swagger.summary = 'Single user profile data'
    #swagger.security = [{"bearerAuth": []}]
    */
  const id = request.user.id
  const user = await User.findById({ '_id': id })
    .populate({ path: 'announcements', select: 'announcementType mark model mileage price onActive createdDate', sort: { 'createdDate': 1 } })

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
  const announcements = await Car.find({ _id: deletedUser.announcements })

  for (const announcement of announcements) {
    if (Object.keys(announcement.photoFileNames).length > 0) {
      announcement.photoFileNames.map(async fileName => {
        const objectName = `${config.OCI_FOLDER}/${fileName}`
        const httpRequest = await getOCIAuthHeaders(objectName)

        const result = await axios.delete(httpRequest.uri, { headers: Object.fromEntries(httpRequest.headers) })
        return result
      })
    }
  }
  const announcementIds = announcements.map(announcement => announcement._id)
  await Car.deleteMany({_id: {$in: announcementIds}})

  response.status(204).end()
})

module.exports = userRouter