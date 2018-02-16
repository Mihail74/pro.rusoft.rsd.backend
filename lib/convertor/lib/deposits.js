module.exports = {}

const projectsConvertors = require('./projects')
const transactionsConvertors = require('./transactions')

const makeTransferDepositShort = async deposit => deposit == null ? null : ({
  id: deposit._id,
  project: await projectsConvertors.makeProjectShort(deposit.project),
  transfer: transactionsConvertors.makeBlockchainTransactionShort(deposit.transfer)
})

Object.assign(module.exports, {
  makeTransferDepositShort
})
