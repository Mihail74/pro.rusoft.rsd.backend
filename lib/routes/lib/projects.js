const express = require('express')
const { projectsService } = requireRoot('./lib/services')
const { authenticate } = require('./middleware')

const router = express.Router()

router.get('/', authenticate(), async (req, res) => {
  res.json(await projectsService.loadProjectsList())
})

module.exports = router
