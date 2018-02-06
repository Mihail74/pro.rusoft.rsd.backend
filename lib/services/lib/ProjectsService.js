const keystone = require('keystone')
const { makeProjectShort, makeProjectModel } = requireRoot('./lib/convertor')
const { projectShortProjection, projectModelProjection } = requireRoot('lib/projections')

const MainProject = keystone.list('MainProject').model
const BlockchainTransaction = keystone.list('BlockchainTransaction').model
const MainTransferDeposit = keystone.list('MainTransferDeposit').model

class ProjectsService {
  constructor (applicationContext) {
    this.applicationContext = applicationContext
  }

  get blockChainExplorer () {
    return this.applicationContext.blockChainExplorer
  }
  get transactionProcessor () {
    return this.applicationContext.transactionProcessor
  }
  async loadProjectsList (selector) {
    let projects = await MainProject
      .find(selector)
      .populate(projectShortProjection)
      .exec()

    return Promise.all(projects.map(async project => ({
      ...(await makeProjectShort(project)),
      balance: await this.blockChainExplorer.getBalance(project.address.address)
    })))
  }

  async loadProjectDetails (selector) {
    const project = await MainProject
      .findOne(selector)
      .populate(projectModelProjection)
      .exec()
    return makeProjectModel(project)
  }

  async deposit ({ projectId, user, rawtx }) {
    await this.transactionProcessor.processTransaction(rawtx)
    const transaction = await BlockchainTransaction.findOne({ rawtx })

    return MainTransferDeposit.create({
      transfer: transaction._id,
      user: user._id,
      wallet: user.investingWallet,
      project: projectId
    })
  }
}

module.exports = ProjectsService
