module.exports = {}

const makeBlockchainTransactionShort = transaction => transaction == null ? null : ({
  id: transaction._id,
  hash: transaction.hash,
  createdDate: transaction.createdDate,
  status: transaction.status,
  type: transaction.type,
  inputAddresses: transaction.inputAddresses,
  outputAddresses: transaction.outputAddresses
})

Object.assign(module.exports, {
  makeBlockchainTransactionShort
})
