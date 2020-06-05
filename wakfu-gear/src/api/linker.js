import Vue from 'vue'

const endpoint = process.env.API_URL

export default {
  get: async (resource, params) => (await Vue.http.post(`${endpoint}/linker`, { resource, params })).body
}
