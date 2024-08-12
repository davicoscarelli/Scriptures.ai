const crypto = require('crypto')
const Cache = use('Cache') // Assuming you're using a cache system

class OTPService {
  static generateOTP() {
    return crypto.randomInt(1000, 9999).toString()
  }

  static async storeOTP(userId, otp) {
    await Cache.put(`otp_${userId}`, otp, 10 * 60) // Store OTP for 10 minutes
  }

  static async validateOTP(userId, otp) {
    const storedOtp = await Cache.get(`otp_${userId}`)
    return storedOtp === otp
  }
}

module.exports = OTPService