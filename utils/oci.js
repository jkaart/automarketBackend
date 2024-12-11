const config = require('./config')
const common = require('oci-common')

const configurationFilePath = config.OCI_CONFIG
const configProfile = 'DEFAULT'

const provider = new common.ConfigFileAuthenticationDetailsProvider(
  configurationFilePath,
  configProfile
)

const getOCIAuthHeaders = async (objectName) => {
  const signer = new common.DefaultRequestSigner(provider)
  const httpRequest = {
    uri: `${config.OCI_ENDPOINT}/n/${config.OCI_NAMESPACE}/b/${config.OCI_BUCKETNAME}/o/${objectName}`,
    headers: new Headers(),
    method: 'DELETE',
  }
  await signer.signHttpRequest(httpRequest)

  return httpRequest
}





module.exports = getOCIAuthHeaders