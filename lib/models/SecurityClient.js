const keystone = require('keystone')
const Types = keystone.Field.Types

const SecurityClient = new keystone.List('SecurityClient')

SecurityClient.add({
  name: { type: String, required: true, index: true, initial: true },
  secret: { type: String, index: true, initial: true, required: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', index: true, initial: true, required: true }
})

SecurityClient.defaultSort = 'name'
SecurityClient.defaultColumns = 'name, user'
SecurityClient.register()
