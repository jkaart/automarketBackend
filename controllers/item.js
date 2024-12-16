const itemRouter = require('express').Router()
const multer = require('multer')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const config = require('../utils/config')
const { Car, BuyCar } = require('../models/car')
const { auth, checkUserRole } = require('../utils/middleware')
const getOCIAuthHeaders = require('../utils/oci')

const checkFileTypes = (request, file, next) => {
  const allowedMIMETypes = ['image/jpeg', 'image/jpg']

  if (!allowedMIMETypes.includes(file.mimetype)) {
    return next(new Error('Invalid file type. Only jpg image files are allowed.'), false)
  }
  next(null, true)
}

const upload =
  multer({
    limits: {
      fileSize: 1024 * 1024 * 1 // 1MB file size only
    },
    fileFilter: checkFileTypes
  })

itemRouter.post('/', auth, upload.array('photos', 3), async (request, response) => {
  /*@swagger
    #swagger.tags = ['Item']
    #swagger.summary = "Save a new car announcement"
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: 'object',
                    properties: {
                        mark: { type: 'string', example: 'Volvo', description: 'Car mark' },
                        model: { type: 'string', example: 'V70', description: 'Car model' },
                        fuelType: { type: 'string', example: 'diesel', description: 'Car fuel type' },
                        mileage: { type: 'number', example: 120000, description: 'Car mileage or odometer reading' },
                        gearBoxType: { type: 'string', example: 'manual', description: 'Car gear box type' },
                        price: { type: 'number', example: 10000, description: 'Car price' },
                        description: { type: 'string', example: 'Hyvä auto', description: 'Announcement description' },
                        photos: {
                            description: 'Car photos',
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'binary'
                            }
                        }
                    },
                    required: ['mark','model', 'fuelType', 'mileage', 'gearBoxType', 'price']
                }
            }
        }
    }
    #swagger.responses[201] = {
      description: "Response back saved car, id and message",
      content: {
        'application/json': {
          schema: { 
            type: 'object',
            properties: {
              id: {type: 'string', example: '675613089b7bd846447b9d0c', description:'Item id'},
              mark: { type: 'string', example: 'Volvo', description: 'Car mark' },
              model: { type: 'string', example: 'V70', description: 'Car model' },
              fuelType: { type: 'string', example: 'diesel', description: 'Car fuel type' },
              mileage: { type: 'number', example: 120000, description: 'Car mileage or odometer reading' },
              gearBoxType: { type: 'string', example: 'manual', description: 'Car gear box type' },
              price: { type: 'number', example: 10000, description: 'Car price' },
              description: { type: 'string', example: 'Hyvä auto', description: 'Announcement description' },
              onSale: {type: 'boolean', example: 'true', description:'Item sale status'},
              createdDate: {type: 'date', example:'2024-12-09T12:00:00.000Z', description:'Date when item is `published`'},
              photoURLs: {
                description: 'Car full size photo urls',
                type: 'array',
                format:'uri',
                example: ['https://automarketbackend.onrender.com/api/photo/7cca8e54-591f-4698-bca4-d48cc47e89f2.jpg', 'https://automarketbackend.onrender.com/api/photo/7f01860c-42b0-40c1-8ec5-432a9477f3bf.jpg'],
              },
              thumbnailURLs: {
                description: 'Car thumbnail photo urls',
                type: 'array',
                format:'uri',
                example: ['https://automarketbackend.onrender.com/api/photo/thumb_7cca8e54-591f-4698-bca4-d48cc47e89f2.jpg', 'https://automarketbackend.onrender.com/api/photo/thumb_7f01860c-42b0-40c1-8ec5-432a9477f3bf.jpg'],
              },
            }
          }
        }           
      }
    }
  */
  const user = request.user
  const { mark, model, fuelType, mileage, gearBoxType, price, description } = request.body
  /* if (!request.files) {
          return response.status(422).json('Photos missing')
      }
   */
  const storedFileNames = []

  const uploadResponses = request.files.map(async file => {
    //const orgFileExt = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
    const newFileName = uuidv4() + '.jpg'
    storedFileNames.push(newFileName)

    /* const output = await sharp(file.buffer)
      .resize({ width: 1024 })
      .toBuffer()

    const result = await axios.put(`${config.OCI_URI}/${config.OCI_FOLDER}/${newFileName}`, output, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    }) */

    const result = await axios.put(`${config.OCI_URI}/${config.OCI_FOLDER}/${newFileName}`, file.buffer,
      {
        headers: {
          'Content-Type': file.mimetype,
          'Content-Length': file.size,
        }
      }
    )
  })


  Promise.all(uploadResponses).then(async () => {
    const car = new Car({
      mark,
      model,
      fuelType,
      mileage,
      gearBoxType,
      price,
      description,
      photoFileNames: storedFileNames,
      user: user.id
    })

    const savedCar = await car.save()
    user.sellAnnouncements = user.sellAnnouncements.concat(savedCar._id)
    await user.save()

    response
      .status(201)
      .json({ savedCar, message: 'Announcement registered successfully' })
  })
})

