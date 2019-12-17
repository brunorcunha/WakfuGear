import Vuex from 'vuex'
import Vue from 'vue'
import items from './modules/items'
import filtros from './modules/filtros'
import gears from './modules/gears'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    items,
    gears,
    filtros
  }
})
