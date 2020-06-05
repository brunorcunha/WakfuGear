'use strict';
const request = require('request-promise')
const { ALLOWED_ORIGINS } = require('./configs/variables');

const requestBuild = id => {
  return request({
    uri: `https://zenithwakfu.com/builder/api/build/${id}`,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    json: true
  })
}

module.exports.handler = async (event, context, callback) => {
  const { origin } = event.headers
  const { id } = event.queryStringParameters
  const headerCORS = (ALLOWED_ORIGINS.includes(origin)) ? origin : '*'

  try {
    const json = await requestBuild(id)
    let retorno = {
      gear: json.equipements.map(e => e.id_equipment),
      titulo: json.name_build
    }

    const body = JSON.stringify(retorno)
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
