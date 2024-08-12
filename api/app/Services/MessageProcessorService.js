const ChatGPTService = use('App/Services/ChatGPTService')
const WhatsAppService = use('App/Services/WhatsAppService')
const User = use('App/Models/User')

const Logger = use('Logger')

// Simple in-memory store for user states and details (for prototyping)
const userStates = {}
const userDetails = {}

class MessageProcessorService {
  static async processMessage(from, message) {
    try {
      let user = await User.findBy('phone_number', from)
      if (!user || message.toLowerCase() === 'login') {
        `Por favor, faça login no site para usar o bot. \n\nhttps://www.scriptures.pro/v1/google/redirect?phone_number=${from}`
      }

      await auth.login(user)

      if (message.toLowerCase() === 'menu' || message.toLowerCase() === 'start') {
        return this.getMenu(user)
      }

      if (this.isAwaitingDetails(from)) {
        return await this.handleSermonDetails(from, message)
      }

      if (message.trim() === '1') {
        // Start the sermon draft process
        this.setUserState(from, 'awaiting_topic')
        return 'Indique o tema do seu devocional '
      }

      return this.getMenu(user)
    } catch (error) {
      console.log("AAAAA", error)
      Logger.error('Error in MessageProcessorService processMessage: %j', error)
      return 'Ocorreu um erro ao processar o seu pedido. Por favor, tente novamente.'
    }
  }

  static getMenu(user) {
    let username = user.username
    return `Bem-vindo(a) ao Devocional Bot, ${username}!\n\nPor favor, escolha uma opção:\n1. Esboço de Devocional\n\nDigite o número de sua escolha.`
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
        return 'Indique o tema do seu devocional '
      }

      if (userState === 'awaiting_theme') {
        this.setUserDetail(from, 'theme', message)
        this.setUserState(from, 'awaiting_scriptures')
        return 'Inclua as escrituras de sua preferência para o devocional (separadas por vírgulas, opicional):'
      }

      if (userState === 'awaiting_scriptures') {
        this.setUserDetail(from, 'scriptures', message)
        this.setUserState(from, 'idle')

        await WhatsAppService.sendMessage(from, "Por favor, aguarde um momento.")

        const { topic, theme, scriptures } = userDetails[from]
        const sermonDraft = await ChatGPTService.createSermonDraft(topic, theme, scriptures)
        const cleanedDraft = sermonDraft.replace(/\*\*/g, '*');
        const constrainedDraft = cleanedDraft.slice(0, 1400);
        console.log(constrainedDraft.length)
        return `Aqui está o esboço do devocional \n\n${constrainedDraft}`;
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