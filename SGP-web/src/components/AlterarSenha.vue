<template>
  <div class="login-box">
    <div class="login-logo yellow-bg">
      <router-link to="/"><img src="/static/img/logo-login.png"></router-link>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">
      <p class="login-box-msg">Faça seu acesso</p>
      <form @submit.prevent="submit">

        <div v-if='error' class="alert alert-danger">
          <a class="close" data-dismiss="alert">&times;</a>
          {{ error }}
        </div>
        <p class="ng-binding">Alterar senha</p>
        <div class="form-group required"  :class="{ 'has-error' : errors.first('novaSenha')}">
          <input type="password" class="form-control"
                 :class="{'input': true, 'is-danger': errors.has('novaSenha') }"
                 placeholder="Digite a Senha"
                 name="novaSenha"
                 data-vv-as="nova senha"
                 v-model="form.novaSenha"
                 v-validate="'required|min:6'"
                 vid="novaSenha"
                 ref="novaSenhaRef"
          >
          <span v-if="errors.first('novaSenha')" class="label label-danger"> {{ errors.first('novaSenha') }}</span>

        </div>
        <div class="form-group has-feedback" style="font-size: smaller; font-style: italic;">Pelo menos 6 caracteres (letras ou números)</div>
        <div class="form-group required" :class="{ 'has-error' : errors.first('confirmaSenha')}">
          <input type="password" class="form-control"
                 :class="{'input': true, 'is-danger': errors.has('confirmaSenha') }"
                 placeholder="confirme a senha"
                 data-vv-as="confirma senha"
                 v-model="form.confirmaSenha"
                 name="confirmaSenha"
                 v-validate="'required|confirmed:novaSenhaRef'"
          >
          <span v-if="errors.first('confirmaSenha')" class="label label-danger"> {{ errors.first('confirmaSenha') }}</span>
        </div>
        <div align="center">

            <button type="submit" class="btn btn-primary btn-block btn-flat">Alterar</button>
             <!--<g-button-ujarak :disabled="form.busy" color="info"type="submit" size="button&#45;&#45;size-ss"> Acessar o sistema</g-button-ujarak>-->
        </div>

      </form>
      <br>
    </div>
    <br>
    <div align="center">
      <div class="center"  style="color:white;font-family:verdana;font-size:73%;">
        * Observação: se você não foi informado pela FBB de que o seu projeto foi migrado para nova versão, basta acessar abaixo:
      </div>
    </div>
    <br>
    <div align="center">
      <a href="http://www.fbb.org.br/projetos/portal" target="_"><g-button-ujarak color="primary" size="button--size-ss"> Antigo SGP</g-button-ujarak></a>
    </div>
    <br>
    <br>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
  // import axios from 'axios'

  import Form from '../vform/Form'

  export default {
    name: 'AlterarSenha',
    data: function () {
      return {
        // Create a new form instance
        user: {
          novaSenha: null,
          confirmaSenha: null
        },
        // Create a new form instance
        form: new Form({
          ds_login: ''
        }),
        error: ''
      }
    },
    methods: {
      submit: function () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            axiosLaravel.post('/altera-senha-token/' + this.$route.params.token, this.form).then((response) => {
              this.$snotify.success('Senha alterada com sucesso')
              setTimeout(() => { this.$router.push('/login') }, 2000)
            })
            .catch((error) => {
              console.log('error.response', error.response)
              if (error.response.status === 401) {
                this.$snotify.error(error.response.data.responseInfo.reasons[0].detail)
              } else {
                this.$root.trataErro(error)
              }
            })
          }
        })
      }
    },
    mounted: function () {
      axiosLaravel.get('altera-senha-token/' + this.$route.params.token).then((response) => {
        this.form = response.data.user
      })
        .catch((error) => {
          if (error) {
            this.$root.trataErro(error)
          }
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
    margin: 0 auto;
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
    margin-t∂op: 55px;
    z-index: 3;
    position: relative;
  }

  .btn-primary {
    background-color: #0038a8 !important;
    border-color: #002775;
  }
  .has-feedback .form-control {
    padding-right: 42.5px;
  }

</style>
