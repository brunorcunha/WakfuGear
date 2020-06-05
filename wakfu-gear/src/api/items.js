import Vue from 'vue'

const endpoint = process.env.API_URL

export default {
  getItems: async () => (await Vue.http.get(`${endpoint}/items`)).body,
  getVersion: async () => (await Vue.http.get(`${endpoint}/version`)).body,
  getZenith: async id => (await Vue.http.get(`${endpoint}/zenith`, { params: { id } })).body
}
