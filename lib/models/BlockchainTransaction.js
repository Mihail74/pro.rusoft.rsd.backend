const keystone = require('keystone')
const Types = keystone.Field.Types

const BlockchainTransaction = new keystone.List('BlockchainTransaction', {
  map: { name: 'txId' },
  sortable: true
})

BlockchainTransaction.add({
  txId: { type: String, initial: true, required: true },
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
    default: 'SIMPLE',
    options: [
      { value: 'SIMPLE', label: 'Simple' },
      { value: 'MULTISIG', label: 'MultiSig' }
    ]
  },
  objectId: { type: String, hidden: true }
})

BlockchainTransaction.schema.pre('save', async function (next) {
  this.objectId = this._id
  next()
})

BlockchainTransaction.defaultColumns = 'txId, type, status'
BlockchainTransaction.register()
