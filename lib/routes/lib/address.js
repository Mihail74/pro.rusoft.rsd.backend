const express = require('express')
const { addressService } = requireRoot('./lib/services')
const { authenticate } = require('./middleware')

const router = express.Router()

router.get('/:address', authenticate(), async (req, res) => {
  const info = await addressService.getAddressInfo(req.params.address)

  res.send({
    address: info.addrStr,
    balance: Math.round(Number(info.balance) * 1e8),
    unconfirmedBalance: Math.round(Number(info.unconfirmedBalance) * 1e8)
  })
})

module.exports = router
