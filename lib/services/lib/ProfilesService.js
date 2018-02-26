const keystone = require('keystone')
const projections = requireRoot('lib/projections')

const SecurityUser = keystone.list('SecurityUser').model

/**
 * Сервис для работы с профилями
 */
class ProfilesService {
  async loadProfileDetails (selector) {
    const user = await SecurityUser
      .findOne(selector)
      .populate(projections.users.userModelProjection)
      .exec()
    return user
  }
}

module.exports = ProfilesService
