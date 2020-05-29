'use strict';
const AWS = require('aws-sdk')
const request = require('request-promise')

const verificarVersaoAPI = async () => {
  return JSON.parse(await request('https://wakfu.cdn.ankama.com/gamedata/config.json'))
}

module.exports.handler = async (event, context, callback) => {
  const ALLOWED_ORIGINS = [
    'http://localhost:8080/',
    'https://wakfu-gear.netlify.app'
  ]
  const { origin } = event.headers
  const headerCORS = (ALLOWED_ORIGINS.includes(origin)) ? origin : '*'

  try {
    const body = JSON.stringify(await verificarVersaoAPI())
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
