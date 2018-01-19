const { createApp } = requireRoot('lib/app')

const axios = require('axios')
const backend = axios.create({
  baseURL: 'http://localhost:3000/api/v1'
})

const app = createApp({ headless: true, logger: null })

describe('Jobs Tests', () => {
  before(app.start.bind(app))
  after(app.stop.bind(app))

  it('Succeed to log in & log out with valid credentials', async () => {
    const response1 = await backend.post('security/login', {
      email: 'confirmed@mail.com',
      password: 'qwerty123'
    })

    {
      const { status, data } = response1
      expect(status, 'status should be 200').to.equal(200)
      expect(data.token != null, 'data.token should be specified').to.be.true
      expect(data.user != null, 'data.user should be specified').to.be.true
      expect(data.user._id != null, 'data.user._id should be specified').to.be.true
      expect(data.user.email != null, 'data.user.email should be specified').to.be.true
      expect(data.user.password != null, 'data.user.password should not be specified').to.be.false
    }

    const response2 = await backend.post('security/logout', null, {
      headers: {
        Authorization: `Bearer ${response1.data.token}`
      }
    })

    {
      const { status } = response2
      expect(status, 'status should be 200').to.equal(200)
    }
  })
})
