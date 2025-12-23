<template>
  <div class="box box-primary">
    <div class="box-header with-border">
      <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> <font style="color:#048019;">Pré-Análise da Proposta</font></h3>
    </div>
    <div class="box-body">
      <fieldset :disabled="this.$router.currentRoute.name === 'proposta-visualiza'">
      <div class="form-horizontal">
        <!--Agência condutora do Projeto-->
        <agencia-condutora-projeto v-if="mostrarRef('agencia_condutora_agencia')" :propsProposta="preAnalise" @agenciaSelecionada="preAnalise.agencia"></agencia-condutora-projeto>
        <!--FAV-->
        <!--<fav :propsPreAnalise="preAnalise" fase="Pré-Análise"></fav>-->
        <!--FEP-->
        <fep :propsPreAnalise="preAnalise"></fep>
        <!--Categorizadores-->
        <categorizadores :propsPreAnalise="preAnalise"></categorizadores>
        <!--Cálculo de Rating-->
        <div class="row" v-if="mostrarRef('restricoes')">




          <div class="col-md-12 required">
            <div class="box box-widget">
              <div class="box-header with-border">
                <h3 class="box-title">Cálculo de Rating</h3>
              </div>
              <div class="box-body form-group required-field" style="padding-top: 0px;"
                   :class="{ 'has-error' : errors.first('calculo de rating')}">
                <div class="col-md-12">
                  <label class="control-label">Cálculo de rating</label>
                  <div>
                    <div class="col-sm-2" v-for="r in rating">
                      <label class="new-control new-control-radio" style="padding-top: 8px; margin-left: 15px;">
                        <input type="radio" name="calculo de rating" :value="r.id"
                        v-model="preAnalise.rating"
                        v-validate="'required'"/>
                        {{r.description}}
                        <div class="new-control-indicator"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <span v-if="errors.first('calculo de rating')" class="label label-danger"> {{ errors.first('calculo de rating') }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--Restrições-->
        <!--<restricoes :propsPreAnalise="preAnalise"></restricoes>-->
        <!--Documentos-->
        <fieldset>
          <legend>Documentos da Proposta</legend>
          <div class="col-md-12">
            <upload-documentos-php-novo :propDocumentos="preAnalise.documentos" :documentTypes="''" :documentosObrigatorios="''" :localUso="listaDocEntidades" ></upload-documentos-php-novo>
          </div>
        </fieldset>
        <!--Aprovação-->
        <fieldset>
          <legend>Aprovação</legend>
          <div class="col-md-6">

            <!-- Aprovação radio Button -->
            <div class="form-group required full" :class="{ 'has-error' : errors.first('resultado pre-analise')}" style="margin-right:0;margin-left:0">
              <label for="resultado pre-analise" class="control-label">Ação sobre a proposta:</label>
              <div class="col-md-12">
                <label class="radio-inline new-control new-control-radio
">
                  <input type="radio" name="resultado pre-analise" id="resultado pre-analise" data-vv-as="Resultado da Pré-análise" v-model="preAnalise.resultadoAprovacao" value="APROVAR"
                         v-validate="'required'"> Aprovar
                  <div class="new-control-indicator"></div>
                </label>
              </div>
              <div class="col-md-12">
                <label class="radio-inline new-control new-control-radio">
                  <input  type="radio" name="resultado pre-analise" data-vv-as="Resultado da Pré-análise" v-model="preAnalise.resultadoAprovacao" value="ENVIAR_REVISAO"
                         v-validate="'required'"> Revisão
                  <div class="new-control-indicator"></div>
                </label>
              </div>
              <div class="col-md-12">
                <label class="radio-inline new-control new-control-radio">
                  <input  type="radio" name="resultado pre-analise" v-model="preAnalise.resultadoAprovacao" data-vv-as="Resultado da Pré-análise" value="REPROVAR"
                         v-validate="'required'"> Reprovado
                  <div class="new-control-indicator"></div>
                </label>
              </div>
            </div>
            <span v-if="errors.first('resultado pre-analise')" class="label label-danger"> {{ errors.first('resultado pre-analise') }}</span>

            <!-- justificativa -->
            <div v-if="preAnalise.resultadoAprovacao && preAnalise.resultadoAprovacao !== 'APROVAR'" class="form-group required full"
                 :class="{ 'has-error' : errors.first('justificativa')}" style="margin-right:0;margin-left:0">
              <label for="justificativa" class="control-label">Justificativa:</label>
              <textarea v-model="preAnalise.preAnaliseJustificativa" style="height:150px; resize:none;" name="justificativa" id="justificativa" class="form-control"
                        v-validate="'required'"></textarea>
              <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
            </div>

          </div>
        </fieldset>
      </div>
      </fieldset>
    </div>
    <!--<div class="box-footer" v-if="aguardaEnviar === 0">-->
      <!--<button v-if="preAnalise.resultadoAprovacao" @click="onConclude" type="button" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</button>-->
      <!--<button @click="onSave" type="button" class="btn btn-default btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Salvar</button>-->
      <!--<button @click="onReturn" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</button>-->
    <!--</div>-->
  </div>

</template>

<script>
    import AgenciaCondutoraProjeto from '../../modules/agenciaCondutoraProjeto'
    import Fav from '../../modules/fav'
    import Fep from '../../modules/fep'
    import Categorizadores from '../../modules/categorizadores'
    import Restricoes from '../../modules/restricoes'
    import UploadDocumentosPhpNovo from '../../modules/uploadDocumentosPhpNovo'

    export default {
      components: {
        UploadDocumentosPhpNovo,
        Restricoes,
        Categorizadores,
        Fep,
        Fav,
        AgenciaCondutoraProjeto},
      name: 'pre-analise-form',
      props: ['propsPreAnalise', 'propsFluxo'],
      data () {
        return {
          elementos: {
            visivel: ''
          },
          aguardaEnviar: 0,
          preAnalise: {}
        }
      },
      created () {
        this.buscaRisco()
      },
      mounted () {
        this.buscaRisco()
        if (this.preAnalise) { // SE não carregar o rating da erro n HTML
          this.preAnalise.rating.id = 0
        }
      },
      watch: {
        propsPreAnalise () {
          this.preAnalise = this.propsPreAnalise
          this.$emit('preAnaliseProposta', this.preAnalise)
        },
        propsFluxo () {
          this.elementos = this.propsFluxo.elementos
        }
      },
      methods: {
        mostrarRef (ref) {
          return _.filter(this.elementos, item => item.nome === ref).some((item) => { return item.visivel })
        },
        buscaRisco () {
          axios.get('proxy/project/risk-answer/get-by-risk-question-id/' + 8).then((response) => {
            console.log('response.data.value', response.data.value)
            this.rating = response.data.value
            this.$forceUpdate()
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        onConclude () {
          if (this.preAnalise.resultadoAprovacao === 'APROVAR') {
            this.Aprova()
          } else if (this.preAnalise.preAnalysisApprovalResult === 'REPROVED' || this.preAnalise.preAnalysisApprovalResult === 'REVIEW') {
            this.$validator.validate('justificativa')
            this.$validator.validate('preAnalysisApprovalResult')
            if (this.$validator.errors.items.length > 0) {
              this.$validator.errors.items.forEach((item) => {
                this.$snotify.error('campo ' + item.field + ' com erro. Favor verificar')
              })
            } else {
              this.enviaBackEnd()
            }
          }
        },
        enviaBackEnd () {
          // Se o cadastro da entidade ligado a proposta não estiver aprovada mostra mensagem e não deixa concluir
          // if (!this.verificaCadastroEntidadeOk()) {
          //   this.$snotify.error('Esta entidade não tem o cadastro completo aprovado, portanto o seu cadastro ainda não foi integrado ao ERP.')
          //   return
          // }
          this.aguardaEnviar = 1
          this.$snotify.async('Validando proposta. Por favor, aguarde...', {timeout: 0})
          axios.put('proxy/project/approval-pre-analysis/' + this.preAnalise.id + '/approve', this.preAnalise).then((response) => {
            this.$snotify.clear()
            this.$snotify.success('Validação atualizada com sucesso')
            setTimeout(() => { this.$router.go(-1) }, 2000)
          })
            .catch((error) => {
              this.aguardaEnviar = 0
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        Aprova () {
          // Verifica se os dados da proposta estão ok
          if (!this.$root.validaProposta(this.preAnalise.proposal)) {
            return
          }
          // Verifica se os campos da proposta foram preenchidos
          this.$parent.$validator.validateAll().then((validado) => {
            if (!validado) {
              this.$snotify.error('Formulario de proposta possui erros favor verificar')
              return
            }
            // Verifica se algum componente filho tem algum erro
            if (!this.$root.verificaFormulario(this)) {
              this.$snotify.error('Formulario possui erros favor verificar')
              return
            }
            // Verifica a quantidade de documentos
            if (this.preAnalise.documents.length === 0) {
              this.$snotify.error('Favor anexar documentos da Pré-Analise')
              return
            }
            this.$validator.validateAll().then((validado) => {
              if (!validado) {
                this.$snotify.error('Formulario possui erros favor verificar')
              } else {
                this.enviaBackEnd()
              }
            })
          })
        },
        verificaCadastroEntidadeOk () {
          if (_.has(this.preAnalise.proposal, 'entity')) {
            if (!(_.has(this.preAnalise.proposal.entity, 'codForERp') && Number.isInteger(parseInt(this.preAnalise.proposal.entity.codForERp)))) {
              return false
            }
          }
          return true
        },
        onSave () {
          if (!this.validaRating()) {
            this.$snotify.error('Campo de calculo de Rating é obrigatório')
            return
          }
          // Se o cadastro da entidade ligado a proposta não estiver aprovada mostra mensagem mas deixa salvar
          if (!this.verificaCadastroEntidadeOk()) {
            this.$snotify.warning('Esta entidade não tem o cadastro completo aprovado, portanto o seu cadastro ainda não foi integrado ao ERP.')
          }
          this.$snotify.async('Salvando validação. Por favor, aguarde...', {timeout: 0})
          axios.put('proxy/project/approval-pre-analysis/' + this.preAnalise.id, this.preAnalise).then((response) => {
            this.$snotify.clear()
            this.$snotify.success('Validação salva com sucesso')
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        onReturn () {
          this.$router.go(-1)
        },
        validaRating () {
          if (this.preAnalise.proposal.rating.id <= 0) {
            return false
          }
          return true
        }
      }
    }
</script>

<style scoped>

</style>
