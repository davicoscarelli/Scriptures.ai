const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

class ChatGPTService {
  static async createSermonDraft(topic, theme, scriptures) {
    const messages = [
      {
        role: 'system',
        content: 'Você é um assistente útil para a criação de devocionais.',
      },
      {
        role: 'user',
        content: `Crie um Devocional evangelico com menos de 1500 caracteres sobre o tópico "${topic}" com o tema "${theme}". Inclua as seguintes escrituras: ${scriptures}.`,
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