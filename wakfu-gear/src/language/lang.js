import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { pt } from './pt'
import { en } from './en'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'pt',
  messages: { pt, en }
})
