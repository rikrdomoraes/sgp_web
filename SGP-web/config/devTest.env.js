var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEBUG_MODE: true,
  BASEURL: '"https://sgpteste.fbb.org.br:9080"',
  BASEURLLARAVEL: '"https://sgpteste.fbb.org.br:5443/api/"',
  BASEURLLARAVELWEBSOCKET: '"sgpdesenvolvimento.fbb.org.br"'
})
