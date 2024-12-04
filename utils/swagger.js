const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' })

const doc = {
    info: {
        title: 'Automarketti API',
        description: 'Automarketti site API',
    },
    servers: [
        {
            url: "https://automarketbackend.onrender.com",
            description: 'Production server'
        },
        {
            url: 'http://localhost:3001',
            description: 'Testing server'
        },
    ],
    tags: [
        {
            name: 'Item',
            description: 'Individual announcement endpoints'
        },
        {
            name: 'Items',
            description: 'All announcements endpoints'
        },
        {
            name: 'Users',
            description: 'Users endpoints'
        },
        {
            name: 'User',
            description: 'User profile endpoints'
        }
    ],
    components: {
        schemas: {
            Item: {
                mark: { type: 'string'},
                model: { type: 'string'},
                fuelType: { type: 'string'},
                mileage: { type: 'number'},
                gearBoxType: { type: 'string'},
                price: { type: 'number'},
                description: { type: 'string'},
                photos: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            },
            User: {
                name: { type: 'string'},
                password: { type: 'string'},
            }
        }
    }
}

const outputFile = './docs/swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)