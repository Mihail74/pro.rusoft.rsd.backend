const keystone = require('keystone')
// const config = require('config')
// const { WebError } = requireRoot('lib/errors')
const { userModelProjection } = requireRoot('lib/projections')

const SecurityUser = keystone.list('SecurityUser').model

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
