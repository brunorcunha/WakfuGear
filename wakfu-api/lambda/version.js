'use strict';
const AWS = require('aws-sdk')
const request = require('request-promise')

async function verificarVersaoAPI () {
  return JSON.parse(await request('https://wakfu.cdn.ankama.com/gamedata/config.json'))
}

module.exports.handler = async (event, context, callback) => {
  try {
    const body = JSON.stringify(await verificarVersaoAPI())
    callback(null, {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body
    })
  } catch (e) {
    callback(null, {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e })
    })
  }
}
