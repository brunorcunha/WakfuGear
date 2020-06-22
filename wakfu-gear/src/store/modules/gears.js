import { equipType } from '../../model/equipType'

const defaultGear = () => ({
  gear: {
    NECK: null,
    BELT: null,
    LEGS: null,
    CHEST: null,
    BACK: null,
    SHOULDERS: null,
    HEAD: null,
    LEFT_HAND: null,
    RIGHT_HAND: null,
    PET: null,
    ACCESSORY: null,
    COSTUME: null,
    MOUNT: null,
    FIRST_WEAPON: null,
    SECOND_WEAPON: null
  },
  nome: 'Gear',
  qntItens: 0
})

const state = {
  gears: [],
  gearAtual: null
}

const getters = {
  allGears: state => state.gears,
  gears: state => state.gears.map(gear => gear.nome),
  gearAtual: state => state.gears[state.gearAtual].gear,
  indexAtual: state => state.gearAtual,
  qnt: state => state.gears.length,
  nome: state => state.gears[state.gearAtual].nome,
  vazio: state => state.gears[state.gearAtual].qntItens === 0
}

const mutations = {
  init: (state, { LS }) => { state.gears = LS.gears },
  addGear: (state, { gear }) => { state.gears.push(gear || defaultGear()) },
  editarGear: (state, { gear, index }) => { state.gears[index].gear = gear || defaultGear() },
  removerGear: (state, { index }) => { state.gears.splice(index, 1) },
  addQntItens: (state, { index }) => { state.gears[index].qntItens++ },
  subQntItens: (state, { index }) => { state.gears[index].qntItens-- },
  setNome: (state, { nome, index }) => { state.gears[index].nome = nome },
  setAtual: (state, { index }) => { state.gearAtual = index },
  salvarLS: (state) => { localStorage.setItem('gears', JSON.stringify(state)) }
}

const actions = {
  init ({ commit }) {
    let LS = localStorage.getItem('gears')
    if (LS) {
      LS = JSON.parse(LS)
      LS.gears.forEach(gear => { gear.qntItens = Object.keys(gear.gear).reduce((total, atual) => !gear.gear[atual] ? total : total + 1, 0) })
      commit('init', { LS })
      commit('setAtual', { index: LS.gearAtual })
    } else {
      commit('addGear', {})
      commit('setAtual', { index: 0 })
      commit('salvarLS')
    }
  },
  selecionarAtual ({ commit, state, dispatch }, { index }) {
    commit('setAtual', { index })
  },
  setNome ({ commit }, { nome, index }) {
    index = (index != null ? index : state.gearAtual)
    commit('setNome', { nome, index })
    commit('salvarLS')
  },
  async adicionarGear ({ commit }, { gear }) {
    if (gear) {
      gear = JSON.parse(JSON.stringify(gear))
      gear.qntItens = Object.keys(gear.gear).reduce((total, atual) => !gear.gear[atual] ? total : total + 1, 0)
    }
    commit('addGear', { gear })
    commit('salvarLS')
  },
  async clonarGear ({ commit, state }, { index }) {
    index = (index != null ? index : state.gearAtual)
    commit('addGear', { gear: JSON.parse(JSON.stringify(state.gears[index])) })
    commit('salvarLS')
  },
  async removerGear ({ commit }, { index }) {
    index = (index != null ? index : state.gearAtual)
    commit('removerGear', { index })
    if (index === state.gearAtual) commit('setAtual', { index: 0 })
    if (state.gears.length === 0) {
      commit('addGear', {})
      commit('setAtual', { index: 0 })
    }
    commit('salvarLS')
  },
  async editarGear ({ commit }, { gear, index }) {
    index = (index != null ? index : state.gearAtual)
    commit('editarGear', { gear: JSON.parse(JSON.stringify(gear)), index })
    commit('salvarLS')
  },
  async adicionarItem ({ commit, state, dispatch }, { item, index }) {
    const posicoesPossiveis = equipType.find(e => e.id === item.type).pos
    index = (index != null ? index : state.gearAtual)
    const gear = { ...state.gears[index].gear }
    let colocouItem = false

    for (const i in posicoesPossiveis) {
      const posicao = posicoesPossiveis[i]
      if (!gear[posicao]) {
        gear[posicao] = item
        colocouItem = true
        break
      }
    }
    if (!colocouItem) {
      const posicao = posicoesPossiveis[0]
      gear[posicao] = item
    }
    commit('editarGear', { gear, index })
    commit('addQntItens', { index })
    commit('salvarLS')
  },
  async adicionarItems ({ commit, state, dispatch }, { items, index }) {
    index = (index != null ? index : state.gearAtual)
    const gear = { ...state.gears[index].gear }

    items.forEach(item => {
      const posicoesPossiveis = equipType.find(e => e.id === item.type).pos
      let colocouItem = false

      for (const i in posicoesPossiveis) {
        const posicao = posicoesPossiveis[i]
        if (!gear[posicao]) {
          gear[posicao] = item
          colocouItem = true
          break
        }
      }
      if (!colocouItem) {
        const posicao = posicoesPossiveis[0]
        gear[posicao] = item
      }
    })

    commit('editarGear', { gear, index })
    commit('addQntItens', { index })
    commit('salvarLS')
  },
  async removerItem ({ commit, state, dispatch }, { posicao, index }) {
    index = (index != null ? index : state.gearAtual)
    const gear = { ...state.gears[index].gear }
    gear[posicao] = null
    commit('editarGear', { gear, index })
    commit('subQntItens', { index })
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
