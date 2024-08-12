const twilio = require('twilio')

class WhatsAppService {
  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  }

  async sendMessage(to, body) {
    await this.client.messages.create({
      body,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`
    }).then(message => console.log("AAAAAA", message.sid))
  }
}

module.exports = new WhatsAppService()