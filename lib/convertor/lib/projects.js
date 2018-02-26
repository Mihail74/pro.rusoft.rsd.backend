module.exports = {}

const services = requireRoot('lib/services')
const imageConvertors = require('./image')
const usersConvertors = require('./users')

const makeProjectShort = async project => {
  if (project == null) {
    return null
  }
  const info = await services.blockChainExplorer.getAddressInfo(project.address.address)

  return {
    id: project._id,
    name: project.name,
    description: project.description,
    targetValue: project.targetValue,
    thumbnail: imageConvertors.makeImageShort(project.thumbnail),
    owner: usersConvertors.makeUserShort(project.owner),
    members: project.members.map(usersConvertors.makeUserShort),
    balance: Math.round(info.balance * 1e8),
    unconfirmedBalance: Math.round(info.unconfirmedBalance * 1e8),
    createdDate: project.createdDate,
    startedDate: project.startedDate,
    dueDate: project.dueDate,
    status: project.status,
    address: project.address.address
  }
}

const makeProjectModel = project => project == null ? null : ({
  descriptor: makeProjectShort(project)
  // TODO @ipavlenko: Add stats and project details here
})

Object.assign(module.exports, {
  makeProjectShort,
  makeProjectModel
})
