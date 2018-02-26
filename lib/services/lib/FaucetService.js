const coinSelect = require('coinselect')
const bitcoin = require('bitcoinjs-lib')
const bip39 = require('bip39')
const config = require('config')

/**
 * Faucet для приобритения rsd.
 */
class FaucetService {
  constructor (applicationContext) {
    this.applicationContext = applicationContext
    this.feeRate = 55 // satoshis per byte
    this.network = bitcoin.networks.testnet
    const mnemonic = config.bitcoin.mnemonic

    this.wallet = bitcoin.HDNode
      .fromSeedBuffer(bip39.mnemonicToSeed(mnemonic), this.network)
      .derivePath(`m/44'/1'/0'/0/0`)
  }

  get addressService () {
    return this.applicationContext.addressService
  }

  get transactionProcessor () {
    return this.applicationContext.transactionProcessor
  }

  async faucet (address, value) {
    let utxos = await this.addressService.getAddressUtxo(this.wallet.getAddress())
    utxos = utxos.map(e => ({
      ...e,
      value: Math.round(e.amount * 1e8),
      txId: e.txid
    }))

    const targets = [
      {
        address,
        value
      }
    ]
    let { inputs, outputs } = coinSelect(utxos, targets, this.feeRate)
    const txb = new bitcoin.TransactionBuilder(this.network)

    inputs.forEach(input => txb.addInput(input.txId, input.vout))
    outputs.forEach(output => {
      // Сдачу обратно
      if (!output.address) {
        output.address = this.wallet.getAddress()
      }
      txb.addOutput(output.address, output.value)
    })

    for (let i = 0; i < inputs.length; i++) {
      txb.sign(i, this.wallet.keyPair)
    }

    this.transactionProcessor.processTransaction(txb.build().toHex())
  }
}

module.exports = FaucetService
