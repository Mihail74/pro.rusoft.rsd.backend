const express = require('express')
const { projectsService } = requireRoot('./lib/services')
// const { authenticate } = require('./middleware')

const router = express.Router()

router.get('/', async (req, res) => {
  res.json({
    content: await projectsService.loadProjectsList()
  })
})

router.get('/i/:id', async (req, res) => {
  res.json({
    content: await projectsService.loadProjectDetails({
      _id: req.params.id
    })
  })
})

module.exports = router
