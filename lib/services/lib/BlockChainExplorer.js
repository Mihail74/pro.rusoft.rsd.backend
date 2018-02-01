const axios = require('axios')
const config = require('config')

const blockexplorer = axios.create({
  baseURL: config.blockexplorer.url + '/api'
})

class BlockChainExplorer {
  /**
  * Баланс на адресе
  */
  async getBalance (address) {
    return this.severalTime(async () => {
      const { data: balance } = await blockexplorer.get(`/addr/${address}/balance`)
      return balance
    })
  }

  /**
  * Транзакция по txId
  */
  async getTx (txId) {
    return this.severalTime(async () => {
      const { data: tx } = await blockexplorer.get(`/tx/${txId}`)
      return tx
    })
  }

  /**
  * rawtx по txId
  */
  async getRawTx (txId) {
    return this.severalTime(async () => {
      const { data: response } = await blockexplorer.get(`/rawtx/${txId}`)
      return response.rawtx
    })
  }

  async getBlock (blockHash) {
    return this.severalTime(async () => {
      const { data: block } = await blockexplorer.get(`/block/${blockHash}`)
      return block
    })
  }

  async sendTx (rawtx) {
    return this.severalTime(async () => {
      const { data: txId } = await blockexplorer.post('/tx/send', {
        rawtx
      })
      return txId
    })
  }

  async getAddressInfo (address) {
    return this.severalTime(async () => {
      const { data: info } = await blockexplorer.get(`/addr/${address}`)
      return info
    })
  }

  /**
  * Пробует выполнить func несколько раз.
  * Необходимо, т.к. blockExplorer переодически отваливается из-за большого количества запросов
  */
  async severalTime (func) {
    let tryCount = 5
    while (tryCount > 0) {
      tryCount--
      try {
        return await func()
      } catch (e) {
        if (tryCount === 0) {
          console.error(`BlockChainExplorer.severalTime: can't execute function ${func.name}, cause`)
          console.log(e.response.data)
        }
      }
    }
  }
}

module.exports = BlockChainExplorer
