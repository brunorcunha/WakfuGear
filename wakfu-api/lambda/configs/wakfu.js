const { endpointWAPI } = require('./variables');
const request = require('request-promise');

const WAPIrequestVersion = async () => {
  const response = await request(`${endpointWAPI}/config.json`)
  return JSON.parse(response).version
}

const WAPIrequestItems = async (versao, tipo) => {
  const response = await request(`${endpointWAPI}/${versao}/${tipo}.json`)
  return response
}

exports.WAPI = {
  version: WAPIrequestVersion,
  items: WAPIrequestItems
}
