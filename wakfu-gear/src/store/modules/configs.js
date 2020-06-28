const defaultState = () => ({
  darkTheme: true,
  tabSelected: 'equips',
  drawerLeft: true,
  drawerRight: false,
  tableTransposed: false,
  retrair: true,
  calculoDano: {
    danoBase: 100,
    criticoBase: 125,
    danoInfligido: 0,
    resistencia: 0
  },
  showDano: {
    posicoes: ['Frente', 'Costas'],
    alvos: ['ST', 'ZONA'],
    distancias: ['CAC', 'DIST'],
    multiplicadores: ['Critico']
  }
})

const state = {
  configs: defaultState()
}

const getters = {
  darkTheme: state => state.configs.darkTheme,
  retrair: state => state.configs.retrair,
  calculoDano: state => state.configs.calculoDano,
  showDano: state => state.configs.showDano
}

const mutations = {
  setConfig: (state, config) => { state.configs = config },
  setRetrair: (state, retrair) => { state.configs.retrair = retrair },
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
  setRetrair ({ commit }, retrair) {
    commit('setRetrair', retrair)
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
