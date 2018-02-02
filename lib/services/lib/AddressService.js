class AddressService {
  constructor (applicationContext) {
    this.applicationContext = applicationContext
  }

  get blockChainExplorer () {
    return this.applicationContext.blockChainExplorer
  }

  async getAddressInfo (address) {
    return this.blockChainExplorer.getAddressInfo(address)
  }

  async getAddressUtxo (address) {
    return this.blockChainExplorer.getUtxo(address)
  }
}

module.exports = AddressService
