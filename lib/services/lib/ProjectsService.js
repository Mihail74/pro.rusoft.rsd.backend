const keystone = require('keystone')
const { makeProjectShort, makeProjectModel } = requireRoot('./lib/convertor')
// const config = require('config')
// const { WebError } = requireRoot('lib/errors')
const { projectShortProjection, projectModelProjection } = requireRoot('lib/projections')

const MainProject = keystone.list('MainProject').model
const MainTransferDeposit = keystone.list('MainTransferDeposit').model
const MainTransferWithdrawal = keystone.list('MainTransferWithdrawal').model

class ProjectsService {
  async loadProjectsList (selector) {
    let projects = await MainProject
      .find(selector)
      .populate(projectShortProjection)
      .exec()

    const projectsTotalDeposites = await MainTransferDeposit
      .aggregate()
      .cursor({ batchSize: 2500 })
      .lookup({ from: MainProject.collection.name, localField: 'project', foreignField: '_id', as: 'project' })
      .unwind('project')
      // .match({ 'project.curators': { $in: [user._id] } }) // Тут был бы фильтр по прроектам, если бы нужно было только проекты конкретного пользователя
      .group({ _id: '$project._id', totalDeposites: { $sum: '$amount' } })
      .exec()
      .toArray()

    const projectsTotalDepositesMap = projectsTotalDeposites.reduce((m, entry) => ({
      ...m,
      [entry._id]: entry.totalDeposites
    }), {})

    const projectsTotalWithdrawals = await MainTransferWithdrawal
      .aggregate()
      .cursor({ batchSize: 2500 })
      .lookup({ from: MainProject.collection.name, localField: 'project', foreignField: '_id', as: 'project' })
      .unwind('project')
      // .match({ 'project.curators': { $in: [user._id] } }) // Тут был бы фильтр по прроектам, если бы нужно было только проекты конкретного пользователя
      .group({ _id: '$project._id', totalWithdrawals: { $sum: '$amount' } })
      .exec()
      .toArray()

    const projectsTotalWithdrawalsMap = projectsTotalWithdrawals.reduce((m, entry) => ({
      ...m,
      [entry._id]: entry.totalWithdrawals
    }), {})

    return projects.map(project => ({
      ...makeProjectShort(project),
      totalDeposites: projectsTotalDepositesMap[project._id] || 0,
      totalWithdrawals: projectsTotalWithdrawalsMap[project._id] || 0
    }))
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
