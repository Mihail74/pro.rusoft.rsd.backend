const express = require('express')
const { projectsService } = requireRoot('./lib/services')
const { authenticate } = require('./middleware')

const router = express.Router()

router.get('/', authenticate(), async (req, res) => {
  res.json({
    content: await projectsService.loadProjectsList()
  })
})

router.get('/i/:id/short', authenticate(), async (req, res) => {
  res.json({
    content: await projectsService.loadProjectDetailsShort({
      _id: req.params.id
    })
  })
})

router.post('/:id/deposit', authenticate(), async (req, res) => {
  const { rawtx } = req.body
  const projectId = req.params.id
  const user = req.token.user
  try {
    await projectsService.deposit({ projectId, user, rawtx })
  } catch (e) {
    res.sendStatus(e.status || 500)
    return
  }
  res.sendStatus(200)
})

module.exports = router
