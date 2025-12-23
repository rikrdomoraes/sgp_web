<!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
<template>
    <div class="content-wrapper" style="min-height: 870px;">
      <section class="content-header ng-scope">
        <vue-headful :title="'SGP - Solicitações'"/>
        <h1>{{ etapa }} de Prestação de Contas (Modelo Simplificado)</h1>

        <div class="row-flex all-start prest-button-container" v-if="Object.keys(projeto).length > 0">
          <span v-if="!loading.show">
          <g-button-moema color="warning" @click.native="$router.go(-1)" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>
          </span>

          <div class="espacamento_botoes"></div>

          <span v-show="!loading.show" v-if="(!_.isEmpty(projeto) || !_.isNull(id))">
            <!-- Chamado 64.954: relatório 611 -->
            <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(611)" href="javascript:void(0)" v-if="(processo === 'PAGAMENTO') && _.includes(['Autorização', 'Liquidação'], ultimaTarefaFeita.nome)"
                            :title="'<h5>611 - Comprovante de Pagamento (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
              <i class="fa fa-print" aria-hidden="true"></i> 611
            </g-button-ujarak>
          </span>

          <span v-show="!loading.show" v-if="usuarioLogado.userType === 'FUNDACAO' && (!_.isEmpty(projeto) || !_.isNull(id))">
            <!--Fabio desistiu após ter sido criado o botão para o relatório 200, logo ele fica sempre oculto-->
            <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(200)" href="javascript:void(0)"
                            :title="'<h5>200 - Comunicado Interno (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
              <i class="fa fa-print" aria-hidden="true"></i> 200
            </g-button-ujarak>

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
            <g-button-ujarak color="primary" size="button--size-ss" @click.native="onDownloadZIP()"
                            :title="'<h5>Faz o download de todos os arquivos da solicitação (zip)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}"
                            v-if="usuarioLogado.userType !== 'ENTIDADE' && etapa !== 'Solicitação'">
                              <i class="fa fa-download" aria-hidden="true">&nbsp;Baixar arquivos</i>
            </g-button-ujarak>
          </span>

          <div class="espacamento_botoes"></div>
          <span v-show="!loading.show">
            <g-button-moema color="success" @click.native.stop="validarConclusao('Concluir')" type="button"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>
          </span>
          <span v-show="!loading.show">
            <g-button-moema color="primary" @click.native="validarConclusao('Salvar')" type="button"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-moema>
          </span>

          <div class="espacamento_botoes"></div>

          <span
                      :title="'<h5> Abrir Chamado referente a solicitação atual</h5>'"
                      v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}" v-show="!loading.show">
            <g-button-moema color="error" @click.native.stop="abrirChamado" type="button"><i class="fa  fa-comment-o" aria-hidden="true"></i> Abrir Chamado</g-button-moema>
          </span>
        </div>

        <b-breadcrumb :items="breadcrumb"/>
      </section>
      <section class="content ng-scope" v-if="novaSolicitacao && Object.keys(projeto).length === 0">
        <!-- SELECIONAR PROJETO AQUI CASO NAO EXISTA ID NA ROTA, É UMA NOVA SOLICITACAO -->
        <div class="column all-start prest-main-container">
              <div v-if="loading.show" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i></div>
              <div class="box-header with-border">
                <h3 class="prest-box-title row-flex centered-start"><i :class="ehVisualizacao ? 'fa fa-caret-right' : 'fa fa-pencil'" aria-hidden="true"></i> Selecione o projeto</h3>
              </div>
              <select name="projeto"
                              v-model="projeto"
                              class="form-control"
                              aria-hidden="true"
                              @change="selecionaProjeto()">
                      <option v-for="projetoDisponivel in listaProjetos" :value="projetoDisponivel">{{projetoDisponivel.Projeto}}</option>
              </select>
            </div>
        </section>
        <section class="content ng-scope">
          <div class="column all-start prest-main-container" v-if="Object.keys(projeto).length > 0 || !novaSolicitacao">
            
            <div v-if="loading.show" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i></div>

            <div class="box-header">
              <h3 class="prest-box-title row-flex centered-start">
                <i class="fa fa-pencil" aria-hidden="true"></i>
                {{projeto.Projeto}}
                <span v-if="usuarioLogado.userType === 'FUNDACAO' && !loading.tela">
                  (<strong>{{projeto.Status_ERP}}</strong>)
                  <router-link :title="'<h5>Ir para a página do Projeto</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'small', arrow : true }" :to="{name: 'projeto', params: { numero: projeto.Numero_projeto }}" target="_blank">&nbsp<i class="fa fa-external-link"></i></router-link>
                </span> 
              </h3>
            </div>

            <div class="column start-centered prest-entidade-info-container">
              <router-link :title="'<h5>Ir para o Cadastro dessa Entidade</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" :to="{name: 'cadastro-entidade-visualiza', params: { id: projeto.fk_entidade }}" target="_blank"> {{entidade.ds_nome}} &nbsp<i class="fa fa-external-link"></i></router-link>
              <div class="row-flex centered-start prest-label-info">
                  <b>Período de execução:</b>
                  <div>{{ projeto.data_inicial_formatada }} a {{ projeto.data_final_formatada }}</div>
              </div>
              <div class="row-flex centered-start prest-label-info">
                <b>CNPJ:</b>
                <div>{{entidade.ds_cnpj | cnpj}}</div>
              </div>
              <div class="row-flex centered-start prest-label-info">
                <b>Projeto Superior:</b>
                <div>{{projeto.projeto_superior}}</div>
              </div>
            </div>

            <adiantamentosPrestacaoSimplificada
              :adiantamentosConcedidos="adiantamentosConcedidos"
              :loading="loading"
              :totais="totais" 
            >
            </adiantamentosPrestacaoSimplificada>
            <cronogramaPrestacaoSimplificada 
              :cronograma="cronograma" 
              :totais="totais" 
              :loading="loading"
              :calcularTotaisExtato="calcularTotaisExtato"
              :verificaCorrigeDados="verificaCorrigeDados"
              :extratoFiltrosSelecionados="extratoFiltrosSelecionados"
              :projeto="projeto"
              :adicionaRestricao="adicionaRestricao"
              :entidade="entidade"
              :setArrayNotas="setArrayNotas"
              :notasCadastradas="table.items"
            ></cronogramaPrestacaoSimplificada>


            <div class="box-body prest-notas-cadastradas-container">
              <h4 class="prest-box-title row-flex centered-start">Notas Cadastradas <i class="fa fa-sticky-note" aria-hidden="true" ></i></h4>
              <b-container fluid>
                <b-table show-empty
                          stacked="md"
                          striped
                          :bordered="table.bordered"
                          :items="table.items"
                          :fields="table.fields"
                          :current-page="table.currentPage"
                          :per-page="table.perPage"
                          :filter="table.filter"
                          empty-text="Nenhum registro encontrado"
                          :sort-by.sync="table.sortBy"
                          :sort-desc.sync="table.sortDesc">
                          <template slot="dataInclusao" scope="row">{{row.value | moment("L")}}</template>
                          <template slot="valor" scope="row">{{row.value | real}}</template>
                          <template slot="serieNota" scope="row">{{row.value.replace('_', ' ')}}</template>
                          <template slot="item" scope="row">{{row.value + ' - ' + row.item.itemOrcamento.Item_Descricao}}</template>
                          <template slot="cpfCnpj" scope="row">
                            <span v-if="row.item.hasOwnProperty('cpfFornecedor')">{{row.item.cpfFornecedor | cpf}}</span>
                            <span v-else>{{row.item.cnpjFornecedor | cnpj}}</span>
                          </template>
                          <template slot="actions" scope="row">
                            <g-button-ujarak color="primary" size="button--size-ss"  @click.native="editarNota(row.value)"><i class="fa fa-pencil-square-o" aria-hidden="true" ></i> Editar</g-button-ujarak>
                            <g-button-ujarak color="error" size="button--size-ss" @click.native="excluirNota(row.value)"><i class="fa fa-trash-o" aria-hidden="true"></i> Excluir</g-button-ujarak>
                          </template>
                          <template slot="status" scope="row">
                            <span :class="getClassStatus(row.value)"><b>{{ row.value }}</b></span>
                          </template>
                </b-table>
              </b-container>
            </div>

            <!-- Anexos ------------------------------------------------------------------------------------------------------------------------------>
            <div class="box-body prest-upload-container">
              <h4 class="prest-box-title row-flex centered-start">Demais Documentos Anexos <i class="fa fa-paperclip" aria-hidden="true" ></i></h4>
              <uploadDocumentosPhpPrestacao :propDocumentos="anexos" :documentTypes="''" :local-uso="'SOLICITACAO_PAGAMENTO'"></uploadDocumentosPhpPrestacao>
            </div>

            <!-- Marcação de ciente em declarações para liberação de recursos ----------------------------------------------------------------------------------------------------------->
            <div class="box-body ciente_declaracoes">

              <div v-if="_.includes(['Solicitação', 'Revisão'], etapa) && !ehVisualizacao">
                <div :class="'alert alert-dismissible alert-' + (_.find(cienteDeclaracoes, ['codigo', declaracao.codigo]) ? 'success' : 'warning')" v-for="declaracao in declaracoes">
                  <h4><i class="fa fa-warning"></i> Atenção!</h4>
                  <p>
                    <i @click="ciente(declaracao.codigo)" :class="_.find(cienteDeclaracoes, ['codigo', declaracao.codigo]) ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o'" aria-hidden="true"></i>
                    {{ textoDeclaracao(declaracao.texto) }}
                  </p>
                </div>
              </div>

              <div v-else class="column all-centered prest-declaracoes">
                <div v-for="declaracao in cienteDeclaracoes" class="row-flex all-start prest-declaracoes-container">
                  <div class="column all-centered prest-declaracoes-icon">
                    <i class="fa fa-exclamation-circle" aria-hidden="true" ></i>
                  </div>
                  <div class="col-md-9">{{ textoDeclaracao(declaracao.texto) }}</div>
                  <div class="col-md-3 text-right">
                    {{ declaracao.usuario.nome }}<br/>
                    {{ declaracao.data | moment('DD/MM/YYYY HH:mm') }}
                  </div>
                </div>
              </div>

            </div>
            <!-- Histórico do processo ----------------------------------------------------------------------------------------------------------->
            <div class="box-body prest-upload-container">
              <h4 class="prest-box-title row-flex centered-start">Histórico da Solicitação <i class="fa fa-clock-o" aria-hidden="true" ></i></h4>
              <HistoricoSolicitacaoPagamento :propsValidacao="validacao" :propsHistorico="historico" :key="666"></HistoricoSolicitacaoPagamento>
            </div>

            <!-- Decisões ----------------------------------------------------------------------------->
            <div class="column all-start prest-upload-container" id="decisoes_aprovação" v-if="_.includes(['Autorização'], etapa) && usuarioLogado.userType === 'FUNDACAO' && !ehVisualizacao">
                    <h4 class="prest-box-title-warning row-flex centered-start">Decisão <i class="fa fa-balance-scale" aria-hidden="true" ></i></h4>

                          <div class="form-group required col-md-12">

                            <div class="col-md-12">
                              <!-- Aprovação -------------------------------------------------->
                              <label class="new-control new-control-radio" style="padding-top: 8px;">
                                <input type="radio" name="decisão" :value="etapa === 'Análise' ? (processo === 'CONTRAPARTIDA' ? 'Conclusão' : 'Análise Tributária') : (etapa === 'Análise Tributária' ? 'Autorização' : (etapa === 'Autorização' ? (processo === 'PRESTACAO_DE_CONTAS' ? 'Conclusão' : (ativaGeracaoRemessa ? 'Liquidação' : 'Conclusão')) : (etapa === 'Liquidação' ? 'Conclusão' : '')))" :disabled="ehVisualizacao"
                                      v-model="aprovacao.resultadoAprovacao" v-validate="'required'"/> {{ etapa === 'Liquidação' ? 'Concluir processo manualmente' : 'Aprovar solicitação' }}
                                <div class="new-control-indicator"></div>
                              </label>

                              <!-- Observação opcional da aprovação -->
                              <div class="col-md-12">
                                <div v-if="(etapa === 'Análise' && aprovacao.resultadoAprovacao === 'Análise Tributária') || (etapa === 'Análise Tributária' && aprovacao.resultadoAprovacao === 'Autorização') || (etapa === 'Autorização' && aprovacao.resultadoAprovacao === 'Conclusão') || (etapa === 'Autorização' && aprovacao.resultadoAprovacao === 'Liquidação') || (etapa === 'Análise' && aprovacao.resultadoAprovacao === 'Conclusão')" class="col-md-12">
                                  <label for="observacao_decisao" class="control-label">Observação:</label>
                                  <textarea name="observacao_decisao" id="observacao_decisao" v-model="nota.observacao" rows="3" class="form-control" :disabled="ehVisualizacao"></textarea>
                                </div>
                              </div>
                            </div>
                            <!-- Revisão da entidade -------------------------------------------------->
                            <div class="col-md-12" v-if="etapa === 'Autorização'">
                              <label class="new-control new-control-radio" style="padding-top: 8px;">
                                <input type="radio" name="decisão" value="Revisão" :disabled="ehVisualizacao || (_.includes(['PAGAMENTO', 'RESSARCIMENTO', 'PRESTACAO_DE_CONTAS'], this.processo) && ((projeto.Status_ERP !== 'APR' && possuiNotaSapiens) || tituloMovimentado))"
                                      v-model="aprovacao.resultadoAprovacao" v-validate="'required'"/> Encaminhar para revisão da entidade
                                <div class="new-control-indicator"></div>
                              </label>

                              <div>
                                <p v-if="projeto.Status_ERP !== 'APR' && possuiNotaSapiens" class="col-md-12 text-danger"><strong> Atenção:</strong> Não é possível devolver para a entidade pois o projeto está com status diferente de APR e com nota no Sapiens.</p>
                                <p v-if="tituloMovimentado" class="col-md-12 text-danger"><strong> Atenção:</strong> Não é possível devolver para a entidade pois a nota possui movimento contábil.</p>
                              </div>

                              <!-- Justificativa de devolução para entidade -->
                              <div class="col-md-12">
                                <div v-if="aprovacao.resultadoAprovacao === 'Revisão' && usuarioLogado.userType === 'FUNDACAO'"
                                    class="required-field col-md-12" :class="{ 'has-error' : errors.first('justificativa')}">
                                  <label for="justificativa_revisão" class="control-label">Motivo para revisão:</label>
                                  <textarea name="motivo para revisão" v-model="solicitacao.observacao" rows="3" id="justificativa_revisão" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"></textarea>
                                  <span v-if="errors.first('motivo para revisão')" class="label label-danger"> {{ errors.first('motivo para revisão') }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                    </div>
              </div>
        </section>
    </div>
  </template>
  
  <script>
    import { mapGetters } from 'vuex'
    import moment from 'moment'
    import cronogramaPrestacaoSimplificada from './cronogramaPrestacaoSimplificada.vue'
    import adiantamentosPrestacaoSimplificada from './adiantamentosPrestacaoSimplificada.vue'
    import uploadDocumentosPhpPrestacao from './uploadDocumentosPhpPrestacao.vue'
    import HistoricoSolicitacaoPagamento from './historicoSolicitacaoPagamento.vue'

    export default {
      components: {
        cronogramaPrestacaoSimplificada,
        adiantamentosPrestacaoSimplificada,
        uploadDocumentosPhpPrestacao,
        HistoricoSolicitacaoPagamento
      },
      name: 'SolicitacaoPrestacaoContasSimplificado',
      data () {
        return {
          loading: {
            show: false,
            cronograma: false,
            adiantamentos: false,
            tela: false
          },
          ehVisualizacao: false,
          etapa: 'Solicitação',
          id: null,
          listaProjetos: [],
          projeto: {},
          entidade: {},
          validacao: {},
          cronograma: {},
          aprovacao: {},
          temOcorrencia: false,
          novaSolicitacao: true,
          extratoFiltrosSelecionados: ['saldos', 'fundacao'],
          restricaoParaConcluir: [],
          adiantamentosConcedidos: [],
          cienteDeclaracoes: [],
          anexos: [],
          historico: [],
          declaracoes: [
            {
              'codigo': 'fornecedoresNaoLigadosDirigentes',
              'texto': 'Declaro que esta liberação de recurso não será destinada ao pagamento de fornecedores de bens e serviços dos quais seu(s) proprietário(s), sócio(s) ou dirigente(s) seja(m) componentes da diretoria e conselhos da {{entidade.ds_nome}}'
            },
            {
              'codigo': 'recursosNaoDestinadosDirigentesParentes',
              'texto': 'Declaro ainda que o recurso não será destinado a fornecedores de bens e serviços dos quais seu(s) proprietário(s), sócio(s) ou dirigente(s) seja(m) parente(s) consanguíneo(s) ou afins, em linha reta ou colateral, até o terceiro grau com dirigente(s) ou conselheiro(s) da {{entidade.ds_nome}}'
            },
            {
              'codigo': 'cienciaDaVeracidade',
              'texto': 'Em nome de {{entidade.ds_nome}}, declaro estar ciente da veracidade das informações fornecidas e da obrigatoriedade de guarda documental por um período de 10 anos após o encerramento do projeto.'
            }
          ],
          nota: {
            numeroNota: null,
            serieNota: null,
            dataInclusao: null,
            dataValidade: null,
            observacao: null,
            dados_bancarios: {
              banco: null,
              agencia: null,
              conta: null,
              tipo: 1
            },
            tipoFornecedor: null,
            codigoFornecedor: '',
            cpfFornecedor: '',
            cnpjFornecedor: '',
            nomeFornecedor: '',
            enderecoFornecedor: '',
            cepFornecedor: '',
            // cidadeFornecedor: '',
            // estadoFornecedor: '',
            anexos: [],
            forma_pagamento: null,
            pagamentoPrioritario: 0,
            bypass: '',
            dadosComplementares: [],
            suporteFbb: [],
            tributacao: '',
            valorTributado: '',
            parametros_documento: [],
            boleto: {
              sucesso: false,
              mensagem: null,
              tipoCodigoInput: null,
              tipoBoleto: null,
              codigoBarras: null,
              linhaDigitavel: null,
              numeroInformadoTela: null,
              vencimento: null,
              valor: null
            },
            favorecido: {
              CodBan: '',
              CodAge: '',
              CcbFav: '',
              contas: [],
              incluidos: [],
              excluidos: [],
              resultado: [],
              dadosBancariosSelecionados: null
            }
          },
          notas: [],
          solicitacao: {},
          descricaoProcesso: 'Prestação de Contas',
          table: {
            items: [],
            currentPage: 0,
            perPage: 10,
            totalRows: 0,
            sortBy: 'id',
            sortDesc: true,
            filter: null,
            emptyText: 'Não tem nenhum registro para mostrar',
            fields: [
                { key: 'numeroNota', label: 'Número Nota', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'serieNota', label: 'Tipo Documento', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'itemNome', label: 'Nome Item', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'dataInclusao', label: 'Data Emissão', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'cpfCnpj', label: 'CPF/CNPJ', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'nomeFornecedor', label: 'Nome Emitente', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'valor', label: 'Valor', thStyle: 'text-align: center', class: 'text-center' },
                { key: 'item', label: 'Item', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'status', label: 'Status', thStyle: 'text-align: center', class: 'text-center', sortable: true },
                { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
            ]
          },
          totais: {
            projeto: {
              fbb: {
                orcado: 0,
                solicitado: 0,
                saldo: 0
              },
              parceiros: {
                orcado: 0,
                solicitado: 0,
                saldo: 0
              },
              contrapartida: {
                orcado: 0,
                solicitado: 0,
                saldo: 0
              },
              total: {
                orcado: 0,
                solicitado: 0,
                saldo: 0
              }
            },
            adiantamento: {
              fbb: {
                orcado: 0,
                solicitado: 0,
                saldo: 0
              },
              parceiros: {
                orcado: 0,
                solicitado: 0,
                saldo: 0
              },
              total: {
                orcado: 0,
                solicitado: 0,
                saldo: 0
              }
            }
          },
          notaOk: false,
          aprovacaoOk: false,
          baixaOk: false,
          store: this.$store,
          breadcrumb: [{
            text: 'Inicial',
            href: '/'
          }, {
            text: 'Solcitações Prestação de Contas Simplificada',
            active: true
          }]
        }
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ]),
        chiefActive () {
          return this.usuarioLogado.entity.chiefs.some(chefe => {
            return chefe.active === true && moment(new Date()).isSameOrAfter(moment(chefe.initialMandateDate)) && moment(new Date()).isSameOrBefore(moment(chefe.endMandateDate))
          })
        }
      },
      created: function () {
      },
      mounted: function () {
        if (this.$route.params.id) {
          console.log(`ID encontrado: ${this.$route.params.id}`)
          this.id = this.$route.params.id
          this.novaSolicitacao = false
          this.buscaDados()
        } else {
          console.log('Nenhum ID encontrado na rota. Nova Solicitação')
          this.carregarListaProjetos()
          this.novaSolicitacao = true
        }
      },
      methods: {
        // Funçoes migradas do Edita Pagamento
        async buscaDados () {
          console.log('buscaDados')
          this.loading.show = true
          // Carregando dados da ultima tarefa necessários aos carregamento do Cronograma
          await axiosLaravel.get('pagamento/ultima/tarefa/' + this.id).then((response) => {
            console.log('Pega ultima tarefa', response.data)
            this.id_entidade = response.data[0]['id_entidade']
            // this.razaoSocial = response.data[0]['ds_razao_social']
            this.projeto.Id_proposta = response.data[0]['id_projeto']
            this.projeto.Projeto = response.data[0]['projeto']
            this.projeto.Objetivo = response.data[0]['objetivo_geral']
            this.projeto.Status_ERP = response.data[0]['situacao_projeto_sapiens']
            this.projetoSuperior = response.data[0]['ds_projetoSuperior']
            this.projeto.fk_entidade = response.data[0]['id_entidade']
            this.entidade['ds_cnpj'] = response.data[0]['ds_cnpj']
            this.projeto.Numero_projeto = _.has(this.projeto, 'Numero_projeto') ? this.projeto['Numero_projeto'] : this.projeto.Projeto.substring(0, 5)
            this.nota.id = response.data[0]['id_documento_liberacao']
            this.extratoFiltrosSelecionados.push('solicitados')
            this.dirigentes = response.data['dirigentes']
            this.processo = response.data[0]['id_processo']
            this.validaSolicitante()
            this.buscaProcesso()
            this.carregarNotas()
            this.carregarCronograma()
            this.buscaOcorrencias()
            this.carregarPrestacaoAdiantamento()
            this.periodoExecucao()
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        // Dados da entidade
        async validaSolicitante () {
          console.log('###### Valida Solicitante')
          console.log('PROJETO: ', this.projeto)
          console.log('PROCESSO: ', this.processo)
          axiosLaravel.post('pagamento/valida/solicitante', {'projeto': this.projeto, 'processo': this.processo}).then((response) => {
            if (_.get(response.data, 'codigo', 'ERRO') !== 'ERRO') {
              this.entidade = response.data.retorno
              console.log('Entidade', this.entidade)
            }
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        async buscaProcesso () {
          console.log('####### Busca Processo')
          // Em paralelo, carregando dados do processo com todas as informações da NF
          await axiosLaravel.get('processos/' + this.id).then((response) => {
            console.log('####### Busca Processo OK', response.data)
            this.dataProcesso = moment(response.data.inicio).format('DD/MM/YYYY')
            if (moment(this.dataProcesso).isSameOrBefore(moment(this.dataCorte))) {
              this.dataMenor = true
            } else {
              this.dataMenor = false
            }
            //
            // TODO dataMenor
            // Ignorar as tarefas com tipo SISTEMA
            this.historico = _.filter(response.data.tarefas, function (item) { return item.tipo !== 'Sistema' })
            // this.historico = response.data.tarefas
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
            //
            this.ultimaTarefaFeita = _.chain(_.cloneDeep(this.historico)).filter(function (h) { return h.tipo === 'Usuário' && !_.isNull(h.termino) }).sortBy('id').last().value()
            //
            this.buscaHistorico(this.id)
            //
            this.etapa = _.chain(_.cloneDeep(this.historico)).remove(['tipo', 'Usuário']).sortBy('id').last().get('nome').value()
            // _.set(this.validacao, 'documentos_liberacao', response.data.documentos_liberacao)
            // console.log('validacao', this.validacao)
            // this.validacao.processo = _.omit(response.data, ['documentos_liberacao', 'tarefas'])
            // //
            // this.possuiNotaSapiens = response.data.possuiNotaSapiens
            // this.tituloMovimentado = response.data.tituloMovimentado
            // this.nota.bypass = this.carregarParametrosDocumento(this.validacao.parametros_documento, ['OPCOES', 'BYPASS'])
            // this.nota.tributacao = this.carregarParametrosDocumento(this.validacao.parametros_documento, ['TRIBUTACAO'])
            // this.nota.tributacao = this.nota.tributacao === '' ? 'NAO_TRIBUTADO' : this.nota.tributacao
            // this.nota.valorTributado = parseFloat(this.carregarParametrosDocumento(this.validacao.parametros_documento, ['VALOR_TRIBUTADO']))
            // if (this.carregarParametrosDocumento(this.validacao.parametros_documento, ['BOLETO']) !== '') {
            //   this.nota.boleto = JSON.parse(this.carregarParametrosDocumento(this.validacao.parametros_documento, ['BOLETO']))
            // }
            // this.cienteDeclaracoes = JSON.parse(this.carregarParametrosDocumento(this.validacao.parametros_documento, ['DECLARACOES']))
            // if (this.ehProjetoEspecial) {
            //   let dados = this.carregarParametrosDocumento(this.validacao.parametros_documento, ['DADOS_COMPLEMENTARES'])
            //   this.nota.dadosComplementares = (dados === '' || _.isNull(dados)) ? [] : JSON.parse(dados)
            // }
            // if (this.processo === 'RESSARCIMENTO') {
            //   let favorecido = this.carregarParametrosDocumento(this.validacao.parametros_documento, ['FAVORECIDO'])
            //   // Verifica se os dados do favorecido estão no parametro do documento ou senão deve buscar dadosFavorecido de novo
            //   if (favorecido === '' || _.isNull(favorecido)) {
            //     this.dadosFavorecido({'tipo': 'porIdProcesso', 'termo': this.id})
            //   } else {
            //     let favorecidoJson = JSON.parse(favorecido)
            //     if (_.has(favorecidoJson, 'codfav') || _.has(favorecidoJson, 'resultado')) {
            //       this.nota.favorecido = favorecidoJson
            //       this.nota.favorecido.incluidos = []
            //       this.nota.favorecido.excluidos = []
            //       this.nota.favorecido['dadosBancariosSelecionadosAnterior'] = _.clone(this.nota.favorecido.dadosBancariosSelecionados) // Simples cópia só para verificar na gravação se foi selecionado outro dado bancário diferente do informado pela entidade
            //       this.validacao.dados_bancarios.banco = this.nota.favorecido.dadosBancariosSelecionados.codban
            //       this.validacao.dados_bancarios.agencia = this.nota.favorecido.dadosBancariosSelecionados.codage
            //       this.validacao.dados_bancarios.conta = this.nota.favorecido.dadosBancariosSelecionados.ccbfav
            //       this.validacao.dados_bancarios.tipo = this.nota.favorecido.dadosBancariosSelecionados.tiptcc
            //       this.opcoesContasExistentesFavorecido = this.nota.favorecido.resultado
            //     } else {
            //       this.dadosFavorecido({'tipo': 'porIdProcesso', 'termo': this.id})
            //     }
            //   }
            //   this.nota.tributacao = 'NAO_TRIBUTADO'
            // }
            // //
            // let nfes = _.filter(this.validacao.parametros_documento, ['parametro', 'NFe'])
            // this.ehNFe = nfes.length > 0 // Se houver NF-e
            // if (this.ehNFe) {
            //   this.nfe = JSON.parse((_.last(_.sortBy(nfes, ['created_at'])))['valor']) // Pega a última se houver mais de uma NF-e registrada
            // }
            // //
            // this.nota.anexos = this.validacao.documentos
            // this.nota.numeroNota = this.validacao.numero
            // this.nota.serieNota = this.validacao.serie
            // this.nota.dataInclusao = this.validacao.emissao
            // this.nota.dataValidade = this.validacao.validade
            // this.bancoSelecionado = _.filter(this.listaBancos, ['codigo', this.validacao.dados_bancarios.banco])[0]
            // this.nota.dados_bancarios.banco = this.validacao.dados_bancarios.banco
            // this.nota.dados_bancarios.agencia = this.validacao.dados_bancarios.agencia
            // this.nota.dados_bancarios.conta = this.validacao.dados_bancarios.conta
            // this.nota.dados_bancarios.tipo = this.validacao.dados_bancarios.tipo
            // this.tipoContaSelecionado = _.filter(this.tiposConta, ['codigo', this.nota.dados_bancarios.tipo])[0]
            // let fornecedor = this.validacao.dados_bancarios.fornecedor
            // this.nota.tipoFornecedor = (fornecedor.identificador.length === 14 ? 'Pessoa Jurídica' : 'Pessoa Física')
            // this.nota.cpfFornecedor = (this.nota.tipoFornecedor === 'Pessoa Física' ? fornecedor.identificador : '')
            // this.nota.cnpjFornecedor = (this.nota.tipoFornecedor === 'Pessoa Jurídica' ? fornecedor.identificador : '')
            // this.nota.nomeFornecedor = (fornecedor.nome)
            // this.nota.enderecoFornecedor = (fornecedor.endereco)
            // this.nota.cepFornecedor = (fornecedor.cep)
            // this.verificaCpfCnpjSapiens(fornecedor.identificador)
            // this.procurandoCidadeUF()
            // this.nota.forma_pagamento = this.validacao.forma_pagamento
            // this.nota.pagamentoPrioritario = this.validacao.prioridade
            // this.$forceUpdate()
          })
            .catch((error) => {
              console.log('error', error)
            })
        },
        async carregarNotas () {
          console.log('######## carregarNotas')
          await axiosLaravel.get('prestacaoSimplificada/buscaNotas/' + this.id).then((response) => {
            console.log('carregarNotas', response.data)
            this.notas = _.cloneDeep(response.data.notas)
            this.table.items = _.cloneDeep(response.data.notas)
            this.anexos = response.data.anexos
            this.cienteDeclaracoes = response.data.declaracao[0].valor
            this.loading.show = false
          })
            .catch((error) => {
              console.log('error', error)
              this.loading.show = false
            })
        },
        carregarParametrosDocumento (parametrosCarregados, parametrosBusca) {
          let parametros = _.filter(parametrosCarregados, function (p) {
            return _.includes(parametrosBusca, p.parametro) || _.includes(parametrosBusca, p.valor)
          })
          if (parametros.length > 0) {
            return _.last(_.sortBy(parametros, ['created_at']))['valor']
          } else {
            return _.includes(parametrosBusca, 'DECLARACOES') ? '[]' : ''
          }
        },
        // Carrega Lista de Projetos para seleção caso seja uma nova solicitação
        carregarListaProjetos () {
          this.loading.show = true
          console.log('Carregando lista de projetos...')
          if (typeof Storage !== 'undefined') { // Ver se o browser suporta localStorage/sessionStorage.
            // Se sim, guardará a lista de codigos de ocorrência (raramente muda) junto com um timestamp da ultima atualizacao
            let listaProjetos = JSON.parse(window.localStorage.getItem('lista-projetos'))
            // Calcula a diferenca em dias do timestamp de agora e do que foi gravado no storage (que se não tiver ainda considera o inicio de 2024 para forçar atualização)
            let diferenca = Math.floor((((new Date()).getTime()) / 3600000) - ((_.get(listaProjetos, 'atualizado', (new Date('2024-02-20')).getTime())) / 3600000))
            if (diferenca >= 1 || _.isEmpty(listaProjetos)) { // Se não tiver lista ou a lista estiver desatualizada (com mais de 1 dia).. atualiza ela
              console.log('Carregando lista de projetos da base...')
              axiosLaravel.post('processos/projetos', {'processo': 'PRESTACAO_DE_CONTAS', 'tipoBusca': 'simples'}).then((response) => {
                // Limitar acesso a projetos
                let listaProjetos = response.data
                let acessosProjetos = _.get(this.usuarioLogado, 'configuracoes.acesso_projetos')
                if (acessosProjetos) {
                  let permissoesAcesso = ['INICIA_SOLICITACAO'] // A lista constará quais acessos serão permitidos para que o projeto figure na lista
                  acessosProjetos = _.map(_.filter(acessosProjetos, function (p) { return _.find(p.acesso, function (a) { return _.includes(permissoesAcesso, a.codigo) }) }), 'numero')
                  listaProjetos = _.filter(listaProjetos, function (p) { return _.includes(acessosProjetos, p['Numero_projeto']) })
                }
                this.listaProjetos = listaProjetos
                window.localStorage.setItem('lista-projetos', JSON.stringify({'atualizado': Math.floor((new Date()).getTime()), 'lista': this.listaProjetos}))
                this.$forceUpdate()
                this.loading.show = false
                console.log('DADOS CARREGADOS DA BASE')
              })
                .catch((error) => {
                  console.log('error', error)
                  this.$root.trataErro(error)
                })
            } else {
              console.log('Carregando lista de projetos do local storage...')
              this.listaProjetos = _.cloneDeep(listaProjetos.lista)
              this.loading.show = false
            }
          }
        },
        selecionaProjeto () {
          this.loading.show = true
          this.periodoExecucao()
          this.consultaProjetosEmAlteracao()
          axiosLaravel.post('pagamento/valida/solicitante', {'projeto': this.projeto, 'processo': 'PRESTACAO_DE_CONTAS'}).then((response) => {
            if (_.has(response.data, 'codigo')) {
              if (response.data.codigo !== 'ERRO') {
                this.entidade = response.data.retorno
                this.buscaOcorrencias()
                this.carregarCronograma()
                this.carregarPrestacaoAdiantamento()
              }
            }
            this.loading.show = false
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        async periodoExecucao () {
          console.log('####### Carrega Periodo Execucao e dados complementares')
          await axiosLaravel.get('propostas/' + this.projeto.Id_proposta + '/periodo_execucao_sapiens').then(response => {
            let datetimeInicial = new Date(response.data.data_inicio_sapiens)
            let datetimeFim = new Date(response.data.data_final_sapiens)
            this.dataFinalConvenio = new Date(response.data.data_fim_convenio)
            this.projeto.data_inicial_formatada = datetimeInicial.toLocaleDateString('pt-BR')
            this.projeto.data_final_formatada = datetimeFim.toLocaleDateString('pt-BR')
            this.projeto.dateInicioSapiens = datetimeInicial.setDate(datetimeInicial.getDate() - 1)
            this.projeto.dateFimSapiens = new Date(response.data.data_final_sapiens)
            this.projeto.dateAprovacao = new Date(response.data.data_aprovacao)
            this.projeto.projeto_superior = response.data.projeto_superior
          })
        },
        async buscaOcorrencias () {
          console.log('## Busca Ocorrencias')
          await axiosLaravel.post('ocorrencia/busca', {'informacao': 'SIMPLIFICADO', 'projeto': this.projeto.Numero_projeto, 'nivel': [2, 3, 4], 'situacao': 'LIBERADO'}).then((response) => {
            console.log('## Busca Ocorrencias OK')
            if (_.get(response.data, 'codigo', '') === 'OK') {
              this.ocorrencias = response.data.retorno
              if (this.ocorrencias.length > 0) { // Se há ocorrências ativas para esse projeto
                this.temOcorrencia = true
              }
            } else {
              this.$snotify.error(response.data.mensagem)
            }
            this.$forceUpdate()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        async carregarCronograma () {
          console.log('### Carrega Cronograma')
          this.loading.cronograma = true
          let idDocumento = _.has(this.nota, 'id') ? this.nota.id : 1
          await axiosLaravel.post('processos/cronograma/projeto/', {'proposta': this.projeto['Id_proposta'], 'processo': 'PRESTACAO_DE_CONTAS', 'aglutinado': 'Completo', 'documento': idDocumento}).then((response) => {
            this.cronograma = response.data
            this.filtrarPorOrigemRecurso(_.find(this.cronograma.itens, function (i) { return ('' + i.Item_Origem).substring(0, 1) === '1' }) ? 'fundacao' : 'parceiro')
            this.acertoValoresCronograma()
            this.valoresProjeto() // Em todas as etapas verifica antes se há inconsistências ao carregar os valores totais do projeto
            if (this.usuarioLogado.userType === 'FUNDACAO') {
              this.verificarTitulosDisponiveisPC()
            }
            this.loading.cronograma = false
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        filtrarPorOrigemRecurso (origem) { // origem pode ser 'fundacao', 'parceiro'
          _.pull(this.extratoFiltrosSelecionados, 'fundacao', 'parceiro')
          _.uniq(this.extratoFiltrosSelecionados.push(origem))
          this.filtrarExtrato()
          this.calcularTotaisExtato()
        },
        filtrarExtrato () {
          // Percorrer todos os itens do cronograma
          this.cronograma.itens.forEach((item) => {
            let selecionados = 0
            // Mostrar ou não se o filtro for de 'saldo' e tiver saldo
            selecionados += _.includes(this.extratoFiltrosSelecionados, 'saldos') && _.has(item, 'Valor_saldo') && item.Valor_saldo > 0 ? 1 : 0

            // Demanda 64547: Adição de filtro por Fundação e P. Estratégico
            selecionados += _.includes(this.extratoFiltrosSelecionados, 'fundacao') && _.has(item, 'Item_Origem') && item.Item_Origem === 1 ? 1 : 0
            selecionados += _.includes(this.extratoFiltrosSelecionados, 'parceiro') && _.has(item, 'Item_Origem') && item.Item_Origem === 5 ? 1 : 0

            // Mostrar ou não se o filtro for de 'solicitados' e tiver valor e quantidade acima de zero
            selecionados += _.includes(this.extratoFiltrosSelecionados, 'solicitados') && _.has(item, 'Valor_solicitado') && item.Valor_solicitado > 0 && _.has(item, 'Qtde_solicitado') && item.Qtde_solicitado > 0 ? 1 : 0
            item['mostrar'] = this.extratoFiltrosSelecionados.length === selecionados
          })
        },
        calcularTotaisExtato () {
          this.verificaCorrigeDados()
          let fbb = this.valorProjetoOrigem('1')
          let contrapartida = this.valorProjetoOrigem('2')
          let parceiro = this.valorProjetoOrigem('5')
          this.totais.projeto.fbb.orcado = fbb.orcado
          this.totais.projeto.fbb.solicitado = fbb.solicitado
          this.totais.projeto.fbb.saldo = fbb.saldo
          this.totais.projeto.contrapartida.orcado = contrapartida.orcado
          this.totais.projeto.contrapartida.solicitado = contrapartida.solicitado
          this.totais.projeto.contrapartida.saldo = contrapartida.saldo
          this.totais.projeto.parceiros.orcado = parceiro.orcado
          this.totais.projeto.parceiros.solicitado = parceiro.solicitado
          this.totais.projeto.parceiros.saldo = parceiro.saldo
          this.totais.projeto.total.orcado = fbb.orcado + contrapartida.orcado + parceiro.orcado
          if (this.etapa === 'Solicitação') {
            if (this.extratoFiltrosSelecionados.includes('fundacao')) {
              parceiro.solicitado = 0
              this.cronograma.itens.forEach((item) => {
                if (item.Item_Origem === 5) {
                  item.Qtde_solicitado = 0
                  item.Valor_solicitado = 0
                }
              })
            } else if (this.extratoFiltrosSelecionados.includes('parceiro')) {
              fbb.solicitado = 0
              this.cronograma.itens.forEach((item) => {
                if (item.Item_Origem === 1) {
                  item.Qtde_solicitado = 0
                  item.Valor_solicitado = 0
                }
              })
            }
          }

          this.totais.projeto.total.solicitado = fbb.solicitado + contrapartida.solicitado + parceiro.solicitado
          this.totais.projeto.total.saldo = fbb.saldo + contrapartida.saldo + parceiro.saldo
          // forçando para carregar 2 casas após a vírgula: erro de arredondamento
          this.totais.projeto.total.solicitado = Math.round(this.totais.projeto.total.solicitado * 100) / 100
          this.$forceUpdate()
        },
        verificaCorrigeDados () {
          this.$forceUpdate()
          this.nota.itens = []
          this.cronograma.itens.forEach((item) => {
            item['valorSolicitado'] = item.Valor_solicitado
            item['quantidadeSolicitada'] = item.Qtde_solicitado
            if (parseFloat(item.Qtde_solicitado) > 0 && parseFloat(item.Valor_solicitado) > 0) {
              this.nota.itens.push(item)
            }
          })
        },
        valorProjetoOrigem (origem) {
          let valorOrcado = 0
          let valorSolicitado = 0
          let valorSaldo = 0
          let valorAdiantavelOrcado = 0
          if (_.isEmpty(this.cronograma) || !_.has(this.cronograma, 'itens') || this.cronograma.itens.length === 0) {
            return { orcado: 0, saldo: 0, solicitado: 0, adiantavel: 0 }
          }
          this.cronograma.itens.forEach((item) => {
            if (('' + item.Item_Origem).substring(0, 1) === origem) {
              valorOrcado += parseFloat(item.Valor_orcado)
              valorSolicitado += parseFloat(item.Valor_solicitado)
              valorSaldo += parseFloat(item.Valor_saldo)
              valorAdiantavelOrcado += ('' + item.Adiantavel === '1') ? parseFloat(item.Valor_orcado) : 0
            }
          })
          return { orcado: valorOrcado, saldo: valorSaldo, solicitado: valorSolicitado, adiantavel: valorAdiantavelOrcado }
        },
        verificarTitulosDisponiveisPC () {
          // Verifica se há algum titulo de adiantamento para esse projeto com transação 90530 e valor em aberto
          axiosLaravel.post('processos/verifica_titulos_adiantamento', {'numeroProjeto': this.projeto.Numero_projeto}).then((response) => {
            console.log('verificarTitulosDisponiveisPC', response.data)
            if (_.get(response.data, 'codigo', '') === 'ERRO') {
              this.adicionaRestricao({'tag': 'adiantamentoNaoDisponivelParaPrestarContas', 'ativo': true, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Ainda não há título de adiantamento disponível para prestar contas'})
            } else {
              console.log('verificarTitulosDisponiveisPC ERRO', response.data)
            }
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        valoresProjeto () {
          axiosLaravel.post('processos/valores/projeto/', {'numeroProjeto': this.projeto['Numero_projeto'], 'processo': this.processo, 'etapa': this.etapa}).then((response) => {
            console.log('valoresProjeto >>> ', response.data)
            if (_.get(response.data, 'codigo', '') === 'ERRO' && response.data.mensagem.length > 0) {
              response.data.mensagem.forEach((msg) => {
                this.adicionaRestricao({'tag': 'valoresTotaisIncorretosProjeto_' + msg.codigo, 'ativo': true, 'tipo': 'restricao', 'acao': null, 'mensagem': msg.mensagem})
              })
            }
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        adicionaRestricao (ev) {
          if (!_.isNil(ev) && _.has(ev, 'tag')) {
            // Se já existe, remova da lista
            _.remove(this.restricaoParaConcluir, function (i) {
              return i.tag === ev.tag
            })
            // Adiciona a restrição
            this.restricaoParaConcluir.push(ev)
          }
        },
        removeRestricao (ev) {
          _.remove(this.restricaoParaConcluir, function (i) {
            return i.tag === ev.tag
          })
        },
        consultaProjetosEmAlteracao () {
          console.log('consultando se o projeto possui alteração em andamento', this.projeto.Numero_projeto)
          axiosLaravel.get('projeto/alteracoes/verificaAlteracaoEmAndamento/' + this.projeto.Numero_projeto).then((response) => {
            console.log(response.data)
            this.projetoComAlteracaoEmAndamento = response.data.alteracao_em_andamento
            if (this.projetoComAlteracaoEmAndamento === true) {
              console.log('erro, projeto com alteração em andamento')
              this.adicionaRestricao({'tag': 'projetoComAlteracaoEmAndamento', 'ativo': true, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Solicitação não disponível. Verificamos que há uma alteração de projetos em andamento.'})
              let restricoes = _.filter(this.restricaoParaConcluir, {'ativo': true, 'tipo': 'restricao'})
              let mensagens = '<div class=avisoAlerta><li>' + _.join(_.map(restricoes, 'mensagem'), '<li>') + '</div>'
              this.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {})
            }
          })
          .catch((error) => {
            this.$snotify.clear()
            this.loading.tela = false
            console.error(error)
          })
        },
        async carregarPrestacaoAdiantamento () {
          console.log('#### Carrega Prestaçao Adiantamento')
          this.loading.adiantamentos = true
          await axiosLaravel.get('processos/adiantamento/recursos/' + this.projeto['Id_proposta']).then((response) => {
            console.log('#### Carrega Prestaçao Adiantamento OK')
            this.adiantamentosConcedidos = response.data.adiantamentos_concedidos.row
            this.calcularTotaisAdiantamento()
            this.$forceUpdate()
            this.loading.adiantamentos = false
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        calcularTotaisAdiantamento () {
          this.totais.adiantamento.fbb.saldo = _.sumBy(this.adiantamentosConcedidos, function (i) { return i.recurso === 'FUNDACAO' ? i.pendente_comprovacao : 0 })
          this.totais.adiantamento.fbb.orcado = _.sumBy(this.adiantamentosConcedidos, function (i) { return i.recurso === 'FUNDACAO' ? i.contratado : 0 })
          this.totais.adiantamento.fbb.solicitado = _.sumBy(this.adiantamentosConcedidos, function (i) { return i.recurso === 'FUNDACAO' ? i.requisitado : 0 })
          this.totais.adiantamento.parceiros.saldo = _.sumBy(this.adiantamentosConcedidos, function (i) { return i.recurso === 'PARCEIRO_ESTRATEGICO' ? i.pendente_comprovacao : 0 })
          this.totais.adiantamento.parceiros.orcado = _.sumBy(this.adiantamentosConcedidos, function (i) { return i.recurso === 'PARCEIRO_ESTRATEGICO' ? i.contratado : 0 })
          this.totais.adiantamento.parceiros.solicitado = _.sumBy(this.adiantamentosConcedidos, function (i) { return i.recurso === 'PARCEIRO_ESTRATEGICO' ? i.requisitado : 0 })
          this.totais.adiantamento.total.solicitado = this.totais.adiantamento.fbb.solicitado + this.totais.adiantamento.parceiros.solicitado
          this.totais.adiantamento.total.orcado = this.totais.adiantamento.fbb.orcado + this.totais.adiantamento.parceiros.orcado
          this.totais.adiantamento.total.saldo = this.totais.adiantamento.fbb.saldo + this.totais.adiantamento.parceiros.saldo
          this.$forceUpdate()
          // Alterar o filtro do cronograma se não tiver limite disponível em um recurso quando se tratar de parcelas mistas na solicitação ou revisão
          if (_.includes(['Solicitação', 'Revisão'], this.etapa) && this.adiantamentosConcedidos.length !== (_.uniq(_.map(this.adiantamentosConcedidos, function (p) { return ('' + p.numeroTitulo) }))).length) {
            this.filtrarPorOrigemRecurso(this.totais.adiantamento.fbb.saldo > 0 ? 'fundacao' : 'parceiro')
          }
        },
        emitir (relatorio) {
          this.loading.tela = true
          this.projeto['Numero_projeto'] = _.has(this.projeto, 'Numero_projeto') ? this.projeto['Numero_projeto'] : this.projeto.Projeto.substring(0, 5)
          if (!_.toSafeInteger(this.projeto['Numero_projeto']) > 0) {
            this.$snotify.error('Há algum erro ao pegar o número deste projeto. Favor informar o administrador do sistema')
            return
          }
          let parametros = '<ECodEmp=1><ENumPrj=' + this.projeto['Numero_projeto'] + '>'
          if (relatorio === 222 || relatorio === 219) {
            parametros += ',<ESitPrj=ULT>'
          } else if (relatorio === 248) {
            parametros += ',<ECodFor=>'
          }
          if (relatorio === 222) {
            parametros += ',<EMosDes=S>'
          }
          if (relatorio === 200 && _.has(this.analiseTributaria, 'nf') && ('' + this.analiseTributaria.nf.SitNfc === '2')) { // Comunicado Interno não usa os parâmetros triviais acima, ent~çao se for este o relatório ele reescreve os parâmetros
            parametros = '<ECodFor=' + this.analiseTributaria.nf.CodFor + '>,<ENumNfc=' + this.analiseTributaria.nf.NumNfc + '>,<ECodSnf=' + this.analiseTributaria.nf.CodSnf + '>,<EForOrg=F>,<EPreCon=N>'
          }
          if (relatorio === 611) {
            parametros = `<ECodFor=${this.analiseTributaria.nf.CodFor}><ENumTit="${this.analiseTributaria.titulo.NumTit}"><ETitBai=S>`
          }
          this.$snotify.clear()
          let codigoRelatorio = (relatorio === 200 ? 'SRNF' : 'FJCF') + relatorio + '.GER'
          if (relatorio === 611) codigoRelatorio = 'FPCP' + relatorio + '.GER'
          this.$snotify.async('Gerando relatório ' + relatorio + '. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': codigoRelatorio}, params: parametros}).then((response) => {
            this.onDownload(response, relatorio, this)
          })
            .catch((error) => {
              this.$snotify.clear()
              this.loading.tela = false
              this.$root.trataErro(error)
            })
        },
        onDownload (response, relatorio, vm) {
          let item = response.data.arquivo
          const contentType = 'application/pdf'
          const b64Data = response.data.arquivo
          let file = this.b64toBlob(b64Data, contentType)
          // Suporte 61615 - Ajuste para definir o nome do arquivo no download no formato YYYYMMDD ID PG/PC/RE
          // Suporte 62097 - inclusão do número do projeto para o caso de PC
          let tipoProcesso = ''
          switch (vm.processo) {
            case 'PAGAMENTO':
              tipoProcesso = 'PG'
              break
            case 'PRESTACAO_DE_CONTAS':
              tipoProcesso = 'PC ' + this.projeto.Numero_projeto
              break
            case 'RESSARCIMENTO':
              tipoProcesso = 'RE'
              break
          }
          let ie = !!window.MSInputMethodContext && !!document.documentMode
          if (relatorio !== 200) {
            if (!ie) {
              let blob = file
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = 'Relatório ' + relatorio + ' » ' + vm.projeto.Projeto
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } else {
              let blob = file
              let link = document.createElement('blob')
              link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
              link.download = 'Relatório ' + relatorio + ' » ' + vm.projeto.Projeto
              link.click()
            }
          } else {
            if (!ie) {
              let blob = file
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              // 70137 - Inserir valor da tarefa no nome do arquivo
              link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id + ' - ' + tipoProcesso + ' VALOR ' + vm.totais.projeto.total.solicitado
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } else {
              let blob = file
              let link = document.createElement('blob')
              link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
              // 70137 - Inserir valor da tarefa no nome do arquivo
              link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id + ' - ' + tipoProcesso + ' VALOR ' + vm.totais.projeto.total.solicitado
              link.click()
            }
          }
          this.$snotify.clear()
          this.$snotify.success('Relatório gerado com sucesso!')
          this.loading.tela = false
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
        textoDeclaracao (texto) {
          let regex = /{{(.*?)}}/g
          let correspondencias = texto.match(regex)
          correspondencias.forEach((correspondencia) => {
            let valor = _.get(this, correspondencia.replaceAll('{{', '').replaceAll('}}', ''))
            valor = _.isUndefined(valor) || _.isNull(valor) || _.isEmpty(valor) ? '' : valor
            texto = _.replace(texto, '' + correspondencia, '' + valor)
          })
          return texto
        },
        ciente (codigo) {
          if (_.find(this.cienteDeclaracoes, ['codigo', codigo])) {
            _.remove(this.cienteDeclaracoes, ['codigo', codigo])
          } else {
            this.cienteDeclaracoes.push({'codigo': codigo, 'texto': _.get(_.find(this.declaracoes, ['codigo', codigo]), 'texto', ''), 'data': new Date(), 'usuario': {'id': this.usuarioLogado.id, 'nome': this.usuarioLogado.ds_nome_usuario}})
          }
          this.$forceUpdate()
        },
        buscaHistorico (request) {
          axiosLaravel.post('historico-tarefas/lista', {'parametro': request}).then((response) => {
            this.historicoBack = response.data
            let tar = _.find(this.historico, {nome: 'Solicitação'})
            if (!_.isEmpty(this.historicoBack) && !_.find(this.historicoBack, {nome: 'SOLICITACAO'})) {
              if (tar.nome === 'Solicitação' && this.dataMenor === false) {
                this.historicoBack.push({
                  fk_processo: tar.fk_processo,
                  fk_tarefa: tar.id,
                  fk_usuario: tar.fk_usuario,
                  nome: 'SOLICITACAO',
                  proxima_etapa: '',
                  usuario: tar.usuario,
                  data_edicao: null,
                  inicio: tar.inicio,
                  termino: tar.termino,
                  observacao: tar.observacao
                })
              }
            }
            // Remove quando tem inconsistência de já estar em REVISAO e a proxima etapa Revisão
            // let tar2 = _.find(this.historicoBack, {nome: 'REVISAO', proxima_etapa: 'Revisão'})
            // let index = _.findIndex(this.historicoBack, { id: tar2.id })
            // this.historicoBack.splice(index, 1)
          })
        },
        // Fim das funções migradas do Edita Pagamento
        // Funçao que trás as notas cadastradas do cronograma:
        setArrayNotas (novaNota) {
          // Sensibiliza o valor do campo no cronograma
          this.cronograma.itens.forEach((item) => {
            if (item.Id_item === novaNota.itemOrcamento.Id_item) {
              // Quantidade sempre será 1 para acerto do cronograma
              item.Qtde_solicitado = 1
              // Valor irá somar o total dos valores de todas as notas do item do cronograma
              item.Valor_solicitado += novaNota.valor
            }
          })
          this.table.items.push(novaNota)
          this.calcularTotaisExtato()
          this.$forceUpdate()
        },
        getClassStatus (status) {
          let classStatus = ''
          switch (status) {
            case 'Pendente':
              classStatus = 'text-warning'
              break
            case 'Baixado':
              classStatus = 'text-success'
              break
            case 'Erro Processamento':
              classStatus = 'text-danger'
              break
            default:
              classStatus = ''
          }
          return classStatus
        },
        // (2025)TODO - FAZER PRO ARRAY DE NOTAS
        async validarNota () {
          let identificador = this.nota.cpfFornecedor
          if (this.nota.cpfFornecedor === '') {
            identificador = this.nota.cnpjFornecedor
          }
          let data = {
            numero: this.nota.numeroNota,
            identificador: identificador,
            serie: this.nota.serieNota,
            id: this.id
          }
          await axiosLaravel.post('processos/tarefas/validaDocumentoAnalisePrestacao', data).then((response) => {
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
              console.log('ERRO')
              this.loading.tela = false
              throw error
            })
        },
        async validarConclusao (resultadoAprovacao) {
          // PARA OS COLEGAS DO FUTURO: COLOQUE AQUI QUALQUER VERIFICAÇÃO QUE DESEJAR FAZER ANTES DE FINALIZAR A SOLICITAÇÃO
          this.loading.show = true
          console.log('VALIDANDO CONCLUSAO ... ', resultadoAprovacao)
          if (this.table.items.length <= 0) {
            this.$snotify.error('Favor informar os itens da solicitação')
            this.loading.show = false
            return
          }
          // Seta o resultado da aprovação (Salvar / Concluir)
          if (this.aprovacao.resultadoAprovacao !== 'Revisão' && this.aprovacao.resultadoAprovacao !== 'Conclusão') {
            this.aprovacao.resultadoAprovacao = resultadoAprovacao
          }
          console.log('resultadoAprovacao', this.aprovacao.resultadoAprovacao)
          this.verificaCorrigeDados()
          this.adicionaRestricao({'tag': 'cienteDeclaracoes', 'ativo': (this.cienteDeclaracoes.length < 3), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Deve confirmar que está ciente das declarações no final desta solicitação'})
          // (2025)TODO - Validar nota quando a etapa for aprovação e o processo for prestação de contas
          if (this.etapa === 'Análise') {
            validarNota()
          }
          // Regras caso se trate só de prestação de contas e se é pra devolver em revisão para a entidade aí não sensibiliza a validação.
          if (this.aprovacao.resultadoAprovacao !== 'Revisão' && this.etapa !== 'Autorização') {
            this.adicionaRestricao({'tag': 'prestacaoContasComSaldoZerado', 'ativo': (this.totais.adiantamento.fbb.saldo + this.totais.projeto.total.solicitado <= 0 && this.totais.adiantamento.parceiros.saldo + this.totais.projeto.total.solicitado <= 0), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Não há saldo disponível para solicitação de Prestação de Contas'})
          }
          // Verifica se a solicitação passa o saldo disponível
          if (_.includes(['Solicitação'], this.etapa)) {
            this.adicionaRestricao({'tag': 'solicitacaoAcimaSaldoDisponível', 'ativo': (this.totais.projeto.total.solicitado > (_.includes(this.extratoFiltrosSelecionados, 'fundacao') ? this.totais.adiantamento.fbb.saldo : this.totais.adiantamento.parceiros.saldo)), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Valor da solicitação superior ao saldo máximo disponível R$ ' + (_.includes(this.extratoFiltrosSelecionados, 'fundacao') ? this.totais.adiantamento.fbb.saldo : this.totais.adiantamento.parceiros.saldo)})
          }
          // Quando se tratar de encaminhar para Revisão da entidade deve-se excluir as retrições de conclusão
          if (this.aprovacao.resultadoAprovacao === 'Revisão') {
            this.restricaoParaConcluir.forEach((erro) => {
              if (erro.tag === 'adiantamentoNaoDisponivelParaPrestarContas' || _.includes(erro.tag, 'valoresTotaisIncorretosProjeto')) {
                this.removeRestricao({'tag': erro.tag})
              }
            })
          }
          // Verifica se a solicitação possui alguma restrição para concluir
          let restricoes = _.filter(this.restricaoParaConcluir, {'ativo': true, 'tipo': 'restricao'})
          if (restricoes.length > 0) {
            let mensagens = '<div class=avisoAlerta prest-aviso-alerta><li>' + _.join(_.map(restricoes, 'mensagem'), '<li>') + '</div>'
            this.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoAlerta prest-aviso-alerta'}).then(function (dialog) {})
            this.loading.show = false
            return
          }
          // Processa Conclusão
          this.processarConclusao()
        },
        processarConclusao () {
          console.log('processarConclusao', this.table.items)
          // ========================================================================
          // Verificações de ETAPA
          // ========================================================================
          // Verifica se está Solicitando ou Revisando
          if (this.aprovacao.resultadoAprovacao === 'Concluir') {
            if ((this.etapa === 'Solicitação' || this.etapa === 'Revisão')) {
              this.aprovacao.resultadoAprovacao = 'Autorização'
            } else if (this.etapa === 'Autorização' && this.aprovacao.resultadoAprovacao === 'Conclusão') {
              this.aprovacao.resultadoAprovacao = 'Conclusão'
            } else if (this.etapa === 'Autorização' && this.aprovacao.resultadoAprovacao === 'Revisão') {
              this.aprovacao.resultadoAprovacao = 'Revisão'
            }
          }
          // =========================================================================
          // (2025)TODO - Verificar quando o resultado Aprovacao for Salvar
          // =========================================================================
          this.loading.show = true
          // ========================================================================
          // Inicia o corpo da solicitacao
          // ========================================================================
          this.solicitacao.notas = _.cloneDeep(this.table.items)
          // Grava os dados da ciencia das declarações
          if (_.includes(['Solicitação', 'Revisão'], this.etapa)) {
            this.solicitacao.parametros_documento = []
            this.solicitacao.parametros_documento.push({ 'parametro': 'DECLARACOES', 'valor': this.cienteDeclaracoes })
          } else {
            this.solicitacao.declaracoes = this.cienteDeclaracoes
          }
          this.solicitacao.valorTotal = 0
          this.solicitacao.projeto = this.projeto
          //
          this.solicitacao.processo = {'nome': 'PRESTACAO_DE_CONTAS_SIMPLIFICADA', 'situacao': 'EM_EXECUCAO'}
          this.solicitacao.tarefa = {'nome': 'SOLICITACAO', 'tipo': 'USUARIO', 'situacao': 'PADRAO'}
          this.solicitacao.idUsuario = this.usuarioLogado.id
          this.solicitacao.anexos = this.anexos
          _.set(this.solicitacao, 'proximaEtapa', this.aprovacao.resultadoAprovacao)
          _.set(this.solicitacao, 'proxima_etapa', this.aprovacao.resultadoAprovacao)
          _.set(this.solicitacao, 'data_edicao', this.data_edicao)
          //
          // Quando se trata de processo novo (não tem id ainda) --------------------------------------------------------
          if (_.isNull(this.id)) {
            console.log('SOLICITACAO DEBUG:', this.solicitacao)
            this.criarSolicitacao(this.solicitacao)
          } else {
            // Seta os documentos de liberaçao a partir das notas cadastradas na this.solicitacao.notas
            let docLib = []
            this.solicitacao.notas.forEach((nota) => {
              let documentoLiberacao = this.setDoc(nota)
              docLib.push(documentoLiberacao)
            })
            if (docLib) {
              // this.loading.show = false
              console.log('DOC DEBUG:', docLib)
              // return
            }
            this.solicitacao.doc = docLib
            this.solicitacao.id = this.id
            // Processamentos adicionais antes de encaminhar tarefa
            if (_.includes(['Autorização'], this.etapa) && this.aprovacao.resultadoAprovacao === 'Conclusão') {
              this.concluirSolicitacao()
            } else {
              // Para todos os demais casos só encaminhar o processo para próxima etapa
              this.encaminharProximaTarefa(this.solicitacao)
            }
          }
        },
        setDoc (nota) {
          console.log('setDoc', nota)
          let doc = {}
          // Quando o processo já foi criado (tem id) -----------------------------------------------------------------
          _.set(doc, 'id', this.id)
          _.set(doc, 'tarefas', this.historico)
          _.set(doc, 'glosa', nota.observacao)
          // Adicionando os parâmetros novos que Renato criou para Histórico
          _.set(doc, 'proxima_etapa', this.aprovacao.resultadoAprovacao)
          _.set(doc, 'data_edicao', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
          //
          _.set(doc, 'documentos_liberacao', {})
          _.set(doc, 'documentos_liberacao.numero', nota.numeroNota)
          _.set(doc, 'documentos_liberacao.serie', nota.serieNota)
          _.set(doc, 'documentos_liberacao.prioridade', nota.pagamentoPrioritario)
          _.set(doc, 'documentos_liberacao.forma_pagamento', nota.forma_pagamento)
          _.set(doc, 'documentos_liberacao.emissao', nota.dataInclusao)
          _.set(doc, 'documentos_liberacao.validade', nota.dataValidade)
          _.set(doc, 'documentos_liberacao.fk_dados_bancarios', this.validacao.fk_dados_bancarios)
          _.set(doc, 'documentos_liberacao.dados_bancarios', nota.dados_bancarios)
          _.set(doc, 'documentos_liberacao.dados_bancarios.fk_fornecedor', _.has(this.validacao.dados_bancarios, 'fk_fornecedor') ? this.validacao.dados_bancarios.fk_fornecedor : 0)
          _.set(doc, 'documentos_liberacao.dados_bancarios.fornecedor.nome', nota.nomeFornecedor)
          _.set(doc, 'documentos_liberacao.dados_bancarios.fornecedor.identificador', nota.tipoFornecedor === 'Pessoa Jurídica' ? nota.cnpjFornecedor : nota.cpfFornecedor)
          _.set(doc, 'documentos_liberacao.dados_bancarios.fornecedor.cep', nota.cepFornecedor)
          _.set(doc, 'documentos_liberacao.dados_bancarios.fornecedor.endereco', nota.enderecoFornecedor)
          //
          _.set(doc, 'documentos_liberacao.receiptItems', nota.items[0])
          // Acerto de saldo
          console.log('VALOR DA NOTA:', nota.valor)
          _.set(doc, 'documentos_liberacao.receiptItems.quantidadeSolicitada', 1)
          _.set(doc, 'documentos_liberacao.receiptItems.valorSolicitado', nota.valor)
          _.set(doc, 'documentos_liberacao.receiptItems.Qtde_solicitado', 1)
          _.set(doc, 'documentos_liberacao.receiptItems.Valor_solicitado', nota.valor)
          _.set(doc, 'documentos_liberacao.receiptItems.fk_documentos_liberacao', nota.items[0].fk_documentos_liberacao)

          // Parâmetros do documento de liberação
          this.validacao.parametros_documento = []

          if (nota.bypass !== '') {
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'OPCOES', 'valor': nota.bypass })
          }
          if (_.includes(['Solicitação', 'Revisão'], this.etapa)) {
            this.validacao.parametros_documento.push({ 'fk_documentos_liberacao': this.validacao.id, 'parametro': 'DECLARACOES', 'valor': JSON.stringify(this.cienteDeclaracoes) })
          }
          if (_.isEmpty(this.validacao.parametros_documento)) {
            _.set(doc, 'documentos_liberacao.parametros_documento', this.validacao.parametros_documento)
          }
          //
          _.set(doc, 'processo', this.validacao.processo)
          _.set(doc, 'processo.nome', this.processo)
          _.set(doc, 'proximaEtapa', this.aprovacao.resultadoAprovacao)
          //
          console.log('DOC DEPOIS DA ATUALIZACAO: ', doc)
          return doc
        },
        async concluirSolicitacao () {
          // // Quando estiver Autorização e for Devolver para Análise... deve desaprovar o título
          //   this.aprovacaoTitulo('D', doc)
          // } else if (this.aprovacao.resultadoAprovacao === 'Autorização') {
          // // Quando estiver Análise e for Aprovar o processo... deve aprovar o título
          //   this.aprovacaoTitulo('A', doc)
          // } else if (_.includes(['Autorização'], this.etapa) && this.aprovacao.resultadoAprovacao === 'Conclusão') {
          //   // Quando for Prestação de Contas, estiver na Autorização e for Aprovar o processo... deve baixar o título de adiantamento
          //   this.baixaTitulo(doc)

          // Finaliza o processo de prestação de contas
          console.log('CONCLUINDO SOLICITACAO...')
          this.$snotify.clear()
          this.$snotify.async('Concluindo Solicitação de Prestação de Contas. Por favor, aguarde...', {timeout: 0})
          this.loading.show = true
          // Percorre todas as notas em um for
          // Pega cada nota que esteja com o status Pendente ou Erro
          for (let i = 0; i < this.table.items.length; i++) {
            let nota = this.table.items[i]
            console.log('nota', nota)
            if (nota.status !== 'Concluído') {
              console.log('NOTA PENDENTE!')
              // Faz a integração com o Sapiens
              this.$snotify.clear()
              console.log(nota)
              let mensagem = 'Integrando nota: ' + nota.numeroNota + ' com o ERP. Por favor, aguarde...'
              this.$snotify.async(mensagem, {timeout: 0})
              let fkDocumentoLiberacao = nota.items[0].fk_documentos_liberacao
              let fkProcesso = this.id
              this.notaOk = false
              await this.sincronizarComSapiens(fkDocumentoLiberacao, fkProcesso)
              console.log('1 - SINCRONIZOU COM ERP', this.notaOk)
              if (!this.notaOk) {
                this.$snotify.clear()
                this.$snotify.error('Erro ao INTEGRAR nota: ' + nota.numeroNota + ' com o ERP. Favor verificar!', '', 10000)
                this.nota.status = 'ERRO INTEGRAÇÃO ERP'
                this.table.items[i].status = 'ERRO INTEGRAÇÃO ERP'
                this.$forceUpdate()
                this.loading.show = false
                console.log('1 - SINCRONIZOU COM ERP (ERRO)', this.notaOk)
                return
              } else {
                this.$snotify.clear()
                this.$snotify.success('Nota Integrada no Sapiens com sucesso: ' + nota.numeroNota, '', 10000)
                this.nota.status = 'INTEGRADO COM ERP - PENDENTE APROVAÇÃO NOTA'
                this.table.items[i].status = 'INTEGRADO COM ERP - PENDENTE APROVAÇÃO NOTA'
                console.log('1 - SINCRONIZOU COM ERP (OK)', this.notaOk)
                this.$forceUpdate()
              }
              if (nota.status === 'INTEGRADO COM ERP - PENDENTE APROVAÇÃO NOTA') {
                mensagem = 'Aprovando nota: ' + nota.numeroNota + ' . Por favor, aguarde...'
                // this.$snotify.clear()
                this.$snotify.async(mensagem, {timeout: 0})
                this.aprovacaoOk = false
                this.loading.show = true
                await this.aprovacaoTitulo('A', nota, fkDocumentoLiberacao)
                console.log('2 - APROVACAO TITULO', this.aprovacaoOk)
                if (!this.aprovacaoOk) {
                  // this.$snotify.clear()
                  // this.$snotify.error('Erro ao APROVAR nota: ' + nota.numeroNota + ' com o ERP. Favor verificar!', '', 10000)
                  this.nota.status = 'ERRO APROVAÇÃO ERP'
                  this.table.items[i].status = 'ERRO APROVAÇÃO ERP'
                  console.log('2 - APROVACAO TITULO(ERRO)', this.aprovacaoOk)
                  this.$forceUpdate()
                  this.loading.show = false
                  return
                } else {
                  this.$snotify.clear()
                  this.$snotify.success('Nota Aprovada no Sapiens com sucesso: ' + nota.numeroNota, '', 10000)
                  this.nota.status = 'APROVADO COM ERP - PENDENTE BAIXA'
                  this.table.items[i].status = 'APROVADO COM ERP - PENDENTE BAIXA'
                  console.log('2 - APROVACAO TITULO(OK)', this.aprovacaoOk)
                  this.$forceUpdate()
                }
              }
              // roda apenas um pra debugar
              return
              // Roda a Aprovação do Título
              // this.aprovacaoTitulo('A', nota)
              // Baixa o Título
              // this.baixaTitulo(nota)
            }
          }
          this.$snotify.clear()
          this.loading.show = false
          return
          // Pega cada nota que esteja com o status Pendente ou Erro
          // Faz a integração com o Sapiens
          // Roda a Aprovação do Título
          // Baixa o Título
          // Encerra a Tarefa
        },
        async sincronizarComSapiens (fkDocumentoLiberacao, fkProcesso) {
          console.log('sincronizarComSapiens', fkDocumentoLiberacao, fkProcesso)
          this.loading.tela = true
          let data = {
            idDocumentoLiberacao: fkDocumentoLiberacao,
            idProcesso: fkProcesso,
            idUsuario: this.usuarioLogado.id
          }
          await axiosLaravel.post('prestacaoSimplificada/integracaoGravaNotaFisica', data).then((response) => {
            console.log('RETORNOU OK', response.data)
            this.$snotify.clear()
            this.$snotify.success(response.data)
            this.notaOk = true
          })
            .catch((error) => {
              this.notaOk = false
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        criarSolicitacao (nota) {
          this.$snotify.async((nota.proximaEtapa === 'Salvar' ? 'Salvando' : 'Encaminhando') + ' Solicitação de ' + this.descricaoProcesso + '. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('prestacaoSimplificada/grava', nota).then((response) => {
            this.$snotify.clear()
            if (_.hasIn(response, 'error')) {
              this.$snotify.clear()
              this.$snotify.error(response.data.value.error[0], '', 10000)
            } else {
              this.gravaHistorico(response.data)
              this.$snotify.clear()
              if (nota.proximaEtapa === 'Salvar') {
                this.id = response.data.id
                this.$snotify.success('Gravado com sucesso. Relendo a solicitação...')
                this.$router.push(this.rotasProcesso[this.processo] + '/' + this.id)
              } else {
                this.$snotify.success('Solicitação encaminhada com sucesso!')
                this.$router.push('/solicitacao/solicitacao-prestacao-contas-simplificada')
              }
            }
            this.loading.show = false
          })
            .catch((error) => {
              console.log(error)
              this.loading.show = false
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        gravaHistorico (parm) {
          axiosLaravel.post('historico-tarefas/', parm).then((response) => {
          })
        },
        async aprovacaoTitulo (operacao, doc, fkDocumentoLiberacao) {
          console.log('APROVANDO TITULO...')
          this.$snotify.async('Processando ' + (operacao === 'A' ? 'aprovação' : 'desaprovação') + ' do título...', {timeout: 0})
          this.loading.tela = true
          await axiosLaravel.post('prestacaoSimplificada/tituloAprovarDesaprovar/', {'idProcesso': this.id, 'tipoOperacao': operacao, 'fk_documento_liberacao': fkDocumentoLiberacao, 'ds_login': this.usuarioLogado.ds_login, 'id_usuario': this.usuarioLogado.id}).then((response) => {
            this.$snotify.clear()
            this.aviso(response.data)
            if (response.data.codigo === 'ERRO') {
              // this.saiDaTela()
              this.loading.show = false
              this.aprovacaoOk = false
            }
            if (_.has(response.data, 'codigo') && _.includes(['OK', 'AVISO'], response.data.codigo)) {
              // Se o resultado da (des)aprovação do titulo for ok ou um aviso qualquer então pode continuar o processo
              // this.encaminharProximaTarefa(doc)
              this.loading.show = false
              this.aprovacaoOk = true
            }
          })
          .catch((error) => {
            this.aprovacaoOk = false
            this.$snotify.clear()
            this.loading.show = false
            console.log(error)
            this.$root.trataErro(error)
          })
        },
        baixaTitulo (doc) {
          this.$snotify.async('Baixando título de prestação contra adiantamento...', {timeout: 0})
          this.loading.tela = true
          axiosLaravel.post('prestacao_contas/adiantamento/baixa/', {'idProcesso': this.id, 'doc': doc}).then((response) => {
            this.aviso(response.data)
            if (response.data.codigo === 'ERRO') {
              this.saiDaTela()
            }
            if (_.has(response.data, 'codigo') && _.includes(['OK', 'AVISO'], response.data.codigo)) {
              // Se o resultado da baixa for ok ou um aviso qualquer, então pode continuar o processo
              this.$snotify.clear()
              this.encaminharProximaTarefa(doc)
            }
            // this.loading.tela = false
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
              this.loading.tela = false
            })
        },
        encaminharProximaTarefa (doc) {
          // Encaminha o processo para a próxima etapa do documento de liberação
          console.log('encaminharProximaTarefa (doc) >>>>', doc)
          this.loading.tela = true
          let msgProcessando = 'Salvando a solicitação...'
          let msgConclusao = 'Gravado com sucesso. Relendo a solicitação...'
          let msgExclusaoNota = (this.aprovacao.resultadoAprovacao === 'Revisão' || (this.aprovacao.resultadoAprovacao === 'Análise' && this.etapa !== 'Solicitação')) && this.possuiNotaSapiens ? ' e excluindo notas do ERP' : ''
          if (!_.isUndefined(this.aprovacao.resultadoAprovacao) && this.aprovacao.resultadoAprovacao !== 'Salvar') {
            msgProcessando = 'Encaminhando ' + (this.descricaoProcesso) + (_.isUndefined(this.aprovacao.resultadoAprovacao) ? '...' : ' para ' + this.aprovacao.resultadoAprovacao + msgExclusaoNota)
            msgConclusao = 'Encaminhado com sucesso!'
          }
          this.$snotify.async(msgProcessando, {timeout: 0})
          this.$forceUpdate()
          axiosLaravel.put('prestacaoSimplificada/encaminhaProximaTarefa/', doc).then((response) => {
            this.$snotify.clear()
            if (_.hasIn(response, 'error')) {
              this.$snotify.clear()
              this.$snotify.error(response.data.value.error[0], '', 10000)
            } else {
              this.gravaHistorico(response.data)
              this.$snotify.clear()
              this.$snotify.success(msgConclusao)
              if (_.get(this.aprovacao, 'resultadoAprovacao', '') !== 'Salvar') {
                this.$router.push('/solicitacao/solicitacao-prestacao-contas-simplificada')
              }
            }
          })
            .catch((error) => {
              this.loading.show = false
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        aviso (retorno) {
          if (_.has(retorno, 'codigo')) {
            let mensagem = (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) ? retorno.mensagem : 'Erro ao processar a requisição'
            if (retorno.codigo === 'ERRO') {
              this.$snotify.clear()
              this.$snotify.error(mensagem)
            } else {
              if (_.includes(['OK', 'AVISO'], retorno.codigo)) {
                this.$snotify.success(mensagem, {timeout: 30000})
              }
            }
          }
        },
        acertoValoresCronograma () {
          console.log('ACERTO VALORES CRONOGRAMA', this.notas)
          // Verifica se é uma solicitação nova ou já existe ID
          if (_.isNull(this.id)) {
            return
          }
          // let totalSolicitado = 0
          // Zera os valores solicitados no cronograma que tem notas
          this.notas.forEach((nota) => {
            this.cronograma.itens.forEach((item) => {
              if (item.Id_item === nota.itemOrcamento.Id_item) {
                item.Qtde_solicitado = 1
                item.Valor_solicitado = 0
              }
            })
          })

          this.notas.forEach((nota) => {
            console.log('NOTA', nota)
            this.cronograma.itens.forEach((item) => {
              if (item.Id_item === nota.itemOrcamento.Id_item) {
                item.Valor_saldo += nota.valor
                item.Valor_solicitado += nota.valor
              }
            })
          })
          this.totais.projeto.total.solicitado = _.sumBy(this.cronograma.itens, function (i) { return i.Valor_solicitado })
        }
      }
    }
  </script>
  
  <style src="../../../../static/css/prestacaoContasNovo.css">
  </style>
  