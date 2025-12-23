<template>
  <div>
    <div v-if="mostrarMensagem === 'SIM'" class="alert alert-dismissible alert-warning" id="quandroAviso">
      <h4 align="center">COMUNICADO FBB</h4>
      <span v-html=mensagem></span>
    </div>
  <div class="login-box">
    <div class="login-logo yellow-bg">
      <router-link to="/"><img src="/static/img/logo-login.png"></router-link>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">
      <p class="login-box-msg">Faça seu acesso</p>
      <form @submit.prevent="login" @keydown="form.onKeydown($event)">

        <div v-if='error' class="alert alert-danger">
          <a class="close" data-dismiss="alert">&times;</a>
          {{ error }}
        </div>

        <div class="form-group required" :class="{ 'has-error' : form.errors.has('ds_login')}">
          <input type="text" class="form-control"
                 placeholder="Informe seu Login ou E-mail"
                 name="usuario"
                 v-model="form.ds_login"
                 v-validate="'required'"
          >
          <has-error :form="form" field="ds_login"></has-error>
          <span v-if="errors.first('usuario')" class="label label-danger"> {{ errors.first('usuario') }}</span>

        </div>

        <div class="form-group required" :class="{ 'has-error' : form.errors.has('senha')}">
          <input type="password" class="form-control"
                 :class="{'input': true, 'is-danger': errors.has('senha') }"
                 placeholder="Senha"
                 v-model="senha"
                 name="senha"
                 v-validate="'required'"
          >

          <span v-if="errors.first('senha')" class="label label-danger"> {{ errors.first('senha') }}</span>
        </div>
        <div align="center">
          <button :disabled="form.busy" type="submit" class="btn btn-primary-login btn-block btn-flat">Acessar</button>
        </div>

      </form>
      <br>
      <div align="center">
        <a id="recupera-senha" href="/esqueci-minha-senha"><span style="color: red">Esqueci minha senha</span></a>
      </div>
      <br>
      <div align="center">
      <a id="recupera-senha-msg" href="\static\img\help_senha_sgp.jpg" target="_"> <span style="color: #00569f"><i class="fa fa-question-circle" aria-hidden="true"></i>&nbsp Como recuperar minha senha?</span></a>
      </div>
    </div>
    <br>


    <vue-snotify></vue-snotify>
    <div style="color: white; text-align: center; padding: 10px; background-color: #002d4b; width:360px; margin: 0 auto 0 auto;">
          <p>Ao acessar o SGP, você está concordando com o <a style="color: #FCFC30;" target="_blank" href="https://www.fbb.org.br/images/Documentos/Etica%20e%20Integridade/2024/Programa_de_Compliance_e_Integridade_Funda%C3%A7%C3%A3o_BB.pdf?_t=1721390628">Programa de <i>Compliance</i> e Integridade</a> e o <a style="color:#FCFC30;" target="_blank" href="https://www.fbb.org.br/images/Sobre_nos/005_Governanca/Governanca/2024/C%C3%B3digo_de_%C3%89tica_Funda%C3%A7%C3%A3o_BB.pdf?_t=1706019600">Código de Ética</a> da Fundação BB.</p>
    </div>
  </div>

  </div>

</template>

