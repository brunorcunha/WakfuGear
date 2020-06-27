const defaultState = () => ({
  darkTheme: false,
  tabSelected: 'equips',
  drawerLeft: true,
  drawerRight: false,
  tableTransposed: false,
  calculoDano: {
    danoBase: 100,
    criticoBase: 125,
    resistencia: 0
  },
  showDano: {
    posicoes: ['Frente', 'Costas'],
    alvos: ['ST', 'ZONA'],
    distancias: ['CAC', 'DIST'],
    multiplicadores: ['Critico', 'Berserk']
  }
})

const state = {
  configs: defaultState()
}

const getters = {
  darkTheme: state => state.configs.darkTheme,
  calculoDano: state => state.configs.calculoDano,
  showDano: state => state.configs.showDano
}

const mutations = {
  setConfig: (state, config) => { state.configs = config },
  setDarkTheme: (state, dark) => { state.configs.darkTheme = dark },
  setCalculoDano: (state, obj) => { state.configs.calculoDano = obj },
  setShowDano: (state, obj) => { state.configs.showDano = obj },
  salvarLS: (state) => { localStorage.setItem('configs', JSON.stringify(state.configs)) }
}

const actions = {
  init ({ commit }) {
    let configs = defaultState()
    if (localStorage.getItem('configs')) configs = JSON.parse(localStorage.getItem('configs'))
    commit('setConfig', configs)
  },
  setDarkTheme ({ commit }, dark) {
    commit('setDarkTheme', dark)
    commit('salvarLS')
  },
  setDanos ({ commit }, obj) {
    commit('setCalculoDano', obj.calculoDano)
    commit('setShowDano', obj.showDanos)
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
