const keystone = require('keystone')
const bitcoin = require('bitcoinjs-lib')
const bip39 = require('bip39')
const config = require('config')
const AddressRepository = keystone.list('PlatformAddress').model

class AddressProvider {
  constructor (applicationContext) {
    this.applicationContext = applicationContext
    this.network = bitcoin.networks.testnet
    this.hdMaster = bitcoin.HDNode
      .fromSeedBuffer(bip39.mnemonicToSeed(config.bitcoin.mnemonic), this.network)
  }

  async init () {
    await this.loadNextChildIndex()
    return this
  }

  async loadNextChildIndex () {
    const actualIndex = await AddressRepository.findOne().sort('-index').exec()

    this.nextIndex = actualIndex == null ? 1 : actualIndex.index + 1
    return this.nextIndex
  }

  getNextIndex () {
    return this.nextIndex++
  }

  async nextAddress () {
    const nextIndex = this.getNextIndex()
    const childNode = this.hdMaster.derivePath(`m/44'/1'/0'/0/${nextIndex}`)

    return this.saveAddress(childNode.keyPair.getAddress(), nextIndex)
  }

  async saveAddress (address, index) {
    const newAddress = new AddressRepository({
      address,
      index
    })
    return newAddress.save()
  }
}

module.exports = AddressProvider
