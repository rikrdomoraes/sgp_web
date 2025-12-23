<template>
  <header class="main-header">
    <!-- Logo -->
    <router-link to="/dashboard" class="logo">
      <!-- mini logo for sidebar mini 50x50 pixels -->
      <span class="logo-mini"><b>A</b>LT</span>
      <!-- logo for regular state and mobile devices -->
      <span class="logo-lg"><img src="" alt=""></span>
    </router-link>
    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top" v-bind:style="'background: ' + _.get(barraAmbiente(), 'cor')">
      <!-- Sidebar toggle button-->
      <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </a>
      <span style="font-size: x-large;line-height: 45px;">{{ _.get(barraAmbiente(), 'descricao') }}</span>
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">

          <li v-if="usuarioLogado.userType === 'FUNDACAO' && usuarioLogado.sujeitoAPonto" style="padding: 15px 15px;" :data-title="minutosRestanteNoPonto > 5 ? 'Horário previsto para saída' : minutosRestanteNoPonto > 0 ? 'Sua jornada de trabalho está se encerrando' : 'Fim da jornada de trabalho'">
            <span style="font-weight: bold; padding: 8px 10px; border-radius: 20px; cursor:default;"
            :class="minutosRestanteNoPonto > 10 ? 'ponto-normal' : minutosRestanteNoPonto > 0 ? 'ponto-alerta' : 'ponto-perigo'">

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="vertical-align: middle; width: 25px; height: 25px; display: inline;">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" />
              </svg>
              <!-- {{ usuarioLogado.limitePonto.slice(0,2) }}h{{  usuarioLogado.limitePonto.slice(3,5) }} -->
            </span>
          </li>

          <li class="dropdown user user-menu">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <img v-if="_.isNull(usuarioLogado.bl_foto)" :src = "'/static/img/nouser.png'" class="user-image" alt="User Image pequeno">
              <img v-else :src="usuarioLogado.bl_foto" class="user-image" alt="User Image pequeno">
              <span class="hidden-xs">{{usuarioLogado.ds_nome_usuario}}</span>
            </a>
            <ul class="dropdown-menu">
              <!-- User image -->
              <li class="user-header">
                <img :src = "usuarioLogado.bl_foto ? usuarioLogado.bl_foto : '/static/img/nouser.png'" class="img-circle" alt="User Image grande">
                <p>
                  {{usuarioLogado.userName}}
                  <small>Criado em: {{usuarioLogado.dt_criado | moment("DD-MM-YYYY")}}</small>
                </p>
              </li>
              <!-- Menu Footer-->
              <li class="user-footer">
                <div class="pull-left">
                  <router-link :to="{name: 'preferencias'}" uib-tooltip="" type="button" class="btn btn-default btn-flat"><i aria-hidden="true"></i> Preferências</router-link>
                </div>
                <div class="pull-right">
                  <a class="btn btn-default btn-flat" @click.prevent="logout">Sair</a>
                </div>
              </li>
            </ul>
          </li>

          <li v-if="usuarioLogado.ds_tipo_usuario === 'FUNDACAO'"> <!-- por enquanto somente Reinald, Mateus e Renato visualizam -->
            <a href="#" data-toggle="control-sidebar"><i class="fa fa-list"></i></a>
          </li>

        </ul>
      </div>
    </nav>
    <vue-snotify></vue-snotify>
    <dialog ref="alertaPontoDialog" id="alertaPontoDialog">
      <p><strong>Atenção!</strong> </p>
      <p v-if="minutosRestanteNoPonto <= 0" style="margin:25px 0">
        Jornada de trabalho encerrada.
      </p>
      <p v-else style="margin:25px 0">
        Em breve sua jornada de trabalho se encerrará.
      </p>
      <button class="btn btn-neutral" onclick="alertaPontoDialog.close()">Fechar</button>
    </dialog>
  </header>

</template>

