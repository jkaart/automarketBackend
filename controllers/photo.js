const photoRouter = require('express').Router()
const axios = require('axios')
const config = require('../utils/config')
const { pipeline } = require('node:stream/promises')

photoRouter.get('/:fileName', async (request, response) => {
  /*@swagger
   #swagger.tags = ['Item']
   #swagger.summary = 'Announcement photos download'
   #swagger.parameters['fileName'] = {
    description:'Requested photo filename'
   }
   #swagger.responses[200] = {
        description: 'Requested photo',
        content: {
            'image/jpeg':{
                type: 'object',
                properties: {
                    type:'file'
                }
            }
        }
   }
   */
  const { fileName } = request.params

  const { data } = await axios.get(`${config.OCI_URI}/${config.OCI_FOLDER}/${fileName}`, { responseType: 'stream' })


  await pipeline(data, response)
})

module.exports = photoRouter