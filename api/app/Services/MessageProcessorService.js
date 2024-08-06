const ChatGPTService = use('App/Services/ChatGPTService')
const Logger = use('Logger')

// Simple in-memory store for user states and details (for prototyping)
const userStates = {}
const userDetails = {}

class MessageProcessorService {
  static async processMessage(from, message) {
    try {
      if (message.toLowerCase() === 'menu' || message.toLowerCase() === 'start') {
        return this.getMenu()
      }

      if (this.isAwaitingDetails(from)) {
        return await this.handleSermonDetails(from, message)
      }

      if (message.trim() === '1') {
        // Start the sermon draft process
        this.setUserState(from, 'awaiting_topic')
        return 'Indique o tema do seu sermão:'
      }

      return this.getMenu()
    } catch (error) {
      Logger.error('Error in MessageProcessorService processMessage: %j', error)
      return 'Ocorreu um erro ao processar o seu pedido. Por favor, tente novamente.'
    }
  }

  static getMenu() {
    return 'Bem-vindo ao Sermon Bot!\n\nPor favor, escolha uma opção:\n1. Esboço de Sermão\n\nDigite o número de sua escolha.'
  }

  static isAwaitingDetails(from) {
    return userStates[from] && userStates[from] !== 'idle'
  }

  static async handleSermonDetails(from, message) {
    try {
      const userState = userStates[from]

      if (userState === 'awaiting_topic') {
        this.setUserDetail(from, 'topic', message)
        this.setUserState(from, 'awaiting_theme')
        return 'Indique o tema do seu sermão:'
      }

      if (userState === 'awaiting_theme') {
        this.setUserDetail(from, 'theme', message)
        this.setUserState(from, 'awaiting_scriptures')
        return 'Indique as escrituras para o seu sermão (separadas por vírgulas):'
      }

      if (userState === 'awaiting_scriptures') {
        this.setUserDetail(from, 'scriptures', message)
        this.setUserState(from, 'idle')

        const { topic, theme, scriptures } = userDetails[from]
        const sermonDraft = await ChatGPTService.createSermonDraft(topic, theme, scriptures)
        const cleanedDraft = sermonDraft.replace(/\*\*/g, '*');
        return `Aqui está o esboço do sermão:\n\n${cleanedDraft}`;
      }

      return 'Comece por escrever "menu".'
    } catch (error) {
      Logger.error('Error in MessageProcessorService handleSermonDetails: %j', error)
      return 'Ocorreu um erro ao processar o seu pedido. Por favor, tente novamente.'
    }
  }

  static getUserState(from) {
    return userStates[from]
  }

  static setUserState(from, state) {
    userStates[from] = state
  }

  static getUserDetails(from) {
    return userDetails[from]
  }

  static setUserDetail(from, key, value) {
    if (!userDetails[from]) {
      userDetails[from] = {}
    }
    userDetails[from][key] = value
  }
}

module.exports = MessageProcessorService