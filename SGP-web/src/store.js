import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  token: null,
  tokenLaravel: null,
  user: window.localStorage.user,
  usuario: window.localStorage.usuario ? JSON.parse(window.localStorage.usuario) : null,
  userPermissions: window.localStorage.userPermissions,
  laravelurl: null,
  categorizadores: [],
  ramoAtividades: [],
  formasJuridicas: [],
  configuracoes: [],
  questionarioRisco: [],
  tipoRegistros: [],
  projetosDuplicacao: []
}
const env = {
  laravel: ''
}

const mutations = {
  SET_TOKEN (state, token) {
    state.token = token
  },
  REMOVE_TOKEN (state) {
    state.token = null
  },
  SET_USER (state, data) {
    state.token = data.token
    state.userPermissions = data.info
  },
  REMOVE_USER (state) {
    state.token = null
    state.userPermissions = null
  },
  SET_USER_LARAVEL (state, data) {
    state.tokenLaravel = data.access_token
    state.usuario = data.usuario
    state.userPermissions = data.usuario.permissoes
  },
  REMOVE_USER_LARAVEL (state) {
    state.tokenLaravel = null
    state.usuario = null
  },
  SET_USER_DETAIL (state, data) {
    state.user = data
  },
  REMOVE_USER_DETAIL (state) {
    state.user = null
  },
  SET_LARAVEL (state, url) {
    state.laravelurl = url.replace('/api/', '')
  },
  SET_CATEGORIZADORES (state, data) {
    state.categorizadores = data
  },
  SET_RAMO_ATIVIDADES (state, data) {
    state.ramoAtividades = data
  },
  SET_FORMAS_JURIDICAS (state, data) {
    state.formasJuridicas = data
  },
  SET_CONFIGURACOES (state, data) {
    state.configuracoes = data
  },
  SET_QUESTIONARIO (state, data) {
    state.questionarioRisco = data
  },
  SET_TIPOREGISTROS (state, data) {
    state.tipoRegistros = data
  },
  SET_PROJETOS_DUPLICACAO (state, data) {
    state.projetosDuplicacao = data
  }
}

const getters = {
  usuarioLogado: (state) => {
    return (state.usuario)
  },
  urlLaravel: () => {
    return (env.laravel)
  }
}

// Guarda as informações dos itens de despesas
const ItensDespesas = {
  state: {
    produtos: [],
    servicos: []
  },
  getters: {
    produtos: (state) => {
      return (state.produtos)
    },
    servicos: (state) => {
      return (state.servicos)
    }
  }
}

// Guarda informações do módulo de upload de documentos
const UploadDocumentos = {
  state: {
    tiposPermitidos: null,
    tamanhoPermitido: null,
    documentos: []
  },
  getters: {
    tiposPermitidos: (state) => {
      return (state.tiposPermitidos)
    },
    tamanhoPermitido: (state) => {
      return (state.tamanhoPermitido)
    },
    documentos: (state) => {
      return (state.documentos)
    }
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  modules: {
    itensDespesas: ItensDespesas,
    uploadDocumentos: UploadDocumentos
  }
})
