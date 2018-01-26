const keystone = require('keystone')
const Types = keystone.Field.Types

const MainProject = new keystone.List('MainProject', {
  map: { name: 'name' },
  autokey: { path: 'slug', from: 'name', unique: true },
  sortable: true
})

MainProject.add({
  name: { type: String, default: 'Project', initial: true, required: true },
  description: { type: String, default: 'Small description', initial: true, required: false },
  owner: { type: Types.Relationship, ref: 'SecurityUser', required: true, initial: true, index: true },
  members: { type: Types.Relationship, ref: 'SecurityUser', initial: true, many: true },
  thumbnail: { type: Types.CloudinaryImage, folder: 'main-project/thumbnail', autoCleanup: true, width: 512, height: 512 },
  createdDate: { type: Date, default: Date.now, required: true },
  startedDate: { type: Date, dependsOn: { status: ['STARTED', 'FINISHED'] } },
  finisedDate: { type: Date, dependsOn: { status: ['FINISHED'] } },
  dueDate: { type: Date, default: () => Date.now() + 3600 * 24 * 100, required: true, initial: true },
  targetValue: { type: Number, required: true, initial: true },
  status: {
    type: Types.Select,
    default: 'NEW',
    required: true,
    initial: false,
    options: [
      { value: 'NEW', label: 'New' },
      { value: 'STARTED', label: 'Started' },
      { value: 'FINISHED', label: 'Finished' }
    ]
  },
  objectId: { type: String, hidden: true }
})

MainProject.schema.pre('save', async function (next) {
  this.objectId = this._id
  next()
})

MainProject.defaultColumns = 'name, owner, status, startedDate, dueDate'
MainProject.register()
