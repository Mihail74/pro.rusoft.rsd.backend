const keystone = require('keystone')

/**
 * Тэг проекта
 */
const ProjectTag = new keystone.List('ProjectTag', {
  map: { name: 'tag' }
})

ProjectTag.add({
  tag: { type: String, required: true, initial: true },
  title: { type: String, required: true, initial: true },
  objectId: { type: String, hidden: true }
})

ProjectTag.schema.pre('save', async function (next) {
  this.objectId = this._id
  next()
})

ProjectTag.defaultColumns = 'tag, title'
ProjectTag.register()
