const keystone = require('keystone')
const { userModelProjection } = requireRoot('lib/projections')

const SecurityUser = keystone.list('SecurityUser').model

/**
 * Сервис для работы с профилями
 */
class ProfilesService {
  async loadProfileDetails (selector) {
    const user = await SecurityUser
      .findOne(selector)
      .populate(userModelProjection)
      .exec()
    return user
  }
}

module.exports = ProfilesService
