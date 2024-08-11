import { defineConfig, services } from '@adonisjs/ally/build/src/AllyManager'

module.exports = defineConfig({
  google: {
    driver: 'google',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: 'https://scriptures-ai-6c1591cb87ac.herokuapp.com/v1/google/callback',
  },
})