const { makeUserShort, makeWalletShort, makeProjectShort, makeTransferDepositShort, makeTransferWithdrawalShort } = require('./shorts')

const makeUserModel = user => user == null ? null : ({
  descriptor: makeUserShort(user),
  projects: !user.projects ? [] : user.projects.map(makeProjectShort),
  investingWallet: makeWalletShort(user.investingWallet),
  personalWallet: makeWalletShort(user.personalWallet),
  deposites: !(user.investingWallet && user.investingWallet.deposites) ? [] : user.investingWallet.deposites.map(makeTransferDepositShort),
  withdrawals: !(user.personalWallet && user.personalWallet.withdrawals) ? [] : user.personalWallet.withdrawals.map(makeTransferWithdrawalShort)
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
