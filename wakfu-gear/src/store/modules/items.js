import semver from 'semver'
import api from '../../api/items'

const state = {
  versao: '',
  items: [],
  itemsList: [],
  existItems: false
}

const getters = {
  versao: state => state.versao,
  items: state => state.items,
  itemsList: state => state.itemsList,
  existItems: state => state.existItems
}

const mutations = {
  setVersao: (state, versao) => { state.versao = versao },
  setItems: (state, items) => { state.items = items },
  setItemsList: (state, itemsList) => { state.itemsList = itemsList },
  setExistItems: (state, existItems) => { state.existItems = !!existItems }
}

const actions = {
  async init ({ commit }, lang) {
    const fnLocal = async () => {
      const dados = await api.getItems()
      const versao = await api.getVersion()
      const itens = dados.filter(e => !!e.title).sort((a, b) => a.lvl - b.lvl)
      const itensList = itens.map(e => e.title[lang] || e.title['fr']).sort()
      localStorage.setItem('versao', versao.version)
      localStorage.setItem('itens', JSON.stringify(itens))
      localStorage.setItem('itensList', JSON.stringify(itensList))
    }

    if (!localStorage['versao'] || !localStorage['itens']) {
      await fnLocal()
    } else {
      const versao = await api.getVersion()
      if (semver.gt(versao.version.replace('1.', ''), localStorage['versao'].replace('1.', ''))) {
        commit('setVersao', versao.version)
      }
    }

    commit('setVersao', localStorage.getItem('versao'))
    commit('setItems', JSON.parse(localStorage.getItem('itens')))
    commit('setItemsList', JSON.parse(localStorage.getItem('itensList')))
    commit('setExistItems', true)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
