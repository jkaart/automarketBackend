const photoRouter = require('express').Router()
const axios = require('axios')
const config = require('../utils/config')

photoRouter.get('/:fileName', async (request, response) => {
    const { fileName } = request.params

    const { data } = await axios.get(`${config.OCI_URI}/${fileName}`, { responseType: "stream" })
    data.pipe(response)
})

module.exports = photoRouter