const User = use('App/Models/User')
const OTPService = use('App/Services/OTPService') 

class AuthController {
  async redirectToGoogle({ ally, request }) {
    const phoneNumber = request.input('phone_number')

  return ally.driver('google').redirect((request) => {
    request.stateParamName(phoneNumber) 
    request.param('access_type', 'offline')
    request.param('prompt', 'select_account')
  })
  }

  async handleGoogleCallback({ ally, auth, response, request }) {
    console.log("ENTROU NO CALLBACK", request.all(), request)
    const google = ally.driver('google')


    const user = await google.getUser()

    const username = user.getEmail().split('@')[0]

    console.log(username)

    // Find or create a user in the database
    const dbUser = await User.findOrCreate(
      { google_id: user.getId() },
      {
        email: user.getEmail(),
        username: username,
        avatar: user.getAvatar(),
        password: null,
      }
    )

    // Log the user in
    const logged_user = await auth.login(dbUser)

    console.log("LOGGED USER", logged_user)

    return view.render('otp_request', { username: logged_user.username, user_id: logged_user.id })

    // return response.redirect('https://api.whatsapp.com/send/?phone=+14155238886&text=start&type=phone_number&app_absent=0')
  }

  async verifyNumber({ request, response, view }) {
    const { phone_number, user_id } = request.only(['phone_number', 'user_id'])

    // Generate OTP and send via WhatsApp
    const otp = OTPService.generateOTP()
    await OTPService.storeOTP(user_id, otp) // Store OTP in the database
    await WhatsAppService.sendMessage(phone_number, `Your OTP is: ${otp}`)

    // Render the OTP verification page
    return view.render('otp_verification', { phone_number, user_id })
  }

  async verifyOTP({ request, response, auth }) {
    const { user_id, phone_number } = request.only(['user_id', 'phone_number']);
    const otp = [
      request.input('digit1'),
      request.input('digit2'),
      request.input('digit3'),
      request.input('digit4')
    ].join(''); // Combine the digits into a full OTP
  
    // Validate OTP
    const isValid = await OTPService.validateOTP(user_id, otp);
  
    if (!isValid) {
      return response.send('Invalid OTP. Please try again.');
    }
  
    // Update the user's phone number and complete registration
    const user = await User.find(user_id);
    user.phone_number = phone_number;
    await user.save();
  
    // Log the user in
    await auth.login(user);
  
    // Redirect back to WhatsApp
    return response.redirect('https://api.whatsapp.com/send/?phone=+14155238886&text=start&type=phone_number&app_absent=0')
}

  async me({ auth }) {
    return auth.getUser()
  }
}


module.exports = AuthController