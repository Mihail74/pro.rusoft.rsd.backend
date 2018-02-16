module.exports = {}

const makeImageShort = image => image == null ? null : ({
  ...image
})

Object.assign(module.exports, {
  makeImageShort
})
