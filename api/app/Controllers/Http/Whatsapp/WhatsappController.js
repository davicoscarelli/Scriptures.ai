const WhatsAppService = use('App/Services/WhatsAppService')
const MessageProcessorService = use('App/Services/MessageProcessorService')

class WhatsAppController {
  async webhook({ request, response }) {
    console.log("AAAAA")
    const incomingMessage = request.input('Body')
    const from = request.input('From').replace('whatsapp:', '')

    console.log("Incoming message from", from, ":", incomingMessage)

    // Process the incoming message
    const reply = await MessageProcessorService.processMessage(from, incomingMessage)

    // Send the response back to the user
    await WhatsAppService.sendMessage(from, reply)

    response.status(200).send('Message processed')
  }
}

module.exports = WhatsAppController