<script>
  /* eslint-disable no-unused-vars */

  // import axios from 'axios'
  import Msg from '../.././mensagem_sistema.json'
  import CryptoJS from 'crypto-js'

  export default {
    name: 'Login',
    components: {
      Msg
    },
    data: function () {
      return {
        // Create a new form instance
        form: new Form({
          ds_login: '',
          senha: ''
        }),
        senha: null,
        mensagem: '',
        credentials: {
          username: '',
          password: ''
        },
        error: ''
      }
    },
    beforeMount () {
      this.mensagem = Msg.texto
      this.mostrarMensagem = Msg.ativo
    },
    methods: {
      carregaMensagem () {
      },
      login: function () {
        var store = this.$store
        var credentials = {
          username: this.form.ds_login,
          password: this.form.senha
        }
        this.$validator.validateAll().then(async (result) => {
          if (result) {
            await this.loginLaravel()
          }
        })
      },
      async loginLaravel () {
        // Chama o back end no Laravel para autenticação
        this.form.senha = CryptoJS.AES.encrypt(this.senha, 'ARtAVARECtoxYGoBsTaBLETeRanTedErEVoLIcHOlsTacKysTERSpERnaPHiCEnEthi').toString()
        // Save to local storage as well
        await this.form.post(process.env.BASEURLLARAVEL + 'auth/login').then((response) => {
          // Verifica se o usuário está ativo
          if (parseInt(response.data.usuario.bt_ativo) !== 1) {
            this.$snotify.error('Erro de autenticação: Usuário inativo.')
            return
          }
          // Grava a autenticação no Vuex
          this.$store.commit('SET_USER_LARAVEL', response.data)
          if (window.localStorage) {
            window.localStorage.removeItem('tokenLaravel')
            window.localStorage.removeItem('usuario')
            window.localStorage.removeItem('userPermissions')
            // Salva no browser o token
            window.localStorage.setItem('tokenLaravel', response.data.access_token)
            window.localStorage.setItem('tokenLaravelExpires_at', response.data.expires_at)
            window.localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
            window.localStorage.setItem('userPermissions', JSON.stringify(response.data.usuario.permissoes))
            // Cria autorização anonima (Gambiarra para funcionar o header no axios
            let setaAutorizacao = function () {
              // Se tem o token....
              if (response.data.access_token) {
                axiosLaravel.defaults.headers.Authorization = 'Bearer ' + response.data.access_token
              }
            }
            setaAutorizacao()
            this.$router.push('/dashboard')
          }
        })
          .catch((error) => {
            console.log('error', error)
            this.error = error.response.data.message
            this.$snotify.error(this.error)
          })
      }
    },
    mounted: function () {
      this.carregaMensagem()
      require('icheck')

      $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
      })
    }
  }
</script>

<style>
  html {
    height: 100%;
  }
  body{
    height: 100%;
    /*background-color: #0161AB !important;*/
    background-image: url("/static/img/background.jpg") !important;
  }
  /*
   * Page: Login & Register
   * ----------------------
   */
  .login-logo,
  .register-logo {
    font-size: 35px;
    text-align: center;
    margin-bottom: 0px !important;
    font-weight: 300;
  }
  .login-logo a,
  .register-logo a {
    color: #444;
  }
  .login-page,
  .register-page {
    background: #d2d6de;
  }
  .login-box,
  .register-box {
    width: 360px;
    margin: 0 auto !important;
    padding: 7% 0 0 0;
  }
  @media (max-width: 480px) {
    .login-box,
    .register-box {
      width: 90%;
      margin-top: 20px;
    }
  }
  .login-box-body,
  .register-box-body {
    background: #fff;
    padding: 20px;
    border-top: 0;
    color: #666;
  }
  .login-box-body .form-control-feedback,
  .register-box-body .form-control-feedback {
    color: #777;
  }
  .login-box-msg{
    margin: 0;
    text-align: center;
    padding: 0 20px 20px 20px;
  }
  .yellow-bg {
    background-color: #FCFC30;
    margin-bottom: 0px;
    margin-top: 55px;
    z-index: 3;
    position: relative;
  }

  .btn-primary {
    background-color: #002d4b !important;
    border-color: #002d4b;
  }
  .btn-primary-login {
    background-color: #002d4b !important;
    border-color: #002d4b;
    color: #fff;
  }
  button.btn-primary-login:hover, button.btn-primary-login:active {
    color: #fff;
    opacity: 0.9 ;
  }
  .has-feedback .form-control {
    padding-right: 42.5px;
  }

</style>
