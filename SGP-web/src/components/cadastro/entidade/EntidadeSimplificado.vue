<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Entidades</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <div class="box-header with-border"  ssm-lte-loading="cmptSimpleRegisterEntityForm" ng-hide="$ctrl.entity.status === 'PENDENTE_APROVACAO'  ||  $ctrl.entity.status === 'COMPLETO' || $ctrl.entity.status =='INCOMPLETO'">
      <div class="box-header with-border">
        <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Processo: </h3>
      </div>
      <div class="col-md-6 col-lg-4">
        <select class="form-control ng-pristine ng-untouched ng-valid ng-empty" id="processo" name="processo" v-model="processos.simplifiedNumber" @change="escolhido">
          <option value=""></option>
          <option v-for="processo in processos" :value="processo">{{processo.simplifiedNumber}}</option>
        </select>
      </div>
    </div>

    <!-- main content -->
    <section class="content ng-scope" v-if="procSelecionado">
      <div class="row">
        <div class="col-md-12">
          <div ng-if="show.grid" class="ng-scope ng-isolate-scope"><div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Cadastro da Entidade: Simplificado</h3>
            </div>
          <div class="box-body" id="dadosCadastrais">
        <div class="row">
          <form name="frmCommonRegister" class="form-horizontal" novalidate>
            <div class="col-md-7 col-lg-6" id="cadastroJuri">
                <fieldset>
                  <legend>Dados da entidade:</legend>

                  <!-- company name -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('Razão social')}">
                    <label for="nome" class="control-label col-sm-4 col-md-3">Razão social:</label>
                    <div class="col-md-8">
                      <input v-model="entidade.companyName" name="Razão social" class="form-control" type="text" ref="Razão social" v-validate="'required|min:1|max:255'">
                      <span v-if="errors.first('Razão social')" class="label label-danger"> {{('O campo Razão Social é obrigatório') }}</span>
                    </div>
                  </div>

                  <!-- cnpj -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('CNPJ')}">
                    <label for="CNPJ" class="control-label col-sm-4 col-md-3" ref="CNPJ">CNPJ:</label>
                    <div class="col-md-5">
                      <the-mask v-model="entidade.cnpj" name="CNPJ" class="form-control" type="text"
                                v-validate="'required|min:14|max:14'" mask="##.###.###/####-##">
                      </the-mask>
                      <span v-if="errors.first('CNPJ')" class="label label-danger"> {{('O campo CNPJ é obrigatório') }}</span>
                    </div>
                  </div>

                  <!-- cnpj expedition time -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('cnpjExpeditionTime')}">
                    <label for="cnpjExpeditionTime" class="control-label col-sm-4 col-md-3">Expedição CNPJ:</label>
                    <div class="col-md-5">
                      <div class="input-group">
                        <datepicker ref="cnpjExpeditionTime" name="cnpjExpeditionTime" v-model="entidade.cnpjExpeditionTime" input-class="form-control datepicker"
                                    :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                    format="dd/MM/yyyy" v-validate="'required'">
                        </datepicker>
                        <span v-if="errors.first('cnpjExpeditionTime')" class="label label-danger"> {{('O campo Expedição do CNPJ é obrigatório') }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- business name -->
                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('Nome fantasia')}">
                    <label for="Nome fantasia" class="control-label col-sm-4 col-md-3">Nome fantasia:</label>
                    <div class="col-md-8">
                      <input v-model="entidade.businessName" name="Nome fantasia" ref="Nome fantasia" class="form-control" type="text" v-validate="'required|min:1|max:255'">
                      <span v-if="errors.first('Nome fantasia')" class="label label-danger"> {{('O campo Nome fantasia é obrigatório') }}</span>
                    </div>
                  </div>
                </fieldset>
              </div>
            <div class="col-md-6">
            <fieldset>
              <legend>Contato:</legend>

              <!--Telefone Fixo-->
              <div  class="form-group required-field col-md-7"
                    :class="{ 'has-error' : errors.first('Telefone')}">
                <label class="control-label col-md-4">Telefone: </label>
                <div name="Telefone" class="col-md-8">
                  <the-mask v-model="entidade.contact.phone"
                            name="Telefone" class="form-control" type="text"
                            :mask="['(##) ####-####', '(##) #####-####']"
                            v-validate="'required'">
                  </the-mask>
                </div>
                <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
              </div>


              <!--Email-->
              <div class="form-group required-field col-md-7"
                   :class="{ 'has-error' : errors.first('email')}">
                <label class="control-label col-md-4">E-mail:</label>
                <div name="email" class="col-md-8">
                  <input v-model="entidade.email"
                         @input="entidade.email=$event.target.value.toLowerCase()"
                         name="email" class="form-control" type="text"
                         maxlength="255" v-validate="'required'">
                </div>
                <span v-if="errors.first('email')" class="label label-danger"> {{ errors.first('email') }}</span>
              </div>
            </fieldset>
            </div>

            <div class="col-md-12">
              <div class="box box-widget">
                <div class="box-header">
                  <h3 class="box-title">Endereço:</h3>
                </div>
              </div>
              <endereco :entEnderecos="entidade.address"></endereco>
            </div>


            <!-- chiefs -->
            <div class="col-md-12">
              <div class="box box-widget">
                <div class="box-header">
                  <h3 class="box-title">Dirigentes:</h3>
                </div>
              </div>
              <dirigentes :entDirigentes="entidade.chiefs" name="dirigentes"></dirigentes>
            </div>

            <div class="col-md-12">
              <div class="box box-widget">
                <div class="box-header">
                  <h3 class="box-title">Documentos Upload</h3>
                </div>
              </div>
              <div class="col-md-12">
                <upload-documentos :propDocumentos="entidade.documents" :documentTypes="docs" :documentosObrigatorios="docs"></upload-documentos>
              </div>
            </div>
            </form>
          </div>
            <br>
            <div class="box-footer">
              <g-button-moema color="success" size="button--size-ss" @click.native="conclui()"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>
              <g-button-moema color="primary" size="button--size-ss" @click.native="salva()"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>
              <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
            </div>
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
  import Endereco from '../../modules/endereco'
  import Dirigentes from '../../modules/dirigentes'
  import Usuarios from '../../modules/usuarios'
  import UploadDocumentos from '../../modules/uploadDocumentos'
  import HistoricoEntidade from '../../modules/historico-entidade'
  // import moment from 'moment'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      Endereco,
      Dirigentes,
      UploadDocumentos,
      HistoricoEntidade,
      Usuarios
    },
    name: 'entidade-simplificado',
    data () {
      return {
        processos: [],
        processo: [],
        tipo: [],
        erroSalvar: 0,
        entidade: {
          address: [],
          chiefs: [],
          documents: [],
          contact: {
            email: null,
            phone: null
          }
        },
        procSelecionado: null,
        campoErro: null,
        user: {
          entity: {
            contact: {
              phone: null,
              mobile: null
            }
          }
        },
        contato: [],
        documentosObrigatorios: [],
        docs: [],
        documentTypes: [],
        tiposArquivos: [],
        mandatos: {},
        mandato: {},
        dirigentes: {},
        ramoAtividade: [],
        endereco: {},
        historico: {},
        usuarios: {}
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created () {
      this.simplificado()
      this.loadPositionMandate()
      this.buscaDocumentos()
      this.buscaArquivosEsperados()
    },
    mounted () {
    },
    methods: {
      buscaArquivosEsperados () {
        axios.get('proxy/account/config/general-system-config').then((response) => {
          this.documentosObrigatorios = response.data.value.entitySimplificadoConfig.documentTypes
          for (let i = 0; i < this.documentosObrigatorios.length; i++) {
            this.docs[i] = this.documentosObrigatorios[i]
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaDocumentos () {
        axios.get('proxy/document/documents/type?active').then((response) => {
          this.tiposArquivos = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      simplificado () {
        axios.get('proxy/document/simplified/active/list').then((response) => {
          this.processos = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      escolhido () {
        this.procSelecionado = this.processos.simplifiedNumber.simplifiedNumber
        this.entidade.simplified = this.processos.simplifiedNumber.id
      },
      loadPositionMandate () {
        axios.get('/proxy/project/position-mandate').then((response) => {
          this.mandatos = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      isEditable () {
        return (this.$root.authorize('entidade-editar') || this.$root.authorize('minha-entidade-editar'))
      },
      salva () {
        if (this.entidade.id) {
          this.atualiza()
        } else {
          this.grava()
        }
      },
      conclui () {
        this.entidade.registerPhase = 'CADASTRO_SIMPLIFICADO'
        // this.entidade.chiefs[0].initialMandateDate = moment(this.entidade.chiefs[0].initialMandateDate).format('YYYY-MM-DD')
        // this.entidade.chiefs[0].endMandateDate = moment(this.entidade.chiefs[0].initialMandateDate).format('YYYY-MM-DD')
        let entidadeOK = true
        let aba = ''
        if (entidadeOK) {
          this.$validator.validateAll().then((result) => {
            if (result) {
              if (this.entidade.id) {
                axios.put('/proxy/account/entities/' + this.entidade.id, this.entidade).then((response) => {
                  this.$snotify.clear()
                  this.$snotify.success('Cadastro da Entidade concluído com sucesso!')
                  this.$router.go(-1)
                })
                  .catch((error) => {
                    this.$root.trataErro(error)
                  })
              } else {
                axios.post('proxy/account/entities/', this.entidade).then((response) => {
                  this.$snotify.clear()
                  this.$snotify.success('Cadastro da Entidade concluído com sucesso!')
                  this.$router.go(-1)
                })
              }
            } else {
              this.errors.items.forEach((item) => {
                this.campoErro = item.field
              })
            }
          })
        } else {
          this.$snotify.error('Erros no preenchimento da aba ' + aba + '. Favor verificar.')
        }
      },
      atualiza () {
        this.entidade.users = this.usuarios
        this.entidade.registerPhase = 'CADASTRO_SIMPLIFICADO'
        this.$snotify.async('Salvando entidade. Por favor, aguarde...', {timeout: 0})
        axios.put('/proxy/account/entities/' + this.entidade.id + '/temp', this.entidade).then((response) => {
          // this.salvaUsuarios()
          this.$snotify.success('Entidade salva com sucesso!')
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      grava () {
        this.erroSalvar = 0
        if (!this.entidade.companyName) {
          this.erroSalvar = 1
        }
        if (!this.entidade.cnpj) {
          this.erroSalvar = 1
        }
        if (!this.entidade.businessName) {
          this.erroSalvar = 1
        }
        if (!this.entidade.contact.phone) {
          this.erroSalvar = 1
        }
        if (!this.entidade.email) {
          this.erroSalvar = 1
        }
        if (this.erroSalvar === 0) {
          this.entidade.registerPhase = 'CADASTRO_SIMPLIFICADO'
          this.$snotify.async('Gravando entidade. Por favor, aguarde...', {timeout: 0})
          axios.post('proxy/account/entities/temp/', this.entidade).then((response) => {
            this.$snotify.clear()
            this.$snotify.success('Entidade gravada com sucesso!')
          })
        } else {
          this.$snotify.error('Preencha os campos mínimos necessários para salvar.')
        }
      }
    }
  }
</script>

<style scoped>


</style>
