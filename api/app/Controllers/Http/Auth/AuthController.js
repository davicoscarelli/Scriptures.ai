const User = use('App/Models/User')


class AuthController {
  async redirectToGoogle({ ally, request }) {
    const phoneNumber = request.input('phone_number')

  return ally.driver('google').redirect((request) => {
    request.state(phoneNumber) 
    request.param('access_type', 'offline')
    request.param('prompt', 'select_account')
  })
  }

  async handleGoogleCallback({ ally, auth, response, request }) {
    console.log("ENTROU NO CALLBACK", request.all(), request)
    const google = ally.driver('google')


    const user = await google.getUser()

    const phoneNumber = google.state()
    console.log("PHONE NUMBER", phoneNumber)

    console.log("AEEEE CARAIOOO", user)

    const username = user.getEmail().split('@')[0]

    console.log(username)

    // Find or create a user in the database
    const dbUser = await User.findOrCreate(
      { google_id: user.getId() },
      {
        email: user.getEmail(),
        username: username,
        avatar: user.getAvatar(),
        password: null ,
        phone_number: phoneNumber
      }
    )

    // Log the user in
    const logged_user = await auth.login(dbUser)

    console.log("LOGGED USER", logged_user)

    return response.redirect('https://api.whatsapp.com/send/?phone=+14155238886&text=start&type=phone_number&app_absent=0')
  }

  async me({ auth }) {
    return auth.getUser()
  }
}


module.exports = AuthController