<template>
  <div class="login-box">
    <div class="login-logo yellow-bg">
      <router-link to="/"><img src="/static/img/logo-login.png"></router-link>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">
      <p class="login-box-msg">Lembrar senha</p>
      <form @submit.prevent="onValidate">

        <div v-if='error' class="alert alert-danger">
          <a class="close" data-dismiss="alert">&times;</a>
          {{ error }}
        </div>

        <div class="form-group required" :class="{ 'has-error' : form.errors.has('ds_login')}">
          <input type="text" class="form-control"
                 placeholder="Informe seu Login ou E-mail"
                 name="login"
                 v-model="form.ds_login"
                 v-validate="'required'"
          >
          <has-error :form="form" field="ds_login"></has-error>
          <span v-if="errors.first('login')" class="label label-danger"> {{ errors.first('login') }}</span>
        </div>
        <div align="center">
          <button :disabled="form.busy" type="submit" class="btn btn-primary btn-block btn-flat">Recuperar senha</button>
        </div>

      </form>
      <br>
      <a id="login" href="/">Voltar para Login</a>
    </div>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
    export default {
      name: 'EsqueciMinhaSenha',
      data () {
        return {
          // Create a new form instance
          form: new Form({
            ds_login: ''
          })
        }
      },
      methods: {
        onValidate () {
          this.$validator.validateAll().then(async (result) => {
            if (result) {
              this.form.post('/esqueci-senha', {'ds_login': this.form.ds_login}).then((response) => {
                this.$snotify.success(response.data.resposta)
              })
                .catch((error) => {
                  if (error) {
                    // this.$root.trataErro(error)
                    this.$snotify.error(JSON.parse(error.response.data.message).ds_login[0])
                  }
                })
            }
          })
        }
      }
    }
</script>

<style>
  html {
    height: 100%;
  }
  body{
    height: 100%;
    background-color: #0161AB !important;
    background-image: url("/static/img/background.jpg");
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
