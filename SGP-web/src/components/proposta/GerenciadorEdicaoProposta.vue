  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
<template>
    <!-- <div v-if="detalhamento" class="column all-centered botao-flutuante">
      <i class="fa fa-users" aria-hidden="true"></i>
    </div> -->
    <div class="column all-end gerenciador-presenca-container" :class="podeEditar ? 'edicao-permitida' : 'edicao-nao-permitida' ">
        <div>
            <i class="fa fa-pencil" aria-hidden="true"></i> <i>Gerenciador de Edição da Proposta [ {{ numeroProposta }} ]</i>
        </div>
        <div v-if="Object.keys(sessaoAtiva).length > 0">
            <b>{{ sessaoAtiva.user_name == usuarioLogado.ds_nome_usuario && !podeEditar ? 'Você já está editando em outra aba ou navegador' : 'Editando agora: ' + sessaoAtiva.user_name }}</b> <i class="fa fa-user" aria-hidden="true"></i>
        </div>
        <div v-if="podeEditar">
            Última Atualização de Presença: <b>{{ moment(sessaoAtiva.ultimo_ping).format('DD/MM/YYYY HH:mm:ss') }}</b> <i class="fa fa-circle" aria-hidden="true"></i>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  export default {
    components: {
    },
    name: 'GerenciadorEdicaoProposta',
    data () {
      return {
        loading: false,
        moment: moment,
        decisaoEdicao: 'Pendente',
        sessaoAtiva: {},
        podeEditar: false,
        intervalPing: null,
        enderecoHome: 'https://sgphomologacao.fbb.org.br',
        enderecoEncerrarSessao: 'https://sgphomologacao.fbb.org.br:5443/api/gerenciadorEdicao/encerraSessao/'
      }
    },
    props: ['numeroProposta'],
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      chiefActive () {
        return this.usuarioLogado.entity.chiefs.some(chefe => {
          return chefe.active === true && moment(new Date()).isSameOrAfter(moment(chefe.initialMandateDate)) && moment(new Date()).isSameOrBefore(moment(chefe.endMandateDate))
        })
      }
    },
    created: function () {
      if (!sessionStorage.getItem('tabId')) {
        const tabId = Date.now().toString() + Math.random().toString(36).substr(2)
        sessionStorage.setItem('tabId', tabId)
      }
    },
    mounted: function () {
      this.verificarSessaoAtiva()
    },
    beforeDestroy: function () {
      if (this.intervalPing) {
        clearInterval(this.intervalPing)
      }
      if (this.podeEditar) {
        window.removeEventListener('beforeunload', this.encerrarSessao)
        this.encerrarSessao()
      }
      // Colocar a função de encerrar sessao de edicao aqui
    },
    methods: {
      async verificarSessaoAtiva () {
        console.log('Verificando Sessao de Edição Ativa...')
        this.$snotify.async('Verificando Sessão de Edição ativa...', {timeout: 0})
        this.loading = true
        let obj = {
          proposta_id: this.numeroProposta,
          user_id: this.usuarioLogado.id,
          user_name: this.usuarioLogado.ds_nome_usuario,
          uid_aba: sessionStorage.getItem('tabId'),
          navegador: this.verificaNavegador()
        }
        await axiosLaravel.post('/gerenciadorEdicao/verificarEdicaoPropostaAtiva/', obj)
          .then((response) => {
            // Regra de negocio
            this.$snotify.clear()
            this.decisaoEdicao = response.data.resultado
            this.sessaoAtiva = response.data.sessao

            if (this.decisaoEdicao === 'Edição Permitida') {
              this.$snotify.success('Sessão Verificada: ' + response.data.resultado)
              this.podeEditar = true
              this.iniciarPing()
              window.addEventListener('beforeunload', this.encerrarSessao)
            } else {
              this.podeEditar = false
              let mensagem = `Proposta em edição pelo usuário: ${this.sessaoAtiva.user_name}. Não será possível salvar enquanto a sessão do usuário nessa proposta estiver ativa. Deseja continuar para VISUALIZAR a proposta?`
              if (this.usuarioLogado.ds_nome_usuario === this.sessaoAtiva.user_name && this.sessaoAtiva.navegador === this.verificaNavegador()) {
                mensagem = `Atenção: Proposta em edição em outra aba. Não será possível salvar. Deseja continuar para VISUALIZAR a proposta nesta aba?`
              } else if (this.usuarioLogado.ds_nome_usuario === this.sessaoAtiva.user_name && this.sessaoAtiva.navegador !== this.verificaNavegador()) {
                mensagem = `Atenção: Proposta em edição em outro navegador. Não será possível salvar. Deseja continuar para VISUALIZAR a proposta nesta aba?`
              }
              this.$dialog.confirm(mensagem, {html: true, animation: 'fade', customClass: 'avisoAlerta'})
                .then(dialog => {
                  console.log('concordou')
                }).catch(() => {
                  window.location.href = this.enderecoHome
                })
            }
            console.log(response.data)
          })
          .catch((error) => {
            console.log(error)
          })
        this.loading = false
        console.log('sessaoVerificada ', this.decisaoEdicao)
        this.$emit('sessaoVerificada', this.podeEditar)
      },
      iniciarPing () {
        if (this.intervalPing) {
          clearInterval(this.intervalPing)
        }
        this.intervalPing = setInterval(() => {
          this.ping()
        }, 60000)
      },
      ping () {
        console.log('Atualizando presença de edição...')
        this.loading = true
        let obj = {
          proposta_id: this.numeroProposta,
          user_id: this.usuarioLogado.id,
          user_name: this.usuarioLogado.ds_nome_usuario,
          uid_aba: sessionStorage.getItem('tabId'),
          navegador: this.verificaNavegador()
        }
        axiosLaravel.post('/gerenciadorEdicao/verificarEdicaoPropostaAtiva/', obj)
          .then((response) => {
            // Regra de negocio
            console.log('ping edição:', response.data)
            this.sessaoAtiva = response.data.sessao
          })
          .catch((error) => {
            console.log(error)
          })
        this.loading = false
      },
      verificaNavegador () {
        const ua = navigator.userAgent
        let navegador = ''
        if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
          navegador = 'Chrome'
        } else if (ua.includes('Firefox')) {
          navegador = 'Firefox'
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
          navegador = 'Safari'
        } else if (ua.includes('Edg')) {
          navegador = 'Edge'
        } else if (ua.includes('OPR') || ua.includes('Opera')) {
          navegador = 'Opera'
        } else {
          navegador = 'Desconhecido'
        }
        return navegador
      },
      encerrarSessao () {
        console.log('Encerrando a sessao...')
        let propostaId = this.numeroProposta
        // TODO: Colocar a url full
        const url = this.enderecoEncerrarSessao + propostaId
        // Envia a requisição silenciosa
        navigator.sendBeacon(url)
      }
    }
  }
</script>

<style>
    .gerenciador-presenca-container {
        padding: 10px 20px;
        border-radius: 20px;
        margin-bottom: 10px;
        margin-top: 10px;
        box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
        border: 2px solid #FFFFFF;
    }

    .edicao-permitida {
      background-color: rgb(21, 136, 243);
      color: #FFFFFF;
    }

    .edicao-nao-permitida {
      background-color: rgb(206, 89, 34);
      color: #FFFFFF;
    }

    .botao-flutuante {
      cursor: pointer;
      position: fixed;
      top: 100px;
      right: 2%;
      width: 30px;
      height: 30px;
      border-radius: 20px;
      background-color: rgb(21, 136, 243);
      box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
      border: 2px solid #FFFFFF;
      color: #FFFFFF;
      z-index: 9999;
    }
</style>
