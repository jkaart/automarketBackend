const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})

const doc = {
    info: {
        title: 'Automarketti API',
        description: 'Automarketti site API',
    },
    servers: [
        {
            url: 'http://localhost:3001',
            description: ''
        },
        {
            url: "https://automarketbackend.onrender.com",
            description: ''
        }
    ],
    tags: [
        {
            name: 'Item',
            description: 'Individual announcement endpoints'
        },
        {
            name: 'Items',
            description: 'All announcements endpoints'
        }
    ],
    components: {
        schemas: {
            Item: {
                $mark: 'Volvo',
                $model: 'V70',
                $fuelType: 'Diesel',
                $mileage: 120_000,
                $gearBoxType: 'Manual',
                $description: 'Hyvä auto'
            }
        }
    }
}

const outputFile = './docs/swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)