const keystone = require('keystone')

const middlewareRouter = require('./lib/middleware')
const securityRouter = require('./lib/security')
const projectsRouter = require('./lib/projects')
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
  app.use('/api/v1/me', meRouter)

  app.get('/', (req, res) => {
    res.redirect('/keystone/')
  })

  restful.expose({
    BlockchainTransfer: {
      envelop: false,
      methods: ['list', 'retrieve']
    }
  }).start()

  app.use(middlewareRouter.errorHandler)
}
