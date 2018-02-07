const express = require('express')
const { addressService, addressProvider } = requireRoot('./lib/services')
const { authenticate } = require('./middleware')

const router = express.Router()

router.get('/generate', async (req, res) => {
  const address = await addressProvider.nextAddress()

  res.send({
    address
  })
})

router.get('/:address', async (req, res) => {
  const info = await addressService.getAddressInfo(req.params.address)
  res.send({
    address: info.addrStr,
    balance: Math.round(Number(info.balance) * 1e8),
    unconfirmedBalance: Math.round(Number(info.unconfirmedBalance) * 1e8)
  })
})

router.get('/:address/utxo', async (req, res) => {
  const utxo = await addressService.getAddressUtxo(req.params.address)

  res.send({
    utxo
  })
})

module.exports = router
