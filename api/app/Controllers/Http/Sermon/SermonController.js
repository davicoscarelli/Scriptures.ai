'use strict'

class SermonController {
    async create({ request, response }) {
        const { topic, theme, scriptures } = request.only(['topic', 'theme', 'scriptures'])
        const sermonDraft = await ChatGPTService.createSermonDraft(topic, theme, scriptures)
        return response.json(sermonDraft)
      }
}

module.exports = SermonController
