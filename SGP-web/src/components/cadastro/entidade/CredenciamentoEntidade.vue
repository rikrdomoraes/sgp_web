<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Entidades
        <!-- button Concluir fica clicavel depois de verificar se o cnpj existe - suporte 59895 -->
        <span v-if="!loading">
          <g-button-moema color="success" size="button--size-ss" @click.native="conclui()"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>
        </span>
        <span v-else>
          <i class="fa fa-refresh fa-spin"></i>
        </span>
        <g-button-moema color="primary" size="button--size-ss" @click.native="limpar()"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</g-button-moema>
        <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
      </h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">
      <div class="row">
        <div class="col-md-12">
          <div ng-if="show.grid" class="ng-scope ng-isolate-scope"><div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Credenciamento da Entidade</h3>
            </div>
          <div class="box-body" id="dadosCadastrais">

            <div v-show="loading" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>


            <div class="row">
          <form name="frmCommonRegister" class="form-horizontal" novalidate>
            <div class="col-md-7 col-lg-6" id="cadastroJuri">
                <fieldset>
                  <legend>Dados da entidade:</legend>

                  <!-- Razão social -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('Razão social')}">
                    <label for="nome" class="control-label col-sm-4 col-md-3">Razão social:</label>
                    <div class="col-md-8">
                      <input v-model="entidade.ds_nome" name="Razão social" data-vv-as="Razão Social" class="form-control" type="text" ref="Razão social" v-validate="'required|min:1|max:255'">
                      <span v-if="errors.first('Razão social')" class="label label-danger">{{ errors.first('Razão social') }}</span>
                    </div>
                  </div>

                  <!-- CNPJ -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('CNPJ')}">
                    <label for="CNPJ" class="control-label col-sm-4 col-md-3" ref="CNPJ">CNPJ:</label>
                    <div class="col-md-5">
                      <the-mask @blur.native="verificaCNPJEntidade" v-model="entidade.ds_cnpj" name="CNPJ" data-vv-as="CNPJ" class="form-control" type="text"
                                v-validate="'required|cnpj|min:14|max:14'" mask="##.###.###/####-##">
                      </the-mask>
                      <span v-if="errors.first('CNPJ')" class="label label-danger"> {{ errors.first('CNPJ') }}</span>
                    </div>
                    <!-- verifica se o CNPJ informado existe na base e mostra mensagem e link - suporte 58985 -->
                    <div class="col-md-offset-3 col-md-9" v-if="entidadesExistentes.length > 0 && _.has(entidadesExistentes[0], 'ds_nome') && !_.isNull(entidadesExistentes[0].ds_nome) ">
                      <span class="label label-danger"> CNPJ já cadastrado no sistema.</span>
                      <p v-for="entidade in entidadesExistentes">
                        <router-link :title="'<h5>Ir para o Cadastro dessa Entidade</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" :to="{name: 'cadastro-entidade-edita', params: { id: entidade.id }}" target="_blank">
                        {{entidade.ds_cnpj | cnpj}} -
                        {{entidade.ds_nome}}
                        ({{entidade.ds_nome_fantasia}})
                          <i class="fa fa-external-link"></i></router-link>
                      </p>
                    </div>
                  </div>


                  <!-- Data expedição CNPJ -->
                  <!--<div class="form-group required-field" :class="{ 'has-error' : errors.first('cnpjExpeditionTime')}">-->
                    <!--<label for="cnpjExpeditionTime" class="control-label col-sm-4 col-md-3">Expedição CNPJ:</label>-->
                    <!--<div class="col-md-5">-->
                      <!--&lt;!&ndash;<div class="input-group">&ndash;&gt;-->
                        <!--&lt;!&ndash;<datepicker ref="cnpjExpeditionTime" name="cnpjExpeditionTime" data-vv-as="Expedição CNPJ" v-model="entidade.dt_data_expedicao_cnpj" input-class="form-control datepicker"&ndash;&gt;-->
                                    <!--&lt;!&ndash;:language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"&ndash;&gt;-->
                                    <!--&lt;!&ndash;format="dd/MM/yyyy" v-validate="'required'">&ndash;&gt;-->
                        <!--&lt;!&ndash;</datepicker>&ndash;&gt;-->
                        <!--&lt;!&ndash;<span v-if="errors.first('cnpjExpeditionTime')" class="label label-danger">{{ errors.first('cnpjExpeditionTime') }}</span>&ndash;&gt;-->
                      <!--&lt;!&ndash;</div>&ndash;&gt;-->
                      <!--<input-->
                        <!--type="text"-->
                        <!--ref="cnpjExpeditionTime"-->
                        <!--name="cnpjExpeditionTime"-->
                        <!--v-model="dt_data_expedicao_cnpj"-->
                        <!--class="form-control"-->
                        <!--v-mask="'##/##/####'"-->
                        <!--data-vv-as="Expedição CNPJ"-->
                        <!--:masked="masked"-->
                        <!--v-validate="'required|validdate|dateeqpast'"-->
                      <!--&gt;-->
                      <!--<span v-if="errors.first('cnpjExpeditionTime')" class="label label-danger">{{ errors.first('cnpjExpeditionTime') }}</span>-->
                    <!--</div>-->
                  <!--</div>-->

                  <!-- Nome fantasia -->
                  <!--<div class="form-group required-field" :class="{ 'has-error' : errors.first('Nome fantasia')}">-->
                    <!--<label for="Nome fantasia" class="control-label col-sm-4 col-md-3">Nome fantasia:</label>-->
                    <!--<div class="col-md-8">-->
                      <!--<input v-model="entidade.ds_nome_fantasia" name="Nome fantasia" ref="Nome fantasia" data-vv-as="Nome fantasia" class="form-control" type="text" v-validate="'required|min:1|max:255'">-->
                      <!--<span v-if="errors.first('Nome fantasia')" class="label label-danger">{{ errors.first('Nome fantasia') }}</span>-->
                    <!--</div>-->
                  <!--</div>-->

                  <!-- Email entidade -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('EmailEnt')}">
                    <label for="email" class="control-label col-sm-4 col-md-3">E-Mail:</label>
                    <div class="col-md-8">
                      <input @change="verificaEmailEntidade" v-model="entidade.ds_email" name="EmailEnt" class="form-control" type="text" data-vv-as="E-Mail" delivery="account" method="uniqueUserEmail" v-validate="'required|email|min:1|max:255'" ref="EmailEnt">
                      <span v-if="entidade.ds_email === usuario.ds_email && entidade.ds_email && usuario.ds_email" class="label label-danger"> {{('Os e-mails da entidade e do usuário não podem ser iguais!') }}</span>
                      <span v-if="errors.first('EmailEnt')" class="label label-danger">{{ errors.first('EmailEnt') }}</span>
                    </div>
                  </div>

                  <!-- Confirmação email entidade-->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('emailConfirmacaoEnt')}">
                    <label for="userEmail" class="control-label col-sm-4 col-md-3">Confirmar E-Mail:</label>
                    <div class="col-md-8">
                      <input v-model="emailConfirmacaoEnt" @paste.prevent name="emailConfirmacaoEnt" data-vv-as="Confirmar E-Mail" class="form-control" type="text" delivery="account" method="uniqueUserEmail" v-validate="'required|email|min:1|max:255'" ref="emailConfirmacaoEnt">
                      <span v-if="errors.first('emailConfirmacaoEnt')" class="label label-danger">{{ errors.first('emailConfirmacaoEnt') }}</span>
                      <span v-if="entidade.ds_email !== emailConfirmacaoEnt && emailConfirmacaoEnt.length > 0" class="label label-danger"> {{('Os e-mails informados não são iguais!') }}</span>
                    </div>
                  </div>
                  <!-- Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS-->
                  <!-- Informação se entidade possui CEBAS ou CMAS-->
                  <div class="form-group required-field">
                    <label for="possuiCebas" class="control-label col-sm-4 col-md-3">Possui CEBAS:</label>
                    <div class="col-md-2">
                      <select v-model="possuiCebas" @change="onChangeCebasCmas($event)" class="form-control" name="possuiCebas">
                        <option>Não</option>
                        <option>Sim</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group required-field">
                    <label for="possuiCmas" class="control-label col-sm-4 col-md-3">Possui CMAS:</label>
                    <div class="col-md-2">
                      <select v-model="possuiCmas" @change="onChangeCebasCmas($event)" class="form-control" name="possuiCmas">
                        <option>Não</option>
                        <option>Sim</option>
                      </select>
                    </div>
                  </div>

                </fieldset>
              </div>

              <div class="col-sm-6">
                <fieldset>
                  <legend>Representante Legal:</legend>

                  <!-- Nome do usuário -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('userName')}">
                    <label for="nome" class="control-label col-sm-4 col-md-3">Nome:</label>
                    <div class="col-sm-8 col-md-9">
                      <input v-model="usuario.ds_nome_usuario" name="userName" class="form-control" data-vv-as="Nome" type="text" v-validate="'required|min:1|max:255'">
                      <span v-if="errors.first('userName')" class="label label-danger">{{ errors.first('userName') }}</span>
                    </div>
                  </div>

                  <!-- CPF -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('cpf')}">
                    <label for="cpf" class="control-label  col-sm-4 col-md-3">CPF:</label>
                    <div class="col-sm-7 col-md-6 col-lg-5">
                      <the-mask v-model="usuario.ds_cpf"
                                name="cpf" class="form-control" type="text" data-vv-as="CPF"
                                :mask="'###.###.###-##'" v-validate="'cpf|required'">
                      </the-mask>
                      <span v-if="errors.first('cpf')" class="label label-danger">{{ errors.first('cpf') }}</span>
                    </div>
                  </div>

                  <!-- Login -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('Login')}">
                    <label for="Login" class="control-label  col-sm-4 col-md-3">Login:</label>
                    <div class="col-sm-7 col-md-6 col-lg-5">
                      <input v-model="usuario.ds_login" name="Login" data-vv-as="Login" @change="verificaUsuario"
                             class="form-control" type="text" v-validate="'required'">
                      <span v-if="errors.first('Login')" class="label label-danger"> {{ errors.first('Login') }}</span>
                    </div>
                  </div>

                  <!-- telefone -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('Telefone')}">
                    <label for="Telefone" class="control-label  col-sm-4 col-md-3">Telefone:</label>
                    <div class="col-sm-7 col-md-6 col-lg-5">
                      <the-mask v-model="usuario.ds_telefone" name="Telefone" data-vv-as="Telefone" ref="Telefone" class="form-control" type="text"
                                v-validate="'required|min:10|max:11'" :mask="['(##) ####-####', '(##) #####-####']">
                      </the-mask>
                      <span v-if="errors.first('Telefone')" class="label label-danger">{{ errors.first('Telefone') }}</span>
                    </div>
                  </div>

                  <!-- Email do usuário -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('userEmail')}">
                    <label for="userEmail" class="control-label col-sm-4 col-md-3">E-Mail:</label>
                    <div class="col-md-8">
                      <input @change="verificaEmailUsuario" v-model="usuario.ds_email" name="userEmail" data-vv-as="E-mail" class="form-control" type="text" delivery="account" method="uniqueUserEmail" v-validate="'required|email|min:1|max:255'" ref="userEmail">
                      <span v-if="entidade.ds_email === usuario.ds_email && entidade.ds_email" class="label label-danger"> {{('Os e-mails da entidade e do usuário não podem ser iguais.') }}</span>
                      <span v-if="errors.first('userEmail')" class="label label-danger">{{ errors.first('userEmail') }}</span>
                    </div>
                  </div>
                  <!-- Confirmação email do usuário -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('emailConfirmacao')}">
                    <label for="userEmail" class="control-label col-sm-4 col-md-3">Confirmar E-Mail:</label>
                    <div class="col-md-8">
                      <input v-model="emailConfirmacao" @paste.prevent name="emailConfirmacao" data-vv-as="Confirmar E-Mail" class="form-control" type="text" delivery="account" method="uniqueUserEmail" v-validate="'required|email|min:1|max:255'" ref="emailConfirmacao">
                      <span v-if="errors.first('emailConfirmacao')" class="label label-danger">{{ errors.first('emailConfirmacao') }}</span>
                      <span v-if="usuario.ds_email !== emailConfirmacao && emailConfirmacao.length > 0" class="label label-danger"> {{('Os e-mails informados não são iguais!') }}</span>
                    </div>
                  </div>

                </fieldset>
              </div>

              <div class="col-sm-12">
                <fieldset>
                  <legend> Documentos:</legend>
                </fieldset>

                 <!-- Docume
