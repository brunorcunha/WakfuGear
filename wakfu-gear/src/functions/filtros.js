import { equipEffects } from '../model/equipEffects'
import { equipType } from '../model/equipType'

const thisFiltros = {
  existeFiltro: (filtros, filtro) => {
    if (!filtros || !filtros.niveis || !Array.isArray(filtros[filtro])) return false
    return true
  },

  filtroNome: (items, filtros) => {
    if (!filtros || !filtros.nome || filtros.nome.length === 0) return items
    return items.filter(item => item.title && item.title[filtros.lang].toUpperCase().includes(filtros.nome.toUpperCase()))
  },

  filtroLevel: (items, filtros) => {
    if (!thisFiltros.existeFiltro(filtros, 'niveis') || filtros.niveis.length !== 2) return items

    let levelMin = parseInt(filtros.niveis[0])
    let levelMax = parseInt(filtros.niveis[1])

    if (isNaN(levelMin) || isNaN(levelMax)) return items
    if (levelMin > levelMax) levelMax = [levelMin, levelMin = levelMax][0]

    const filtro = nivel => (nivel >= levelMin && nivel <= levelMax) || thisFiltros.isPetFilter(items, filtros)
    return items.filter(item => filtro(item.lvl))
  },

  filtroRaridade: (items, filtros) => {
    if (!thisFiltros.existeFiltro(filtros, 'raridades') || filtros.raridades.length === 0) return items

    const raridades = filtros.raridades.map(e => parseInt(e)).filter(e => !isNaN(e))
    if (raridades.length === 0) return items

    const filtro = rarity => raridades.some(raridade => raridade === rarity || thisFiltros.isPetFilter(items, filtros))
    return items.filter(item => filtro(item.rarity))
  },

  filtroTipo: (items, filtros) => {
    if (!thisFiltros.existeFiltro(filtros, 'tipos') || filtros.tipos.length === 0) return items

    let tipos = filtros.tipos.map(e => parseInt(e)).filter(e => !isNaN(e))
    if (tipos.length === 0) return items
    tipos = tipos.map(b => {
      const parent = equipType.find(e => e.id === b)
      const filhos = equipType.filter(e => e.iid === b).map(e => e.id)
      return [b, (parent ? parent.iid : undefined), filhos].flat()
    }).flat()

    const filtro = type => tipos.some(tipo => tipo === type)
    return items.filter(item => filtro(item.type))
  },

  filtroBonus: (items, filtros) => {
    if (!thisFiltros.existeFiltro(filtros, 'bonus') || filtros.bonus.length === 0) return items

    let bonus = filtros.bonus.map(e => parseInt(e)).filter(e => !isNaN(e))
    if (bonus.length === 0) return items
    bonus = bonus.map(b => [b, equipEffects.find(fx => fx.id === b).iid].flat()).flat()

    const filtro = equipEffects => bonus.some(b => equipEffects.map(e => e.id).includes(b))
    return items.filter(item => filtro(item.equipEffects))
  },

  filtroLimit: (items, filtros) => {
    if (!filtros || !filtros.limit) return items.slice(0, 10)
    const limit = parseInt(filtros.limit)
    const offset = filtros.offset ? parseInt(filtros.offset) : 0
    if (isNaN(limit) || isNaN(offset)) return items.slice(0, 10)

    return items.slice(offset, limit)
  },

  isPetFilter (items, filtros) {
    if (!thisFiltros.existeFiltro(filtros, 'tipos') || filtros.tipos.length === 0) return false
    return filtros.tipos.some(e => e === 582 || e === 420)
  }
}

export default thisFiltros
