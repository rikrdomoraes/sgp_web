export const trataErro = {
  created () {
  },
  methods: {
    trataErro (error) {
      let mensagem = null
      if (error.response.status) {
        if (error.response.status === 403) {
          mensagem = error.response.data.message
        }
        if (error.response.status === 503) {
          mensagem = 'Sistema esta em manutenção favor acessar novamente daqui a alguns segundos. Obrigado'
        }
        if (error.response.status === 422) {
          mensagem = _.flattenDeep(Object.values(error.response.data.error))
        }
      }
      if (!error.response) {
        mensagem = 'Nenhum registro encontrado'
      } else if (error.response.status) {
        if (error.response.status === 401) {
          mensagem = 'sem acesso para buscar informações necessárias'
          this.$snotify.error(mensagem) // primeira parte é a mensagem depois a configuração padrão
          setTimeout(function () {
            if (window.localStorage) {
              window.localStorage.removeItem('token')
              window.localStorage.removeItem('user')
              window.localStorage.removeItem('userPermissions')
              window.localStorage.removeItem('tokenLaravel')
            }
            location.reload(true)
          }, 3000)
        } else if (error.response.status === 500) {
          if (error.response.data.error) {
            mensagem = 'Erro no processamento da requisição. ' + error.response.data.error
          } else if (error.response.data.message) {
            mensagem = 'Erro no processamento da requisição. ' + error.response.data.message
          } else {
            mensagem = 'Erro no processamento da requisição. ' + error.response.data
          }
        } else if (error.response.status === 409) {
          mensagem = error.response.data.responseInfo.reasons[0].detail
        }
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        mensagem = error.response.data
      } else if (error.request) {
        mensagem = error.request
      } else {
        // Something happened in setting up the request that triggered an Error
        mensagem = error.message
      }
      this.$snotify.error(mensagem, {bodyMaxLength: 1200}) // primeira parte é a mensagem depois a configuração padrão
      console.log('%cErro:', 'font-size: 20px; background: red; color: white', error.response)

      return mensagem
    }
  }
}
