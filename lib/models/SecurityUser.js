const keystone = require('keystone')

const Types = keystone.Field.Types

const SecurityUser = new keystone.List('SecurityUser')

SecurityUser.add({
  name: { type: String, initial: true },
  email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
  password: { type: Types.Password, initial: true, required: true },
  avatar: { type: Types.CloudinaryImage, folder: 'security-user/avatar', autoCleanup: true, width: 512, height: 512 },
  isConfirmed: { type: Types.Boolean, initial: true },
  objectId: { type: String, hidden: true }
}, 'Permissions', {
  isAdmin: { type: Boolean, label: 'Can access Keystone', index: true, initial: true }
}, 'Wallets', {
  investingWallet: { type: Types.Relationship, ref: 'MainWallet', initial: true, index: true, filters: { owner: ':objectId', type: 'INVESTING' } },
  personalWallet: { type: Types.Relationship, ref: 'MainWallet', initial: true, index: true, filters: { owner: ':objectId', type: 'PERSONAL' } }
})

SecurityUser.relationship({ path: 'projects', ref: 'MainProject', refPath: 'owner' })
SecurityUser.relationship({ path: 'wallets', ref: 'MainWallet', refPath: 'owner' })

SecurityUser.schema.pre('save', function (next) {
  this.objectId = this._id
  if (this.name == null || this.name === '') {
    this.name = this.email.substring(0, this.email.lastIndexOf('@'))
  }
  this.email = this.email.toLowerCase()
  next()
})

// Provide access to Keystone
SecurityUser.schema.virtual('canAccessKeystone').get(function () {
  return this.isAdmin && this.isConfirmed
})

SecurityUser.schema.virtual('projects', {
  ref: 'MainProject',
  localField: '_id',
  foreignField: 'owner',
  justOne: false
})

SecurityUser.schema.virtual('wallets', {
  ref: 'MainWallet',
  localField: '_id',
  foreignField: 'owner',
  justOne: false
})

SecurityUser.schema.pre('remove', async function (next) {
  const MainProject = keystone.list('MainProject').model
  const MainWallet = keystone.list('MainWallet').model
  const [ projects, wallets ] = await Promise.all([
    MainProject.find({ owner: this._id }).exec(),
    MainWallet.find({ owner: this._id }).exec()
  ])
  await Promise.all([
    ...projects.map(d => d.remove()),
    ...wallets.map(d => d.remove())
  ])
  next()
})

SecurityUser.defaultColumns = 'name, avatar, email, isConfirmed, isAdmin'
SecurityUser.register()

// SecurityUser.model.findOne({ email: 'demo@example.com' }, (findError, user) => {
//   if (findError) {
//     // handle error
//   } else {
//     user.isAdmin = true
//     user.save((saveError) => {
//       if (saveError) {
//         // handle error
//       }
//     })
//   }
// })
