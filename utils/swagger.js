const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})

const doc = []

const outputFile = './docs/swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)