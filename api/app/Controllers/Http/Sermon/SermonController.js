'use strict'
const WhatsAppService = use('App/Services/WhatsAppService')
const MessageProcessorService = use('App/Services/MessageProcessorService')

const ChatGPTService = use('App/Services/ChatGPTService')


class SermonController {
    async create({ request, response }) {
        const { topic, theme, scriptures } = request.only(['topic', 'theme', 'scriptures'])
        const sermonDraft = await ChatGPTService.createSermonDraft(topic, theme, scriptures)
        return response.json(sermonDraft)
      }
}

module.exports = SermonController
