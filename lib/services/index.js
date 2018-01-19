const SecurityService = require('./lib/SecurityService')
const ProjectsService = require('./lib/ProjectsService')

module.exports = {
  securityService: new SecurityService(),
  projectsService: new ProjectsService()
}
