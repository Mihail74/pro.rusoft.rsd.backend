const keystone = require('keystone')
const converters = requireRoot('./lib/convertor')
const { projects: { projectShortProjection, projectModelProjection } } = requireRoot('lib/projections')

const MainProject = keystone.list('MainProject').model
const BlockchainTransaction = keystone.list('BlockchainTransaction').model
const MainTransferDeposit = keystone.list('MainTransferDeposit').model

/**
 * Сервис для работы с проектами
 */
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

  get addressProvider () {
    return this.applicationContext.addressProvider
  }

  get cloudinary () {
    return this.applicationContext.cloudinary
  }

  async loadProjectsList (selector) {
    let projects = await MainProject
      .find(selector)
      .populate(projectShortProjection)
      .exec()

    return Promise.all(projects.map(async project => converters.projects.makeProjectShort(project)))
  }

  async loadProjectDetailsShort (selector) {
    let project = await MainProject
      .findOne(selector)
      .populate(projectShortProjection)
      .exec()

    return converters.projects.makeProjectShort(project)
  }

  async loadProjectDetails (selector) {
    const project = await MainProject
      .findOne(selector)
      .populate(projectModelProjection)
      .exec()
    return converters.projects.makeProjectModel(project)
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

  async create ({ name, description, ownerId, memberIdList, targetValue, thumbnail }) {
    const savedThumbnail = await this.cloudinary.upload(thumbnail.path, {
      public_id: `main-project/thumbnail/${thumbnail.name}`,
      use_filename: true,
      width: 512,
      height: 512
    })

    const address = await this.addressProvider.nextAddress()

    return MainProject.create({
      name,
      address,
      description,
      owner: ownerId,
      members: memberIdList,
      targetValue,
      thumbnail: savedThumbnail
    })
  }
}

module.exports = ProjectsService
