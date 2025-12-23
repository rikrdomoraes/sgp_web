var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEBUG_MODE: true,
  BASEURL: '"http://sgphomologacao.fbb.org.br:9080"',
  BASEURLLARAVEL: '"http://localhost:8000/api/"',
  BASEURLLARAVELWEBSOCKET: '"sgphomologacao.fbb.org.br"',
});
