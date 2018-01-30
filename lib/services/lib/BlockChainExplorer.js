const axios = require('axios')
const config = require('config')
const { URLSearchParams } = require('url')

const blockexplorer = axios.create({
  baseURL: config.blockexplorer.url + '/api'
})

class BlockChainExplorer {
  /**
  * Баланс на адресе
  */
  async getBalance (address) {
    const { data: balance } = await blockexplorer.get(`/addr/${address}/balance`)
    return balance
  }

  /**
  * Транзакция по txId
  */
  async getTx (txId) {
    const { data: tx } = await blockexplorer.get(`/tx/${txId}`)
    return tx
  }

  /**
  * rawtx по txId
  */
  async getRawTx (txId) {
    const { data: response } = await blockexplorer.get(`/rawtx/${txId}`)
    return response.rawtx
  }

  async getBlock (blockHash) {
    const { data: block } = await blockexplorer.get(`/block/${blockHash}`)
    return block
  }

  async sendTx (rawtx) {
    const { data: txId } = await blockexplorer.post('/tx/send', {
      rawtx
    })
    return txId
  }
}

module.exports = BlockChainExplorer
