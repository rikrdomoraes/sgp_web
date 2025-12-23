<template>
  <div class="box box-widget">
    <div class="box-body">
      <form name="cmptDocPreparationForm" class="form-horizontal" novalidate>

        <!--DATAS-->
        <div class="col-md-12">

          <div class="form-group col-md-2 required-field"
               style="margin-right:0;margin-left:0;"
               :class="{'has-error': errors.first('data de proposta')}">
            <label class="control-label">Data da Proposta</label>
            <div class="input-group">
              <datepicker name="data de proposta" v-model="analise.proposal.dataProposta"
                          input-class="form-control datepicker"
                          :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                          format="dd/MM/yyyy" v-validate="'required'">
              </datepicker>
            </div>
            <span v-if="errors.first('data de proposta')"
                  class="label label-danger"> {{ errors.first('data de proposta') }}</span>

          </div>

          <div class="form-group col-md-2 required-field"
               style="margin-right:0;margin-left:0;"
               ng-class="{'has-error': cmptProFormalizatinForm.$submitted && cmptProFormalizatinForm.analysisDate.$error.required }">
            <label class="control-label">Data de análise</label>
            <div class="input-group">
              <datepicker name="data da análise" v-model="analise.proposal.analysisDate"
                          input-class="form-control datepicker"
                          :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                          format="dd/MM/yyyy" v-validate="'required'">
              </datepicker>
            </div>
            <span v-if="errors.first('data da análise')" class="label label-danger"> {{ errors.first('data da análise') }}</span>
          </div>

          <div class="form-group col-md-2 required-field"
               style="margin-right:0;margin-left:0;"
               ng-class="{'has-error': cmptProFormalizatinForm.$submitted && cmptProFormalizatinForm.grantDate.$error.required }">
            <label class="control-label">Data de deferimento</label>
            <div class="input-group">
              <datepicker name="data de deferimento" v-model="analise.proposal.grantDate" input-class="form-control datepicker"
                          :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                          format="dd/MM/yyyy" v-validate="'required'">
              </datepicker>

            </div>
            <span v-if="errors.first('introducao')" class="label label-danger"> {{ errors.first('introducao') }}</span>
          </div>

          <div class="form-group col-md-2"
               style="margin-right:0;margin-left:0;">
            <label class="control-label">Data de assinatura do convênio</label>
            <div class="input-group">
              <datepicker name="data de assinatura" v-model="analise.proposal.agreementAssignmentDate" input-class="form-control datepicker"
                          :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                          format="dd/MM/yyyy" >
              </datepicker>
            </div>
          </div>

          <!-- Data de Vigência -->
          <div class="form-group col-md-2"
               style="margin-right:0;margin-left:0;">
            <label class="control-label">Data de Vigência do Projeto</label>
            <div class="input-group">
              <datepicker name="data de emissao" v-model="analise.proposal.validityDate" input-class="form-control datepicker"
                          :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                          format="dd/MM/yyyy">
              </datepicker>
            </div>
          </div>

        </div>

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
                                     :documentosObrigatorios="documentosObrigatorios"
                                     :disable="true">
                  </upload-documentos>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                        <input type="radio" name="actionApproval" value="APPROVED"
                               v-model="approval.projectFormalizationResult"
                               v-validate="'required'"/>
                        Aprovar o projeto
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="col-md-12">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="actionApproval" value="DEVOLVIDO"
                               v-model="approval.projectFormalizationResult"
                               v-validate="'required'"/>
                        Devolver para Formalização
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="col-md-12">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="actionApproval" value="REJECTED"
                               v-model="approval.projectFormalizationResult" id="msgDef"
                               v-validate="'required'"/>
                        Retornar para análise
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <div class="col-md-12">
                      <label class="new-control new-control-radio" style="padding-top: 8px;">
                        <input type="radio" name="actionApproval" value="CANCELED"
                               v-model="approval.projectFormalizationResult"
                               v-validate="'required'"/>
                        Cancelar o projeto
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                    <span v-if="errors.first('nome')"
                          class="label label-danger"> {{ errors.first('actionApproval') }}</span>
                  </div>

                  <!-- justify -->
                  <div
                    v-if="approval.projectFormalizationResult !== 'APPROVED' && 'projectFormalizationResult' in approval"
                    class="form-group full required-field"
                    :class="{ 'has-error' : errors.first('justificativa')}"
                    style="margin-right:0;margin-left:0">
                    <label for="justify" class="control-label">Justificativa</label>
                    <textarea v-model="approval.justify"
                              style="height:150px; resize:none;" name="justificativa"
                              class="form-control"
                              v-validate="'required'">
                                    </textarea>
                  </div>
                  <span v-if="errors.first('justificativa')"
                        class="label label-danger"> {{ errors.first('justificativa') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- buttons -->
        <div class="col-md-12">
          <button v-if="approval.projectFormalizationResult" @click="onConclude" type="button"
                  class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir
          </button>
          <button @click="$router.go(-1)" type="button" class="btn btn-default btn-flat"><i
            class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import Fav from '../../modules/fav'
  import UploadDocumentos from '../../modules/uploadDocumentos'

  export default {
    name: 'aprovacao-projeto',
    components: {
      UploadDocumentos,
      Fav
    },
    data () {
      return {
        requiredFormalizationDocumentsType: [],
        documentosObrigatorios: ['Minuta', 'Plano de Trabalho'],
        approval: {},
        analise: {
          proposal: {}
        }
      }
    },
    props: ['propsAnalise'],
    watch: {
      propsAnalise () {
        this.analise = this.propsAnalise
        this.preparaArquivos()
        this.approval = this.analise
        this.$forceUpdate()
      }
    },
    methods: {
      onConclude () {
        this.$validator.errors.clear()
        // valida se tem arquivo para enviar na opção de envio de Convênio
        if (this.approval.projectFormalizationResult === 'SEND_COVENANT' && (!this.analise.documents || this.analise.documents.length < 1)) {
          this.$validator.errors.add('envia documentos', 'Campo de documentos é obrigatório para envio dos mesmos') // Adiciona erro no errobag
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
        this.$snotify.info('Atualizando Validação', {timeout: 0})
        axios.put('proxy/project/project-formalization/' + this.approval.id, this.approval).then((response) => {
          this.$snotify.clear()
          this.$snotify.success('Formalização atualizada com sucesso')
          setTimeout(() => {
            this.$router.go(-1)
          }, 2000)
        })
          .catch((error) => {
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
