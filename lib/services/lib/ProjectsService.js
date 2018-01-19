const keystone = require('keystone')
const { makeProjectShort, makeProjectModel } = requireRoot('./lib/convertor')
// const config = require('config')
// const { WebError } = requireRoot('lib/errors')
const { projectShortProjection, projectModelProjection } = requireRoot('lib/projections')

const MainProject = keystone.list('MainProject').model

class ProjectsService {
  async loadProjectsList (selector) {
    const projects = await MainProject
      .find(selector)
      .populate(projectShortProjection)
      .exec()
    return projects.map(makeProjectShort)
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
