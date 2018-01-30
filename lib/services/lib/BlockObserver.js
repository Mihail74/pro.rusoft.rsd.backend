const io = require('socket.io-client')
const config = require('config')

class BlockObserver {
  constructor (applicationContext) {
    this.applicationContext = applicationContext
  }

  get blockChainExplorer () {
    return this.applicationContext.blockChainExplorer
  }

  get transactionProcessor () {
    return this.applicationContext.transactionProcessor
  }

  start () {
    const eventToListenTo = 'block'
    const room = 'inv'

    const self = this

    const socket = io(config.blockexplorer.url)
    socket.on('connect', function () {
      console.log('BlockObserver: subscribed for new block from blockexplorer')
      // Join the room.
      socket.emit('subscribe', room)
    })

    socket.on(eventToListenTo, function (blockHash) {
      console.log(`BlockObserver: received new block. hash: [${blockHash}]`)
      self.handleBlock(blockHash)
    })

    return this
  }

  async handleBlock (blockHash) {
    const block = await this.blockChainExplorer.getBlock(blockHash)
    this.transactionProcessor.confirmTransactions(block.tx)
  }
}

module.exports = BlockObserver
