// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
let arquivoEnv = null
// Aqui tem que ter um cuidado que dependendo do enviroment que esta rodando vai rodar como se fosse desenvolvimento como DEFAULT
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
switch (process.env.NODE_ENV) {
  case 'production':
    arquivoEnv = require('./prod.env')
    break;
  case 'development':
    arquivoEnv = require('./dev.env')
    break;
    case 'development-server':
    arquivoEnv = require('./devServer.env')
    break;
    case 'development-test':
    arquivoEnv = require('./devTest.env')
    break;
    case 'homologa':
    arquivoEnv = require('./hom.env')
    break;
  default:
    arquivoEnv = require('./dev.env')
}
module.exports = {
  build: {
    env: arquivoEnv,
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8082,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
}
