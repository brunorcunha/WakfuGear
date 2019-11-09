import Vuex from 'vuex'
import Vue from 'vue'
import items from './modules/items'
import filtros from './modules/filtros'
import gear from './modules/gear'
import gears from './modules/gears'
import atributos from './modules/atributos'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    items,
    atributos,
    gears,
    gear,
    filtros
  }
})
