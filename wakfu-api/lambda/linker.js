'use strict';
const AWS = require('aws-sdk')
const request = require('request-promise')

async function getLinker (resource, params) {
  return await request('http://www.wakfu.com/fr/linker/' + resource + '?' + Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&'))
}

module.exports.handler = async (event, context, callback) => {
  console.log(event)
  if (event.httpMethod === 'OPTIONS') {
    callback(null, {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '2592000',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
    return
  } else if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body)
      const body = await getLinker(data.resource, data.params)
      console.log(body)
      callback(null, {
        statusCode: 200,
        headers: {'Access-Control-Allow-Origin': '*'},
        body
      })
    } catch (e) {
      callback(null, {
        statusCode: 200,
        headers: {'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({error: e})
      })
    }
  }
}
