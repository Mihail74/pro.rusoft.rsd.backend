const keystone = require('keystone')
const crypto = require('crypto')
const { promisify } = require('util')
const Types = keystone.Field.Types

const SecurityCheck = new keystone.List('SecurityCheck', {
  nocreate: true,
  noedit: true
})

SecurityCheck.add({
  check: { type: String },
  type: {
    type: Types.Select,
    options: [
      { value: 'confirm', label: 'Signup Confirmation' },
      { value: 'recover', label: 'Password Recovery' }
    ],
    initial: true,
    required: true
  },
  createdDate: { type: Date, default: Date.now, required: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', required: true }
})

SecurityCheck.schema.pre('save', function (next) {
  promisify(crypto.randomBytes)(128).then(
    random => {
      this.check = crypto.createHash('md5').update(random).digest('hex')
      next()
    }
  )
})

SecurityCheck.defaultColumns = 'check, user, type, createdDate'

SecurityCheck.register()
