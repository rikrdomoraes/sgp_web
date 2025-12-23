<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Preferências</h1>
        <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Preferências',
            href: '#'
            }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">
        <div class="row">
          <div class="col-md-3">
            <!-- Profile Image -->
            <div class="box box-widget">
              <div class="box-body box-profile">
                <div id="preview">
                  <img class="profile-user-img img-responsive img-circle" alt="User profile picture" :src="usuarioLogado.bl_foto || '/static/img/nouser.png'" />
                </div>
                <div class="text-center" v-show="true" style="margin:10px 0">
                  <input class="hidden"  id="files" type="file" @change="onFileChange($event)" Alterar Foto/>
                  <label for="files" class="btn btn-default btn-xs btn-flat">Alterar</label>
                  <input type="file" id="photo" accept=".png,.jpg" style="opacity:0;height:1px"/>
                </div>
                  <h3 class="profile-username text-center">{{ usuarioLogado.ds_nome_usuario }}</h3>
                <ul class="list-group list-group-unbordered">
                  <li class="list-group-item"><b>E-mail</b> <a class="pull-right">{{ usuarioLogado.ds_email }}</a></li>
                </ul>
              </div>
              <!-- /.box-body -->
            </div>
            <!-- /.box -->
          </div>
          <div class="col-md-9">
            <div class="nav-tabs-custom">
              <div class="box-header with-border">
                <h3 class="box-title"> Autenticação </h3>
              </div>
              <div uib-collapse="authBox.isCollapsed">
                <form name="frmChangePassword">
                  <div class="box-body">
                    <div class="row">
                      <div v-if=" usuarioLogado.ds_tipo_usuario !== 'FUNDACAO'" class="col-md-6">
                        <label>Alterar Senha </label>
                        <div class="form-group has-feedback" :class="{ 'has-error' : errors.first('senhaAtual')}" >
                          <input id="senhaAtual" name="senhaAtual" type="password" class="form-control" placeholder="Informe a senha atual" v-model="password.senhaAtual" v-validate="'required'" /> <span class="glyphicon glyphicon-lock form-control-feedback" />
                          <span v-show="errors.first('senhaAtual')" class="label label-danger"> {{('Campo requerido') }}</span>
                        </div>
                        <div class="form-group has-feedback" :class="{ 'has-error' : errors.first('novaSenha')}">
                          <input id="novaSenha" name="novaSenha" type="password" class="form-control" placeholder="Informe a nova senha" v-model="password.novaSenha" v-validate="'required'" /> <span class="glyphicon glyphicon-lock form-control-feedback" />
                          <span v-show="errors.first('novaSenha')" class="label label-danger"> {{('Campo requerido') }}</span>
                        </div>
                        <div class="form-group has-feedback" :class="{ 'has-error' : errors.first('confirmaSenha')}" >
                          <input id="confirmaSenha" name="confirmaSenha" type="password" class="form-control" placeholder="Confirme a nova senha" v-model="password.confirmaSenha" v-validate="'required'" /> <span class="glyphicon glyphicon-lock form-control-feedback" />
                          <span v-show="errors.first('confirmaSenha')" class="label label-danger"> {{('Campo requerido') }}</span>
                          <span v-show="!isValidPassword()" class="label label-danger">As senhas devem ser iguais</span>
                        </div>
                      </div>
                      <div v-if="usuarioLogado.ds_tipo_usuario == 'FUNDACAO'" class="col-md-12">
                        <label>Alterar Senha </label>
                        <div class="callout callout-warning" style="margin-bottom: 0!important;">
                          <h4>Atenção</h4>
                          Contacte o administrador da rede para efetuar a alteração de sua senha.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="usuarioLogado.ds_tipo_usuario !== 'FUNDACAO'" class="box-footer">
                    <button type="submit" class="btn btn-primary btn-flat" @click.prevent="onChangePassword(password)" >
                      <i class="fa fa-check-circle-o" aria-hidden="true"></i> Alterar Senha
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>


      </section>
    </div>
  </div>

</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    components: {},
    name: 'Preferencias',
    data: function () {
      return {
        documento: {},
        password: {
          senhaAtual: '',
          novaSenha: '',
          confirmaSenha: ''
        },
        url: '',
        image: ''
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    methods: {
      isValidPassword () {
        return this.password.novaSenha === this.password.confirmaSenha
      },
      onChangePassword (frm) {
        if (frm == null || !this.isValidPassword()) {
          this.$snotify.error('Verifique o preenchimento do formulário. Há campos com preenchimento inválido.')
          return
        }
        axiosLaravel.put('/usuario/' + this.usuarioLogado.id + '/altera-senha', frm).then((response) => {
          this.$snotify.success('Senha alterada com Sucesso.')
        })
          .catch((error) => {
            if (error) {
              console.log('error', error)
              this.$root.trataErro(error)
            }
          })
      },
      carregaArquivo (file) {
        let reader = new FileReader()
        let vm = this
        reader.onload = function (e) {
          vm.documento.file = e.target.result
        }
        reader.readAsDataURL(file)
      },
      onFileChange (e) {
        let files = e.target.files || e.dataTransfer.files
        this.tamanho = e.target.files[0].size
        this.tamanhoFormatado = (this.tamanho / Math.pow(1024, 2)).toFixed(2)
        // Transforma o arquivo em base64 para passar no json
        this.carregaArquivo(files[0])
        // Pega o nome do arquivo
        this.documento.ds_nome_arquivo = files[0].name
        // Pega o tipo do arquivo
        this.documento.ds_content_type = files[0].type
        // Chama Back end para atualizar a foto
        let usuarioId = this.usuarioLogado.id
        let documento = this.documento
        let vm = this
        setTimeout(function () {
          axiosLaravel.put('/usuario/' + usuarioId + '/foto', {foto: documento.file}).then((response) => {
            vm.$snotify.success('Foto Alterada com Sucesso. Efetue novo login no sistema para que a foto atualizada apareça no perfil')
          })
            .catch((error) => {
              if (error) {
                console.log('error', error)
                this.$root.trataErro(error)
              }
            })
          vm.$emit('onUpdatePicture', this.url)
        }, 500)
      }
    }
}
</script>
