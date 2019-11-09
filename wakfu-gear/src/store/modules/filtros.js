const state = {
  filtros: {}
}

const getters = {
  filtros: state => state.filtros
}

const mutations = {
  setFiltros: (state, filtros) => { state.filtros = filtros }
}

const actions = {
  async init ({ commit }) {
    commit('setFiltros', JSON.parse(localStorage.getItem('filtros') || '{}'))
  },
  async salvar ({ commit }, filtros) {
    commit('setFiltros', localStorage.setItem('filtros', JSON.stringify(filtros)))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
