const keystone = require('keystone')
const Types = keystone.Field.Types

const MainTransferDeposit = new keystone.List('MainTransferDeposit', {
  map: { name: 'transfer' },
  sortable: true
})

MainTransferDeposit.add({
  transfer: { type: Types.Relationship, ref: 'BlockchainTransaction', required: true, initial: true, index: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', required: true, initial: true, index: true },
  wallet: { type: Types.Relationship, ref: 'MainWallet', required: true, initial: true, index: true, filters: { owner: ':user.objectId', type: 'INVESTING' } },
  project: { type: Types.Relationship, ref: 'MainProject', required: true, initial: true, index: true },
  createdDate: { type: Date, default: Date.now, required: true },
  objectId: { type: String, hidden: true },
  amount: { type: Number, hidden: true }
})

MainTransferDeposit.schema.pre('save', async function (next) {
  this.objectId = this._id
  this.amount = 45 // Взять его через async-запрос к блокчейну
  next()
})

MainTransferDeposit.defaultColumns = 'transfer, user, wallet, project, createdDate'
MainTransferDeposit.register()
