const itemRouter = require('express').Router()
const multer = require('multer')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const config = require('../utils/config')
const Car = require('../models/car')
const { auth } = require('../utils/middleware')

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
      #swagger.security = [{
          "bearerAuth": []
      }]
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
            "application/json": {
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
                        onSale: {type: 'boolean', example: 'true', description:'Item sale status'},
                        photos: {
                            description: 'Car photo urls',
                            type: 'array',
                            format:'uri',
                            example: ['https://automarketbackend.onrender.com/api/photo/7cca8e54-591f-4698-bca4-d48cc47e89f2.jpg', 'https://automarketbackend.onrender.com/api/photo/7f01860c-42b0-40c1-8ec5-432a9477f3bf.jpg']

                        }
                      }
                  },
              }           
          }
      }
      */
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
      photoFileNames: storedFileNames
    })

    const savedCar = await car.save()

    response
      .status(201)
      .json({ savedCar, message: 'Announcement registered successfully' })
  })
})



itemRouter.get('/:id', async (request, response) => {
  /*
          #swagger.tags = ['Item']
          #swagger.summary = 'Get individual car announcement'
      */

  const itemId = request.params.id
  const car = await Car.findById(itemId)

  if (!car) {
    return response.status(404).json({ message: 'Announcement not found' })
  }
  response.json(car)

})

itemRouter.delete('/:id', async (request, response) => {
  /*
          #swagger.tags = ['Item']
          #swagger.summary = 'Delete individual car announcement'
      */

  const itemId = request.params.id
  const deletedCar = await Car.findByIdAndDelete(itemId)
  if (!deletedCar) {
    return response.statusCode(404).end()
  }

  // TODO: Photo deleting from oracle object storage need fixing
  // const deleteResponses = deletedCar.photoFileNames.map(async fileName => {
  //     const result = await axios.delete(`${config.OCI_URI}/${fileName}`)

  //     if (result.statusCode === 404) {
  //         return
  //     }

  // })

  // Promise.all(deleteResponses).then(() => {
  //     
  // })

  response.status(204).end()


})

module.exports = itemRouter