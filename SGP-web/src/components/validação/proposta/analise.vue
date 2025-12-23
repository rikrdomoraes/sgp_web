<template>
  <div class="box box-primary" id="analise">
    <div class="box-header with-border">
      <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> <font style="color:#048019;">Análise da Proposta</font></h3><span style="color:#a8a8a8;" v-if="analise.ds_codigo_projeto_erp"> - &nbsp;N°Projeto: <b>{{analise.ds_codigo_projeto_erp}}</b></span>
    </div>
    <div class="box-body">
      <div v-if="usuarioLogado.userType === 'FUNDACAO' && ehSimplificada" style="color: red;">
        Proposta Simplificada
      </div>
      <fieldset>
      <div class="form-horizontal">
        <fieldset :disabled="bloqueia === true">
        <!--Agência condutora do Projeto-->
        <!--<agencia-condutora-projeto :propsProposta="analise" @agenciaSelecionada="analise = $event"></agencia-condutora-projeto>-->
          <!--FEP-->
          <div v-if="_.isNull(analise.fep) || _.isUndefined(analise.fep) || _.isEmpty(analise.fep) || analise.fep === ''">
             <span class="mensagem naoPreenchido">FEP ainda não gerada no sistema. É necessário informar o número da FEP</span>
            <div class="box-body">
              <div class="row">
                <div class="col-md-2">
                  <input type="number" class="form-control" placeholder="Qual vai ser o número da FEP?" v-model="numeroFepInformado" min="0" max="999" step="1">
                  <p style="margin-top:10px">{{ resultadoVerificacaoFepExistente }}</p>
                </div>
                <button :disabled="_.isNull(numeroFepInformado) || _.isEmpty(numeroFepInformado) || (+numeroFepInformado < 1 || +numeroFepInformado > 999)" @click="criaNovaFep(numeroFepInformado)" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none" type="button"><i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp Gerar FEP</button>
              </div>
            </div>
          </div>
          <div>
            <fieldset :disabled="this.$router.currentRoute.name === 'proposta-visualiza' || analise.ds_fase !== 'ANALISE'" id="fep">
              <fep v-if="!_.isNull(analise) && !_.isEmpty(analise)" :propsAnalise="propsAnalise"></fep>
            </fieldset>
          </div>
          <!-- 69906 - Marcação de ODS no projeto -->
          <fieldset>
            <odsMarcacao :proposta="this.$route.params.id" :telaProjeto="false" id="odsMarcacao"/>
          </fieldset>

          <!-- <fieldset>
            <licenciamentoAmbientalAnalise :idProposta="analise.id"/>
          </fieldset> -->

          <!--Relatório da análise-->
          <fieldset :disabled="bloqueia === true" id="relatorioAnalise">
            <div style="background-color: #fcfcfc">
            <legend>&nbsp;Relatório da Análise</legend>
            </div>
            <!--<font color="#696969">Situação: <b>{{preenchimentoRelatorio}}</b></font>-->
            <!--<br>-->
            <br>
            <div>
              <legend :disabled="false">
                <fieldset v-if="analise.ds_fase === 'ANALISE'">
                  <router-link :to="{name: 'relatorio-analise', params: { id: analise.id } }" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none"><i class="fa fa-pencil-square-o"></i> Preencher Relatório</router-link>
                  <router-link :to="{name: 'visualiza-relatorio-analise', params: { id: analise.id, projeto: analise.ds_codigo_projeto_erp } }" target="_blank" class="btn btn-success btn-sm btn-flat" style="text-decoration: none"><i class="fa fa-search"></i> Visualizar Relatório</router-link>
                </fieldset>
                <fieldset v-else>
                  <router-link :to="{name: 'relatorio-analise', params: { id: analise.id } }" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none"><i class="fa fa-search"></i> Visualizar Relatório</router-link>
                </fieldset>
              <!--<b-button type="button" :disabled="false" @click="showModal = true" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp Preencher Relatório</b-button>-->
                <!--<router-link :to="{name: 'relatorio-analise', params: { id: analise.id } }" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none"><i class="fa fa-pencil-square-o"></i> Preencher Relatório</router-link>-->
              </legend>
            </div>
            <span v-if="_.isNull(analise.relatorio_analise)" class="mensagem naoPreenchido"> Relatório da Análise não preenchido ainda</span>
            <div id="app">
              <div v-if="showModal" id="modal4">
                <transition name="modal" id="modal">
                  <div class="modal-mask" id="modal3">
                    <div class="modal-wrapper" @click="$emit(showModal=true)" id="modal1">
                      <div class="modal-dialog" id="modal2">
                        <div class="modal-content" @click.stop>
                          <div class="modal-header">
                            <button type="button" class="close" @click="showModal=false">
                              <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 class="modal-title">Relatório da Análise</h4>
                          </div>
                          <relatorio-analise :propsProposta="analise"></relatorio-analise>
                          <div class="box-body">
                          </div>
                          <div class="box-footer">
                            <b-button type="button" :disabled="false" @click="showModal = false" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-floppy-o" aria-hidden="true"></i>  Salvar </b-button>
                            <b-button type="button" :disabled="false" @click="showModal = false" class="btn btn-warning btn-sm btn-flat"><i class="fa fa-close" aria-hidden="true"></i>  Fechar </b-button>
                          </div>
                          <div align="right">
                            <br>
                          </div></div></div></div></div>
                </transition>
              </div>
            </div>
          </fieldset>
          <br>

          <!-- Rating da entidade -->
          <!--<rating :propsAnalise="analise" @ratingCalculado="analise.rating = $event"></rating>-->
            <div class="box box-widget"  v-if="!ehSimplificada" id="ratingEntidade">
              <div class=" with-border">
                <div class="form-horizontal" style="background-color: #FCFCFC">
                   <legend class="box-title">&nbsp;Rating da Entidade</legend>
                </div>
            <br>
                <fieldset v-if="analise.ds_fase === 'ANALISE'">
                    <router-link v-if="!ehSimplificada" :to="{name: 'relatorio-rating', params: { id: analise.id }, query : { entidade: analise.entidade.id} }" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none"><i class="fa fa-pencil-square-o"></i> Calcular o Rating da Entidade</router-link>
                </fieldset>
                <fieldset v-else>
                  <router-link v-if="!ehSimplificada" :to="{name: 'relatorio-rating', params: { id: analise.id }, query : { entidade: analise.entidade.id} }" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none"><i class="fa fa-search"></i> Visualizar o Rating da Entidade</router-link>
                </fieldset>
              </div><br></div>
          <!--Questionario de riscos-->
          <questionario-riscos :key="questRiscKey" :disabled="this.$router.currentRoute.name === 'proposta-visualiza' || analise.ds_fase !== 'ANALISE'" v-if="analise.ds_fase !== 'CADASTRO'" :propsAnalise="propsAnalise"  @questionario="analise.questionario_respostas = (Array.isArray($event) && $event.length === 0) ? {} : $event" ref="child" :ehSimplificada="ehSimplificada" id="questionarioRiscos"></questionario-riscos>
          <!--Categorizadores-->
          <categorizadores v-if="analise" :propsAnalise="propsAnalise" :indicativoAvaliacao="indicativoAvaliacao" @alteraIndicativoAvaliacao="alteraIndicativoAvaliacao" :ehSimplificada="ehSimplificada" ></categorizadores>
        </fieldset>
        <fieldset :disabled="this.$router.currentRoute.name === 'proposta-visualiza' || analise.ds_fase !== 'ANALISE'" v-if="!ehSimplificada">
          <questoesAvaliacaoProjeto ref="questoesAvaliacao" :idProposta="analise.id" :resultadoAprovacao="propsAnalise.resultadoAprovacao" :proximaEtapa="propsAnalise.proximaEtapa"/>
        </fieldset>
        <!--Elementos Característicos-->
        <fieldset :disabled="this.$router.currentRoute.name === 'proposta-visualiza' || analise.ds_fase !== 'ANALISE'">
        <!-- <div class="row" :disabled="bloqueia === true">
          <div class="form-group col-md-12 required-field" style="margin-left:0px; margin-right:0px;"
               :class="{ 'has-error' : errors.first('elementos característicos')}">
            <label class="control-label">Elementos característicos</label>
            <textarea-autosize v-resizable @input="resizable" v-model="analise.ds_caracteristicas_formalizacao" style="height:150px;resize:none;" name="elementos característicos" data-vv-as="Elementos Característicos"
                               class="form-control" v-validate="'required'"></textarea-autosize>
            <span v-if="errors.first('elementos característicos')" class="label label-danger"> {{ errors.first('elementos característicos') }}</span>
          </div>
        </div> -->
        <!--Indicadores de Resultado-->
        <div class="row" :disabled="bloqueia === true">
          <div class="form-group col-md-12 required-field" style="margin-left:0px; margin-right:0px;"
               :class="{ 'has-error' : errors.first('indicadores')}">
            <label for="indicadores" class="control-label">Indicadores de Resultado</label>
            <div>
              <textarea-autosize v-resizable @input="resizable" placeholder="Informe os indicadores de resultado" style="height:150px;resize:none;" data-vv-as="Indicadores" v-model="analise.ds_indicadores_resultado" name="indicadores" class="form-control"
               v-validate="'required'" >
            </textarea-autosize>
            </div>
            <span v-if="errors.first('indicadores')" class="label label-danger"> {{ errors.first('indicadores') }}</span>
          </div>
        </div>
        <!--Ações de Comunicação-->
        <div class="row" :disabled="bloqueia === true">
          <div class="form-group col-md-12 required-field" style="margin-left:0px; margin-right:0px;"
               :class="{ 'has-error' : errors.first('acoes')}">
            <label for="acoes" class="control-label">Ações de Comunicação</label>
            <div>
              <textarea-autosize v-resizable @input="resizable" placeholder="Informe as acões de comunicação" data-vv-as="Ações" style="height:150px;resize:none;"  v-model="analise.ds_acoes_comunicacao" name="acoes" class="form-control "
                                                  v-validate="'required'">
              </textarea-autosize>
            </div>
            <span v-if="errors.first('acoes')" class="label label-danger"> {{ errors.first('acoes') }}</span>
          </div>
        </div>

        <!--Periodicidade da apresentação dos relatórios de execução-->
        <fieldset :disabled="bloqueia === true" id="periodicidadeRelatorio">
          <div  style="background-color: #FCFCFC">
           <legend>&nbsp;Periodicidade da apresentação dos relatórios de execução</legend>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group col-md-12 required" :class="{ 'has-error' : errors.first('periodicidade')}">
                <label class="control-label">Periodicidade da apresentação dos relatórios de execução</label>
                <select name="periodicidade"
                        v-model="analise.ds_periodicidade_formulario"
                        class="form-control"
                        aria-hidden="true"
                        v-validate="'required'">
                  <option v-for="i in reportPeriodicity" :value="i.id">{{i.name}}</option>
                </select>
                <span v-if="errors.first('periodicidade')" class="label label-danger"> {{ errors.first('periodicidade') }}</span>
              </div>
            </div>
          </div>
        </fieldset>
        <!--Parecer juridico-->
        <fieldset :disabled="bloqueia === true" id="parecerJuridico">
          <div  style="background-color: #FCFCFC">
              <legend>&nbsp;Parecer jurídico</legend>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group col-md-3 required-field" :class="{ 'has-error' : errors.first('data CMJ')}" style="margin-right:0;margin-left:0;">
                <label class="control-label">Data do CMJ</label>
                <div class="input-group">
                  <!-- Alteração da exibição das datas CMJ nas telas de Projeto. Suporte 63.555 -->
                  <input v-if="this.$router.currentRoute.name === 'projeto'" type="date" class="form-control " ref="dataCMJ" name="data do CMJ" v-model="analise.dt_data_cmj"
                           data-vv-as="data do CMJ" v-validate="'required|dateeqpast'">

                  <input v-else type="text" class="form-control" ref="dataCMJ" name="data do CMJ" v-model="analise.dt_data_cmj"
                         placeholder="__ /__ /____" v-mask="'##/##/####'" data-vv-as="data do CMJ" v-validate="'required|dateeqpast|date_format:dd/MM/yyyy'">
                </div>
                <span v-if="errors.first('data do CMJ')" class="label label-danger"> {{ errors.first('data do CMJ') }}</span>
              </div>

              <div class="form-group col-md-3 required-field" :class="{ 'has-error' : errors.first('cmj')}" style="margin-right:0;margin-left:0;">
                <label class="control-label">Número do CMJ</label>
                <input v-model="analise.ds_cmj" name="cmj" class="form-control"
                       type="text" maxlength="255"
                       placeholder="Número do CMJ" v-validate="'required|max:255'">
                <span v-if="errors.first('cmj')" class="label label-danger"> {{ errors.first('cmj') }}</span>
              </div>

              <div class="form-group col-md-3 required-field" :class="{ 'has-error' : errors.first('data parecer')}" style="margin-right:0;margin-left:0;">
                <label class="control-label">Data do parecer jurídico</label>
                <div class="input-group">
                  <!-- Alteração da exibição das datas CMJ nas telas de Projeto. Suporte 63.555 -->
                  <input v-if="this.$router.currentRoute.name === 'projeto'" type="date" class="form-control" ref="dataParecerJuridico" name="data do parecer juridico" v-model="analise.dt_data_parecer_juridico"
                       data-vv-as="data do parecer juridico" v-validate="'required|dateeqpast'">


                <input v-else type="text" class="form-control" ref="dataParecerJuridico" name="data do parecer juridico" v-model="analise.dt_data_parecer_juridico"
                       placeholder="__ /__ /____" v-mask="'##/##/####'" data-vv-as="data do parecer juridico" v-validate="'required|dateeqpast|date_format:dd/MM/yyyy|after:dataCMJ'">
                </div>
                <span v-if="errors.first('data do parecer juridico')" class="label label-danger"> {{ errors.first('data do parecer juridico') }}</span>
              </div>

              <div class="form-group col-md-3 required-field" :class="{ 'has-error' : errors.first('número do parecer jurídico')}" style="margin-right:0;margin-left:0;">
                <label class="control-label">Número do parecer jurídico</label>
                <input v-model="analise.ds_parecer_juridico" name="número do parecer jurídico"
                       class="form-control" type="text"
                       placeholder="Número do parecer jurídico" v-validate="'required|max:255'">
                <span v-if="errors.first('número do parecer jurídico')" class="label label-danger"> {{ errors.first('número do parecer jurídico') }}</span>
              </div>
            </div>
          </div>
          <div  style="background-color: #FCFCFC">
          <!--<legend class="required-field">&nbsp;Ficha de Auto Verificação</legend>-->
          </div>
        </fieldset>
        <!--Documentos-->
        <fieldset :disabled="bloqueia === true" id="documentosAnalise">
          <div  style="background-color: #FCFCFC">
          <legend>&nbsp;Documentos da Análise</legend>
          </div>
          <div class="col-md-12">
            <upload-documentos-php-novo :propDocumentos="documentosAnalise" :propsEtapa="analise.ds_fase" :documentTypes="dctos" :documentosObrigatorios="''" :local-uso="'TODOS'"></upload-documentos-php-novo>
          </div>
        </fieldset>
        </fieldset>
        <!--Decisões da análise da proposta-->
        <fieldset v-if="analise.ds_fase === 'ANALISE'" :disabled="bloqueia === true">
          <div  style="background-color: #FCFCFC">
          <legend>&nbsp;Decisões da análise da proposta</legend>
          </div>
          <div class="row">
            <div class="col-md-12" >
              <div class="form-group col-md-12" :class="{ 'has-error' : errors.first('resultadoAprovacao')}">
                <label class="control-label">Decisões</label>
                <div class="col-md-12">
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" name="resultadoAprovacao" value="ENCAMINHAR_DEFERIMENTO" @change="limparInfo()"
                           v-model="analise.resultadoAprovacao" v-validate="'required'"/> Encaminhar para deferimento
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <div class="col-md-12">
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" name="resultadoAprovacao" value="DEVOLVER_ENTIDADE"
                           v-model="analise.resultadoAprovacao" v-validate="'required'"/> Devolver à entidade para ajustes
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <div class="col-md-12">
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" name="resultadoAprovacao" value="INCLUIR_SAPIENS"
                           v-model="analise.resultadoAprovacao" v-validate="'required'"/> Criar projeto e retornar para análise
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <div class="col-md-12">
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" name="resultadoAprovacao" value="ENVIAR_PENDENCIAS"
                           v-model="analise.resultadoAprovacao" v-validate="'required'"/> Enviar para pendências
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <div class="col-md-12">
                  <label class="new-control new-control-radio" style="padding-top: 8px;">
                    <input type="radio" name="resultadoAprovacao" value="ANULAR_PROPOSTA"
                           v-model="analise.resultadoAprovacao" v-validate="'required'"/> Anular proposta
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
              </div>
            </div>
            <span v-if="errors.first('resultadoAprovacao')" class="label label-danger"> {{('É necessário preencher uma decisão da Análise!') }}</span>
            <div class="col-md-12" v-if="analise.resultadoAprovacao === 'ENVIAR_PENDENCIAS'">
              <div class="form-group col-md-12 required-field"
                   :class="{ 'has-error' : errors.first('justificativa')}">
                <label class="control-label">Motivo da pendência</label>
                <textarea-autosize v-resizable @input="resizable" v-model="analise.observacao" style="height:150px; resize:none;"
                          name="justificativa"
                                   class="form-control" v-validate="'required'"></textarea-autosize>
                <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
              </div>
            </div>
            <div class="col-md-12" v-if="analise.resultadoAprovacao === 'DEVOLVER_ENTIDADE'">
              <div class="form-group col-md-12 required-field"
                   :class="{ 'has-error' : errors.first('justificativa')}">
                <label class="control-label">Motivo da pendência</label>
                <textarea-autosize v-resizable @input="resizable" v-model="analise.observacao" style="height:150px; resize:none;"
                          name="justificativa"
                                   class="form-control" v-validate="'required'"></textarea-autosize>
                <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
              </div>
            </div>
            <div class="col-md-12" v-if="analise.resultadoAprovacao === 'ANULAR_PROPOSTA'">
              <div class="form-group col-md-12 required-field"
                   :class="{ 'has-error' : errors.first('justificativa')}">
                <label class="control-label">Justificativa para reprovação</label>
                <textarea-autosize v-resizable @input="resizable" v-model="analise.observacao" style="height:150px; resize:none;"
                          name="justificativa"
                                   class="form-control" v-validate="'required'"></textarea-autosize>
                <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
  import AgenciaCondutoraProjeto from '../../modules/agenciaCondutoraProjeto'
  import RelatorioAnalise from '../../modules/relatorioAnalise'
  import UploadDocumentosPhpNovo from '../../modules/uploadDocumentosPhpNovo'
  import Fav from '../../modules/fav'
  import QuestionarioRiscos from '../../modules/questionarioRiscos'
  import Fep from '../../modules/fep'
  import Categorizadores from '../../modules/categorizadores'
  import Rating from '../../modules/rating'
  import odsMarcacao from '../../modules/odsMarcacao'
  import licenciamentoAmbientalAnalise from '../../modules/licenciamentoAmbiental/licenciamentoAmbientalAnalise.vue'
  import questoesAvaliacaoProjeto from '../../modules/avaliacaoProjetos/questoesAvaliacaoProjeto.vue'
  import { mapGetters } from 'vuex'
  export default {
    name: 'analise',
    components: {
      Rating,
      QuestionarioRiscos,
      RelatorioAnalise,
      Fav,
      Categorizadores,
      Fep,
      UploadDocumentosPhpNovo,
      AgenciaCondutoraProjeto,
      odsMarcacao,
      licenciamentoAmbientalAnalise,
      questoesAvaliacaoProjeto
    },
    props: ['propsAnalise', 'propsFluxo', 'resultadoAprovacao', 'setPropostaSimplificada'],
    data () {
      return {
        numeroFepInformado: null,
        resultadoVerificacaoFepExistente: '',
        elementos: {
          visivel: ''
        },
        // rating: [],
        questRiscKey: 0,
        showModal: false,
        rating: {},
        notaRating: '',
        ratingTemp: {},
        preenchimentoRelatorio: '',
        bloqueia: false,
        reportPeriodicity: [
          {id: 'SEMESTRAL', name: 'SEMESTRAL'},
          {id: 'QUADRIMESTRAL', name: 'QUADRIMESTRAL'},
          {id: 'TRIMESTRAL', name: 'TRIMESTRAL'},
          {id: 'BIMESTRAL', name: 'BIMESTRAL'},
          {id: 'MENSAL', name: 'MENSAL'}
        ],
        documentosAnalise: [],
        approval: {},
        analise: {
          questionario_respostas: {},
          ratingRelatorio: [],
          documentos: {
            analise: []
          }
        },
        formalizacaoDcto: [],
        dctos: [],
        aguardaEnviar: 0,
        requiredFormalizationDocumentsType: [],
        defaultDocumentTypeWorkPlan: null,
        defaultDocumentTypeDraft: null,
        documentosObrigatorios: ['Minuta', 'Plano de Trabalho', 'CADIN', 'Certidão Negativa de Débitos Trabalhistas - CNDT'],
        documentosObrigatoriosSimplificado: ['Minuta', 'Plano de Trabalho', 'CADIN', 'Certidão Negativa de Débitos Trabalhistas - CNDT', 'CND', 'Certidão junto a Controladoria Geral da União (CNEP/CEPIM)', 'Litígio com o BB (Portal Jurídico)'],
        indicativoAvaliacao: '',
        exibeQuestionario: '',
        // Indicativos de simplificação de proposta
        faixasInvestimento: [{faixa: 1, de: 0, para: 100000, alcada: 'Comitê de Desenvolvimento Social'}, {faixa: 2, de: 100000.01, para: 300000, alcada: 'Comitê de Desenvolvimento Social'}, {faixa: 3, de: 300000.01, para: 1000000000, alcada: 'Comitê Estratégico'}],
        totalFBB: 0,
        totalContrapartida: 0,
        totalParceiro: 0,
        faixaDoProjeto: 0,
        ehSimplificada: false
      }
    },
    inject: ['$validator'],
    provide () {
      return {
        $validator: this.$validator
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
      documentosAnalise () {
        if (this.documentosAnalise) {
          this.analise.documentos.analise = this.documentosAnalise
        }
      },
      propsAnalise () {
        console.log('CARREGOU PROPOSTA: ')
        this.analise = this.propsAnalise
        this.moveDados()
        this.calculaTotaisEFaixaProjeto()
      },
      propsFluxo () {
        this.elementos = this.propsFluxo.elementos
      }
    },
    updated () {
      if (this.$refs.questoesAvaliacao && !this.$refs.questoesAvaliacao._isEventListenerAdded) {
        this.$refs.questoesAvaliacao.$on('indicativo-codigo-updated', this.updateCategAvaliacao)
        this.$refs.questoesAvaliacao._isEventListenerAdded = true // Marcar que o listener foi adicionado
      }
    },
    created () {
      if (this.$route.name === 'proposta-visualiza') {
        this.bloqueia = true
      }
      if (_.isEmpty(this.$store.state.configuracoes)) {
        axiosLaravel.get('configuracoes/').then((response) => {
          this.$store.commit('SET_CONFIGURACOES', response.data)
          this.setConfiguracoes(this.$store.state.configuracoes)
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      } else {
        this.setConfiguracoes(this.$store.state.configuracoes)
      }
      // Monta origem da proposta
      if (!this.analise.questionario_respostas || this.analise.questionario_respostas.length === 0) {
        this.analise.questionario_respostas = {}
      }
    },
    mounted () {
      this.recalcula()
      this.analise = this.propsAnalise
      this.moveDados()
      this.calculaTotaisEFaixaProjeto()
    },
    methods: {
      async criaNovaFep (numeroFepInformado) {
        this.resultadoVerificacaoFepExistente = 'Verificando número da FEP...'
        await axiosLaravel.get(`fep/verifica_numero/${numeroFepInformado}`).then((response) => {
          console.log('Verifica FEP - response.data: ', response.data)
          if (response.data.fepDisponivel === false) {
            this.resultadoVerificacaoFepExistente = 'Número FEP já existe para o ano vigente'
          } else {
            this.resultadoVerificacaoFepExistente = 'FEP disponível'
            this.$dialog.confirm(`Número de FEP disponível. Deseja gerar a FEP <b> ${numeroFepInformado}</b> para a proposta <b>${this.analise.ds_nome}</b>?`, {html: true, animation: 'fade', customClass: 'avisoAlerta'})
            .then(dialog => {
              this.$snotify.async('Criando FEP para a proposta...', {timeout: 0})
              axiosLaravel.post('fep', {'fk_proposta': this.analise.id, 'numero': numeroFepInformado}).then((response) => {
                console.log('post.NovaFep')
                console.log(this.analise)
                console.log('response', response)
                this.$snotify.clear()
                this.$snotify.success('FEP gerada com sucesso')
                return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
                  this.$router.go()
                })
              })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
            })
          }
        })
      },
      moveDados () {
        if (this.analise.documentos) {
          if (_.isUndefined(this.analise.documentos.analise) || this.analise.documentos.analise.length <= 0) {
            // O correto é usar o dctos, mas ele não carrega no momento correto (aqui aparece vazio), então foi colocados os tipos de arquivos de análise fixos no array abaixo
            let idTiposDocumentosAnalise = [7, 8]// _.map(this.dctos, 'id')
            let documentosAnalise = _.filter(this.propsAnalise.documentos.proposta, function (doc) {
              return _.includes(idTiposDocumentosAnalise, doc.fk_tipo_documento)
            })
            this.analise.documentos.analise = documentosAnalise
          }
          this.documentosAnalise = this.analise.documentos.analise
        }
        this.$emit('analiseProposta', this.analise)
        // só move se vier algo preenchido.
        if (this.analise.relatorio_analise) {
          if (!_.isNull(this.analise.relatorio_analise) && !_.isUndefined(this.analise.relatorio_analise)) {
            this.relatorioAnalise = JSON.parse(this.analise.relatorio_analise)
          }
        }
        let result = 0
        if (!_.isNull(this.relatorioAnalise) && !_.isUndefined(this.relatorioAnalise)) {
          result = Object.keys(this.relatorioAnalise).length
        }
        let total = 63
        if (_.isEmpty(this.relatorioAnalise)) {
          this.preenchimentoRelatorio = 'Não Preenchido'
        }
        if (result < total) {
          this.preenchimentoRelatorio = 'Em Preenchimento'
        }
        if (result >= total) {
          this.preenchimentoRelatorio = 'Preenchido'
        }
        // this.analise.documentosFormalizacao = this.formalizacaoDcto
        this.approval = this.analise
        // this.carregaArquivos()
        this.$emit('analiseProposta', this.analise)
        this.$emit('etapa', this.analise.ds_fase)
        this.$forceUpdate()
      },
      setConfiguracoes (data) {
        let generalSystemConfig = data
        let minuta = data.configuracao_proposta.minuta
        let planoTrabalho = data.configuracao_proposta.plano_trabalho
        this.dctos.push(minuta, planoTrabalho)
        if (generalSystemConfig.configuracao_proposta) {
          this.requiredFormalizationDocumentsType = []

          if (generalSystemConfig.configuracao_proposta.minuta) {
            this.requiredFormalizationDocumentsType.push(generalSystemConfig.configuracao_proposta.minuta)
            this.defaultDocumentTypeDraft = generalSystemConfig.configuracao_proposta.minuta
          }
          if (generalSystemConfig.configuracao_proposta.plano_trabalho) {
            this.requiredFormalizationDocumentsType.push(generalSystemConfig.configuracao_proposta.plano_trabalho)
            this.defaultDocumentTypeWorkPlan = generalSystemConfig.configuracao_proposta.plano_trabalho
          }
        }
      },
      alteraIndicativoAvaliacao (valor) {
        this.indicativoAvaliacao = valor
        this.exibeQuestionario = valor
        console.log('deu certo e o indicativo é ', this.indicativoAvaliacao)
      },
      recalcula () {
        // let existe = _.has(this.analise, 'ratingRelatorio')
        let rat = {}
        let bc = new BroadcastChannel('test_channel')
        let self = this
        bc.onmessage = function (ev) {
          rat = ev.data
          this.notaRating = rat.classificacao.nota
          self.ratingTemp = rat
          self.analise.ratingRelatorio = self.ratingTemp
        }
        this.ratingTemp = self.ratingTemp
      },
      mostrarRef (ref) {
        return _.filter(this.elementos, item => item.nome === ref).some((item) => { return item.visivel })
      },
      onReturn () {
        this.$router.go(-1)
      },
      carregaArquivos () {
        this.analise.formalizationDocuments = []
        if (this.analise.proposal.documentDraft) {
          this.analise.formalizationDocuments.push(this.analise.proposal.documentDraft)
        }
        if (this.analise.proposal.documentWorkPlan) {
          this.analise.formalizationDocuments.push(this.analise.proposal.documentWorkPlan)
        }
      },
      Aprova () {
        // Valida se os documentos obrigatórios foram enviados
        if (!this.verificaDocumentosCarregados()) {
          this.$snotify.error('Existem documentos pendentes')
          return
        }
        // Verifica se os dados da proposta estão ok
        if (!this.$root.validaProposta(this.analise.proposal)) {
          return
        }
        this.$parent.$validator.validateAll().then(async (validado) => {
          if (!validado) {
            this.$snotify.error('Formulario de proposta possui erros favor verificar')
            return
          }
          // Verifica se algum componente filho tem algum erro
          if (await this.$root.verificaFormulario(this)) {
            this.$snotify.error('Formulario possui erros favor verificar')
            return
          }
          this.$validator.validateAll().then((validado) => {
            if (!validado) {
              this.$snotify.error('Formulario possui erros favor verificar')
            } else {
              // this.enviaBackEnd()
            }
          })
        })
      },
      enviaBackEnd () {
        // anexa a proposta na analise
        this.aguardaEnviar = 1
        this.$snotify.async('Validando proposta. Por favor, aguarde...', {timeout: 0})
        axios.put('proxy/project/approval-analysis/' + this.approval.id + '/approve', this.approval).then((response) => {
          this.$snotify.clear()
          this.$snotify.success('Analise atualizada com sucesso')
          setTimeout(() => { this.$router.go(-1) }, 2000)
        })
          .catch((error) => {
            this.aguardaEnviar = 0
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      getTiposDocumentoSimplificado () {
        console.log('CONSULTA DOCUMENTOS SIMPLIFICADOS OBRIGATORIOS')
        // anexa a proposta na analise
        let obj = {
          lista: this.documentosObrigatoriosSimplificado
        }
        axiosLaravel.post('/simplificado/retornarTipoDocumentoSimplificado/', obj).then((response) => {
          console.log('DOCUMENTOS SIMPLIFICADOS: ', response.data)
          if (response.data) {
            this.dctos = response.data
          }
          this.$snotify.clear()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      validaContaFinanceira () {
        let ITEM = null
        this.analise.proposal.objectives.forEach(objetivo => {
          objetivo.goals.forEach(meta => {
            meta.activities.forEach(atividade => {
              atividade.items.forEach(item => {
                if (!item.financialAccount || item.financialAccount === '') {
                  ITEM = item
                  this.$snotify.warning('Falta conta financeira no item "' + ITEM.itemDescription + '"', {timeout: 10000})
                }
              })
            })
          })
        })
        return ITEM
      },
      validaMunicipalizacao () {
        let CIDADE = null
        this.analise.proposal.municipalizationResume.forEach(cidade => {
          if (!cidade.phase || cidade.phase === '') {
            CIDADE = cidade
            this.$snotify.warning('A Municipalização da cidade ' + cidade.name + ' é de preenchimento obrigatório!')
          }
        })
        return CIDADE
      },
      // Valida se todos os documentos foram adicionados
      verificaDocumentosCarregados () {
        if (!this.analise.formalizationDocuments) {
          return false
        }
        let documentosCarregados = this.analise.formalizationDocuments.map((item) => {
          return item.documentType.type
        })
        return _.isEqual(this.documentosObrigatorios.sort(), documentosCarregados.sort())
      },
      limparInfo () {
        if (this.analise.resultadoAprovacao === 'ENCAMINHAR_DEFERIMENTO' || this.analise.resultadoAprovacao === 'INCLUIR_SAPIENS') {
          this.analise.observacao = ''
        }
      },
      moveDocumentosFormalizacao () {
        // Retira a minuta e o plano de trabalho do objeto para depois preencher novamente se for o caso
        // Isso é feito para não dar problema nas ligações dos objetos java
        delete this.analise.proposal.documentDraft
        delete this.analise.proposal.documentWorkPlan
        // Varre o array para mover os dados conforme o tipo
        this.analise.formalizationDocuments.forEach((documento) => {
          if (documento.documentType.type === 'Minuta') {
            this.analise.proposal.documentDraft = documento
          } else {
            this.analise.proposal.documentWorkPlan = documento
          }
        })
      },
      updateCategAvaliacao (newVal) {
        console.log('UPDATE CATEG', newVal)
        this.indicativoAvaliacao = newVal
      },
      salvarAvaliacao () {
        if (!this.ehSimplificada) {
          return this.$refs.questoesAvaliacao.salvarPontuacao()
        }
      },
      calculaTotaisEFaixaProjeto () {
        console.log('calculaTotaisEFaixaProjeto')
        this.totalFBB = 0
        this.totalContrapartida = 0
        this.totalParceiro = 0
        this.analise.atividades.forEach((atividade) => {
          // se a atividade tem itens_orcamento sem valor ignora!
          if (atividade.itens_orcamentos) {
            atividade.itens_orcamentos.forEach((item) => {
              if (('' + item.origem) === '1') {
                this.totalFBB += (item.valor_unitario * item.quantidade)
              }
              if (('' + item.origem) === '2') {
                this.totalContrapartida += (item.valor_unitario * item.quantidade)
              }
              if (('' + item.origem) === '5') {
                this.totalParceiro += (item.valor_unitario * item.quantidade)
              }
            })
          }
        })
        let totalProjeto = this.totalFBB + this.totalParceiro
        console.log('calculaTotaisEFaixaProjeto-total: ', totalProjeto)
        this.faixaDoProjeto = _.find(this.faixasInvestimento, function (faixa) { return faixa.de <= totalProjeto && totalProjeto <= faixa.para })
        console.log('calculaTotaisEFaixaProjeto-faixa: ', this.faixaDoProjeto.faixa)
        this.ehSimplificada = _.includes([1, 2], this.faixaDoProjeto.faixa)
        if (this.ehSimplificada) {
          this.getTiposDocumentoSimplificado()
          this.$emit('setPropostaSimplificada', 'C')
          // if (this.propsAnalise.fk_edital === 12) {
          //   this.analise.ds_periodicidade_formulario = 'SEMESTRAL'
          // } else {
          this.analise.ds_periodicidade_formulario = 'QUADRIMESTRAL'
          // }
          this.questRiscKey++
        }
      }
    }
  }
</script>

<style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9999;
    overflow-y: scroll;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
  }
  .modal-wrapper {
    display: inherit;
    vertical-align: auto;

  }
  .modal-dialog {
    width: 80%;

  }
  .riscoCalculado {
    font-weight: bold;
    font-size: 16px;
  }
  .mensagem {
    font-weight: bold;
    font-size: 16px;
  }
  .naoPreenchido {
    color: orangered;
  }

</style>
