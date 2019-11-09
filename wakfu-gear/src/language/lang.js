import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { ptBR } from './ptBR'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'pt-BR',
  messages: { 'pt-BR': ptBR }
})
