const keystone = require('keystone')
const { makeProjectShort, makeProjectModel } = requireRoot('./lib/convertor')
// const config = require('config')
// const { WebError } = requireRoot('lib/errors')
const { projectShortProjection, projectModelProjection } = requireRoot('lib/projections')

const MainProject = keystone.list('MainProject').model

class ProjectsService {
  constructor (applicationContext) {
    this.applicationContext = applicationContext
  }

  get blockChainExplorer () {
    return this.applicationContext.blockChainExplorer
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
}

module.exports = ProjectsService
