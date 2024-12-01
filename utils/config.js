require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const OCI_PAR = process.env.OCI_PAR

const PHOTO_FOLDER = process.env.NODE_ENV === 'dev'
    ? process.env.PHOTO_FOLDER_DEV
    : process.env.PHOTO_FOLDER

module.exports = {
    PORT,
    MONGODB_URI,
    OCI_PAR,
    PHOTO_FOLDER

}