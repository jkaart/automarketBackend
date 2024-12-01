const itemRouter = require('express').Router()
const multer = require('multer')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const config = require('../utils/config')
const Car = require('../models/car')

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

itemRouter.post('/', upload.array('file', 3), async (request, response) => {
    /*
        #swagger.tags = ['Item']
        #swagger.summary = "Save a new car announcement"
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/Item"
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "Response back saved car, id and message",
            content: {
                "application/json": {
                    schema: { 
                        $ref: "#/components/schemas/Item"
                    },
                }           
            }
        }  
    */
    const { mark, model, fuelType, mileage, gearBoxType, description } = request.body
    if (!request.files) {
        return response.status(422).json('Photos missing')
    }

    const storedFileNames = []

    const uploadResponses = request.files.map(async file => {
        const orgFileExt = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
        const newFileName = uuidv4() + orgFileExt
        storedFileNames.push(newFileName)
        const result = await axios.put(`${config.OCI_PAR}\/${config.PHOTO_FOLDER}\/${newFileName}`, file.buffer,
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
    response.status(204).end()

})

module.exports = itemRouter