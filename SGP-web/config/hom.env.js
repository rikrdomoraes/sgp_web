var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
  DEBUG_MODE: true,
  BASEURL: '"https://sgphomologacao.fbb.org.br:9080"',
  BASEURLLARAVEL: '"https://sgphomologacao.fbb.org.br:5443/api/"',
  BASEURLLARAVELWEBSOCKET: '"sgphomologacao.fbb.org.br"'
})
