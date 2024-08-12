const TempToken = use('App/Models/TempToken')

class OTPService {
  static generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  static async storeOTP(phoneNumber, otp) {
    // Store the OTP with the phone number in the temp_tokens table
    await TempToken.create({
      phone_number: phoneNumber,
      token: otp,
    })
  }

  static async validateOTP(phoneNumber, otp) {
    console.log("CARAIOOOOO", phoneNumber, otp)
    // Find the OTP by phone number
    const record = await TempToken.query().where('phone_number', phoneNumber).orderBy('created_at', 'desc').first()

    console.log(record)
    if (!record) {
      return false
    }

    // Check if the OTP matches
    return record.token === otp
  }

  static async deleteOTP(phoneNumber) {
    // Delete the OTP after it's used
    await TempToken.query().where('phone_number', phoneNumber).delete()
  }
}

module.exports = OTPService