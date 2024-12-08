const photoRouter = require('express').Router()
const axios = require('axios')
const config = require('../utils/config')
const { pipeline } = require('node:stream/promises')
const sharp = require('sharp')

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
  const orgFileName = request.params.fileName
  const fileName = orgFileName.replace('thumb_', '')

  const responseType = orgFileName.startsWith('thumb_')
    ? 'arraybuffer'
    : 'stream'

  const res = await axios.get(`${config.OCI_URI}/${config.OCI_FOLDER}/${fileName}`, { responseType: responseType })

  if (orgFileName.startsWith('thumb_')) {
    const buffer = Buffer.from(res.data, 'binary')
    const output = sharp(buffer)
      .resize({ width: 300 })
    return await pipeline(output, response)
  }
  await pipeline(res.data, response)
})

module.exports = photoRouter