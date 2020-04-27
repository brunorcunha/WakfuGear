import Vue from 'vue'

const endpoint = 'https://wakfu-api.netlify.app/.netlify/functions'

export default {
  getItems: async () => (await Vue.http.get(`${endpoint}/items`)).body,
  getVersion: async () => (await Vue.http.get(`${endpoint}/version`)).body
}
