const { projectShortProjection } = require('./shorts')

const investingWalletProjection = [
  {
    path: 'deposites',
    populate: [
      { path: 'project', populate: projectShortProjection },
      { path: 'transfer' }
    ]
  }
]

const personalWalletProjection = [
  {
    path: 'deposites',
    populate: [
      { path: 'project', populate: projectShortProjection },
      { path: 'transfer' }
    ]
  }
]

const userModelProjection = [
  { path: 'investingWallet', populate: investingWalletProjection },
  { path: 'personalWallet', populate: personalWalletProjection },
  { path: 'projects', populate: projectShortProjection }
]

const projectModelProjection = [
  { path: 'owner' },
  { path: 'members' }
]

module.exports = {
  userModelProjection,
  projectModelProjection
}