itemRouter.post('/buy', auth, async (request, response) => {
  const { title, description } = request.body
  const user = request.user

  const announcement = new BuyCar({
    title,
    description,
    user: user.id
  })

  const savedBuyCar = await announcement.save()
  user.buyAnnouncements = user.buyAnnouncements.concat(savedBuyCar._id)
  await user.save()

  response
    .status(201)
    .populate('user', 'username')
    .json({ savedBuyCar, message: 'Announcement registered successfully' })

})

itemRouter.get('/:id', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Item']
    #swagger.summary = 'Get individual car announcement'
    #swagger.responses[200] = {
      description: "Response requested car",
      content: {
        'application/json': {
          schema: { 
            type: 'object',
            properties: {
              id: {type: 'string', example: '675613089b7bd846447b9d0c', description:'Item id'},
              mark: { type: 'string', example: 'Volvo', description: 'Car mark' },
              model: { type: 'string', example: 'V70', description: 'Car model' },
              fuelType: { type: 'string', example: 'diesel', description: 'Car fuel type' },
              mileage: { type: 'number', example: 120000, description: 'Car mileage or odometer reading' },
              gearBoxType: { type: 'string', example: 'manual', description: 'Car gear box type' },
              price: { type: 'number', example: 10000, description: 'Car price' },
              description: { type: 'string', example: 'Hyvä auto', description: 'Announcement description' },
              onSale: {type: 'boolean', example: 'true', description:'Item sale status'},
              createdDate: {type: 'date', example:'2024-12-09T12:00:00.000Z', description:'Date when item is `published`'},
              photoURLs: {
                description: 'Car full size photo urls',
                type: 'array',
                format:'uri',
                example: ['https://automarketbackend.onrender.com/api/photo/7cca8e54-591f-4698-bca4-d48cc47e89f2.jpg', 'https://automarketbackend.onrender.com/api/photo/7f01860c-42b0-40c1-8ec5-432a9477f3bf.jpg'],
              },
              thumbnailURLs: {
                description: 'Car thumbnail photo urls',
                type: 'array',
                format:'uri',
                example: ['https://automarketbackend.onrender.com/api/photo/thumb_7cca8e54-591f-4698-bca4-d48cc47e89f2.jpg', 'https://automarketbackend.onrender.com/api/photo/thumb_7f01860c-42b0-40c1-8ec5-432a9477f3bf.jpg'],
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Error message if requested sell car announcement not found',
      content: {
        'application/json': {
          schema: { 
            type: 'object',
            properties: {
              message: {type: 'string', example:'Announcement not found', description:'Message if announcement not found'}
            }
          }
        }
      }
    }
  */

  const itemId = request.params.id
  const car = await Car.findById(itemId)

  if (!car) {
    return response.status(404).json({ message: 'Announcement not found' })
  }
  response.json(car)

})

itemRouter.get('/buy/:id', async (request, response) => {
  /*@swagger
    #swagger.tags = ['Item']
    #swagger.summary = 'Get individual buy a car announcement'
    #swagger.responses[200] = {
      description: 'Response requested buy a car announcement',
        content: {
          'application/json': {
            schema: { 
              type: 'object',
              properties: {
                title: {type: 'string', example:'Hyvä auto', description: 'Announcement title'},
                description: {type:'string', example:'Hyvä ja vähän ajettu auto.', description: 'Announcement description'},
                createdDate: {type: 'date', example:'2024-12-09T12:00:00.000Z', description:'Date when item is `published`'},
              }
            }
          }
        }
    }
    #swagger.responses[404] = {
      description: 'Error message if requested buy car announcement not found',
      content: {
        'application/json': {
          schema: { 
            type: 'object',
            properties: {
              message: {type: 'string', example:'Announcement not found', description:'Message if announcement not found'}
            }
          }
        }
      }
    }
  */

  const itemId = request.params.id
  const buyCar = await BuyCar.findById(itemId)

  if (!buyCar) {
    return response.status(404).json({ message: 'Announcement not found' })
  }
  response.json(buyCar)

})

itemRouter.delete('/:id', auth, checkUserRole(['admin']), async (request, response) => {
  /*@swagger
    #swagger.tags = ['Item']
    #swagger.summary = 'Delete individual car announcement'
  */

  const itemId = request.params.id
  const deletedCar = await Car.findByIdAndDelete(itemId)
  if (!deletedCar) {
    return response.status(404).end()
  }

  const deleteResponses = deletedCar.photoFileNames.map(async fileName => {
    const objectName = `${config.OCI_FOLDER}/${fileName}`
    const httpRequest = await getOCIAuthHeaders(objectName)

    const result = await axios.delete(httpRequest.uri, { headers: Object.fromEntries(httpRequest.headers) })
  })

  Promise.all(deleteResponses).then(() => {
    response.status(204).end()
  })

})

module.exports = itemRouter