const applicationContext = {}

module.exports = applicationContext

const SecurityService = require('./lib/SecurityService')
const ProfilesService = require('./lib/ProfilesService')
const ProjectsService = require('./lib/ProjectsService')
const TransactionProcessor = require('./lib/TransactionProcessor')
const TransactionParser = require('./lib/TransactionParser')
const BlockObserver = require('./lib/BlockObserver')
const BlockChainExplorer = require('./lib/BlockChainExplorer')
const NotificationService = require('./lib/NotificationService')
const AddressService = require('./lib/AddressService')
const FaucetService = require('./lib/FaucetService')
const AddressProvider = require('./lib/AddressProvider')
const Cloudinary = require('./lib/Cloudinary')

Object.assign(applicationContext, {
  securityService: new SecurityService(),
  profilesService: new ProfilesService(),
  projectsService: new ProjectsService(applicationContext),
  transactionProcessor: new TransactionProcessor(applicationContext),
  blockObserver: new BlockObserver(applicationContext),
  transactionParser: new TransactionParser(applicationContext),
  blockChainExplorer: new BlockChainExplorer(applicationContext),
  notificationService: new NotificationService(applicationContext),
  addressService: new AddressService(applicationContext),
  faucetService: new FaucetService(applicationContext),
  addressProvider: new AddressProvider(applicationContext),
  cloudinary: new Cloudinary(applicationContext)
})

applicationContext.blockObserver.start()
applicationContext.notificationService.start()
applicationContext.addressProvider.init()
applicationContext.cloudinary.init()
