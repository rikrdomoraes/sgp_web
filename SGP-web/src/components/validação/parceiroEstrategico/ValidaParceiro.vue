<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Validação de Entidades</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">
        <div class="col-md-12">
          <!-- grid -->
          <!-- ngIf: show.grid --><div ng-if="show.grid" class="ng-scope ng-isolate-scope"><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Cadastro de Parceiro Estratégico</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body" id="dadosCadastrais">
            <div class="row">
              <div class="col-md-12">
                <form name="frmCommonRegister" class="form-horizontal" novalidate>
                  <div class="col-md-7 col-lg-6" id="cadastroJuri">
                    <fieldset :disabled="!isEditable()">
                      <legend>Dados da entidade:</legend>

                      <!-- company name -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Razão social')}">
                        <label for="Razão social" class="control-label col-md-4">Razão social:</label>
                        <div class="col-md-8">
                          <input v-model="parceiro.strategicPartner.companyName" name="Razão social" class="form-control" type="text" ref="Razão social" v-validate="'required|min:1|max:255'">
                          <span v-if="errors.first('Razão social')" class="label label-danger"> {{('O campo Razão Social é obrigatório') }}</span>
                        </div>
                      </div>

                      <!-- cnpj -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('CNPJ')}">
                        <label for="CNPJ" class="control-label col-md-4" ref="CNPJ">CNPJ:</label>
                        <div class="col-md-6 col-lg-4">
                          <the-mask v-model="parceiro.strategicPartner.cnpj" name="CNPJ" class="form-control" type="text"
                                    v-validate="'required|min:14|max:14'" mask="##.###.###/####-##">
                          </the-mask>
                          <span v-if="errors.first('CNPJ')" class="label label-danger"> {{('O campo CNPJ é obrigatório') }}</span>
                        </div>
                      </div>

                      <!-- cnpj expedition time -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('cnpjExpeditionTime')}">
                        <label for="cnpjExpeditionTime" class="control-label col-md-4">Expedição CNPJ:</label>
                        <div class="col-md-6 col-lg-4">
                          <div class="input-group">
                            <datepicker ref="cnpjExpeditionTime" name="cnpjExpeditionTime" v-model="parceiro.strategicPartner.cnpjExpeditionTime" input-class="form-control" :language="$datePickerPtBR" format="dd/MM/yyyy" v-validate="'required'" :placeholder="dataPlaceholder" ></datepicker>
                            <span v-if="errors.first('cnpjExpeditionTime')" class="label label-danger"> {{('O campo Expedição do CNPJ é obrigatório') }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- business name -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Nome fantasia')}">
                        <label for="Nome fantasia" class="control-label col-md-4">Nome fantasia:</label>
                        <div class="col-md-8">
                          <input v-model="parceiro.strategicPartner.businessName" name="Nome fantasia" ref="Nome fantasia" class="form-control" type="text" v-validate="'required|min:1|max:255'">
                          <span v-if="errors.first('Nome fantasia')" class="label label-danger"> {{('O campo Nome fantasia é obrigatório') }}</span>
                        </div>
                      </div>

                      <!-- legal type -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Natureza jurídica')}">
                        <label for="Natureza jurídica" class="control-label col-md-4">Natureza jurídica:</label>
                        <div class="col-md-8">
                          <select v-model="parceiro.strategicPartner.legalType" name="Natureza jurídica" class="form-control" v-validate="'required'" ref="Natureza jurídica">
                            <option value="ASSOCIAÇÃO">Associação</option>
                            <option value="COOPERATIVA">Cooperativa</option>
                            <option value="EMPRESA_PUBLICA">Empresa pública</option>
                            <option value="FUNDACAO">Fundação</option>
                            <option value="ORGAO_PUBLICO_EXECUTIVO_ESTADUAL">Orgão público executivo estadual</option>
                            <option value="ORGAO_PUBLICO_EXECUTIVO_MUNICIPAL">Orgão público executivo municipal</option>
                            <option value="SEM_FINS_LUCRATIVOS">Sem fins lucrativos</option>
                            <option value="SERVICO_SOCIAL_AUTONOMO">Serviço social autônomo</option>
                            <option value="SOCIEDADE_LTDA">Sociedade ltda</option>
                            <option value="SOCIEDADE_POR_ACOES">Sociedade por Ações</option>
                          </select>
                          <span v-if="errors.first('Natureza jurídica')" class="label label-danger"> {{('O campo Natureza jurídica é obrigatório') }}</span>
                        </div>
                      </div>

                      <!-- activity -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Ramo atividade')}">
                        <label for="Ramo atividade" class="control-label col-md-4">Ramo atividade:</label>
                        <div class="col-md-8">
                          <select v-model="parceiro.strategicPartner.activity" class="form-control" name="Ramo atividade"
                                  v-validate="'required'" ref="Ramo atividade">
                            <option :label="ramoAtividade.code + ' - ' + ramoAtividade.description" :value="ramoAtividade" v-for="(ramoAtividade) in ramoAtividade">{{ ramoAtividade.code + ' - ' + ramoAtividade.description }}</option>
                          </select>
                          <span v-if="errors.first('Ramo atividade')" class="label label-danger"> {{('O campo Ramo atividade é obrigatório') }}</span>
                        </div>
                      </div>

                      <!-- constitution document -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Doc. constituição')}">
                        <label for="constitutionDocument" class="control-label col-md-4">Doc. constituição:</label>
                        <div class="col-md-8">
                          <select v-model="parceiro.strategicPartner.constitutionDocument" name="Doc. constituição" class="form-control" v-validate="'required'" ref="Doc. constituição">
                            <option value="ATA_CONSTITUICAO">Ata constituição</option>
                            <option value="CONTRATO_SOCIAL">Contrato social</option>
                            <option value="ESTATUTO">Estatuto</option>
                            <option value="LEI_ORGANICA_MUNICIPAL">Lei orgânica municipal</option>
                          </select>
                          <span v-if="errors.first('Doc. constituição')" class="label label-danger"> {{('O campo Doc. constituição é obrigatório') }}</span>
                        </div>
                      </div>

                    </fieldset>
                  </div>

                  <div class="col-md-5 col-lg-6" id="contato">
                    <fieldset >
                      <legend>Contato:</legend>

                      <!-- phone -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Telefone')}">
                        <label for="Telefone" class="control-label col-md-4">Telefone:</label>
                        <div class="col-md-8 col-lg-4">
                          <input v-model="parceiro.strategicPartner.phone" v-mask="'(##) ####-#####'" :masked="masked" name="Telefone" class="form-control" type="text" v-validate="'required|min:1'" ref="Telefone">
                        </div>
                        <span v-if="errors.first('Telefone')" class="label label-danger"> {{('O campo Telefone é obrigatório') }}</span>
                      </div>

                      <!-- mobile -->
                      <div class="form-group">
                        <label for="mobile" class="control-label col-md-4">Celular:</label>
                        <div class="col-md-8 col-lg-4">
                          <input v-model="parceiro.strategicPartner.mobile" v-mask="'(##) #####-#####'" :masked="masked" name="mobile" class="form-control" type="text">
                        </div>
                      </div>

                      <!-- email -->
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('Email')}">
                        <label for="email" class="control-label col-md-4">E-Mail:</label>
                        <div class="col-md-8">
                          <input v-model="parceiro.strategicPartner.email" name="Email" class="form-control" type="text" delivery="account" method="uniqueUserEmail" v-validate="'required|min:1|max:255'" ref="Email">
                        </div>
                         <span v-if="errors.first('Email')" class="label label-danger"> {{('O campo E-mail é obrigatório') }}</span>
                      </div>

                      <!-- website -->
                      <div class="form-group">
                        <label for="email" class="control-label col-md-4">Site:</label>
                        <div class="col-md-8">
                          <input v-model="parceiro.strategicPartner.website" name="website" class="form-control" type="text" v-validate="'max:255'">
                        </div>
                      </div>

                    </fieldset>
                  </div>

                  <!-- addresses -->
                  <div class="col-md-12">
                    <div class="box box-widget">
                      <div class="box-header">
                        <h3 class="box-title">Endereço:</h3>
                      </div>
                    </div>
                    <endereco :entEnderecos="endereco"></endereco>
                  </div>

                  <!-- chiefs -->
                  <div class="col-md-12">
                    <div class="box box-widget">
                      <div class="box-header">
                        <h3 class="box-title">Dirigentes:</h3>
                      </div>
                    </div>
                    <dirigentes :entDirigentes="dirigentes" name="dirigentes"></dirigentes>
                  </div>


                  <!-- users -->

                  <div class="col-md-12">
                    <div class="box box-widget">
                      <div class="box-header">
                        <h3 class="box-title">Usuários da entidade:</h3>
                      </div>
                    </div>
                    <usuarios :entUsuarios="parceiro.strategicPartner.usuarios"></usuarios>
                  </div>

                  <!--Documentos-->
                  <div class="col-md-12">
                    <div class="box box-widget">
                      <div class="box-header">
                        <h3 class="box-title">Documentos Upload</h3>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <upload-documentos :propDocumentos="parceiro.strategicPartner.documents" :documentTypes="parceiro.strategicPartner.documentTypes"></upload-documentos>
                    </div>
                  </div>

                  <!-- projetos -->
                  <div class="col-md-12">
                    <div class="box box-widget">
                      <div class="box-header">
                        <h3 class="box-title">Projetos:</h3>
                      </div>
                    </div>
                    <projetos :ParcProjetos="projetos"></projetos>
                  </div>

                  <!-- approval history -->
                  <div class="col-md-12">
                    <div class="box box-widget">
                      <div class="box-header">
                        <h3 class="box-title">Histórico:</h3>
                      </div>
                    </div>
                    <historicoParcEstrategico :parcHistorico="historico"></historicoParcEstrategico>
                  </div>
                </form>
                <div class="col-md-12">
                  <fieldset>
                  <legend>Validação:</legend>
                    <label for="approvalResult" class="control-label col-md-3">Aprovar cadastro:</label>
                  <div class="col-md-12">
                      <label class="radio-inline new-control new-control-radio">
                        <input @click="showJustify = false" type="radio" name="approvalResult" v-model="analise.approvalResult" value="APPROVED" required> Sim
                        <div class="new-control-indicator"></div>
                      </label>
                      <label class="radio-inline new-control new-control-radio">
                        <input @click="showJustify = true" type="radio" name="approvalResult" v-model="analise.approvalResult" value="REJECTED" required> Não
                        <div class="new-control-indicator"></div>
                      </label>
                      </div>
                      <span v-if="errors.first('resultado')" class="label label-danger"> {{ errors.first('resultado') }}</span>
                      <br>
                    <br>
                    <br><br><br>
                    <!-- justify -->
                    <div v-if="analise.approvalResult === 'REJECTED'" class="form-group required full"
                         :class="{ 'has-error' : errors.first('justificativa')}" style="margin-right:0;margin-left:0">
                      <label for="justify" class="control-label">Justificativa:</label>
                      <textarea v-model="analise.justify" style="height:150px; resize:none;" name="justify" id="justify" class="form-control"
                                v-validate="'required'"></textarea>
                      <span v-if="errors.first('justify')" class="label label-danger"> {{ errors.first('justify') }}</span>
                    </div>

                  </fieldset>
                </div>
                </div>
              <!-- /.col -->
            </div>
            <!-- /.row -->
          </div>
          <!-- /.box-body -->
          <div class="box-footer">
            <button @click="conclui(frmCommonRegister)"  uib-tooltip="Conclui o cadastro" type="button" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</button>
            <button @click="salva(frmCommonRegister)"   uib-tooltip="Apenas salva o cadastro" type="button" class="btn btn-default btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>
            <button @click="$router.push({ path: '/validacao/validacao-parceiro-estrategico/lista' })" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</button>
          </div>
          <!-- /.box-footer -->
        </div>
        </div></div></div>

    </section>
  </div>
  </div>
  <!-- /.box -->
