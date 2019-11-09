import atributos from '../../functions/atributos'

const state = {
  atributos: {}
}

const getters = {
  atributos: state => state.atributos
}

const mutations = {
  setAtributos: (state, atributos) => { state.atributos = atributos }
}

const actions = {
  calcularAtributos ({ commit }, gear) {
    const atr = atributos.getAtributos(gear)
    commit('setAtributos', atr)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
