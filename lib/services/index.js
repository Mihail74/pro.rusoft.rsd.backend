const SecurityService = require('./lib/SecurityService')
const ProfilesService = require('./lib/ProfilesService')
const ProjectsService = require('./lib/ProjectsService')

module.exports = {
  securityService: new SecurityService(),
  profilesService: new ProfilesService(),
  projectsService: new ProjectsService()
}
