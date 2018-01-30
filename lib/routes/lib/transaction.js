const express = require('express')
const { transactionProcessor } = requireRoot('./lib/services')
const { authenticate } = require('./middleware')

const router = express.Router()

router.post('/', authenticate(), async (req, res) => {
  const rawtx = req.body.rawtx
  await transactionProcessor.processTransaction(rawtx)
  res.sendStatus(200)
})

module.exports = router
