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

const formatarTabela = async () => {
  let versao = await verificarVersaoAPI()
  let items = await getAllItems(versao)
  items = items.map(item => formatar(item))
  return items
}

const verificarGFX = item => {
  let iid = item.definition.item.graphicParameters.gfxId
  let id = item.definition.item.id
  let type = item.definition.item.baseParameters.itemTypeId
  return `${iid}` === `${type}${id}`
}

const formatar = (item, lang) => {
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

const getAllItems = async (versao) => {
  return JSON.parse(await criarJSONSeNaoExistir(versao, 'items'))
}

const verificarVersaoAPI = async () => {
  let response = await request('https://wakfu.cdn.ankama.com/gamedata/config.json')
  let versao = JSON.parse(response).version
  return versao
}

const criarJSONSeNaoExistir = async (version, type) => {
  let response = ''
  try {
    await fs.access(`${version}/${type}.json`)
    response = (await fs.readFile(`${version}/${type}.json`)).Body.toString()
  } catch (e) {
    response = await request(`https://wakfu.cdn.ankama.com/gamedata/${version}/${type}.json`)
    await fs.writeFileSync(`${version}/${type}.json`, response)
    response = (await fs.readFile(`${version}/${type}.json`)).Body.toString()
  }
  return response
}

module.exports.handler = async (event, context, callback) => {
  try {
    const body = JSON.stringify(await formatarTabela())
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
