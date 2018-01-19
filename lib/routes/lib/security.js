const express = require('express')
const { securityService } = requireRoot('lib/services')
const { WebError } = requireRoot('lib/errors')

const router = express.Router()

router.get('/me', async (req, res, next) => {
  const { authorization } = req.headers
  try {
    const token = await securityService.token({
      token: authorization
    })

    res.send({
      token: token.token,
      user: {
        _id: token.user._id,
        email: token.user.email
      }
    })
  } catch (e) {
    if (e instanceof WebError) {
      res.status(e.status).send(e.message)
    } else {
      // eslint-disable-next-line
      console.log(e)
      res.status(500).send(e.message)
    }
  }
})

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body
  try {
    const token = await securityService.login({
      email: email.toLowerCase(),
      password
    })
    res.send({
      token: token.token,
      user: {
        _id: token.user._id,
        email: token.user.email
      }
    })
  } catch (e) {
    if (e instanceof WebError) {
      console.log(e)
      res.status(e.status).send(e.message)
    } else {
      console.log(e)
      res.status(500).send(e.message)
    }
  }
})

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body
  try {
    const token = await securityService.login({
      email: email.toLowerCase(),
      password
    })
    res.send({
      token: token.token,
      user: {
        _id: token.user._id,
        email: token.user.email
      }
    })
  } catch (e) {
    if (e instanceof WebError) {
      console.log(e)
      res.status(e.status).send(e.message)
    } else {
      console.log(e)
      res.status(500).send(e.message)
    }
  }
})

router.post('/recover/:check', async (req, res, next) => {
  const { password } = req.body
  try {
    const token = await securityService.confirm({
      check: req.params.check
    })

    token.user.password = password
    token.user.save()

    res.send({
      token: token.token,
      user: {
        _id: token.user._id,
        email: token.user.email
      }
    })
  } catch (e) {
    if (e instanceof WebError) {
      console.log(e)
      res.status(e.status).send(e.message)
    } else {
      console.log(e)
      res.status(500).send(e.message)
    }
  }
})

router.post('/token', async (req, res, next) => {
  const { clientId, clientSecret, userId } = req.body
  try {
    const token = await securityService.client({
      clientId,
      clientSecret,
      userId
    })

    res.send({
      token: token.token,
      user: {
        _id: token.user._id,
        email: token.user.email
      }
    })
  } catch (e) {
    if (e instanceof WebError) {
      res.status(e.status).send(e.message)
    } else {
      console.log(e)
      res.status(500).send(e.message)
    }
  }
})

router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await securityService.signup({
      email: email.toLowerCase(),
      password
    })

    res.json({
      user: {
        _id: user._id,
        email: user.email
      }
    })
  } catch (e) {
    if (e instanceof WebError) {
      res.status(e.status).send(e.message)
    } else {
      res.status(500).send(e.message)
    }
  }
})

router.post('/forgot', async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await securityService.forgot({
      email: email.toLowerCase()
    })

    res.json({
      user: {
        _id: user._id,
        email: user.email
      }
    })
  } catch (e) {
    if (e instanceof WebError) {
      res.status(e.status).send(e.message)
    } else {
      res.status(500).send(e.message)
    }
  }
})

router.post('/passwd', async (req, res, next) => {
  const { check, password } = req.body
  try {
    const user = await securityService.passwd({
      check,
      password
    })

    res.json({
      user: {
        _id: user._id,
        email: user.email
      }
    })
  } catch (e) {
    if (e instanceof WebError) {
      res.status(e.status).send(e.message)
    } else {
      res.status(500).send(e.message)
    }
  }
})

router.get('/confirm/:check', async (req, res, next) => {
  try {
    const token = await securityService.confirm({
      check: req.params.check
    })

    res.json({
      token: token.token,
      user: {
        _id: token.user._id,
        email: token.user.email
      }
    })
  } catch (e) {
    if (e instanceof WebError) {
      res.status(e.status).send(e.message)
    } else {
      res.status(500).send(e.message)
    }
  }
})

router.get('/recover/:check', async (req, res, next) => {
  try {
    const { token, check } = await securityService.recover({
      check: req.params.check
    })

    res.json({
      check: check.check,
      token: token.token,
      user: {
        _id: check.user._id,
        email: check.user.email
      }
    })
  } catch (e) {
    if (e instanceof WebError) {
      res.status(e.status).send(e.message)
    } else {
      res.status(500).send(e.message)
    }
  }
})

router.post('/logout', async (req, res, next) => {
  const { authorization } = req.headers
  try {
    await securityService.logout({
      token: authorization
    })

    res.send({
      ok: true
    })
  } catch (e) {
    if (e instanceof WebError) {
      res.status(e.status).send(e.message)
    } else {
      console.log(e)
      res.status(500).send(e.message)
    }
  }
})

module.exports = router
