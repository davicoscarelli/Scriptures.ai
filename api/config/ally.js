const { defineConfig } = use('@adonisjs/ally')

module.exports = defineConfig({
  google: {
    driver: 'google',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: 'http://localhost:3333/google/callback',
  },
})