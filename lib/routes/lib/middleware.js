const { securityService } = requireRoot('lib/services')
const { WebError } = requireRoot('lib/errors')

function responseUnauthorize (res) {
  res.status(401).send('Unauthorization')
}

exports.authenticate = (scopes) => {
  return function (req, res, next) {
    if (req.headers.authorization == null) {
      return responseUnauthorize(res)
    }
    securityService.token({ token: req.headers.authorization })
      .then(token => {
        if (token == null) {
          return responseUnauthorize(res)
        }
        req.token = token
        next()
      })
      .catch(e => {
        return responseUnauthorize(res)
      })
  }
}

exports.initLocals = function (req, res, next) {
  // res.locals.user = req.user
  next()
}

// Forced to have 4 arguments due to express convension about error handlers
// eslint-disable-next-line
exports.errorHandler = function (err, req, res, next) {
  // eslint-disable-next-line
  console.log(err)
  const status = (err instanceof WebError)
    ? err.status
    : 500
  res.status(status).send('error', { error: err })
}
