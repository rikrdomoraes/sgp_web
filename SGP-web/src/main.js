import Vue from 'vue'
import Resource from 'vue-resource'
import VueRouter from 'vue-router'

import NotFound from './components/modules/dashboard/404.vue'
// eslint-disable-next-line no-unused-vars
import routes from './routes'
import store from './store'
import axios from 'axios'
import 'babel-polyfill'

import vueButtonEffect from 'vue-button-effect'
Vue.use(vueButtonEffect)

import { Form, HasError, AlertError } from '../src/vform'

window.Form = Form
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

// mixins
import {authorize} from './mixins/authorize'
import {trataErro} from './mixins/trataResponseErro'
import {tokenInfo} from './mixins/tokenInfo'
import {verificaFormulario} from './mixins/verificaFormulario'
import {validaProposta} from './mixins/validaProposta'
import {formataNumero} from './mixins/formataNumero'
import {isAdmin} from './mixins/isAdmin'
import {isFundacao} from './mixins/isFundacao'
import {buscaCategorizadores} from './mixins/buscaCategorizadores'
import {buscaFormasJuridicas} from './mixins/buscaFormasJuridicas'
import {buscaRamoAtividades} from './mixins/buscaRamoAtividades'
import {buscatiposRegistros} from './mixins/buscatiposRegistros'
import {buscaQuestionarioRisco} from './mixins/buscaQuestionarioRisco'
// import multiselect
import Multiselect from 'vue-multiselect'

import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

// tooltip
import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'
Vue.use(Tooltip)

Vue.directive('resizable', {
  inserted: function (el) {
    el.addEventListener('input', function (e) {
      e.target.style.height = 'auto'
      e.target.style.height = e.target.scrollHeight + 'px'
    })
  }
})

import vueHeadful from 'vue-headful'
Vue.component('vue-headful', vueHeadful)

import VSwitch from 'v-switch-case'
Vue.use(VSwitch)
//
import draggable from 'vuedraggable'
Vue.component('draggable', draggable)
//
// Quill Editor e módulos de resize e compress images dele -----------
import Quill from 'quill'
//
import ImageResize from 'quill-image-resize'
Quill.register('modules/imageResize', ImageResize)
//
import ImageCompress from 'quill-image-compress'
Quill.register('modules/imageCompress', ImageCompress)
//
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
// ------------------------------------------------------------------
//
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
Vue.component('VueSlider', VueSlider)

import VueTippy from 'vue-tippy'
Vue.use(VueTippy)

import {Tabs, Tab} from 'vue-tabs-component'
Vue.component('tabs', Tabs)
Vue.component('tab', Tab)

// register Multi select globally
Vue.component('multiselect', Multiselect)

import 'v-slim-dialog/dist/v-slim-dialog.css'
import SlimDialog from 'v-slim-dialog'

Vue.use(SlimDialog)

// Progress bar
import VueProgress from 'vue-progress'
Vue.use(VueProgress)
// Resource logic
Vue.use(Resource)
Vue.http.options.emulateJSON = true

// import {ServerTable, ClientTable, Event} from 'vue-tables-2'
import {ClientTable} from 'vue-tables-2'
Vue.use(ClientTable, {}, false, 'bootstrap3')

import VueSweetalert from 'vue-sweetalert'
Vue.use(VueSweetalert)

import DatePicker from 'vue2-datepicker'
Vue.use(DatePicker)

// Calendario
// import VueMaterial from 'vue-material'
// Vue.use(VueMaterial)

import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import 'flatpickr/dist/l10n/pt.js'
Vue.use(flatPickr)

// datepicker
import Datepicker from 'vuejs-datepicker'
Vue.component('datepicker', Datepicker)
import {ptBR} from 'vuejs-datepicker/dist/locale'
Vue.prototype.$datePickerPtBR = ptBR

// Vue mask - para colocar mascara nos campos
import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

import VModal from 'vue-js-modal'
Vue.use(VModal)

import { MdButton } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'

Vue.use(MdButton)

import vueSelect from 'vue-select'
Vue.component('v-select', vueSelect)
Vue.use(vueSelect)

import VueEvents from 'vue-events'
Vue.use(VueEvents)

// Dialog
import 'vuejs-dialog/dist/vuejs-dialog.min.css'
import VuejsDialog from 'vuejs-dialog'
Vue.use(VuejsDialog, {
  cancelText: 'Voltar',
  reverse: false,
  type: 'basic',
  animation: 'bounce',
  backdropClose: false,
  // verification: 'confirmar',
  html: true,
  // verificationHelp: 'Para sua segurança, digite "[+:verification]" para liberar a remoção',
  okText: 'Continuar'
})

