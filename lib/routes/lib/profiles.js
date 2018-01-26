const express = require('express')
const { profilesService } = requireRoot('./lib/services')
const { authenticate } = require('./middleware')
const { makeUserModel } = requireRoot('./lib/convertor')

const router = express.Router()

router.get('/i/:id', authenticate(), async (req, res) => {
  const profile = await profilesService.loadProfileDetails({
    _id: req.params.id
  })
  res.json(makeUserModel(profile))
})

module.exports = router
