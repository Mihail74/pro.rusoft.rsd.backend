const keystone = require('keystone')

const PlatformAddress = new keystone.List('PlatformAddress', {
  map: { name: 'address' },
  sortable: true
})

PlatformAddress.add({
  index: { type: Number, required: true, initial: true },
  address: { type: String, required: true, initial: true },
  objectId: { type: String, hidden: true }
})

PlatformAddress.schema.pre('save', async function (next) {
  this.objectId = this._id
  next()
})

PlatformAddress.defaultColumns = 'address, index'
PlatformAddress.register()
