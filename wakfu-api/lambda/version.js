'use strict';
const AWS = require('aws-sdk')
const request = require('request-promise')

const verificarVersaoAPI = async () => {
  return JSON.parse(await request('https://wakfu.cdn.ankama.com/gamedata/config.json'))
}

module.exports.handler = async (event, context, callback) => {
  try {
    const body = JSON.stringify(await verificarVersaoAPI())
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
