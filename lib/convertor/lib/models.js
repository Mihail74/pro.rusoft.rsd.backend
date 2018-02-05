const { makeUserShort, makeWalletShort, makeProjectShort, makeTransferDepositShort, makeTransferWithdrawalShort } = require('./shorts')

const makeUserModel = async user => user == null ? null : ({
  descriptor: makeUserShort(user),
  projects: !user.projects ? [] : await Promise.all(user.projects.map(makeProjectShort)),
  investingWallet: makeWalletShort(user.investingWallet),
  personalWallet: makeWalletShort(user.personalWallet),
  deposites: !(user.investingWallet && user.investingWallet.deposites) ? [] : await Promise.all(user.investingWallet.deposites.map(makeTransferDepositShort)),
  withdrawals: !(user.personalWallet && user.personalWallet.withdrawals) ? [] : await Promise.all(user.personalWallet.withdrawals.map(makeTransferWithdrawalShort))
  // TODO @ipavlenko: Add stats and project details here
})

const makeProjectModel = project => project == null ? null : ({
  descriptor: makeProjectShort(project)
  // TODO @ipavlenko: Add stats and project details here
})

module.exports = {
  makeUserModel,
  makeProjectModel
}
