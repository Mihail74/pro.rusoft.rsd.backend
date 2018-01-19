const keystone = require('keystone')
const crypto = require('crypto')
const { promisify } = require('util')
const Types = keystone.Field.Types

const SecurityInvite = new keystone.List('SecurityInvite', {
  // nocreate: true,
  // noedit: true
})

SecurityInvite.add({
  invite: { type: String },
  email: { type: String, required: true, initial: true },
  createdDate: { type: Date, default: Date.now, required: true },
  type: {
    type: Types.Select,
    default: 'SIGNUP',
    required: true,
    initial: true,
    options: [
      { value: 'SIGNUP', label: 'Invite User' },
      { value: 'CURATOR', label: 'Invite Curator to the Project' }
    ]
  },
  project: {
    type: Types.Relationship,
    ref: 'MainProject',
    required: true,
    initial: true,
    index: true,
    dependsOn: { type: ['CURATOR'] }
  }
})

SecurityInvite.schema.pre('save', function (next) {
  promisify(crypto.randomBytes)(128).then(
    random => {
      this.invite = crypto.createHash('md5').update(random).digest('hex')
      next()
    }
  )
})

SecurityInvite.defaultColumns = 'invite, email, createdDate, type, project'

SecurityInvite.register()
