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

  const res = await axios.get(`${config.OCI_URI}/${config.OCI_FOLDER}/${fileName}`, { responseType: 'arraybuffer' })

  const size = orgFileName.startsWith('thumb_')
    ? { width: 300, height: 225 }
    : { width: 1024, height: 768 }

  const buffer = Buffer.from(res.data, 'binary')
  const output = sharp(buffer)
    .resize({
      width: size.width,
      height: size.height,
      fit: 'cover',
      position: 'centre',
    })

  return await pipeline(output, response)
})

module.exports = photoRouter