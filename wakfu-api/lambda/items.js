'use strict';
const { ALLOWED_ORIGINS } = require('./configs/variables');
const { WAPI } = require('./configs/wakfu');

const getItemsSaved = async (version, tipo) => {
  const response = await WAPI.items(version, tipo)
  return JSON.parse(response)
}

const getItems = async () => {
  const version = await WAPI.version()
  const items = await getItemsSaved(version, 'items')
  let itemsRetornados = removerItemsTipo(items)
  itemsRetornados = itemsRetornados.map(formatarItem)
  itemsRetornados = removerItemsNivelZeroUmSemFx(itemsRetornados)
  itemsRetornados = removerItemsAdministrator(itemsRetornados)
  return itemsRetornados
}

const verificarGFX = item => {
  let iid = item.definition.item.graphicParameters.gfxId
  let id = item.definition.item.id
  let type = item.definition.item.baseParameters.itemTypeId
  return `${iid}` === `${type}${id}`
}

const removerItemsTipo = items => items.filter(item => ![647, 525, 683, 812, 811, 480, 537].includes(item.definition.item.baseParameters.itemTypeId))
const removerItemsNivelZeroUmSemFx = items => items.filter(item => item.lvl > 1 || item.equipEffects.length > 0)
const removerItemsAdministrator = items => items.filter(item => ![10].includes(item.rarity))

const formatarEquipEffects = equipEffects => {
  const IIDtoID = [
    { iid: 21, id: 20 }, // PV
    { iid: 32, id: 31 }, // PA
    { iid: 56, id: 31 }, // PA
    { iid: 57, id: 41 }, // PM
    { iid: 1063, id: 71 }, // Resistência de Costas
    { iid: 90, id: 80 }, // Resistência Elementar
    { iid: 100, id: 80 }, // Resistência Elementar
    { iid: 93, id: 82 }, // Resistência a Fogo
    { iid: 94, id: 83 }, // Resistência a Água
    { iid: 92, id: 84 }, // Resistência a Terra
    { iid: 130, id: 120 }, // Domínio Elementar
    { iid: 132, id: 122 }, // Domínio de Fogo
    { iid: 1056, id: 149 }, // Domínio de Crítico
    { iid: 168, id: 150 }, // Golpe Crítico
    { iid: 161, id: 160 }, // Alcance
    { iid: 167, id: 166 }, // Sabedoria
    { iid: 172, id: 171 }, // Iniciativa
    { iid: 174, id: 173 }, // Bloqueio
    { iid: 176, id: 175 }, // Esquiva
    { iid: 181, id: 180 }, // Domínio de Costas
    { iid: 192, id: 191 }, // PW
    { iid: 194, id: 191 }, // PW
    { iid: 876, id: 875 }, // Parada
    { iid: 1060, id: 1053 }, // Domínio de Distância
    { iid: 1061, id: 1055 }, // Domínio de Berserk
    { iid: 93, id: 82 }, // Resistência a Fogo
    { iid: 97, id: 82 }, // Resistência a Fogo
    { iid: 94, id: 83 }, // Resistência a Água
    { iid: 98, id: 83 }, // Resistência a Água
    { iid: 92, id: 84 }, // Resistência a Terra
    { iid: 96, id: 84 } // Resistência a Terra
  ]
  const ArrayIID = IIDtoID.map(e => e.iid)

  let equipFx = equipEffects.map(fx => {
    const tID = fx.effect.definition.actionId
    let params = fx.effect.definition.params
    let id = tID

    if (ArrayIID.includes(tID)) {
      id = IIDtoID.find(e => e.iid === tID).id
      if (params && params[0]) params[0] *= -1
    } else {
      if (id === 1068) id = parseInt(`91068${params[2]}`) // Dominio
      if (id === 1069) id = parseInt(`91069${params[2]}`) // Resistencia
      if (id === 42) id = 184 // Controle
    }

    return { id, params }
  })
  const listaDominios = [
    120, // Domínio Elementar
    149, // Domínio de Crítico
    180, // Domínio de Costas
    1050, // Domínio de Zona
    1051, // Domínio de Alvo Único
    1052, // Domínio de Corpo a Corpo
    1053, // Domínio de Distância
    1055, // Domínio de Berserk
    910681, // Domínio sobre 1 elemento
    910682, // Domínio sobre 2 elemento
    910683, // Domínio sobre 3 elementos
    122, // Domínio de Fogo
    123, // Domínio de Terra
    124, // Domínio de Água
    125 // Domínio de Ar
  ];
  const somatoriaDominios = equipFx.reduce((ac, item) => listaDominios.includes(item.id) ? ac + item.params[0] : ac, 0);
  equipFx.push({ id: 9999, params: [somatoriaDominios, 0] });
  return equipFx.filter(e => ![1020, 1062, 400].includes(e.id))
}

const formatarItemsComLevel = (equipEffects, lvl) => {
  equipEffects.forEach(fx => {
    fx.params.unshift(fx.params[0] + parseInt(fx.params[1] * lvl))
  })
  return equipEffects
}

const formatarItem = item => {
  const id = item.definition.item.id
  const title = item.title
  const set = item.definition.item.baseParameters.itemSetId
  const gfx = item.definition.item.graphicParameters.femaleGfxId
  const type = item.definition.item.baseParameters.itemTypeId
  const rarity = item.definition.item.baseParameters.rarity
  // const minShard = item.definition.item.baseParameters.minimumShardSlotNumber
  // const maxShard = item.definition.item.baseParameters.maximumShardSlotNumber
  // const shard = [minShard, maxShard]
  let lvl = item.definition.item.level
  let iid = [ item.definition.item.graphicParameters.gfxId ]
  if (iid[0] !== gfx) iid.push(gfx)

  let equipEffects = formatarEquipEffects(item.definition.equipEffects)
  if ([582, 420, 611].includes(type)) {
    equipEffects = formatarItemsComLevel(equipEffects, 50) // Pets
    lvl = 50
  }
  if (lvl === 0 && rarity === 3) {
    equipEffects = formatarItemsComLevel(equipEffects, 100) // Makabra Items
    lvl = 100
  }

  return {
    id,
    iid,
    title,
    lvl,
    type,
    set,
    rarity,
    equipEffects
  }
}

module.exports.handler = async (event, context, callback) => {
  const { origin } = event.headers
  const headerCORS = (ALLOWED_ORIGINS.includes(origin)) ? origin : '*'
  try {
    const body = JSON.stringify(await getItems())
    return callback(null, {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': headerCORS },
      body
    })
  } catch (e) {
    return callback(null, {
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': headerCORS },
      body: JSON.stringify({ error: e })
    })
  }
}
