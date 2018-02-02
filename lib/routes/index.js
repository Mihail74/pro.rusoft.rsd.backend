const keystone = require('keystone')

const middlewareRouter = require('./lib/middleware')
const securityRouter = require('./lib/security')
const projectsRouter = require('./lib/projects')
const profilesRouter = require('./lib/profiles')
const transactionRouter = require('./lib/transaction')
const addressRouter = require('./lib/address')
const faucetRouter = require('./lib/faucet')
const meRouter = require('./lib/me')

const restful = require('restful-keystone')(keystone, {
  root: '/api/v1'
})

keystone.pre('routes', middlewareRouter.initLocals)

exports = module.exports = function (app) {
  app.set('json spaces', 2)

  app.all('/api/v1/*', keystone.middleware.cors)

  app.options('/api/v1/*', (req, res) => {
    res.sendStatus(200)
  })

  app.use('/api/v1/security', securityRouter)
  app.use('/api/v1/projects', projectsRouter)
  app.use('/api/v1/profiles', profilesRouter)
  app.use('/api/v1/transaction', transactionRouter)
  app.use('/api/v1/address', addressRouter)
  app.use('/api/v1/faucet', faucetRouter)
  app.use('/api/v1/me', meRouter)

  app.get('/', (req, res) => {
    res.redirect('/keystone/')
  })

  restful.expose({
    BlockchainTransaction: {
      envelop: false,
      methods: ['list', 'retrieve']
    }
  }).start()

  app.use(middlewareRouter.errorHandler)
}
