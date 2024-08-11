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


    const user = await google.getUser()

    console.log("AEEEE CARAIOOO", user)

    // Find or create a user in the database
    const dbUser = await User.findOrCreate(
      { email: user.getEmail() },
      {
        username: user.getName(),
        avatar: user.getAvatar(),
      }
    )

    // Log the user in
    const logged_user = await auth.login(dbUser)

    console.log("LOGGED USER", logged_user)

    return response.send('Logged in successfully')
  }
}

module.exports = AuthController