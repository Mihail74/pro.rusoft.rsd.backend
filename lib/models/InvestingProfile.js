const keystone = require('keystone')
const moment = require('moment')
const config = require('config')
const Types = keystone.Field.Types

const generateFilename = file => `${moment().format('MM-DD-YYYY-hh-mm-ss')}-${file.originalname}`

const fileStorage = relativePath => new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: config.storage.file + relativePath,
    generateFilename
  },
  schema: {
    path: true,
    size: true,
    mimetype: true
  }
})

const imageType = options => ({ type: Types.CloudinaryImage,
  generateFilename,
  initial: true,
  autoCleanup: true,
  width: 512,
  height: 512,
  ...options
})

const LEVEL_1_AND_GREATER = [ '1', '2', '3' ]
const LEVEL_2_AND_GREATER = [ '2', '3' ]
const LEVEL_3_AND_GREATER = [ '3' ]

/**
 * Опции для файлов, которые в дальнейшем будут использоваться для валидации
 * на обязательность заполнения
 */
const options = {
  avatar: {
    dependsOn: { level: LEVEL_1_AND_GREATER },
    checkedField: 'url'
  },

  passportFile: {
    dependsOn: { level: LEVEL_2_AND_GREATER },
    checkedField: 'size'
  },
  innFile: {
    dependsOn: { level: LEVEL_2_AND_GREATER },
    checkedField: 'size'
  },

  registrationCertificateFile: {
    dependsOn: { level: LEVEL_3_AND_GREATER },
    checkedField: 'size'
  },
  corporateLogo: {
    dependsOn: { level: LEVEL_3_AND_GREATER },
    checkedField: 'url'
  }
}

/**
 * Инвестиционный профиль участника системы
 */
const InvestingProfile = new keystone.List('InvestingProfile', {
  map: { name: 'name' },
  label: 'Investing profile'
})

InvestingProfile.add(
  'main', {
    objectId: { type: String, hidden: true },

    owner: {
      type: Types.Relationship,
      ref: 'SecurityUser',
      initial: true,
      index: true,
      required: true
    },

    level: {
      type: Types.Select,
      required: true,
      initial: true,
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }
      ],
      default: '1'
    }
  },
  'level-1', {
    name: { type: String, initial: true }, // copy from owner.name for admin UI

    isPublic: { type: Boolean, default: false, initial: true },

    avatar: imageType({
      folder: 'investing-profile/avatar',
      ...options.avatar
    }),

    dateOfBirth: { type: Types.Date, initial: true, required: true },

    country: { type: String,
      initial: true,
      required: true
    },

    intrestingTags: { type: Types.Relationship,
      ref: 'ProjectTag',
      initial: true,
      many: true
    }
  },
  'level-2', {
    address: { type: String,
      initial: true,
      required: true,
      dependsOn: { level: LEVEL_2_AND_GREATER }
    },

    passportNumber: { type: String,
      initial: true,
      required: true,
      dependsOn: { level: LEVEL_2_AND_GREATER }
    },

    passportFile: { type: Types.File,
      storage: fileStorage('/files/passport'),
      ...options.passportFile
    },

    inn: { type: String,
      initial: true,
      required: true,
      dependsOn: { level: LEVEL_2_AND_GREATER }
    },

    innFile: { type: Types.File,
      storage: fileStorage('/files/inn'),
      ...options.innFile
    }
  },
  'level-3 (corporate)', {
    corporateName: { type: String,
      initial: true,
      required: true,
      dependsOn: { level: LEVEL_3_AND_GREATER }
    },

    corporateDescription: { type: String,
      initial: true,
      required: true,
      dependsOn: { level: LEVEL_3_AND_GREATER }
    },

    corporateUrl: { type: Types.Url,
      initial: true,
      required: true,
      dependsOn: { level: LEVEL_3_AND_GREATER }
    },

    corporateLogo: imageType({
      folder: 'investing-profile/corporate/logo',
      ...options.corporateLogo
    }),

    registrationCertificateFile: { type: Types.File,
      storage: fileStorage('/files/corporate/registrationCertificate'),
      ...options.registrationCertificateFile
    }
  })

InvestingProfile.schema.pre('validate', function (next) {
  // Проверка обязательных файлов для уровня
  for (const entry of Object.entries(options)) {
    const fieldName = entry[0]
    const requiredLevels = entry[1].dependsOn.level
    const checkedField = entry[1].checkedField

    if (!this[fieldName][checkedField] && requiredLevels.includes(this.level)) {
      return next(new Error(`${fieldName} is required`))
    }
  }

  return next()
})

InvestingProfile.schema.pre('save', async function (next) {
  const SecurityUser = keystone.list('SecurityUser').model
  const owner = await SecurityUser.findOne(this.owner)

  this.objectId = this._id
  this.name = owner.name
  next()
})

InvestingProfile.defaultColumns = 'owner, level'
InvestingProfile.register()
