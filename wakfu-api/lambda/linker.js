'use strict';
const request = require('request-promise')
const { ALLOWED_ORIGINS } = require('./configs/variables');

const getLinker = async (resource, params) => {
  const args = Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')
  return (await request(`http://www.wakfu.com/fr/linker/${resource}?${args}`))
}

module.exports.handler = async (event, context, callback) => {
  const { origin } = event.headers
  const headerCORS = (ALLOWED_ORIGINS.includes(origin)) ? origin : '*'

  if (event.httpMethod === 'OPTIONS') {
    return callback(null, {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': headerCORS,
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '2592000',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  } else if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body)
      const body = await getLinker(data.resource, data.params)
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
}
