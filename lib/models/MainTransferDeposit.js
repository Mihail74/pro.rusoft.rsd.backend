const keystone = require('keystone')
const Types = keystone.Field.Types

const MainTransferDeposit = new keystone.List('MainTransferDeposit', {
  map: { name: 'transfer' },
  sortable: true
})

MainTransferDeposit.add({
  transfer: { type: Types.Relationship, ref: 'BlockchainTransfer', required: true, initial: true, index: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', required: true, initial: true, index: true },
  wallet: { type: Types.Relationship, ref: 'MainWallet', required: true, initial: true, index: true, filters: { owner: ':user.objectId', type: 'INVESTING' } },
  project: { type: Types.Relationship, ref: 'MainProject', required: true, initial: true, index: true },
  createdDate: { type: Date, default: Date.now, required: true },
  objectId: { type: String, hidden: true }
})

MainTransferDeposit.schema.pre('save', async function (next) {
  this.objectId = this._id
  next()
})

MainTransferDeposit.defaultColumns = 'transfer, user, wallet, createdDate'
MainTransferDeposit.register()
