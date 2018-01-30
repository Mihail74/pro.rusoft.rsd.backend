const SecurityService = require('./lib/SecurityService')
const ProfilesService = require('./lib/ProfilesService')
const ProjectsService = require('./lib/ProjectsService')
const TransactionProcessor = require('./lib/TransactionProcessor')
const TransactionParser = require('./lib/TransactionParser')
const BlockObserver = require('./lib/BlockObserver')
const BlockChainExplorer = require('./lib/BlockChainExplorer')
const NotificationService = require('./lib/NotificationService')
const applicationContext = {}

module.exports = Object.assign(applicationContext, {
  securityService: new SecurityService(),
  profilesService: new ProfilesService(),
  projectsService: new ProjectsService(),
  transactionProcessor: new TransactionProcessor(applicationContext),
  blockObserver: new BlockObserver(applicationContext).start(),
  transactionParser: new TransactionParser(applicationContext),
  blockChainExplorer: new BlockChainExplorer(applicationContext),
  notificationService: new NotificationService(applicationContext).start()
})
