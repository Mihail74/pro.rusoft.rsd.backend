const makeImageShort = image => image == null ? null : ({
  ...image
})

const makeUserShort = user => user == null ? null : ({
  id: user._id,
  email: user.email,
  name: user.name,
  avatar: makeImageShort(user.avatar)
})

const makeProjectShort = project => project == null ? null : ({
  id: project._id,
  name: project.name,
  description: project.description,
  thumbnail: makeImageShort(project.thumbnail),
  user: makeUserShort(project.user),
  members: project.members.map(makeUserShort)
})

const makeProjectModel = project => project == null ? null : ({
  descriptor: makeProjectShort(project)
  // TODO @ipavlenko: Add stats and project details here
})

module.exports = {
  makeUserShort,
  makeProjectShort,
  makeProjectModel
}
