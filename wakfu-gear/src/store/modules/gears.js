const state = {
  gears: []
}

const getters = {
  gears: state => state.gears
}

const mutations = {
  novoGear: (state, gear) => { state.gears.push(gear || {}) },
  editarGear: (state, gear, index) => { state.gears[index] = gear || {} },
  removerGear: (state, index) => { state.gears.splice(index, 1) },
  salvarLS: (state) => { localStorage.setItem('gears', JSON.stringify(state.gears)) }
}

const actions = {
  async adicionarGear ({ commit }, gear) {
    commit('novoGear', gear)
    commit('salvarLS')
  },
  async removerGear ({ commit }, index) {
    commit('removerGear', index)
    commit('salvarLS')
  },
  async editarGear ({ commit }, gear, index) {
    commit('editarGear', gear, index)
    commit('salvarLS')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
