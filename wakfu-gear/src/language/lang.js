import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { pt } from './pt'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'pt',
  messages: { pt, en, es, fr }
})
