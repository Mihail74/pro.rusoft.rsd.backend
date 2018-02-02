const keystone = require('keystone')

const Address = new keystone.List('Address', {
  map: { name: 'address' },
  sortable: true
})

Address.add({
  index: { type: Number, required: true, initial: true },
  address: { type: String, required: true, initial: true },
  objectId: { type: String, hidden: true }
})

Address.schema.pre('save', async function (next) {
  this.objectId = this._id
  next()
})

Address.defaultColumns = 'address, index'
Address.register()
