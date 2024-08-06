const ChatGPTService = use('App/Services/ChatGPTService')
const WhatsAppService = use('App/Services/WhatsAppService')
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
        return 'Please provide the topic for your sermon:'
      }

      return this.getMenu()
    } catch (error) {
      Logger.error('Error in MessageProcessorService processMessage: %j', error)
      return 'There was an error processing your request. Please try again.'
    }
  }

  static getMenu() {
    return 'Welcome to the Sermon Bot!\n\nPlease choose an option:\n1. Sermon Draft\n\nType the number of your choice.'
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
        return 'Please provide the theme for your sermon:'
      }

      if (userState === 'awaiting_theme') {
        this.setUserDetail(from, 'theme', message)
        this.setUserState(from, 'awaiting_scriptures')
        return 'Please provide the scriptures for your sermon (comma-separated):'
      }

      if (userState === 'awaiting_scriptures') {
        this.setUserDetail(from, 'scriptures', message)
        this.setUserState(from, 'idle')
        await WhatsAppService.sendMessage(from, "I'm now creating your sermon draft. Please wait a moment.")

        const { topic, theme, scriptures } = userDetails[from]
        const sermonDraft = await ChatGPTService.createSermonDraft(topic, theme, scriptures)
        const cleanedDraft = sermonDraft.replace(/\*\*/g, '*');
        return `Here is your sermon draft:\n\n${cleanedDraft}`;
      }

      return 'Please start by typing "menu".'
    } catch (error) {
      Logger.error('Error in MessageProcessorService handleSermonDetails: %j', error)
      return 'There was an error processing your request. Please try again.'
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