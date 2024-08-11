const User = use('App/Models/User')

class AuthController {
  async redirectToGoogle({ ally }) {
    return ally.driver('google').redirect((request) => {
      request.param('access_type', 'offline')
      request.param('prompt', 'select_account')
    })
  }

  async handleGoogleCallback({ ally, auth, response }) {
    const google = ally.driver('google')

    if (google.accessDenied()) {
      return response.send('Access was denied')
    }

    if (google.stateMisMatch()) {
      return response.send('Request expired. Try again')
    }

    if (google.hasError()) {
      return response.send(google.getError())
    }

    const user = await google.user()

    // Find or create a user in the database
    const dbUser = await User.findOrCreate(
      { email: user.email },
      {
        username: user.username,
        // avatarUrl: user.avatarUrl,
      }
    )

    // Log the user in
    await auth.login(dbUser)

    return response.send('Logged in successfully')
  }
}

module.exports = AuthController