// V money
import money from 'v-money'
Vue.use(money, {
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  precision: 2,
  masked: false
})

// currency
Vue.filter('real', function (value) {
  value = parseFloat(value)
  let formato = { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' }
  if (!isNaN(value)) {
    return value.toLocaleString('pt-BR', formato)
  }
})

// decimal com  ponto de milhar e duas 'casas'
Vue.filter('decimal2', function (value) {
  return !isNaN(value) ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'decimal', currency: 'BRL' }) : ''
})

// decimal com  ponto de milhar e três 'casas'
Vue.filter('decimal3', function (value) {
  return !isNaN(value) ? value.toLocaleString('pt-BR', { minimumFractionDigits: 3, style: 'decimal', currency: 'BRL' }) : ''
})

// decimal com  ponto de milhar e quatro 'casas'
Vue.filter('decimal4', function (value) {
  return !isNaN(value) ? value.toLocaleString('pt-BR', { minimumFractionDigits: 4, style: 'decimal', currency: 'BRL' }) : ''
})

// cnpj
Vue.filter('cnpj', function (value) {
  if (value) {
    return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
})
Vue.filter('cpf', function (value) {
  if (value) {
    return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
})
Vue.filter('cep', function (value) {
  if (value) {
    return value.replace(/^(\d{5})(\d{2})/, '$1-$2')
  }
})
// telefone
Vue.filter('telefone', function (value) {
  if (value) {
    if (value.length === 11) {
      if (value) {
        return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      }
    }
    if (value.length === 10) {
      if (value) {
        return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
      }
    }
  }
})

// Porcentagem com zeros
Vue.filter('percentage', function (value, decimals) {
  if (!value) value = 0
  if (!decimals) decimals = 2
  value = value * 100
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals) + '%'
})

Vue.filter('formataData', function (value) {
  const today = new Date(value)
  const yyyy = today.getFullYear()

  if (isNaN(yyyy)) {
    return ''
  }
  let mm = today.getMonth() + 1 // Months start at 0!
  let dd = today.getDate()

  if (dd < 10) dd = '0' + dd
  if (mm < 10) mm = '0' + mm

  const formated = dd + '/' + mm + '/' + yyyy
  return formated
})

Vue.use(VueRouter)

// Vue-Lodash
import VueLodash from 'vue-lodash'
const options = { name: 'lodash' } // customize the way you want to call it
Vue.use(VueLodash, options) // options is optional

// instala pacote para trandução de mensagens
import VueI18n from 'vue-i18n'
let messages = require('../static/i18n/pt_BR.js')
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'pt_BR', // set locale
  messages
})

// Validação de formulários
import VeeValidate, { Validator } from 'vee-validate'
import CpfValidator from './components/i18n/cpf.validator'
import CnpjValidator from './components/i18n/cnpj.validator'
import DateValidator from './components/i18n/validdate.validator'
import DateTimeValidator from './components/i18n/validdatetime.validator'
import DatePastValidator from './components/i18n/dateeqorpast.validator'
import DateTimePastValidator from './components/i18n/datetimeeqorpast.validator'
import DateFutureValidator from './components/i18n/dateeqorfuture.validator'
import DateTimeFutureValidator from './components/i18n/datetimeeqorfuture.validator'
import Dictionary from './components/i18n/dictionary'
import AgencyValidator from './components/i18n/agency.validator'
import contaValidator from './components/i18n/contaCorrente.validator'

Vue.use(VeeValidate, {
  locale: 'pt',
  dictionary: Dictionary,
  inject: 'false',
  fieldsBagName: 'campos'
})

Validator.extend('cpf', CpfValidator)
Validator.extend('cnpj', CnpjValidator)
Validator.extend('validdate', DateValidator)
Validator.extend('validdatetime', DateTimeValidator)
Validator.extend('dateeqpast', DatePastValidator)
Validator.extend('datetimeeqpast', DateTimePastValidator)
Validator.extend('dateeqfuture', DateFutureValidator)
Validator.extend('datetimeeqfuture', DateTimeFutureValidator)
Validator.extend('agency', AgencyValidator)
Validator.extend('contacorrente', contaValidator)

// CEP
import ViaCep from 'vue-viacep'
Vue.use(ViaCep)

// Dados bancários
import BankAccountValidator from 'br-bank-account-validator'
Vue.use(BankAccountValidator)

import VueConfirmDialog from 'vue-confirm-dialog'
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

import TextareaAutosize from 'vue-textarea-autosize'
Vue.use(TextareaAutosize)

