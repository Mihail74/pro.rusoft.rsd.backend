const keystone = require('keystone')

const Types = keystone.Field.Types

const SecurityUser = new keystone.List('SecurityUser')

/**
 * Базовая сущность пользователя системы
 */
SecurityUser.add({
  name: { type: String, initial: true, required: true },

  unconfirmedEmail: { type: Types.Email, initial: true },

  email: { type: Types.Email,
    initial: true,
    index: {
      unique: true,
      partialFilterExpression: { email: { $type: 'string' } }
    }
  },

  unconfirmedPhone: { type: String, initial: true },

  phone: { type: String,
    initial: true,
    index: {
      unique: true,
      partialFilterExpression: { phone: { $type: 'string' } }
    }
  }
},
'Wallets', {
  investingWallet: { type: Types.Relationship,
    ref: 'MainWallet',
    initial: true,
    required: true,
    index: true,
    filters: { owner: ':objectId', type: 'INVESTING' } },
  personalWallet: { type: Types.Relationship,
    ref: 'MainWallet',
    initial: true,
    required: true,
    index: true,
    filters: { owner: ':objectId', type: 'PERSONAL' } }
},
'keystone-settings', {
  objectId: { type: String, hidden: true },
  password: { type: Types.Password, initial: true }
}, 'Permissions', {
  isAdmin: { type: Boolean,
    label: 'Can access Keystone',
    index: true,
    initial: true
  }
})

SecurityUser.schema.virtual('wallets', {
  ref: 'MainWallet',
  localField: '_id',
  foreignField: 'owner',
  justOne: false
})

SecurityUser.relationship({
  path: 'investingProfile',
  ref: 'InvestingProfile',
  refPath: 'owner'
})

// Provide access to Keystone
SecurityUser.schema.virtual('canAccessKeystone').get(function () {
  return this.isAdmin
})

SecurityUser.schema.virtual('investingProfile', {
  ref: 'InvestingProfile',
  localField: '_id',
  foreignField: 'owner',
  justOne: true
})

SecurityUser.schema.pre('save', async function (next) {
  this.objectId = this._id
  next()
})

SecurityUser.defaultColumns = 'name, email, unconfirmedEmail, phone, unconfirmedPhone, isAdmin'
SecurityUser.register()
