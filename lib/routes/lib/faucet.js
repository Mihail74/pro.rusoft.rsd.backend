const express = require('express')
const { faucetService } = requireRoot('./lib/services')
const { authenticate } = require('./middleware')

const router = express.Router()

router.post('', authenticate(), async (req, res) => {
  const address = req.body.address
  const value = req.body.value

  await faucetService.faucet(address, value)

  res.sendStatus(200)
})

module.exports = router
