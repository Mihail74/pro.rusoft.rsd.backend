module.exports = {}

const projectShortProjection = [
  { path: 'owner' },
  { path: 'members' },
  { path: 'address' }
]

const projectModelProjection = [
  { path: 'owner' },
  { path: 'members' }
]

Object.assign(module.exports, {
  projectShortProjection,
  projectModelProjection
})
