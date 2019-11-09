import Vue from 'vue'
import Vuetify from 'Vuetify'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()

Vue.config.silent = true
Vue.use(Vuetify)

export default localVue
