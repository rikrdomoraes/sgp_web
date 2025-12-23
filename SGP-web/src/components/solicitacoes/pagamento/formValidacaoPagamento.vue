<template>
  <div class="content-wrapper" style="min-height: 793px;">
    <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>{{fase}} &nbsp;&nbsp;
          <span v-show="!loading" v-if="usuarioLogado.userType === 'FUNDACAO'">
              <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(219)" href="javascript:void(0)"
                               :title="'<h5>219 - Adiantamentos (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                <i class="fa fa-print" aria-hidden="true"></i> 219
              </g-button-ujarak>

              <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(222)" href="javascript:void(0)"
                               :title="'<h5>222 - Extrato de Projeto (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                <i class="fa fa-print" aria-hidden="true"></i> 222
              </g-button-ujarak>

              <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(248)" href="javascript:void(0)"
                               :title="'<h5>248 - Monitoramento Administrativo</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                <i class="fa fa-print" aria-hidden="true"></i> 248
              </g-button-ujarak>
          </span>
          <i v-show="loading" class="fa fa-refresh fa-spin" style="font-size: 30px"></i>
        </h1>

        <b-breadcrumb :items="[{
        text: 'Inicial',
        href: '/'
        }, {
        text: 'Validação',
        href: '#'
        }, {
        text: 'Pagamento',
        active: true
        }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">

        <div class="row">
          <div class="col-md-12 form-horizontal">
            <div class="ng-scope ng-isolate-scope">

              <div v-if="(historicoTarefasTela.length > 0 && historicoTarefasTela[1].observacao != null && historicoTarefasTela[1].observacao !== '')" class="alert alert-dismissible alert-info">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                <h4><i class="fa fa fa-info"></i>&nbsp&nbsp Atenção!</h4>
                <h5><span v-html=historicoTarefasTela[1].observacao></span></h5>
              </div>

              <div class="box box-primary">
                <div class="box-header with-border">
                  <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Validação de Pagamento - <i><span style="color: black"> ID: {{validacao.id}} - Projeto: </span><span
                    style="color: black;">{{proposta.ds_codigo_projeto_erp}} - {{proposta.ds_nome}}</span></i></h3>
                </div>
                <div class="box-header with-border">
                  <div class="row" ng-if="$ctrl.approvalState != 'DEFAULT'">
                    <div class="col-sm-12" >
                      <form name="frmSearch" class="form-horizontal" novalidate>
                        <div class="form-group required" >
                          <div class="col-md-12">
                            <dl class="proposal-definition-list">
                              <dt>Objetivo Geral: </dt>
                              <dd>{{proposta.ds_objetivo_geral}}</dd>
                              <dt>Situação:</dt>
                              <dd><span>{{validacao.situacao}}</span></dd>
                            </dl>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="box-body">
                  <div v-show="loadingShow" class="overlay"
                       style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <fieldset :disabled="fase === 'Autorização'">
                    <div v-switch="validacao.nome">
                      <div v-if="'Pagamento'">
                        <cronograma-solicitacao-pagamento ref="tabelaCronograma" :key="componentKey" :propsNota="nota"
                                                          :propsProjeto="projeto" :propsEtapa="etapa"
                                                          :propsValidacao="validacao"></cronograma-solicitacao-pagamento>
                        <documento-fiscal :propsNota="nota" :propsEtapa="etapa"></documento-fiscal>
                        <forma-pagamento :key="force" :propsNota="nota" :propsValidacao="validacao"></forma-pagamento>
                        <fornecedor :propsNota="nota" :propsValidacao="validacao"></fornecedor>
                        <dados-bancarios :propsNota="nota" :propsValidacao="validacao"
                                         v-if="nota.forma_pagamento === 3 || nota.forma_pagamento === '3'"></dados-bancarios>
                      </div>
                    </div>
                    <div>
                    </div>


                    <!--Documentos de solicitação de pagamento-->
                    <div class="col-md-12">
                      <div class="box-header with-border">
                        <h3 class="box-title">Documentos da Solicitação de {{validacao.nome}}</h3>
                      </div>
                      <upload-documentos-php :propDocumentos="nota.documentos" :documentTypes="''" :disable="''"
                                             :local-uso="'TODOS'"></upload-documentos-php>
                    </div>
                    <div class="col-md-12">
                      <div class="box box-widget">
                        <div class="box-header with-border">
                          <h3 class="box-title">Histórico de solicitação</h3>
                        </div>
                        <historico-solicitacao-pagamento v-if="historicoBack && !_.isNull(historicoBack) && !_.isEmpty(historicoBack)" :propsValidacao="validacao" :propsHistorico="historicoBack" :key="historicoBack"></historico-solicitacao-pagamento>
                      </div>
                      <div class="text-left box-header" v-if="dataProcesso < '10/12/2020'">
                        <a href="" v-if="esconderHistorico === false" @click.prevent="esconderHistorico = true"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar histórico antigo</a>
                        <a href="" v-if="esconderHistorico === true" @click.prevent="esconderHistorico = false"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar histórico antigo</a>
                      </div>
                      <div class="col-md-8" v-if="esconderHistorico === true && dataProcesso < '10/12/2020'">
                        <div class="box box-widget">
                          <div class="box-header with-border">
                            <h3 class="box-title">Histórico Antigo</h3>
                          </div>
                          <historico-antigo :propsValidacao="validacao" :propsHistorico="historicoTarefas" :key="historicoTarefas"></historico-antigo>
                        </div>
                      </div>
                    </div>

                    <!--<div class="col-md-12">-->
                      <!--<div class="box box-widget">-->
                        <!--<div class="box-header with-border">-->
                          <!--<h3 class="box-title">Histórico de solicitação</h3>-->
                        <!--</div>-->
                        <!--<historico-solicitacao-pagamento v-if="!_.isUndefined(validacao.tarefas)" :propsValidacao="validacao" :propsHistorico="historicoBack"></historico-solicitacao-pagamento>-->
                      <!--</div>-->
                    <!--</div>-->

                    <div class="col-md-12" v-if="usuarioLogado.userType === 'FUNDACAO'">
                      <!-- requestApprovalResult -->
                      <div class="form-group full" style="margin-right:0;margin-left:0">
                        <label class="control-label">Opções para este documento:</label>
                        <br>
                        <br>
                        <!--                        <div>-->
                        <!--                          <label class=" new-control new-control-checkbox">-->
                        <!--                            <input-->
                        <!--                              type="checkbox"-->
                        <!--                              v-model="nota.zerar"-->
                        <!--                              :false-value="''"-->
                        <!--                              @change="atualizaOpcoes('ZERAR_IMPOSTO')"-->
                        <!--                              class="form-control"-->
                        <!--                              :true-value="'ZERAR_IMPOSTO'"-->
                        <!--                              name="acao"/>Zerar Imposto-->
                        <!--                            <div class="new-control-indicator"></div>-->
                        <!--                          </label>-->
                        <!--                        </div>-->
                        <div>
                          <label class=" new-control new-control-checkbox">
                            <input
                              type="checkbox"
                              v-model="nota.bypass"
                              :false-value="''"
                              @change="atualizaOpcoes('BYPASS')"
                              class="form-control"
                              :true-value="'BYPASS'"
                              name="acao"/>Não integrar com Sapiens
                            <div class="new-control-indicator"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  <div class="col-md-12">
                    <div class="box box-widget">
                      <div class="box-header with-border" v-if="usuarioLogado.userType === 'FUNDACAO'">
                        <h3 class="box-title">Análise deste documento para Pagamento/Ressarcimento</h3>
                      </div>
                      <div class="box-body">
                        <div class="col-md-12">

                          <!-- requestApprovalResult -->
                          <div class="form-group required full"
                               :class="{ 'has-error' : errors.first('resultadoAprovacao')}"
                               style="margin-right:0;margin-left:0" v-if="usuarioLogado.userType === 'FUNDACAO'">
                            <label for="resultadoAprovacao" class="control-label">Decisão:</label>
                            <div>
                              <label class="radio-inline new-control new-control-radio">
                                <input type="radio" name="resultadoAprovacao"
                                       v-model="aprovacao.resultadoAprovacao" value="Aprovado" required> Aprovar
                                documento
                                <div class="new-control-indicator"></div>
                              </label>
                              <label class="radio-inline new-control new-control-radio">
                                <input type="radio" name="resultadoAprovacao"
                                       v-model="aprovacao.resultadoAprovacao" value="Revisão" required> Encaminhar para
                                revisão
                                <div class="new-control-indicator"></div>
                              </label>
                              <label v-if="fase === 'Autorização'" class="radio-inline new-control new-control-radio">
                                <input @click="showJustify = 'Retonar Análise'" type="radio" name="resultadoAprovacao"
                                       v-model="aprovacao.resultadoAprovacao" value="Retornar Análise" required>
                                Retornar para análise
                                <div class="new-control-indicator"></div>
                              </label>
                              <span v-if="errors.first('resultadoAprovacao')" class="label label-danger"> {{ errors.first('resultadoAprovacao') }}</span>
                            </div>
                          </div>

                          <!-- motivo de devolução Suporte 59885 -->
                          <div class="form-group required-field full" v-if="aprovacao.resultadoAprovacao === 'Revisão'"
                               :class="{ 'has-error' : errors.first('justificativa')}" style="margin-right:0;margin-left:0"">
                          <label for="motivo de devolucao" class="control-label">Motivo de devolução:</label>
                          <div>
                            <div>
                              <select v-model="motivoDevolucao" name="motivo de devolucao" class="form-control" v-validate="'required'">
                                <option value="">Limpar dados do motivo de devolução</option>
                                <option disabled>--------------------------------------------------------------------------</option>
                                <option value="Ausência de documento - documento fiscal / holerite / ofício">Ausência de documento - documento fiscal / holerite / ofício</option>
                                <option value="Ausência ou divergência de documentos de obra civil (termo de medição, contrato, ART ou RRT)">Ausência ou divergência de documentos de obra civil (termo de medição, contrato, ART ou RRT)</option>
                                <option value="Ausência ou divergência do número do acordo BNDES ">Ausência ou divergência do número do acordo BNDES</option>
                                <option value="Cadastro desatualizado ">Cadastro desatualizado</option>
                                <option value="Comprovante de pagamento ausente, divergente ou ilegível ">Comprovante de pagamento ausente, divergente ou ilegível</option>
                                <option value="Dados bancários incorretos">Dados bancários incorretos</option>
                                <option value="Dados do fornecedor incorretos">Dados do fornecedor incorretos</option>
                                <option value="Documento fiscal ilegível ou divergente">Documento fiscal ilegível ou divergente</option>
                                <option value="Existência de ocorrência impeditiva">Existência de ocorrência impeditiva</option>
                                <option value="Itens da nota fiscal divergentes do cronograma físico-financeiro">Itens da nota fiscal divergentes do cronograma físico-financeiro</option>
                                <option value="Pendência de prestação de contas">Pendência de prestação de contas</option>
                                <option value="Recolhimento de tributos ausente ou divergente">Recolhimento de tributos ausente ou divergente</option>
                                <option value="Outros">Outros</option>
                              </select>
                            </div>
                            <span v-if="errors.first('motivo de devolucao')" class="label label-danger"> {{ errors.first('motivo de devolucao') }}</span>
                          </div>
                        </div>

                          <!-- gloss -->
                          <div
                            v-if="aprovacao.resultadoAprovacao === 'Aprovado' && usuarioLogado.userType === 'FUNDACAO'"
                            class="form-group full" style="margin-right:0;margin-left:0">
                            <label for="observação" class="control-label">Observação:</label>
                            <textarea name="observação" id="obs" v-model="validacao.glosa" rows="3"
                                      class="form-control"></textarea>
                          </div>

                          <!-- justify -->
                          <div
                            v-if="aprovacao.resultadoAprovacao === 'Revisão' || aprovacao.resultadoAprovacao === 'Retornar Análise' && usuarioLogado.userType === 'FUNDACAO'"
                            class="form-group required-field full"
                            :class="{ 'has-error' : errors.first('justificativa')}"
                            style="margin-right:0;margin-left:0">
                            <!--<label for="textomotivo" class="">Selecione o motivo:</label>-->
                            <!--<select v-model="textoMotivo" @change="preeencheMotivo(textoMotivo)" class="form-control" name="textomotivo">-->
                            <!--<option value="1 - Texto motivo 1">1 - Texto motivo 1</option>-->
                            <!--<option value="2 - Texto motivo 2">2 - Texto motivo 2</option>-->
                            <!--</select>-->
                            <label for="justificativa" class="control-label">Motivo para revisão:</label>
                            <textarea name="justificativa" v-model="validacao.glosa" rows="3"
                                      class="form-control"
                                      v-validate="'required'"></textarea>
                            <span v-if="errors.first('justificativa')"
                                  class="label label-danger"> {{ errors.first('justificativa') }}</span>
                          </div>
                          <div class="box-footer">
                            <g-button-moema v-if="aprovacao.resultadoAprovacao || usuarioLogado.userType === 'ENTIDADE'"
                                            color="success" size="button--size-ss" @click.native="onSave"><i
                              class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir
                            </g-button-moema>
                            <g-button-moema color="warning" size="button--size-ss" @click.native="voltaPraSolicitacao">
                              <i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista
                            </g-button-moema>
                          </div>
                        </div>
                      </div> <!-- ./box-body -->
                    </div>
                  </div>

                </div>
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
  import moment from 'moment'
  import CronogramaSolicitacaoPagamento from '../modulos/cronograma-solicitacao-pagamento'
  import CronogramaSolicitacaoContrapartida from '../modulos/cronograma-solicitacao-contrapartida'
  import CronogramaSolicitacaoPrestacaocontas from '../modulos/cronograma-solicitacao-prestacaocontas'
  import DocumentoFiscal from '../modulos/documentoFiscal'
  import FormaPagamento from '../modulos/formaPagamento'
  import Fornecedor from '../modulos/fornecedor'
  import UploadDocumentosPhp from '../../modules/uploadDocumentosPhp'
  import DadosBancarios from '../modulos/dadosBancarios'
  import HistoricoSolicitacaoPagamento from '../../solicitacoes/modulos/historicoSolicitacaoPagamento'
  import HistoricoAntigo from '../../solicitacoes/modulos/historicoAntigo'

  export default {
    components: {
      DadosBancarios,
      UploadDocumentosPhp,
      Fornecedor,
      FormaPagamento,
      DocumentoFiscal,
      CronogramaSolicitacaoPrestacaocontas,
      CronogramaSolicitacaoContrapartida,
      CronogramaSolicitacaoPagamento,
      HistoricoSolicitacaoPagamento,
      HistoricoAntigo
    },
    name: 'form-validacao-pagamento',
    data () {
      return {
        // Array que guarda as fases de analise e Autorização de pagamentos
        loading: false,
        analiseAutorizacao: ['ANALYSIS', 'MONITORING'],
        checkedNames: [],
        validacao: {
          documentos_liberacao: {
            parametros_documento: {
              valor: ''
            }
          },
          nome: ''
        },
        esconderHistorico: false,
        data_edicao: '',
        historicoTarefas: [],
        historicoTarefasTela: [],
        historicoBack: [],
        relatorioForm: [],
        nota: {
          zerar: '',
          bypass: ''
        },
        item: {},
        textoMotivo: [],
        relatorios: [],
        rel: [],
        relat: {
          id: 13,
          createdAt: null,
          code: 'FJCF248.GER',
          codeNames: 'ENumPrj;ECodFor',
          fieldNames: 'Projeto;Beneficiário/Fornecedor',
          title: '248 - Monitoramento Administrativo'
        },
        etapa: 'Análise',
        force: 0,
        proposta: {},
        projeto: {},
        motivoDevolucao: '',
        aprovacao: {}
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      mostraParaValidacaoPagamento () {
        return _.includes(this.analiseAutorizacao, this.validacao)
      }
    },
    watch: {},
    created: function () {
      this.data_edicao = moment().format('YYYY-MM-DD HH:mm:ss')
      this.buscaDados()
    },
    methods: {
      atualizaOpcoes ($opcao) {
        if (_.isUndefined(this.nota.parametros_documento)) {
          this.nota.parametros_documento = []
        }
        let existe = this.nota.parametros_documento.some((item) => {
          return item.valor === $opcao
        })
        if (existe) {
          _.remove(this.nota.parametros_documento, (item) => {
            return item.valor === $opcao
          })
        } else {
          this.nota.parametros_documento.push({
            'parametro': 'OPCOES',
            'valor': $opcao
          })
        }
      },
      onLoad () {
        this.$snotify.clear()
        this.$snotify.async('Gerando relatório. Por favor, aguarde...', {timeout: 0})
        axios.put('proxy/utility/erp-report/emit-report', {erpReport: this.relat, params: this.temp}).then((response) => {
          this.onDownload(response)
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      preeencheMotivo (parm) {
        this.validacao.glosa = this.textoMotivo + '\n'
      },
      onSave () {
        this.incluiMotivo()
        this.$validator.validateAll().then(result => {
          if (result) {
            this.aprovacao.nota = this.nota
            this.nota.resultadoAprovacao = this.aprovacao.resultadoAprovacao
            if (this.validacao.tarefas[0].nome === 'Solicitação') {
              this.validacao.proximaEtapa = 'Análise'
            }
            if (this.validacao.tarefas[0].nome === 'Revisão') {
              this.validacao.proximaEtapa = 'Análise'
            }
            if (this.validacao.tarefas[0].nome === 'Análise') {
              if (this.nota.resultadoAprovacao === 'Revisão') {
                this.validacao.proximaEtapa = 'Revisão'
              }
              if (this.nota.resultadoAprovacao === 'Aprovado') {
                this.validacao.proximaEtapa = 'Autorização'
              }
            }
            if (this.validacao.tarefas[0].nome === 'Autorização') {
              if (this.nota.resultadoAprovacao === 'Aprovado') {
                this.validacao.proximaEtapa = 'Conclusão'
              }
              if (this.nota.resultadoAprovacao === 'Revisão') {
                this.validacao.proximaEtapa = 'Revisão'
              }
              if (this.nota.resultadoAprovacao === 'Retornar Análise') {
                this.validacao.proximaEtapa = 'Análise'
              }
            }
            // Se a nota já foi validada e só esta sendo feito a edição então remove do array e coloca novamente
            _.remove(this.validacao.receiptApprovals, item => {
              return item.receipt.id === this.nota.id
            })
            // Adiciona a nota no array de notas para aprovação
            if (this.aprovacao.nota.receiptItems) {
              var x = 0
              var j = 0
              for (x = 0; x < this.aprovacao.nota.itens_liberados.length; x++) {
                for (j = 0; j < this.aprovacao.nota.receiptItems.length; j++) {
                  if (this.aprovacao.nota.itens_liberados[x].itens_orcamentos[0].fk_itens === this.aprovacao.nota.receiptItems[j].Item) {
                    this.aprovacao.nota.itens_liberados[x].quantidade = this.aprovacao.nota.receiptItems[j].quantityRequest
                    this.aprovacao.nota.itens_liberados[x].valor = this.aprovacao.nota.receiptItems[j].valueRequest
                  }
                }
              }
            }
            this.validacao.documentos_liberacao = this.nota
            //
            this.validacao.proxima_etapa = this.validacao.proximaEtapa
            this.validacao.tarefas[0].data_edicao = this.data_edicao
            //
            this.enviaBackEnd()
          } else {
            this.$snotify.error('existem campos com erro favor verificar')
          }
        })
      },
      enviaBackEnd () {
        this.validacao.processo.nome = 'PAGAMENTO'
        this.validacao.aglutinado = 'Não'
        console.log('this.validacao RLMB', this.validacao)
        this.$snotify.async('Enviando Validação de Pagamento. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.put('processos/tarefas/atualiza/', this.validacao).then((response) => {
          this.$snotify.clear()
          if (_.hasIn(response, 'error')) {
            this.$snotify.clear()
            this.$snotify.error(response.data.value.error[0], '', 10000)
          } else {
            this.gravaHistorico(response.data)
            this.$snotify.clear()
            this.$snotify.success('Solicitação gravada com sucesso!')
            setTimeout(() => {
              this.$router.go(-1)
            }, 2000)
          }
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      gravaHistorico (parm) {
        axiosLaravel.post('historico-tarefas/', parm).then((response) => {
          console.log(response.data)
        })
      },
      voltaPraSolicitacao () {
        this.$router.go(-1)
      },
      buscaDados () {
        this.buscaHistorico(this.$route.params.id)
        this.force = 0
        // this.valorTotal = 0
        this.loadingShow = true
        axiosLaravel.get('processos/' + this.$route.params.id).then((response) => {
          this.validacao = response.data
          this.dataProcesso = moment(this.validacao.inicio).format('DD/MM/YYYY')
          this.validacao.processo = _.omit(response.data, ['documentos_liberacao', 'tarefas'])
          this.historicoTarefas = _.cloneDeep(response.data.tarefas)
          this.historicoTarefasTela = _.cloneDeep(response.data.tarefas)
          let array = this.historicoTarefas.filter((item) => {
            return item.tipo === 'Usuário' && !_.isNull(item.termino)
          })
          this.historicoTarefas = _.cloneDeep(array)
          for (let i = 0; i < this.historicoTarefas.length; i++) {
            if (this.historicoTarefas.usuario !== null) {
              this.usuario = this.historicoTarefas.usuario
            }
          }
          this.nota = _.cloneDeep(this.validacao.documentos_liberacao[0])
          this.nomeProjeto = this.validacao.documentos_liberacao[0].itens_liberados[0].itens_orcamentos[0].proposta.ds_codigo_projeto_erp + '-' + this.validacao.documentos_liberacao[0].itens_liberados[0].itens_orcamentos[0].proposta.ds_nome
          this.numeroProjeto = this.validacao.documentos_liberacao[0].itens_liberados[0].itens_orcamentos[0].proposta.ds_codigo_projeto_erp
          this.objetivoProjeto = this.validacao.documentos_liberacao[0].itens_liberados[0].itens_orcamentos[0].proposta.ds_objetivo_geral
          if (this.nota.parametros_documento.some((item) => {
            return item.valor === 'ZERAR_IMPOSTO'
          })) {
            this.nota.zerar = 'ZERAR_IMPOSTO'
          }
          if (this.nota.parametros_documento.some((item) => {
            return item.valor === 'BYPASS'
          })) {
            // Verifica se a opção de BYPASS foi preenchida
            this.nota.bypass = 'BYPASS'
          }
          //
          this.proposta = this.nota.itens_liberados[0].itens_orcamentos[0].proposta
          this.projeto = this.proposta.projeto
          this.validacao.nome = 'PAGAMENTO'
          this.fase = this.validacao.tarefas[0].nome
          if (this.validacao.documentos_liberacao[0].length === 0) {
            this.etapa = 'Solicitação'
          }
          if (this.validacao.tarefas[0].nome === 'Autorização') {
            this.etapa = 'Autorização'
          }
          this.$root.$on('historico', (dados) => {
            this.historicoTarefas = dados
          })
          this.historicoTarefas = this.historicoTarefas.map((item) => {
            if (_.isNull(item.usuario)) {
              item.nomeUsu = '-'
            } else {
              item.nomeUsu = item.usuario.ds_nome_usuario
            }
            return item
          })
          // for (var i = 0; i < this.historicoTarefas.length; i++) {
          //   if (this.historicoTarefas[i].usuario.ds_nome_usuario) {
          //     this.historicoTarefas[i].nomeUsu = this.historicoTarefas[i].usuario.ds_nome_usuario
          //   } else {
          //     this.historicoTarefas[i].nomeUsu = '-'
          //   }
          // }
          this.force = 1
          this.$forceUpdate()
          this.loadingShow = false
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      emitir (relatorio) {
        this.loading = true
        let parametros = '<ECodEmp=1><ENumPrj=' + this.proposta.ds_codigo_projeto_erp + '>'
        if (relatorio === 222 || relatorio === 219) {
          parametros += ',<ESitPrj=ULT>'
        } else if (relatorio === 248) {
          parametros += ',<ECodFor=>'
        }
        if (relatorio === 222) {
          parametros += ',<EMosDes=S>'
        }
        this.$snotify.clear()
        console.log('parametros', parametros)
        this.$snotify.async('Gerando relatório ' + relatorio + '. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': 'FJCF' + relatorio + '.GER'}, params: parametros}).then((response) => {
          this.onDownload(response, relatorio, this)
        })
          .catch((error) => {
            this.$snotify.clear()
            this.loading = false
            this.$root.trataErro(error)
          })
      },
      onDownload (response, relatorio, vm) {
        let item = response.data.arquivo
        const contentType = 'application/pdf'
        const b64Data = response.data.arquivo
        let file = this.b64toBlob(b64Data, contentType)
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        if (!ie) {
          let blob = file
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'Relatório ' + relatorio + ' » ' + vm.proposta.ds_codigo_projeto_erp + ' - ' + vm.proposta.ds_nome
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          let blob = file
          let link = document.createElement('blob')
          link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
          link.download = 'Relatório ' + relatorio + ' » ' + vm.proposta.ds_codigo_projeto_erp + ' - ' + vm.proposta.ds_nome
          link.click()
        }
        this.$snotify.clear()
        this.$snotify.success('Relatório gerado com sucesso!')
        this.loading = false
      },
      b64toBlob (b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data)
        const byteArrays = []
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize)
          const byteNumbers = new Array(slice.length)
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          byteArrays.push(byteArray)
        }
        const blob = new Blob(byteArrays, {type: contentType})
        return blob
      },
      buscaHistorico (request) {
        console.log('caiu aqui historicoBack', request)
        axiosLaravel.post('historico-tarefas/lista', {'parametro': request}).then((response) => {
          this.historicoBack = response.data
          console.log('response historicoBack', response.data)
        })
      },
      incluiMotivo () {
        if (this.aprovacao.resultadoAprovacao === 'Revisão') {
          this.validacao.glosa = '#' + this.motivoDevolucao + '# ' + this.validacao.glosa
        }
      }
    }
  }
</script>

<style scoped>

</style>
