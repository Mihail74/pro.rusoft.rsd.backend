module.exports = {
  apps: [
    {
      name: 'pro.rusoft.rsd.backend',
      script: 'bin/www',
      watch: true,
      env: {
        PORT: 3000,
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 3012,
        NODE_ENV: 'production'
      }
    }
  ]
}