// 1. Import Snotify
import Snotify, { SnotifyPosition } from 'vue-snotify/vue-snotify.min.js'
// 2. Use Snotify You can pass {config, options} as second argument. See the next example or setConfig in [API] section
let snotifyoptions = {
  toast: {
    position: SnotifyPosition.rightTop,
    timeout: 30000
  }
}
Vue.use(Snotify, snotifyoptions)

// Tabela Vue
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
window.boostrapTable = require('bootstrap-table')

// axios(ajax)
// window.axios = require('axios')
window.axios = axios.create({
  baseURL: process.env.BASEURL,
  transformRequest: [(data) => JSON.stringify(data)],
  // transformRequest: [(data) => JSON.stringify(data)],
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
    // 'Authorization': 'Bearer ' + response.data.access_token
  }
})
// configuração da url basica
// axios.defaults.baseURL = process.env.BASEURL
// axios.defaults.transformRequest = [(data) => JSON.stringify(data)]
// axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8'
// Axios para Laravel
window.axiosLaravel = axios.create({
  baseURL: process.env.BASEURLLARAVEL,
  // transformRequest: [(data) => JSON.stringify(data)],
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
    // 'Authorization': ''
  }
})
if (window.localStorage.tokenLaravel) axiosLaravel.defaults.headers.Authorization = 'Bearer ' + window.localStorage.tokenLaravel

// Use vuemoment
const moment = require('moment')
require('moment/locale/pt-br')
Vue.use(require('vue-moment'), {
  moment
})

// Import top level component
import App from './App.vue'

// Routing logic
var router = new VueRouter({
  routes: [
    { path: '*', component: NotFound }, ...routes
  ],
  // routes: routes,
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.hash.includes('change-my-password')) {
    let token = to.hash.split('change-my-password/').pop()
    next({name: 'altera-senha', params: {token: token}})
  } else {
    let logado = window.localStorage.getItem('usuario') !== null
    if (to.name === 'preenche-formulario-externo' && logado) { // Formulário externo e logado, redireciona para url de formulário interno (logado)
      next({path: '/formulario/' + to.params.id, params: {id: to.params.id}})
    } else if (to.name === 'preenche-formulario' && !logado) { // Formulário interno, mas não logado, redireciona para url de "formulário externo"
      next({path: '/form/' + to.params.id, params: {id: to.params.id}})
    } else {
      next()
    }
  }
})

// Check local storage to handle refreshes
if (window.localStorage) {
  if (store.state.token !== window.localStorage.getItem('token')) {
    store.commit('SET_TOKEN', window.localStorage.getItem('token'))
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.state.token
    // buscaDadosUsuario()
  }
}
// Set o caminho do Laravel
store.commit('SET_LARAVEL', process.env.BASEURLLARAVEL)
// Verificar notificações do usuário
// router.afterEach((to, from) => {
//   console.log('to', to)
//   console.log('from', from)
//   if (to.path !== from.path) {
//     axiosLaravel.get('usuario/notificacoes/').then((response) => {
//       console.log('response', response)
//     })
//       .catch((error) => {
//         if (error) {
//           this.$root.trataErro(error)
//         }
//       })
//   }
// })

router.beforeEach((to, from, next) => {
  // region Busca dados essenciais
  if (!_.isUndefined(window.localStorage.tokenLaravel)) {
    buscaFormasJuridicas.methods.buscaFormasJuridicas(store)
    buscaCategorizadores.methods.buscaCategorizadores(store)
    buscaRamoAtividades.methods.buscaRamoAtividades(store)
    buscatiposRegistros.methods.buscatiposRegistros(store)
    buscaQuestionarioRisco.methods.buscaQuestionarioRisco(store)
  }
  // endregion
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.matched.some(record => record.meta.requiresAuth) && (_.isUndefined(window.localStorage.tokenLaravel) || _.isNull(window.localStorage.tokenLaravel))) {
    next('/login')
  } else if ((!_.isUndefined(window.localStorage.tokenLaravel)) && to.path === '/login') {
    next('/dashboard')
  } else {
    next()
  }
})
// console.log(JSON.parse(localStorage.getItem('ngStorage-tokenInfo')).token)
// Start out app!
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  mixins: [authorize, trataErro, tokenInfo, verificaFormulario, validaProposta, formataNumero, isAdmin, isFundacao, buscaCategorizadores, buscaRamoAtividades, buscaFormasJuridicas, buscatiposRegistros, buscaQuestionarioRisco],
  router: router,
  store: store,
  i18n,
  render: h => h(App)
})
require('bootstrap')
require('admin-lte')
require('../node_modules/admin-lte/dist/js/demo.js')
import '../static/css/simplert_novo.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import '../static/css/AdminLTE.min.css'
import 'vue-snotify/styles/material.css'
import '../static/css/skins/skin-fbb.css'
