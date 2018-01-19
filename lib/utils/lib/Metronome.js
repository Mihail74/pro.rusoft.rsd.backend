const EventEmitter = require('events')

class Metronome extends EventEmitter {
  constructor (interval) {
    super()
    this._interval = interval
  }
  interval (interval) {
    this._interval = interval
    return this
  }
  tempo (tempo) {
    this._interval = 60 * 1000 / tempo
    return this
  }
  stop () {
    if (this._timeout) {
      clearTimeout(this._timeout)
      this._timeout = null
      this._tick = null
    }
    return this
  }
  start (immediate = true) {
    this._tick = () => {
      this.emit('tick')
      this._timeout = setTimeout(this._tick, this._interval)
    }
    if (immediate) {
      setImmediate(this._tick)
    } else {
      this._timeout = setTimeout(this._tick, this._interval)
    }
    return this
  }
}

module.exports = Metronome
