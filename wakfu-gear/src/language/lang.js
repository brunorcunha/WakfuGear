import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { enUS } from './enUS'
Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en-US',
  messages: { 'en-US': enUS }
})