ueridos -->
                 <div class="col-sm-12 required-field">
                  <div class="form-group col-md-12" :class="{ 'has-error' : errors.first('documentos')}">
                    <label class="control-label"> Documentos anexos obrigatórios: </label>
                    <br />
                    <multiselect v-model="entidade.tipoDocumentos" :options="tiposArquivos"
                                 :multiple="true" :close-on-select="false"
                                 :clear-on-select="true" :hide-selected="false"
                                 :preserve-search="true"
                                 placeholder="Selecione um perfil"
                                 label="ds_tipo" track-by="ds_tipo"
                                 :preselect-first="true"
                                 selectLabel="Aperte ENTER para selecionar"
                                 deselectLabel="Aperte ENTER para remover"
                                 selectedLabel="Selecionado"
                                 name="documentos"
                                 v-validate="'required'"
                                 data-vv-as="Documentos anexos obrigatórios"
                                 @remove="removeDocumento">
                      <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.option.type }}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                      <!-- <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.option.type }}</span><span class="custom__remove" @tag="removeDocumento(tag)" @click.native="removeDocumento($event,props.option)">❌</span></span></template> -->
                      <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                    </multiselect>
                  </div>
                  <span v-if="errors.first('documentos')" class="label label-danger"> {{ errors.first('documentos') }}</span>
                </div>
              </div>
            </form>
          </div>
            <!--<br>-->
            <!--<div class="box-footer">-->
              <!--<g-button-moema color="success" size="button&#45;&#45;size-ss" @click.native="conclui()"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>-->
              <!--<g-button-moema color="primary" size="button&#45;&#45;size-ss" @click.native="limpar()"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</g-button-moema>-->
              <!--<g-button-moema color="warning" size="button&#45;&#45;size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>-->
            <!--</div>-->
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
          <!-- /.box-body -->

          <!-- /.box-footer -->
      </div>
        </div></div>
    </section>
  </div>
  </div>
  <!-- /.box -->
