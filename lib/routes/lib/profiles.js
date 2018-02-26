const express = require('express')
const { profilesService } = requireRoot('./lib/services')
const { authenticate } = require('./middleware')
const convertors = requireRoot('./lib/convertor')

const router = express.Router()

router.get('/i/:id', authenticate(), async (req, res) => {
  const profile = await profilesService.loadProfileDetails({
    _id: req.params.id
  })

  res.json(await convertors.users.makeUserModel(profile))
})

module.exports = router
