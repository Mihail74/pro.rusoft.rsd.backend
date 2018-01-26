const keystone = require('keystone')
const Types = keystone.Field.Types

const MainTransferWithdrawal = new keystone.List('MainTransferWithdrawal', {
  map: { name: 'transfer' },
  sortable: true
})

MainTransferWithdrawal.add({
  transfer: { type: Types.Relationship, ref: 'BlockchainTransfer', required: true, initial: true, index: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', required: true, initial: true, index: true },
  wallet: { type: Types.Relationship, ref: 'MainWallet', required: true, initial: true, index: true, filters: { owner: ':user', type: 'PERSONAL' } },
  project: { type: Types.Relationship, ref: 'MainProject', required: true, initial: true, index: true },
  createdDate: { type: Date, default: Date.now, required: true },
  objectId: { type: String, hidden: true }
})

MainTransferWithdrawal.schema.pre('save', async function (next) {
  this.objectId = this._id
  next()
})

MainTransferWithdrawal.defaultColumns = 'transfer, user, wallet, createdDate'
MainTransferWithdrawal.register()
