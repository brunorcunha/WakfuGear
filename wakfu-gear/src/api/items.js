import Vue from 'vue'

const endpoint = 'https://wakfu-api.netlify.com/.netlify/functions'

export default {
  async getItems () {
    return (await Vue.http.get(`${endpoint}/items`)).body
  },
  async getVersion () {
    return (await Vue.http.get(`${endpoint}/version`)).body
  }
}