<script>
  /* eslint-disable no-unused-vars */

  import moment from 'moment'
  import {mapGetters} from 'vuex'
  import uidPorAba from '../broadcastProposta/uidPorAba'

  // Websocket
  import Echo from 'laravel-echo'
  window.Pusher = require('pusher-js')
  // import { mapGetters } from 'vuex'

  export default {
    name: 'DashboardHeader',
    data () {
      return {
        image: null,
        usuarioLogado: JSON.parse(window.localStorage.usuario),
        minutosRestanteNoPonto: 60
      }
    },
    async mounted () {
      console.log('HEADER CRIADO!!')
      console.log(process.env.BASEURLLARAVELWEBSOCKET)
      // Busca Uor usuario
      // await this.verificaUOR()
      // Conecta com o Websocket
      await this.conectaWebsocket()
      // Conecta com canal aberto
      this.conectaCanalGeral()
      this.conectaUsuariosLogados()
      this.conectaCanalUsuario()
      this.$forceUpdate()
      // this.buscaDadosJava()
      // this.image = new Image()
      let blob = new Blob([this.usuarioLogado.bl_foto], {type: 'image/png'})
      let reader = new FileReader()
      reader.readAsDataURL(blob)
      let vm = this
      reader.onloadend = await function () {
        let base64data = reader.result
        this.image = base64data
        vm.$forceUpdate()
      }
      // this.showAlertaPontoModal()
      // await this.atualizaLimitePonto()
    },
    methods: {
      buscaDadosJava () {
        axios.get('/proxy/account/principal').then((response) => {
          store.commit('SET_USER_DETAIL', response.data.value)
          window.localStorage.setItem('user', JSON.stringify(response.data.value))
        })
          .catch((error) => {
            this.error = error.response.data.responseInfo.reasons[0].detail
          })
      },
      barraAmbiente () {
        let url = window.location.href
        return _.includes(url, 'localhost') ? {'cor': '#00ebd0', 'descricao': 'Ambiente de Testes'} : (_.includes(url, 'sgphomologacao') ? {'cor': '#54dcfc', 'descricao': 'Ambiente de Homologação'} : {'cor': '#fcfc30', 'descricao': ''})
      },
      logout: function () {
        this.$store.commit('REMOVE_USER')
        this.$store.commit('REMOVE_USER_DETAIL')

        if (window.localStorage) {
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('user')
          window.localStorage.removeItem('userPermissions')
          window.localStorage.removeItem('tokenLaravel')
          window.localStorage.removeItem('usuario')
          window.localStorage.removeItem('tokenLaravelExpires_at')
        }

        this.$router.push('/login')
      },
      conectaWebsocket () {
        console.log('criando ECHO')
        window.Echo = new Echo({
          broadcaster: 'pusher',
          key: 'SGPkey',
          wsHost: process.env.BASEURLLARAVELWEBSOCKET,
          wsPort: 6001,
          wssPort: 6001,
          disableStats: true,
          authEndpoint: process.env.BASEURLLARAVEL + 'broadcasting/auth',
          auth: {headers: {
            Authorization: 'Bearer ' + window.localStorage.tokenLaravel,
            'X-Aba-UID': uidPorAba
          }},
          enabledTransports: ['ws', 'wss', 'websocket']
        })
        console.log('ECHO criado.')
      },
      verificaUOR () {
        axiosLaravel.post('chamado/verificaUOR/').then((response) => {
          console.log('RLMB response.data', response.data)
          this.usuarioLogado.uor = response.data[0]
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      conectaCanalGeral () {
        window.Echo.channel('Geral')
          .listen('MensagemGeral', (e) => {
            this.$snotify.warning(e.mensagem)
          })
        console.log('conecta canal geral')
      },
      conectaUsuariosLogados () {
        window.Echo.join('usuarios-logados')
      },
      conectaCanalUsuario () {
        window.Echo.private('App.User.' + this.usuarioLogado.id)
          .listen('NotificacaoUsuario', (e) => {
            this.$snotify.warning(e.mensagem)
          })
          .notification((notification) => {
            console.log('notification', notification)
          })
        console.log('CONECTA CANAL USUARIO ECHO', this.usuarioLogado.id)
      },
      verificarTempoRestante (horaString) {
        // Obtém a hora atual
        const horaAtual = new Date()
        // Divide a horaString em horas e minutos
        // const [hora, minuto] = horaString.split(':')
        const [hora, minuto] = horaString.split(':')
        // Cria um objeto Date com a hora da string e a data atual
        const horaAlvo = new Date(horaAtual.getFullYear(), horaAtual.getMonth(), horaAtual.getDate(), hora, minuto)
        // Calcula a diferença em milissegundos
        const diferencaEmMilissegundos = horaAlvo - horaAtual
        // retorna diferença em minutos, caso tenha passado da hora, retorna negativo
        this.minutosRestanteNoPonto = parseInt((diferencaEmMilissegundos / 60 / 1000) + 1)
        return parseInt((diferencaEmMilissegundos / 60 / 1000) + 1)
      },
      showAlertaPontoModal () {
        if (!this.usuarioLogado.sujeitoAPonto) {
          return false
        }
        window.setInterval(() => {
          const minutosRestantes = this.verificarTempoRestante(this.usuarioLogado.limitePonto.slice(0, 5))
          if (minutosRestantes <= 5) {
            (!this.$refs.alertaPontoDialog.open) && this.$refs.alertaPontoDialog.showModal()
          }
          if (minutosRestantes < -5) {
            this.logout()
          }
        }, 1000 * 60)
      },
      async atualizaLimitePonto () {
        window.setInterval(() => {
          if (new Date().getHours() < 13) {
            return true // Não é necessário atualizar na parte da manhã
          }
          if (this.usuarioLogado.userType !== 'FUNDACAO' || (!this.usuarioLogado.sujeitoAPonto)) {
            return true // https://freek.dev/2212-avoid-using-else #pregandoAPalavra
          }
          axiosLaravel.get('usuario/atualiza_ponto').then((response) => {
            this.usuarioLogado.limitePonto = response.data.limitePonto
            this.usuarioLogado.sujeitoAPonto = response.data.sujeitoAPonto
          })
        }, 1000 * 3000)
      }
    }
  }
</script>
<style>
#alertaPontoDialog {
  border-radius: 0.5rem;
  border: 0px;
  background-color: #002D4B;
  color: #FFFFFF;
  padding: 35px 45px;
  box-shadow: 1px 1px 15px #444;
  z-index: 999999;
  position: fixed;
}
#alertaPontoDialog button {
  color: #002D4B;
}
#alertaPontoDialog::backdrop {
  background-color: #222222;
  opacity: 0.8;
}
.ponto-normal {
  background-color:#EEEEEE ;
  color:#002d4b;
}
.ponto-alerta {
  background-color:#EEE ;
  color:darkgoldenrod;
}
.ponto-perigo {
  background-color:crimson ;
  color:cornsilk;
}
[data-title]:hover:after {
    opacity: 1;
    transition: all 0.1s ease 0.5s;
    visibility: visible;
}
[data-title]:after {
    content: attr(data-title);
    background: #002D4B;
    color: #fff;
    position: absolute;
    padding: 5px 10px;
    bottom: -1.6em;
    left: 0px;
    white-space: nowrap;
    box-shadow: 1px 1px 3px #222222;
    border-radius: 5px;
    opacity: 0;
    z-index: 99999;
    visibility: hidden;
}
[data-title] {
    position: relative;
}
</style>
