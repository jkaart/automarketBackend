require('dotenv').config()

const PORT = process.env.PORT || 3001

const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const OCI_URI = process.env.NODE_ENV === 'dev'
    ? process.env.DEV_OCI_URI
    : process.env.OCI_URI

const SERVER_URL = process.env.NODE_ENV === 'dev'
    ? process.env.DEV_SERVER_URL
    : process.env.SERVER_URL

const OCI_FOLDER = process.env.MODE_ENV === 'dev'
    ? process.env.DEV_OCI_FOLDER
    : process.env.OCI_FOLDER

module.exports = {
    PORT,
    MONGODB_URI,
    OCI_URI,
    SERVER_URL,
    OCI_FOLDER,
}