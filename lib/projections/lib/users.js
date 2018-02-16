const projectProection = require('./projects')

module.exports = {}

const investingWalletProjection = [
  {
    path: 'deposites',
    populate: [
      { path: 'project', populate: projectProection.projectShortProjection },
      { path: 'transfer' }
    ]
  }
]

const personalWalletProjection = [
  {
    path: 'withdrawals',
    populate: [
      { path: 'project', populate: projectProection.projectShortProjection },
      { path: 'transfer' }
    ]
  }
]

const userModelProjection = [
  { path: 'investingWallet', populate: investingWalletProjection },
  { path: 'personalWallet', populate: personalWalletProjection },
  { path: 'projects', populate: projectProection.projectShortProjection }
]

Object.assign(module.exports, {
  userModelProjection
})
