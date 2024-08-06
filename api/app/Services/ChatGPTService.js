const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

class ChatGPTService {
  static async createSermonDraft(topic, theme, scriptures) {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant for sermon creation.',
      },
      {
        role: 'user',
        content: `Create a sermonunder 1600 characters on the topic "${topic}" with the theme "${theme}". Include the following scriptures: ${scriptures}.`,
      },
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 1,
      max_tokens: 1600,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    return response.choices[0].message.content
  }
}

module.exports = ChatGPTService