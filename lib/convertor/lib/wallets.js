module.exports = {}

const usersConvertors = require('./users')

const makeWalletShort = wallet => wallet == null ? null : ({
  id: wallet._id,
  address: wallet.address,
  createdDate: wallet.createdDate,
  type: wallet.type,
  user: usersConvertors.makeUserShort(wallet.user)
})

Object.assign(module.exports, {
  makeWalletShort
})
