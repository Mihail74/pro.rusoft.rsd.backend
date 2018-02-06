const express = require('express')
const { projectsService } = requireRoot('./lib/services')
const { authenticate } = require('./middleware')

const router = express.Router()

router.get('/', authenticate(), async (req, res) => {
  res.json({
    content: await projectsService.loadProjectsList()
  })
})

router.get('/i/:id', authenticate(), async (req, res) => {
  res.json({
    content: await projectsService.loadProjectDetails({
      _id: req.params.id
    })
  })
})

router.post('/:id/deposit', authenticate(), async (req, res) => {
  const { rawtx } = req.body
  const projectId = req.params.id
  const user = req.token.user

  await projectsService.deposit({ projectId, user, rawtx })
  res.sendStatus(200)
})

module.exports = router
