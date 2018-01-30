const config = require('config')
const amqp = require('amqplib')

class NotificationService {
  start () {
    this.init()
    return this
  }

  async init () {
    this.exchange = 'addresses'

    let amqpConn = await amqp.connect(config.rabbit.url)
      .catch(() => {
        console.log('rabbitmq is not available!')
        process.exit(0)
      })

    this.channel = await amqpConn.createChannel()

    this.channel.on('close', () => {
      console.log('rabbitmq process has finished!')
      process.exit(0)
    })

    try {
      await this.channel.assertExchange(this.exchange, 'topic', {durable: false})
    } catch (e) {
      console.log(e)
      this.channel = await amqpConn.createChannel()
    }

    return this
  }

  send (routingKey, message) {
    this.channel.publish(this.exchange, routingKey, Buffer.from(JSON.stringify(message)))
  }
}

module.exports = NotificationService
