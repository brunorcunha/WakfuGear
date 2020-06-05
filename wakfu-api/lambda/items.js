'use strict';
const { fs } = require('./configs/cache')
const { ALLOWED_ORIGINS } = require('./configs/variables');
const { WAPI } = require('./configs/wakfu');

const FSreadFile = async (version, tipo) => {
  return (await fs.readFile(`${version}/${tipo}.json`)).Body.toString()
}

const FSwriteFile = async (version, tipo, data) => {
  return await fs.writeFileSync(`${version}/${tipo}.json`, data)
}

const getItemsSaved = async (version, tipo) => {
  let response = ''
  try {
    await fs.access(`${version}/${tipo}.json`)
    response = await FSreadFile(version, tipo)
  } catch (e) {
    response = await WAPI.items(version, tipo)
    await FSwriteFile(version, tipo, response)
  }
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
    { iid: 21, id: 20 },
    { iid: 32, id: 31 },
    { iid: 56, id: 31 },
    { iid: 57, id: 41 },
    { iid: 1063, id: 71 },
    { iid: 90, id: 80 },
    { iid: 100, id: 80 },
    { iid: 93, id: 82 },
    { iid: 94, id: 83 },
    { iid: 92, id: 84 },
    { iid: 130, id: 120 },
    { iid: 132, id: 122 },
    { iid: 1056, id: 149 },
    { iid: 168, id: 150 },
    { iid: 161, id: 160 },
    { iid: 167, id: 166 },
    { iid: 172, id: 171 },
    { iid: 174, id: 173 },
    { iid: 176, id: 175 },
    { iid: 181, id: 180 },
    { iid: 192, id: 191 },
    { iid: 194, id: 191 },
    { iid: 876, id: 875 },
    { iid: 1060, id: 1053 },
    { iid: 1061, id: 1055 },
    { iid: 93, id: 82 },
    { iid: 97, id: 82 },
    { iid: 94, id: 83 },
    { iid: 98, id: 83 },
    { iid: 92, id: 84 },
    { iid: 96, id: 84 }
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
  const minShard = item.definition.item.baseParameters.minimumShardSlotNumber
  const maxShard = item.definition.item.baseParameters.maximumShardSlotNumber
  const shard = [minShard, maxShard]
  let lvl = item.definition.item.level
  let iid = [ item.definition.item.graphicParameters.gfxId ]
  if (iid[0] !== gfx) iid.push(gfx)

  let equipEffects = formatarEquipEffects(item.definition.equipEffects)
  if ([582, 420].includes(type)) {
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
    shard,
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
