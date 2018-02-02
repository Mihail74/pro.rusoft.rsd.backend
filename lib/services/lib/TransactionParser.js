const bitcoin = require('bitcoinjs-lib')
const assert = require('assert')
const BigNumber = require('bignumber.js')

const E8 = new BigNumber(10).pow(8)

/**
* Парсер транзакций
*/
class TransactionParser {
  constructor (applicationContext) {
    this.applicationContext = applicationContext

    // TODO: @mdkardaev нужно унести в конфиг
    this.network = bitcoin.networks.testnet
  }

  get blockChainExplorer () {
    return this.applicationContext.blockChainExplorer
  }

  /**
  * Парсинг транзакции в hex-формате.
  * Возвращает txId, rawTx и предстоящии изменения на адресах
  */
  async parseRawTx (rawtx) {
    const tx = bitcoin.Transaction.fromHex(rawtx)
    const txId = tx.getId()

    const inChanges = await this.getInputAddressChanges(tx)
    const outChanges = await this.getOutputAddressChanges(tx)

    return {
      txId,
      rawtx,
      inputAddressChanges: inChanges,
      outputAddressChanges: outChanges
    }
  }

  async getInputAddressChanges (tx) {
    if (tx.isCoinbase()) {
      return []
    }

    const previousTransactionHashes = tx.ins.map(inp => {
      return {
        index: inp.index,
        hash: Buffer.from(inp.hash.reverse(), 'hex').toString('hex')
      }
    })

    let inpAddressChanges = []

    for (let pth of previousTransactionHashes) {
      const previousTx = await this.blockChainExplorer.getTx(pth.hash)

      // TODO: @mdkadaev найти случай, когда будет несколько адресов
      const out = previousTx.vout[pth.index]

      assert(out.scriptPubKey.addresses.length === 1)

      inpAddressChanges.push({
        address: out.scriptPubKey.addresses[0],
        unconfirmedBalance: new BigNumber(out.value).times(E8).times(-1)
      })
    }

    return inpAddressChanges
  }

  getOutputAddressChanges (tx) {
    const outAddresses = []
    for (let out of tx.outs) {
      try {
        const address = bitcoin.address.fromOutputScript(out.script, this.network)

        // TODO: @mdkardaev Иногда приходят странные адреса, с testnet [OP_FALSE и т.п].
        // Со временем выяснить что из этого валидное
        bitcoin.address.fromBase58Check(address)

        outAddresses.push({
          address,
          unconfirmedBalance: new BigNumber(out.value)
        })
      } catch (e) {
        // nothing
      }
    }
    return outAddresses
  }
}

module.exports = TransactionParser
