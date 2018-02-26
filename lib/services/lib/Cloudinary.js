const cloudinary = require('cloudinary')
const config = require('config')
const { promisify } = require('util')

/**
 * Сервис работы с Cloundinary
 */
class Cloudinary {
  constructor (applicationContext) {
    this.applicationContext = applicationContext
  }

  init () {
    const cloudinaryConfig = config.get('cloudinary')

    cloudinary.config({
      cloud_name: cloudinaryConfig.name,
      api_key: cloudinaryConfig.key,
      api_secret: cloudinaryConfig.secret
    })
  }

  async upload (filePath, options) {
    return promisify(cloudinary.v2.uploader.upload)(filePath, options)
  }
}

module.exports = Cloudinary
