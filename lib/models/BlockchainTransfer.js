const keystone = require('keystone')
const Types = keystone.Field.Types

const BlockchainTransfer = new keystone.List('BlockchainTransfer', {
  map: { name: 'hash' },
  sortable: true
})

BlockchainTransfer.add({
  hash: { type: String, initial: true, required: true },
  rawtx: { type: Types.Textarea, initial: true, required: true, height: 150 },
  inputAddresses: { type: Types.TextArray, initial: true },
  outputAddresses: { type: Types.TextArray, initial: true },
  createdDate: { type: Date, default: Date.now, required: true },
  status: {
    type: Types.Select,
    required: true,
    initial: true,
    options: [
      { value: 'NEW', label: 'Новая' },
      { value: 'UNCONFIRMED', label: 'Отправленная' },
      { value: 'MINED', label: 'Исполненная' }
    ]
  },
  type: {
    type: Types.Select,
    required: true,
    initial: true,
    options: [
      { value: 'SIMPLE', label: 'Simple' },
      { value: 'MULTISIG', label: 'MultiSig' }
    ]
  },
  objectId: { type: String, hidden: true }
})

BlockchainTransfer.schema.pre('save', async function (next) {
  this.objectId = this._id
  next()
})

BlockchainTransfer.defaultColumns = 'hash, type, status'
BlockchainTransfer.register()
