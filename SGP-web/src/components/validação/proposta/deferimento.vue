<template>

  <div class="box box-primary">

    <fieldset :disabled="this.$router.currentRoute.name === 'proposta-visualiza'">
      <div class="box-header with-border">
        <h3 class="box-title">Deferimento<span v-if="deferimento.ds_codigo_projeto_erp"> do projeto <b>{{deferimento.ds_codigo_projeto_erp}}</b></span></h3>
      </div>

      <div class="box-body">
        <div class="form-horizontal">

          <div class="row">

            <div class="col-md-6">
              <legend>Datas</legend>
              <dl class="col-md-12">
                <!--Data de deferimento-->
                <div class="form-group col-md-12 required-field" uib-tooltip="Data de deferimento"
                     :class="{ 'has-error' : errors.first('data deferimento')}">
                  <label class="control-label">Data do deferimento pelo comitê</label>
                  <div class="input-group">
                    <datepicker name="data deferimento" v-model="deferimento.dt_deferimento"
                                input-class="form-control datepicker" :language="$datePickerPtBR" :use-utc="false"
                                format="dd/MM/yyyy"
                                v-validate="'required|validdate|dateeqpast'" placeholder="__/__/____"></datepicker>
                  </div>
                  <span v-if="errors.first('data deferimento')" class="label label-danger"> {{ errors.first('data deferimento') }}</span>
                </div>
              </dl>
            </div>

          </div>

        <!--Documentos Deferimento-->
          <div class="row">
            <div class="col-md-12">
              <legend>Documentos do Deferimento</legend>
              <div class="col-md-12">
                <!--//Nesse caso se for enviar algum documento precisa preencher o campo de documento-->
                <upload-documentos-php-novo :propDocumentos="deferimentoDocumentos" :documentTypes="''" :documentosObrigatorios="''" :localUso="'PROPOSTA_DEFERIMENTO'"></upload-documentos-php-novo>
              </div>
            </div>
          </div>


        <!--Decisões do DEFERIMANETO da proposta-->
          <div class="row">
            <div class="col-md-12">
              <legend>Decisões</legend>
              <div class="form-group col-md-12 required-field"
                   :class="{ 'has-error' : errors.first('resultadoAprovacao')}">
                <div class="col-md-12">
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" name="resultadoAprovacao" value="APROVAR"
                           v-model="deferimento.resultadoAprovacao"
                           v-validate="'required'"/>
                    Deferir o Projeto (DEF)
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <div class="col-md-12">
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" name="resultadoAprovacao" value="INDEFERIR"
                           v-model="deferimento.resultadoAprovacao"
                           v-validate="'required'"/>
                    Indeferir o Projeto (IND)
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <div class="col-md-12">
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" name="resultadoAprovacao" value="VOLTAR_ANALISE"
                           v-model="deferimento.resultadoAprovacao"
                           v-validate="'required'"/>
                    Devolver para Reanálise
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <span v-if="errors.first('aprovacao')" class="label label-danger"> {{ errors.first('aprovacao') }}</span>
              </div>

              <!-- justificativa -->
              <div class="col-md-12">
                <div :class="{ 'has-error' : errors.first('justificativa')}" v-if=" deferimento.resultadoAprovacao && deferimento.resultadoAprovacao !== 'APROVAR'"
                     class="form-group full col-md-12 required-field">
                  <label class="control-label">Justificativa</label>
                  <textarea v-model="deferimento.justificativa"
                            name="justificativa"
                            class="form-control" v-validate="'required'">
                  </textarea>
                  <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </fieldset>
  </div>
</template>

<script>
  import Fav from '../../modules/fav'
  import UploadDocumentosPhpNovo from '../../modules/uploadDocumentosPhpNovo'
  import ImpressaoRelatorioModal from '../../relatorios/ImpressaoRelModal'

  export default {
    name: 'deferimento',
    components: {
      ImpressaoRelatorioModal,
      UploadDocumentosPhpNovo,
      Fav},
    data () {
      return {
        requiredFormalizationDocumentsType: [],
        documentosObrigatorios: ['Minuta', 'Plano de Trabalho'],
        approval: {},
        aguardaEnviar: 0,
        deferimentoDocumentos: [],
        deferimento: {
          questionario_respostas: {},
          documentos: {
            deferimento: []
          }
        }
      }
    },
    props: ['propsDeferimento'],
    inject: ['$validator'],
    provide () {
      return {
        $validator: this.$validator
      }
    },
    watch: {
      propsDeferimento () {
        this.deferimento = this.propsDeferimento
        if (this.deferimento.documentos) {
          if (!_.isUndefined(this.deferimento.documentos.deferimento)) {
            if (this.deferimento.documentos.deferimento.length <= 0) {
              this.deferimento.documentos.deferimento = []
            } else {
              this.deferimentoDocumentos = this.deferimento.documentos.deferimento
            }
          }
        }
        this.$emit('deferimentoProposta', this.propsDeferimento)
        // this.preparaArquivos()
        this.$forceUpdate()
      },
      deferimentoDocumentos () {
        if (this.deferimentoDocumentos) {
          this.deferimento.documentos.deferimento = this.deferimentoDocumentos
        }
        this.$emit('deferimentoProposta', this.deferimento)
      }
    },
    methods: {
      // onSave () {
      //   this.analise.approval.proposal = this.analise.proposal
      //   this.$snotify.info('Atualizando Validação', {timeout: 0})
      //   axios.post('proxy/document-preparation/', this.analise).then((response) => {
      //     this.$snotify.clear()
      //     this.$snotify.success('Validação salva com sucesso')
      //   })
      //     .catch((error) => {
      //       this.$snotify.clear()
      //
      //       this.$root.trataErro(error)
      //     })
      // },
      // onConclude () {
      //   this.$validator.validateAll().then((result) => {
      //     if (!result) {
      //       this.$snotify.error('Formulario possui erros favor verificar')
      //     } else {
      //       this.enviaBackEnd()
      //     }
      //   })
      // },
      enviaBackEnd () {
        this.approval.proposal = this.analise.proposal
        this.aguardaEnviar = 1
        this.$snotify.async('Validando proposta. Por favor, aguarde...', {timeout: 0})
        axios.put('proxy/project/approval-grant/' + this.approval.id, this.approval).then((response) => {
          console.log(response)
          this.$snotify.clear()
          this.$snotify.success('Deferimento atualizado com sucesso')
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
      },
      openSgpReport () {
        this.$modal.show('relatorio-sgp')
      },
      openErpReport () {
        // TODO falta fazer o relatorio ERP no deferimento
      }
    }
  }
</script>

<style scoped>

</style>
