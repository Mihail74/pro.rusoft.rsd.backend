module.exports = {}

const projectsConvertors = require('./projects')
const transactionsConvertors = require('./transactions')

const makeTransferWithdrawalShort = async withdrawal => withdrawal == null ? null : ({
  id: withdrawal._id,
  project: await projectsConvertors.makeProjectShort(withdrawal.project),
  transfer: transactionsConvertors.makeBlockchainTransactionShort(withdrawal.transfer)
})

Object.assign(module.exports, {
  makeTransferWithdrawalShort
})
