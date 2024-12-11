require('dotenv').config()

const PORT = process.env.PORT || 3001

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const OCI_URI = process.env.OCI_URI

const OCI_NAMESPACE = process.env.OCI_NAMESPACE
const OCI_BUCKETNAME = process.env.OCI_BUCKETNAME
const OCI_CONFIG = process.env.OCI_CONFIG
const OCI_ENDPOINT = process.env.OCI_ENDPOINT

const SERVER_URL = process.env.NODE_ENV === 'dev'
  ? process.env.DEV_SERVER_URL
  : process.env.SERVER_URL

const OCI_FOLDER = process.env.NODE_ENV === 'dev'
  ? process.env.DEV_OCI_FOLDER
  : process.env.OCI_FOLDER

module.exports = {
  PORT,
  MONGODB_URI,
  OCI_URI,
  SERVER_URL,
  OCI_FOLDER,
  OCI_NAMESPACE,
  OCI_BUCKETNAME,
  OCI_CONFIG,
  OCI_ENDPOINT
}