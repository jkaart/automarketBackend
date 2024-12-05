const photoRouter = require('express').Router()
const axios = require('axios')
const config = require('../utils/config')
const { pipeline } = require("node:stream/promises");

photoRouter.get('/:fileName', async (request, response) => {
    /*@swagger
   #swagger.tags = ['Item','Items']
   #swagger.summary = 'Announcement photos download'
   */
    const { fileName } = request.params

    const { data } = await axios.get(`${config.OCI_URI}/${config.OCI_FOLDER}/${fileName}`, { responseType: "stream" })


    await pipeline(data, response)
})

module.exports = photoRouter