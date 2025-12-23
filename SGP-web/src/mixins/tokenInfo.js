import moment from 'moment'
export const tokenInfo = {
  created () {
    if (window.localStorage.getItem('tokenLaravel')) {
      let token = window.localStorage.getItem('tokenLaravel')
      let base64Url = token.split('.')[1]
      let base64 = base64Url.replace('-', '+').replace('_', '/')
      let tokenExpiraEm = JSON.parse(window.atob(base64)).exp // pega a data que o token vai expirar
      var currentTime = new Date().getTime() / 1000
      if (currentTime > tokenExpiraEm) {
        this.$store.commit('REMOVE_USER')
        this.$store.commit('REMOVE_USER_DETAIL')
        this.$store.commit('REMOVE_USER_LARAVEL')
        this.$store.commit('REMOVE_USER_DETAIL')
        if (window.localStorage) {
          window.localStorage.removeItem('tokenLaravel')
          window.localStorage.removeItem('usuario')
          window.localStorage.removeItem('tokenLaravelExpires_at')
        }
        this.$router.push('/login')
      }
    }
  },
  methods: {
    verificaToken: function () {
      console.log('verificaToken')
      if (window.localStorage.getItem('token')) {
        let token = window.localStorage.getItem('token')
        let base64Url = token.split('.')[1]
        let base64 = base64Url.replace('-', '+').replace('_', '/')
        // pega a data que o token vai expirar
        let tokenExpiraEm = moment(JSON.parse(window.atob(base64)).exp)
        // pega a data atual do sistema
        let currentTime = new Date().getTime() / 1000

        // verifica se o token já expirou
        if (currentTime > tokenExpiraEm) {
          // Se expirou remove os dados do local Storage e do Vuex
          this.$store.commit('REMOVE_USER')
          this.$store.commit('REMOVE_USER_DETAIL')
          this.$store.commit('REMOVE_USER_LARAVEL')
          if (window.localStorage) {
            window.localStorage.removeItem('token')
            window.localStorage.removeItem('user')
            window.localStorage.removeItem('userPermissions')
            window.localStorage.removeItem('tokenLaravel')
          }
          this.$router.push('/login')
        }
      }
    }
  }
}
