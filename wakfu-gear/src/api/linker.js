import Vue from 'vue'

const endpoint = 'https://wakfu-api.netlify.com/.netlify/functions'

export default {
  async get (resource, params) {
    return (await Vue.http.post(`${endpoint}/linker`, { resource, params })).body
  }
}
