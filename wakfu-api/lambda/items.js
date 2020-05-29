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

const formatarItem = item => {
  let iid = [ item.definition.item.graphicParameters.gfxId ]
  let gfx = item.definition.item.graphicParameters.femaleGfxId
  if (iid[0] !== gfx) iid.push(gfx)
  let lvl = item.definition.item.level
  let type = item.definition.item.baseParameters.itemTypeId
  if ([582, 420].includes(type)) lvl = 50
  return {
    id: item.definition.item.id,
    iid,
    title: item.title,
    lvl,
    type,
    set: item.definition.item.baseParameters.itemSetId,
    rarity: item.definition.item.baseParameters.rarity,
    shard: [
      item.definition.item.baseParameters.minimumShardSlotNumber,
      item.definition.item.baseParameters.maximumShardSlotNumber
    ],
    equipEffects: item.definition.equipEffects.map(fx => ({
      id: fx.effect.definition.actionId,
      params: fx.effect.definition.params
    }))
  }
}

module.exports.handler = async (event, context, callback) => {
  try {
    const body = JSON.stringify(await getItems())
    return callback(null, {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': 'https://wakfu-gear.netlify.app' },
      body
    })
  } catch (e) {
    return callback(null, {
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': 'https://wakfu-gear.netlify.app' },
      body: JSON.stringify({ error: e })
    })
  }
}
