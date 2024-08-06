const WhatsAppService = use('App/Services/WhatsAppService')
const MessageProcessorService = use('App/Services/MessageProcessorService')
const Logger = use('Logger')

class WhatsAppController {
  async webhook({ request, response }) {
    try {
        console.log("AAAAAAA ENTROUUU")
    //   const incomingMessage = request.input('Body')
    //   const from = request.input('From').replace('whatsapp:', '')

    //   // Process the incoming message
    //   const reply = await MessageProcessorService.processMessage(from, incomingMessage)

    //   // Send the response back to the user
    //   await WhatsAppService.sendMessage(from, reply)

      response.status(200).send('Message processed')
    } catch (error) {
      Logger.error('Error in WhatsAppController webhook: %j', error)
      response.status(500).send('Internal Server Error')
    }
  }
}

module.exports = WhatsAppController