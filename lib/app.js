const path = require('path')
const keystone = require('keystone')
const config = require('config')

function createApp (options) {
  keystone.init({
    'name': 'pro.rusoft.rsd.backend',
    'brand': 'Admin Panel',
    'mongo': config.get('storage.url'),
    'static': ['public'],
    'favicon': 'public/favicon.ico',
    'signin logo': '/logo.png', // relative to public directory
    'module root': path.join(__dirname, '../'),
    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'SecurityUser',
    'cookie secret': config.get('keystone.cookieSecret'),
    'cloudinary config': config.get('cloudinary.url'),
    'cloudinary folders': true,
    ...options
  })

  keystone.import('lib/models')

  keystone.set('cors allow origin', true)

  keystone.set('routes', require('./routes'))

  keystone.set('nav', {
    structure: ['main-projects', 'main-wallets', 'main-transfer-deposits', 'main-transfer-withdrawals'],
    blockchain: ['blockchain-transactions'],
    security: ['security-users', 'security-clients', 'security-tokens', 'security-invites', 'security-checks']
  })

  keystone.stop = function () {
    keystone.httpServer.close()
    keystone.mongoose.connection.close()
  }

  return keystone
}

exports = module.exports = {
  createApp
}
