const express = require('express')
const { projectsService, profilesService } = requireRoot('./lib/services')
const { authenticate } = require('./middleware')

const router = express.Router()

router.get('/projects', authenticate(), async (req, res) => {
  res.json(await projectsService.loadProjectsList({
    user: req.token.user._id
  }))
})

router.get('/profile', authenticate(), async (req, res) => {
  console.log(req.token)
  
  res.json(await profilesService.loadProfileDetails({
    _id: req.token.user._id
  }))
})

module.exports = router