</template>

<script>
  import Usuarios from '../../modules/usuarios'
  import UploadDocumentos from '../../modules/uploadDocumentos'
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    components: {
      UploadDocumentos,
      Usuarios
    },
    name: 'entidade-credenciamento',
    data () {
      return {
        loading: false,
        tiposArquivos: [],
        campoErro: null,
        jaExiste: false,
        usuario: {
          ds_cpf: ''
        },
        dt_data_expedicao_cnpj: '',
        entidade: {
          ds_cnpj: '',
          ds_cpf: '',
          dt_data_expedicao_cnpj: '',
          usuarios: [],
          tipoDocumentos: []
        },
        emailConfirmacao: '',
        emailConfirmacaoEnt: '',
        entidadesExistentes: [],
        // Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS
        possuiCebas: 'Não',
        possuiCmas: 'Não'
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
      dt_data_expedicao_cnpj: function (val) {
        let newdate = moment(val, 'DD/MM/YYYY', true)
        if (newdate.isValid()) {
          this.entidade.dt_data_expedicao_cnpj = newdate.format('YYYY-MM-DD')
        }
      }
    },
    created () {
    },
    mounted () {
      if (this.localUso === undefined) {
        this.localUso = 'TODOS'
      }
      axiosLaravel.post('documentos/tipos/' + this.localUso).then((response) => {
        this.tiposArquivos = response.data
        // this.buscaArquivosEsperados() // Solicitado no chamado 66108 para não ter mais documentos obrigatórios no cadastro da entidade (item nº 5)
        this.loading = false
      })
        .catch((error) => {
          this.loading = false
          this.$root.trataErro(error)
        })
    },
    methods: {
      buscaArquivosEsperados () {
        axiosLaravel.get('configuracoes/').then((response) => {
          this.entidade.tipoDocumentos = response.data.configuracao_entidade.documentos_obrigatorios
          this.loading = false
        })
          .catch((error) => {
            this.loading = false
            this.$root.trataErro(error)
          })
      },
      limpar () {
        this.entidade.ds_nome = ''
        this.entidade.ds_cnpj = ''
        this.entidade.ds_login = ''
        this.usuario.ds_telefone = ''
        this.entidade.dt_data_expedicao_cnpj = ''
        this.entidade.ds_nome_fantasia = ''
        this.entidade.ds_email = ''
        this.emailConfirmacaoEnt = ''
        this.usuario.ds_nome_usuario = ''
        this.usuario.ds_cpf = ''
        this.usuario.ds_email = ''
        this.usuario.ds_login = ''
        this.emailConfirmacao = ''
      },
      conclui () {
        this.loading = true
        this.entidade.ds_tipo_registro = 'CREDENCIAMENTO'
        this.entidade.ds_fase_registro = 'CREDENCIAMENTO'
        this.entidade.ds_status = 'INCOMPLETO'
        let entidadeOK = true
        if (entidadeOK) {
          this.$validator.validateAll().then(result => {
            if (result) {
              if (this.usuario.ds_email !== this.emailConfirmacao) {
                this.$snotify.error('O formulário possui erros. Favor verificar!')
                return
              }
              if (this.entidade.ds_email !== this.emailConfirmacaoEnt) {
                this.$snotify.error('O formulário possui erros. Favor verificar!')
                return
              }
              if (this.entidade.ds_email === this.usuario.ds_email) {
                this.$snotify.error('Os e-mails da entidade e do usuário não podem ser iguais. Favor verificar!')
                return
              }
              if (this.jaExiste === true) {
                this.$snotify.error('O login informado já existe. Favor verificar!')
                return
              }
              // Se o CNPJ ja estiver cadasdastrado - suporte 59895
              if (this.entidadesExistentes.length > 0 && _.has(this.entidadesExistentes[0], 'ds_nome') && !_.isNull(this.entidadesExistentes[0].ds_nome)) {
                this.$snotify.error('O CNPJ informado já está cadastrado!')
                return
              }
              if (this.jaExisteMail === true) {
                this.$snotify.error('O e-mail da entidade informado já existe. Favor verificar!')
                return
              }
              if (this.jaExisteMailUsu === true) {
                this.$snotify.error('O e-mail do usuário informado já existe. Favor verificar!')
                return
              }
              // Retira caracteres
              this.usuario.ds_cpf = this.usuario.ds_cpf.replace('.', '')
              this.usuario.ds_cpf = this.usuario.ds_cpf.replace('.', '')
              this.usuario.ds_cpf = this.usuario.ds_cpf.replace('-', '')
              this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('.', '')
              this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('.', '')
              this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('.', '')
              this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('/', '')
              this.entidade.ds_cnpj = this.entidade.ds_cnpj.replace('-', '')
              this.entidade.ds_login = this.entidade.ds_cnpj
              let obj = _.cloneDeep(this.usuario)
              const resultArray = []
              resultArray.push(obj)
              this.entidade.usuarios = _.cloneDeep(resultArray)
              this.$snotify.async('Credenciando a entidade. Por favor, aguarde...', {timeout: 0})
              this.loading = false
              axiosLaravel.post('entidades/', this.entidade).then((response) => {
                this.$snotify.clear()
                this.$snotify.success('Entidade credenciada com sucesso!')
                this.loading = false
                setTimeout(() => { this.$router.go(-1) }, 1000)
              })
                .catch((error) => {
                  this.loading = false
                  console.log(error.response)
                  this.$snotify.clear()
                  this.$root.trataErro(error)
                })
            }
          })
        }
        this.loading = false
      },
      verificaUsuario () {
        axiosLaravel.post('/verifica-usuario/', {'parametro': this.usuario.ds_login}).then((response) => {
          // Pega a lista de usuários
          if (response.data.length > 0) {
            this.jaExiste = true
            let field = this.$validator.fields.find({ name: 'Login' })
            field.setFlags({invalid: true})
            this.errors.add({
              field: 'Login',
              msg: response.data,
              id: field.id,
              scope: field.scope
            })
          } else {
            this.jaExiste = false
          }
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      verificaEmailEntidade () {
        axiosLaravel.post('/verifica-usuario/', {'parametro': this.entidade.ds_email}).then((response) => {
          // Pega a lista de usuários
          if (response.data.length > 0) {
            this.jaExisteMail = true
            let field = this.$validator.fields.find({ name: 'EmailEnt' })
            field.setFlags({invalid: true})
            this.errors.add({
              field: 'EmailEnt',
              msg: response.data,
              id: field.id,
              scope: field.scope
            })
          } else {
            this.jaExisteMail = false
          }
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      verificaEmailUsuario () {
        axiosLaravel.post('/verifica-usuario/', {'parametro': this.usuario.ds_email}).then((response) => {
          // Pega a lista de usuários
          if (response.data.length > 0) {
            this.jaExisteMailUsu = true
            let field = this.$validator.fields.find({ name: 'userEmail' })
            field.setFlags({invalid: true})
            this.errors.add({
              field: 'userEmail',
              msg: response.data,
              id: field.id,
              scope: field.scope
            })
          } else {
            this.jaExisteMailUsu = false
          }
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      // verifica se o CPNJ existe e retorna entidades - suporte 58985
      verificaCNPJEntidade () {
        this.loading = true
        axiosLaravel.post('/entidade/cnpj/', {'cnpj': this.entidade.ds_cnpj}).then((response) => {
          this.entidadesExistentes = response.data
          this.loading = false
        })
          .catch((error) => {
            this.loading = false
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },

      // Demanda 64830 inclusão da informação se entidade possui CEBAS e/ou CMAS
      onChangeCebasCmas ($event) {
        const value = $event.target.value
        const name = $event.target.name
        if (name === 'possuiCmas') {
          if (value === 'Sim') {
            this.entidade.tipoDocumentos.push(this.tiposArquivos.find(e => { return e.id === 70 }))
          } else if (value === 'Não') {
            let index = this.entidade.tipoDocumentos.findIndex(e => {
              return e.id === 70
            })
            if (index > 0) {
              this.entidade.tipoDocumentos.splice(index, 1)
            }
          }
        } else if (name === 'possuiCebas') {
          if (value === 'Sim') {
            this.entidade.tipoDocumentos.push(this.tiposArquivos.find(e => { return e.id === 71 }))
          } else {
            let index = this.entidade.tipoDocumentos.findIndex(e => {
              return e.id === 71
            })
            if (index > 0) {
              this.entidade.tipoDocumentos.splice(index, 1)
            }
          }
        }
      },

      removeDocumento (doc) {
        const index = this.entidade.tipoDocumentos.findIndex(e => e.id === doc.id)
        this.entidade.tipoDocumentos.splice(index, 1)
        if (doc.id === 70) {
          this.possuiCmas = 'Não'
        } else if (doc.id === 71) {
          this.possuiCebas = 'Não'
        }
      }
    }
  }
</script>

<style scoped>


</style>
