const axios = require('axios')

class BibleAPIService {
  static async fetchScripture(passages) {
    const response = await axios.get(`https://api.bible.com/v1/passages?query=${passages}&version=NIV`, {
      headers: {
        'Authorization': `Bearer YOUR_API_KEY`
      }
    })
    return response.data
  }
}

module.exports = BibleAPIService