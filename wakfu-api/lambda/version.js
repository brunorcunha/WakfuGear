'use strict';
const { ALLOWED_ORIGINS } = require('./configs/variables');
const { WAPI } = require('./configs/wakfu');

module.exports.handler = async (event, context, callback) => {
  const { origin } = event.headers
  const headerCORS = (ALLOWED_ORIGINS.includes(origin)) ? origin : '*'

  try {
    const version = await WAPI.version();
    const body = JSON.stringify({ version });

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
