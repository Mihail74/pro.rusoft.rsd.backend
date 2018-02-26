module.exports = {}

const imageConvertors = require('./image')
const walletConvertors = require('./wallets')
const withdrawalsConvertors = require('./withdrawals')
const depositsConvertors = require('./deposits')
const projectsConvertors = require('./projects')

const makeUserShort = user => user == null ? null : ({
  id: user._id,
  email: user.email,
  name: user.name,
  avatar: imageConvertors.makeImageShort(user.avatar)
})

const makeUserModel = async user => user == null ? null : ({
  descriptor: makeUserShort(user),
  projects: !user.projects ? [] : await Promise.all(user.projects.map(projectsConvertors.makeProjectShort)),
  investingWallet: walletConvertors.makeWalletShort(user.investingWallet),
  personalWallet: walletConvertors.makeWalletShort(user.personalWallet),
  deposites: !(user.investingWallet && user.investingWallet.deposites)
    ? []
    : await Promise.all(user.investingWallet.deposites.map(depositsConvertors.makeTransferDepositShort)),
  withdrawals: !(user.personalWallet && user.personalWallet.withdrawals)
    ? []
    : await Promise.all(user.personalWallet.withdrawals.map(withdrawalsConvertors.makeTransferWithdrawalShort))
})

Object.assign(module.exports, {
  makeUserShort,
  makeUserModel
})
