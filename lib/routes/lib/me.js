const express = require('express')
const { projectsService } = requireRoot('./lib/services')
const { authenticate } = require('./middleware')

const router = express.Router()

router.get('/projects', authenticate(), async (req, res) => {
  res.json(await projectsService.loadProjectsList({
    user: req.token.user._id
  }))
})

module.exports = router
