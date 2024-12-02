require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const OCI_URI = process.env.NODE_ENV === 'dev'
    ? process.env.DEV_OCI_URI
    : process.env.OCI_URI

const SERVER_URL = process.env.NODE_ENV === 'dev'
    ? process.env.DEV_SERVER_URL
    : process.env.SERVER_URL

module.exports = {
    PORT,
    MONGODB_URI,
    OCI_URI,
    SERVER_URL,
}