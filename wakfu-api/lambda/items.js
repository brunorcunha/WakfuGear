'use strict';
const AWS = require('aws-sdk')
const request = require('request-promise')

const { MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME, AWS_REGION } = process.env
const s3 = new AWS.S3({
  signatureVersion: 'v4',
  credentials: new AWS.Credentials(MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY),
  region: AWS_REGION
})
const S3_PARAMS = { Bucket: S3_BUCKET_NAME }
const fs = {
  access: Key => s3.headObject({ ...S3_PARAMS, Key }).promise(),
  readFile: Key => s3.getObject({ ...S3_PARAMS, Key }).promise(),
  writeFileSync: (Key, payload) => {
    const bufferObject = new Buffer.from(payload)
    return s3.putObject({...S3_PARAMS, Key, ContentType: 'application/json', Body: bufferObject }).promise()
  }
}
const endpointWAPI = 'https://wakfu.cdn.ankama.com/gamedata'

const WAPIrequestVersao = async () => {
  const response = await request(`${endpointWAPI}/config.json`)
  return JSON.parse(response).version
}
const WAPIrequestItems = async (versao, tipo) => {
  const response = await request(`${endpointWAPI}/${versao}/${tipo}.json`)
  return response
}
const FSreadFile = async (versao, tipo) => {
  return (await fs.readFile(`${versao}/${tipo}.json`)).Body.toString()
}
const FSwriteFile = async (versao, tipo, data) => {
  return await fs.writeFileSync(`${versao}/${tipo}.json`, data)
}

const getItemsSaved = async (versao, tipo) => {
  let response = ''
  try {
    await fs.access(`${versao}/${tipo}.json`)
    response = await FSreadFile(versao, tipo)
  } catch (e) {
    response = await WAPIrequestItems(versao, tipo)
    await FSwriteFile(versao, tipo, response)
  }
  return JSON.parse(response)
}

const getItems = async () => {
  const versao = await WAPIrequestVersao()
  const items = await getItemsSaved(versao, 'items')
  const itemsFormatados = items.map(item => formatarItem(item))
  return itemsFormatados
}

const verificarGFX = item => {
  let iid = item.definition.item.graphicParameters.gfxId
  let id = item.definition.item.id
  let type = item.definition.item.baseParameters.itemTypeId
  return `${iid}` === `${type}${id}`
}

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
    { iid: 1061, id: 1055 }
  ]
  const ArrayIID = IIDtoID.map(e => e.iid)

  return equipEffects.map(fx => {
    const tID = fx.effect.definition.actionId
    let params = fx.effect.definition.params
    let id = tID

    if (ArrayIID.includes(tID)) {
      id = IIDtoID.find(e => e.iid === tID).id
      if (params && params[0]) params[0] *= -1
    }

    return {id, params }
  })
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
  if ([582, 420].includes(type)) lvl = 50

  const equipEffects = formatarEquipEffects(item.definition.equipEffects)

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
  const ALLOWED_ORIGINS = [
    'http://localhost:8080/',
    'https://wakfu-gear.netlify.app'
  ]
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
