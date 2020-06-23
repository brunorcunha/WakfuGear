const state = {
  darkTheme: false,
  tabSelected: 'equips',
  drawerLeft: true,
  drawerRight: false,
  tableTransposed: false,
  calculoDano: {
    danoBase: 100,
    criticoBase: 125,
    resistencia: 0
  }
}

const getters = {
  darkTheme: state => state.darkTheme
}

const mutations = {
  setDarkTheme: (state, dark) => { state.darkTheme = dark }
}

const actions = {
  async init ({ commit }) {
    commit('setFiltros', JSON.parse(localStorage.getItem('filtros') || '{}'))
  },
  async setDarkTheme ({ commit }, dark) {
    commit('setDarkTheme', dark)
  },
  async salvar ({ commit }, configs) {
    commit('setConfigs', localStorage.setItem('configs', JSON.stringify(configs)))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