</template>

<script>
  import Endereco from '../../modules/endereco'
  import projetos from '../../modules/projetos'
  import Dirigentes from '../../modules/dirigentes'
  import Usuarios from '../../modules/usuarios'
  import UploadDocumentos from '../../modules/uploadDocumentos'
  import historicoParcEstrategico from '../../modules/historicoParcEstrategico'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      Endereco,
      projetos,
      Dirigentes,
      UploadDocumentos,
      historicoParcEstrategico,
      Usuarios
    },
    name: 'ValidaParceiro',
    data () {
      return {
        campoErro: null,
        analise: {
          approvalResult: '',
          justify: ''
        },
        parceiro: {},
        contato: [],
        dirigentes: [],
        projetos: {},
        ramoAtividade: [],
        endereco: {},
        historico: {},
        usuarios: {},
        atividade: {}
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created () {
      if (this.$route.params.id) {
        axios.get('proxy/account/approval-strategic-partner/' + this.$route.params.id).then((response) => {
          this.parceiro = response.data.value
          this.analise = response.data.value
          this.dirigentes = this.parceiro.strategicPartner.chiefs
          this.contato = this.parceiro.strategicPartner.contacts
          this.endereco = this.parceiro.strategicPartner.addresses
          this.projetos = (Object.assign([], this.parceiro.strategicPartner.projects))
          this.loadEntityActivity()
          this.loadEntityUser()
          this.loadHistory()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      }
    },
    methods: {
      isEditable () {
        return (this.$root.authorize('entidade-editar') || this.$root.authorize('minha-entidade-editar'))
      },
      loadEntityActivity () {
        axios.get('proxy/project/entity-activity/').then((response) => {
          this.ramoAtividade = response.data.value
        })
      },
      loadHistory () {
        axios.get('proxy/account/strategicpartners/' + this.parceiro.strategicPartner.id + '/history').then((response) => {
          this.historico = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      loadEntityUser () {
        axios.get('proxy/account/strategicpartners/' + this.parceiro.strategicPartner.id + '/users').then((response) => {
          this.usuarios = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      salvaUsuarios () {
        axios.post('proxy/account/entities/' + this.parceiro.strategicPartner.id + '/users', this.usuarios).then((response) => {
          this.users = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      salva () {
        if (this.parceiro.strategicPartner.id) {
          this.atualiza()
        } else {
          this.grava()
        }
      },
      conclui () {
        let entidadeOK = true
        let aba = ''
        if (_.isEmpty(this.endereco)) {
          entidadeOK = false
          aba = 'Endereço'
        }
        if (_.isEmpty(this.dirigentes)) {
          entidadeOK = false
          aba = 'Dirigentes'
        }
        if (entidadeOK) {
          this.$validator.validateAll().then((result) => {
            if (result) {
              this.$snotify.clear()
              this.$snotify.info('Atualizando Validação...', {timeout: 0})
              if (this.$route.params.id) {
                axios.put('/proxy/account/approval-strategic-partner/' + this.$route.params.id, this.analise).then((response) => {
                  this.salvaUsuarios()
                  if (this.parceiro.strategicPartner.active === false) {
                    this.$snotify.clear()
                    if (this.usuarioLogado.userType === 'FUNDACAO') {
                      this.$snotify.success('Alteração cadastral concluída com sucesso!')
                    } else {
                      this.$snotify.success('Cadastro da entidade concluído com sucesso! Aguarde e-mail da Fundação Banco do brasil com as informações para dar continuidade ao processo !')
                    }
                    setTimeout(() => {
                      this.$router.go(-1)
                    }, 1000)
                  } else {
                    this.$snotify.clear()
                    this.$snotify.success('Alteração cadastral concluída com sucesso!')
                    this.$router.go(-1)
                  }
                })
                  .catch((error) => {
                    this.$snotify.clear()
                    this.$root.trataErro(error)
                  })
              }
            } else {
              this.errors.items.forEach((item) => {
                this.campoErro = item.field
                if (this.campoErro === 'cnpjExpeditionTime') {
                  $('input[name="cnpjExpeditionTime"]').focus()
                } else if (this.campoErro === 'CNPJ') {
                  $('input[name="CNPJ"]').focus()
                } else {
                  this.$snotify.error(item.msg, '', this.$root._data.error, this.$refs[this.campoErro].focus())
                }
              })
            }
          })
        } else {
          this.$snotify.error('Erros no preenchimento da aba ' + aba + '. Favor verificar.')
        }
      },
      atualiza () {
        this.parceiro.users = this.usuarios
        this.parceiro.strategicPartner.chiefs = this.dirigentes
        this.parceiro.strategicPartner.contacts = this.contato
        this.parceiro.strategicPartner.addresses = this.endereco
        this.parceiro.strategicPartner.projects = this.projetos
        axios.put('/proxy/account/strategicpartners/' + this.parceiro.strategicPartner.id + '/temp', this.parceiro.strategicPartner).then((response) => {
          this.salvaUsuarios()
          this.$snotify.success('Parceiro salvo com sucesso!')
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      grava () {
        axios.post('proxy/account/strategicpartners/temp/' + this.parceiro.strategicPartner).then((response) => {
          this.$snotify.success('Parceiro salvo com sucesso!')
        })
      }
    }
  }
</script>

<style scoped>


</style>
