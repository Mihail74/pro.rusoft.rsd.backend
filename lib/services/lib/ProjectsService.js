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

    return Promise.all(projects.map(async project => makeProjectShort(project)))
  }

  async loadProjectDetailsShort (selector) {
    let project = await MainProject
      .findOne(selector)
      .populate(projectShortProjection)
      .exec()

    return makeProjectShort(project)
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
