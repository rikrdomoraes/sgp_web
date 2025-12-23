<template>
  <div class="box box-widget">
    <div class="box-body">
      <div class="box-header with-border">
        <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> <font style="color:#048019;">Aprovação da Proposta</font></h3>
      </div>
      <form name="cmptDocPreparationForm" class="form-horizontal" novalidate>

        <div class="box-header with-border">
          <h3 class="box-title">Agência condutora do projeto</h3>
        </div>

        <div class="box-body">
          <div class="box-body">
            <div class="row">

              <!-- Dados da Agência -->
              <div class="col-md-6">
                <!--<h2 class="h4">Agência</h2>-->
                <dl>
                  <dd>
                    <div class="form-group col-md-12 required-field"
                         :class="{ 'has-error' : errors.first('banco')}">
                      <label class="control-label">Banco</label>
                      <the-mask v-model="aprovacao.ds_agencia_banco" name="banco" class="form-control" :mask="['###']"
                             v-validate="'required'">
                      </the-mask>
                      <span v-if="errors.first('banco')" class="label label-danger"> {{ errors.first('banco') }}</span>
                    </div>
                  </dd>
                  <dd>
                    <div class="form-group col-md-12 required-field"
                         :class="{ 'has-error' : errors.first('agencia')}">
                      <label class="control-label">Agência</label>
                      <the-mask v-model="analise.proposal.agencyNumber" name="agencia" class="form-control" :mask="['####-X']"
                                v-validate="'required'"></the-mask>
                      <span v-if="errors.first('agencia')" class="label label-danger"> {{ errors.first('agencia') }}</span>
                    </div>
                  </dd>
                  <dd>
                    <div class="form-group col-md-12 required-field"
                         :class="{ 'has-error' : errors.first('conta corrente')}">
                      <label class="control-label">Conta Corrente</label>
                      <the-mask v-model="aprovacao.ds_agencia_conta_corrente" name="conta corrente" class="form-control"
                             v-validate="'required'" :mask="['###-X', '####-X', '#####-X', '######-X', '#######-X', '########-X', '#########-X']">
                      </the-mask>
                      <span v-if="errors.first('conta corrente')" class="label label-danger"> {{ errors.first('conta corrente') }}</span>
                    </div>
                  </dd>
                </dl>
              </div>

              <div class="col-md-6">
                <dl>
                  <!--Data da Proposta-->
                  <div class="form-group col-md-12 required-field-field"
                       :class="{ 'has-error' : errors.first('data proposta')}">
                    <label class="control-label">Data da Proposta</label>
                    <div class="input-group">
                      <datepicker name="data proposta" v-model="aprovacao.dt_proposta" input-class="form-control datepicker"
                                    :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                    format="dd/MM/yyyy" v-validate="'required'">
                      </datepicker>
                    </div>
                    <span v-if="errors.first('data proposta')" class="label label-danger"> {{ errors.first('data proposta') }}</span>
                  </div>
                </dl>
                <dl>
                  <!--Data de análise-->
                  <div class="form-group col-md-12 required-field" uib-tooltip="Data de análise"
                       :class="{ 'has-error' : errors.first('data análise')}">
                    <label class="control-label">Data de análise</label>
                    <div class="input-group">
                      <datepicker name="data análise" v-model="aprovacao.dt_analise"
                                  input-class="form-control datepicker" :language="$datePickerPtBR" :use-utc="true"
                                  format="dd/MM/yyyy"
                                  v-validate="'required'" placeholder="__/__/____">
                      </datepicker>
                    </div>
                    <span v-if="errors.first('data análise')" class="label label-danger"> {{ errors.first('data análise') }}</span>
                  </div>
                </dl>

                <dl>
                  <!--Data de deferimento-->
                  <div class="form-group col-md-12 required-field" uib-tooltip="Data de deferimento"
                       :class="{ 'has-error' : errors.first('data deferimento')}">
                    <label class="control-label">Data de deferimento</label>
                    <div class="input-group">
                      <datepicker name="data deferimento" v-model="aprovacao.dt_deferimento"
                                  input-class="form-control datepicker" :language="$datePickerPtBR" :use-utc="true"
                                  format="dd/MM/yyyy"
                                  v-validate="'required'" placeholder="__/__/____">
                      </datepicker>
                    </div>
                    <span v-if="errors.first('data deferimento')" class="label label-danger"> {{ errors.first('data deferimento') }}</span>
                  </div>
                </dl>

                <!--Data de assinatura do convênio-->
                <dl>
                  <div class="form-group col-md-12" >
                    <label class="control-label">Data de assinatura do convênio</label>
                    <div class="input-group">
                      <datepicker name="data assinatura" v-model="aprovacao.dt_assinatura_convenio"
                                  input-class="form-control datepicker" :language="$datePickerPtBR" :use-utc="true"
                                  format="dd/MM/yyyy"
                                  placeholder="__/__/____">
                      </datepicker>
                    </div>
                    <span v-if="errors.first('data assinatura')" class="label label-danger"> {{ errors.first('data assinatura') }}</span>
                  </div>
                </dl>

                <!-- Data de Vigência -->
                <dl>
                  <div class="form-group col-md-12 required-field">
                    <label class="control-label">Data de Vigência do Projeto</label>
                    <div class="input-group">
                      <datepicker name="data vigência" v-model="aprovacao.dt_data_vigencia"
                                  input-class="form-control datepicker" :language="$datePickerPtBR" :use-utc="true"
                                  format="dd/MM/yyyy"
                                  placeholder="__/__/____"
                                  v-validate="'required'">
                      </datepicker>
                      <span v-if="errors.first('data vigência')" class="label label-danger"> {{ errors.first('data vigência') }}</span>
                    </div>
                  </div>
                </dl>

              </div>
            </div>
          </div>
        </div>

        <!--FAV Respostas-->
        <!--<fav :propsPreAnalise="analise" fase="Preparação de Documentos"></fav>-->
        <!--Minuta-->
        <div class="row">
          <div class="col-md-12">
            <div class="box box-widget">
              <div class="box-header with-border">
                <h3 class="box-title">Minuta / Plano de Trabalho</h3>
              </div>
              <div class="box-body" style="padding-top: 0px;">
                <div class="box-body">
                  <upload-documentos :propDocumentos="analise.documentDraft"
                                     :documentTypes="requiredFormalizationDocumentsType"
                                     :documentosObrigatorios="documentosObrigatorios">
                  </upload-documentos>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--Email para Entidade-->
        <div class="box box-widget">
          <div class="box-header with-border">
            <h3 class="box-title">Envio de E-mail</h3>
          </div>
          <div class="box-body">
            <div class="box-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group col-md-12 required-field"
                       :class="{ 'has-error' : errors.first('enviaEmail')}">
                    <div>
                      <label class="col" style="margin-top: 0px; margin-bottom: 0px; font-size: 12px;">Deseja enviar e-mail para entidade?</label>
                    </div>

                    <div class="col-md-12">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="enviaEmail" value="true"
                               v-model="aprovacao.enviaEmail"
                               v-validate="'required'"/>
                        Sim
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="col-md-12">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="enviaEmail" value="false"
                               v-model="aprovacao.enviaEmail"
                               v-validate="'required'"/>
                        Não
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <span v-if="errors.first('enviaEmail')" class="label label-danger"> {{ errors.first('enviaEmail') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--Documentos Formalização-->
        <fieldset>
          <legend>Documentos de formalização</legend>
          <div class="col-md-12">
            <!--//Nesse caso se for enviar algum documento precisa preencher o campo de documento-->
            <upload-documentos :propDocumentos="aprovacao.documents" :documentTypes="requiredFormalizationDocumentsType" :documentosObrigatorios="documentosObrigatorios"></upload-documentos>
          </div>
        </fieldset>

        <!--Decisões da análise da proposta-->
        <div class="box box-widget">
          <div class="box-header with-border">
            <h3 class="box-title">Aprovação</h3>
          </div>
          <div class="box-body">
            <div class="box-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group col-md-12 required-field"
                       :class="{ 'has-error' : errors.first('actionApproval')}">
                    <div>
                      <label class="col" style="margin-top: 0px; margin-bottom: 0px; font-size: 12px;">Decisões:</label>
                    </div>

                    <div class="col-md-12">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="actionApproval" value="APROVAR"
                               v-model="aprovacao.resultadoAprovacao"
                               v-validate="'required'"/>
                        Aprovar o projeto
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="col-md-12">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="actionApproval" value="ENVIAR_CONVENIO"
                               v-model="aprovacao.resultadoAprovacao"
                               v-validate="'required'"/>
                        Enviar Convênio
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="col-md-12">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="actionApproval" value="REJEITAR"
                               v-model="aprovacao.resultadoAprovacao" id="msgDef"
                               v-validate="'required'"/>
                        Retornar para análise
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="col-md-12">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="actionApproval" value="CANCELAR"
                               v-model="aprovacao.resultadoAprovacao"
                               v-validate="'required'"/>
                        Cancelar o projeto
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <span v-if="errors.first('nome')"
                          class="label label-danger"> {{ errors.first('actionApproval') }}</span>
                  </div>

                  <!-- justify -->
                  <div v-if="aprovacao.resultadoAprovacao === 'REJEITAR' || aprovacao.resultadoAprovacao === 'CANCELAR'" class="form-group full"
                       style="margin-right:0;margin-left:0">
                    <label for="justify" class="control-label">Justificativa</label>
                    <textarea v-model="aprovacao.justificativa"
                              style="height:150px; resize:none;" name="justify"
                              class="form-control">
                                    </textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- buttons -->
        <!--<div class="col-md-12" v-if="aguardaEnviar === 0">-->
          <!--<button v-if="approval.projectFormalizationResult" @click="onConclude" type="button"-->
                  <!--class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</button>-->
          <!--&lt;!&ndash;<button @click="onSave" type="button" class="btn btn-default btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>&ndash;&gt;-->
          <!--<button @click="$router.go(-1)" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</button>-->
        <!--</div>-->
      </form>
    </div>
  </div>
</template>

<script>
  import Fav from '../../modules/fav'
  import UploadDocumentos from '../../modules/uploadDocumentos'

  export default {
    name: 'aprovacao',
    components: {
      UploadDocumentos,
      Fav},
    data () {
      return {
        requiredFormalizationDocumentsType: [],
        documentosObrigatorios: ['Minuta', 'Plano de Trabalho'],
        aprovacao: {},
        aguardaEnviar: 0,
        analise: {
          proposal: []
        },
        customTokens: {
          '#': {pattern: /\d/},
          'X': { pattern: /[0-9x-xX-X]/, transform: v => v.toUpperCase() }
        }
      }
    },
    props: ['propsAprovacao'],
    watch: {
      propsAprovacao () {
        this.aprovacao = this.propsAprovacao
        console.log('this', this)
        this.$emit('aprovacaoProposta', this.aprovacao)
        this.preparaArquivos()
        this.$forceUpdate()
      }
    },
    methods: {
      onSave () {
        this.analise.approval.proposal = this.analise.proposal
        this.$snotify.info('Atualizando Validação', {timeout: 0})
        axios.post('proxy/document-preparation/', this.analise).then((response) => {
          console.log(response)
          this.$snotify.clear()
          this.$snotify.success('Validação salva com sucesso')
        })
          .catch((error) => {
            this.$snotify.clear()

            this.$root.trataErro(error)
          })
      },
      onConclude () {
        this.$validator.errors.clear()
        // valida se tem arquivo para enviar na opção de envio de Convênio
        if (this.approval.projectFormalizationResult === 'SEND_COVENANT' && !this.analise.documents[0]) {
          this.$snotify.error('Necessário anexar os Documentos de Formalização')
          return
        }
        this.$validator.validateAll().then((result) => {
          if (!result) {
            this.$snotify.error('Formulario possui erros favor verificar')
          } else {
            this.enviaBackEnd()
          }
        })
      },
      enviaBackEnd () {
        this.approval.proposal = this.analise.proposal
        this.aguardaEnviar = 1
        this.$snotify.async('Validando proposta. Por favor, aguarde...', {timeout: 0})
        axios.put('proxy/project/project-formalization/' + this.approval.id, this.approval).then((response) => {
          console.log(response)
          this.$snotify.clear()
          this.$snotify.success('Formalização atualizada com sucesso')
          setTimeout(() => { this.$router.go(-1) }, 2000)
        })
          .catch((error) => {
            this.aguardaEnviar = 0
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      preparaArquivos () {
        this.analise.documentDraft = []
        if (this.analise.proposal.documentDraft) {
          this.analise.documentDraft.push(this.analise.proposal.documentDraft)
        }
        if (this.analise.proposal.documentWorkPlan) {
          this.analise.documentDraft.push(this.analise.proposal.documentWorkPlan)
        }
      }
    }
  }
</script>

<style scoped>

</style>
