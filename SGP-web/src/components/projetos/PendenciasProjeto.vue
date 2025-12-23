<template>
  <div v-if="!encerrado">

    <div v-if="pendencias.cadastro !== null" class="alert alert-warning alert-dismissible">
    <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
    <h4><i class="fa fa-warning"></i> Atenção!</h4>
    <p>Atualização cadastral devolvida para ajuste:</p>
    <p>{{ respostaDevolucaoCadastro }}</p>
    </div>

     <div class="box" v-if="!numeroProjeto && loading.carregandoProjetos">
      <div class="box-header">
        <h3 class="box-title">Verificando pendências em projeto(s) ...</h3>
      </div>
    </div>

    <div class="box" id="pendencias_projeto" v-else-if="numeroProjeto || listaProjetos.length > 0 || !_.isEmpty(projeto)">

      <div class="box-header" v-if="!propsNumeroProjeto">

        <span v-if="listaProjetos.length > 1">
          <div v-show="loading.pendencias.mandatos || loading.pendencias.relatorios || loading.pendencias.itensOrcamento" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
          <div class="form-horizontal">
            <div class="form-group required-field">
              <label class="control-label col-md-2">Projeto:</label>
              <div class="col-md-10">
                <select v-model="configuracoes.numeroProjetoSelecionado" name="projeto" class="form-control" aria-hidden="true" @change="selecionaProjeto">
                  <option v-for="projeto in listaProjetos" :value="projeto.ds_codigo_projeto_erp" :selected="projeto.ds_codigo_projeto_erp === configuracoes.numeroProjetoSelecionado">{{projeto.ds_codigo_projeto_erp}} - {{projeto.ds_nome}}</option>
                </select>
              </div>
            </div>
          </div>
        </span>
        <span v-else-if="listaProjetos.length === 1">
          <h3 class="box-title">{{listaProjetos[0].ds_codigo_projeto_erp}} - {{listaProjetos[0].ds_nome}}</h3>
        </span>

      </div>


      <!-- Pendências do projeto ------------------------------------------------------------------------->
      <div class="box-body" id="pendencias" v-if="!_.isEmpty(projeto)">
        <div class="row">

          <div class="col-md-12">

            <!-- Mandatos ---------------------------------------->
            <div class="box box-widget">
              <div v-show="loading.pendencias.mandatos" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
              <div class="box-header">
                <h3 class="box-title">Mandatos
                  <i class="fa fa-external-link" @click="$router.push({name: 'cadastro-entidade-edita', params: { id: usuarioLogado.entidade.id }})" v-if="this.$root.authorize('minha-entidade-visualizar')"
                     :title="'<h5>Vai para a tela do Cadastro da Entidade</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                </h3>
              </div>

              <div class="box-body">
                <div class="col-md-8">
                  <table class="table table-condensed b0">
                    <tbody v-if="_.find(pendencias.mandatos, function (m) {return situacaoPendencia(m.fim_mandato) > -30} )">
                    <tr v-for="mandato in pendencias.mandatos" v-if="situacaoPendencia(mandato.fim_mandato) > -30">
                      <td class="esmaecido w20">{{mandato.cargo}}</td>
                      <td class="w30">{{mandato.nome}}</td>
                      <td class="realce w20"><strong>Término em {{mandato.fim_mandato | moment("L")}}</strong></td>
                      <td>
                        <span v-if="situacaoPendencia(mandato.fim_mandato) > 0" class="vencido">Vencido</span>
                        <span v-else-if="situacaoPendencia(mandato.fim_mandato) === 0" class="vence_hoje">Vence Hoje</span>
                        <span v-else-if="situacaoPendencia(mandato.fim_mandato) > -30" class="vence_breve">Vence em até 30 dias</span>
                      </td>
                    </tr>
                    </tbody>
                    <tbody v-else>
                      <tr><td>Não há mandatos vencidos ou a vencer nos próximos 30 dias</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


            <!-- Relatórios de Execução ---------------------------------------->
            <div class="box box-widget">
              <div v-show="loading.pendencias.relatorios" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
              <div class="box-header">
                <h3 class="box-title">Relatórios de Execução
                  <i class="fa fa-external-link" @click="$router.push({name: 'visualiza-relatorio-execucao', params: { id: projeto.id_projeto }})"
                   :title="'<h5>Vai para a tela do cronograma dos Relatórios de Execução</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                </h3>
              </div>

              <div class="box-body">
                <div class="col-lg-8 col-md-10 col-sm-12">

                  <table class="table table-condensed b0">
                    <tbody>
                    <template v-if="pendencias.relatorios.length > 0">
                      <template v-for="relatorio in relatorioDisponivel()">
                        <tr v-if="_.isNull(relatorio)"><td>Não há relatórios pendentes nem futuros para apresentar</td></tr>
                        <tr v-else>
                          <td class="esmaecido">{{relatorio.tipo}}</td>
                          <td  style="width: 110px">Relatório nº {{relatorio.sequencia}}</td>
                          <td class="realce"><strong>{{relatorio.situacao}}</strong></td>
                          <td style="width: 285px">
                            <span v-if="_.includes(['Não apresentado'], relatorio.situacao.substr(0, 15))" class="vencido">Limite para apresentação até {{relatorio.termino_concluir | moment("L")}}</span>
                            <span v-if="_.includes(['Pendente de pre'], relatorio.situacao.substr(0, 15))" class="vence_breve">Prazo regular para apresentação até {{relatorio.depois_30_final_ciclo | moment("L")}}</span>
                            <span v-if="_.includes(['Devolvido para '], relatorio.situacao.substr(0, 15))" class="vence_hoje">Rever o relatório</span>
                            <span v-if="_.includes(['Em análise pela'], relatorio.situacao.substr(0, 15))" class=""></span>
                            <span v-if="_.includes(['Fora do período'], relatorio.situacao.substr(0, 15)) && _.has(relatorio, 'antes_30_final_ciclo')" class="vence_breve">Ficará disponível a partir de {{relatorio.antes_30_final_ciclo | moment("L")}}</span>
                          </td>
                        </tr>
                      </template>
                    </template>
                    <template v-else><tr><td>Não foram enontrados relatórios de execução</td></tr></template>

                    </tbody>

                  </table>
                </div>
              </div>
            </div>


            <!-- Tarefas para Revisão da Entidade ---------------------------------------->
            <div class="box box-widget">
              <div v-show="loading.pendencias.revisoes" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
              <div class="box-header">
                <h3 class="box-title">Tarefas para Revisão
                  <i class="fa fa-external-link" @click="$router.push({name: 'solicitacao-lista'})"
                   :title="'<h5>Vai para a tela de Solicitações onde pode listar e visualizar as tarefas</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}"></i>
                </h3>
              </div>

              <div class="box-body">
                <div class="col-lg-8 col-md-10 col-sm-12">

                  <table class="table table-condensed b0">
                    <tbody>
                    <template v-if="pendencias.tarefasRevisao.length > 0">
                      <template v-for="tarefa in pendencias.tarefasRevisao">
                        <tr>
                          <td class="esmaecido">
                            {{ tarefa.id }}
                            <i class="fa fa-external-link" @click="$router.push({name: 'solicitacao-alteracoes-projeto', params: {id: tarefa.id}})"
                               v-if="_.includes(['ALTERACOES_PROJETO'], tarefa.nome)"
                               :title="'<h5>Vai direto para a solicitação ID ' + tarefa.id + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}"></i>
                          </td>
                          <td class="text-bold">{{ tarefa.processoTexto }}</td>
                          <td><span class="esmaecido">Criado em </span> {{ tarefa.inicioProcesso | moment("L") }}</td>
                          <td><span class="esmaecido">Revisão desde </span> {{ tarefa.inicioTarefa | moment("DD/MM/YYYY  HH:mm") }}</td>
                          <td>
                            <span v-if="!_.isNull(tarefa.valor)">{{ tarefa.valor | real }}</span>
                            <span v-else>&nbsp;</span>
                          </td>
                        </tr>
                      </template>
                    </template>
                    <template v-else><tr><td>Não foram enontradas tarefas para que faça a revisão da solicitação</td></tr></template>

                    </tbody>

                  </table>
                </div>
              </div>
            </div>

            <!-- Formulários de Avaliaçao de Projeto ---------------------------------------->
            <div class="box box-widget" v-if="loading.pendencias.avaliacoes || pendencias.avaliacoes.length > 0">
              <div v-show="loading.pendencias.avaliacoes" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
              <div class="box-header">
                <h3 class="box-title">Avaliação de Projeto</h3>
              </div>

              <div class="box-body">
                <div class="col-lg-8 col-md-10 col-sm-12">
                  <table class="table table-condensed b0">
                    <tbody>
                      <template v-for="avaliacao in avaliacaoDisponivel()">
                        <tr @click="$router.push({name: 'preenche-formulario', params: {id: avaliacao.acesso}})" style="cursor: pointer">
                          <td>
                            <i class="fa fa-external-link" :title="'<h5>Abre o formulário de Avaliação deste Projeto</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                          </td>
                          <td class="esmaecido" style="width: 120px">{{avaliacao.tipo}}</td>
                          <td>{{avaliacao.nome}}</td>
                          <td class="realce"><strong>{{avaliacao.situacao}}</strong></td>
                        </tr>
                        <tr @click="$router.push({name: 'preenche-formulario', params: {id: avaliacao.acesso}})" style="cursor: pointer">
                          <td>&nbsp;</td>
                          <td colspan="3" style="width: 225px"><span :class="avaliacao.info.classe" v-if="_.includes(['SOLICITACAO', 'REVISAO'], avaliacao.tarefaAtual)">{{ avaliacao.info.texto }}</span></td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>



            <!-- Itens do Orçamentos ---------------------------------------->
            <div class="box box-widget">
              <div v-show="loading.pendencias.itensOrcamento" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
              <div class="box-header">
                <h3 class="box-title">Itens do Orçamento não executados</h3>
              </div>

              <div class="box-body cronogramaff">
                <div class="col-lg-9 col-md-11 col-sm-12" v-if="_.find(pendencias.itensOrcamento, function (i) { return ('' + i.economicidade) === '0' && percentual(i.liberado, i.orcado) < 100 }) && !_.includes(['ENC', 'ESE'], projeto.situacao)">

                  <template v-for="(itensAtividades, origem) in _.groupBy(pendencias.itensOrcamento, 'origem')">

                    <table class="table table-condensed b0" v-if="_.find(itensAtividades, function (i) { return ('' + i.economicidade) === '0' && percentual(i.liberado, i.orcado) < 100 })">
                      <tbody>
                      <tr>
                        <td class="text-bold">{{origem}}</td>
                        <td class="esmaecido">&nbsp;</td>
                        <td class="esmaecido">&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>

                      <template v-for="(itens, atividadeId) in _.groupBy(itensAtividades, 'id_atividade')">

                        <tr class="atividade" :id="'atividadeId' + atividadeId" @click="mostraAtividade(itens)" v-if="_.find(itens, function(i) { return ('' + i.economicidade) === '0' && percentual(i.liberado, i.orcado) < 100 })">
                          <td class="esquerda celula b1 b3 b4 nome_atividade"><i aria-hidden="true" :class="'fa fa-caret-' + (itens[0]['mostrar'] ? 'up' : 'down')"></i>  {{itens[0].descricao_atividade}}</td>
                          <td class="centralizado celula b1 b3 b4 w10" :title="'<h5>Início da atividade</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{periodoParaMesAno(itens[0].inicio_atividade,  projeto.inicio, 'MMMM/YYYY')}}</td>
                          <td class="centralizado celula b1 b3 b4 w10" :title="'<h5>Término da atividade</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{periodoParaMesAno(itens[0].termino_atividade, projeto.inicio, 'MMMM/YYYY')}}</td>
                          <td class="centralizado celula b1 b3 b2" style="font-weight: normal; width: 260px">
                            <span v-if="dataParaPeriodo(hoje, projeto.inicio) > itens[0].termino_atividade" class="vencido">
                              Atividade não concluída no prazo
                            </span>
                          </td>
                        </tr>

                        <template v-for="item in itens" v-if="('' + item.economicidade) === '0' && percentual(item.liberado, item.orcado) < 100 && item.mostrar">
                          <tr :id="'itemId_' + item.id">
                            <td class="celula b3 b4">
                              <div class="item">
                                <div class="text-bold esquerda">{{item.item}}</div>
                                <div class="observacao esquerda">
                                  <span class=id_item>#{{item.id}}</span>
                                  <span>{{item.observacao}}</span>
                                </div>
                              </div>
                            </td>

                            <td class="centralizado celula b3" :title="'<h5>Valor orçado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{ item.orcado | decimal2 }}</td>
                            <td class="centralizado celula b3" :title="'<h5>Valor liberado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{ item.liberado | decimal2 }}</td>
                            <td class="centralizado celula b3 b2">
                              <span class="realce">{{('' + item.economicidade) === '1' ? 100 : percentual(item.liberado, item.orcado) }}%</span>
                            </td>
                          </tr>

                        </template>

                      </template>

                      </tbody>

                    </table>

                  </template>

                </div>

                <div v-else class="col-md-8">Não há itens de orçamento pendentes para liberar{{ _.includes(['ENC', 'ESE'], projeto.situacao) ? '. Projeto encerrado' : '' }}</div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>



<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    components: {
    },
    name: 'visualiza-pendencias-projeto',
    data () {
      return {
        loading: {
          situacao: false,
          carregandoProjetos: false,
          pendencias: {
            mandatos: true,
            relatorios: true,
            avaliacoes: true,
            revisoes: true,
            cadastro: true,
            itensOrcamento: true
          }
        },
        encerrado: false,
        respostaDevolucaoCadastro: '',
        hoje: new Date(),
        numeroProjeto: undefined,
        projeto: {},
        listaProjetos: [],
        configuracoes: {
          numeroProjetoSelecionado: null
        },
        pendencias: {
          mandatos: [],
          relatorios: [],
          avaliacoes: [],
          tarefasRevisao: [],
          cadastro: null,
          itensOrcamento: []
        }
      }
    },
    props: ['propsNumeroProjeto'],
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
    },
    mounted () {
    },
    created () {
      if (_.has(this.usuarioLogado, 'configuracoes') && _.has(this.usuarioLogado.configuracoes, 'pendencias_projeto')) {
        this.configuracoes = this.usuarioLogado.configuracoes.pendencias_projeto
      }
      this.numeroProjeto = this.propsNumeroProjeto
      if (this.numeroProjeto) {
        this.carregaPendencias()
      } else {
        this.carregarListaProjetos()
      }
    },
    methods: {

      carregaPendencias () {
        if (typeof Storage !== 'undefined' && _.isEmpty(_.get(JSON.parse(window.localStorage.getItem('projetos')), 'lista', []))) {
          // Não carregar nada, pois não tem projetos
        } else {
          this.loading.pendencias.mandatos = true
          axiosLaravel.get('atividade/pendencias/mandatos/' + this.numeroProjeto).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              this.pendencias.mandatos = response.data.retorno
            }
            this.loading.pendencias.mandatos = false
          })
            .catch((error) => {
              this.loading.pendencias.mandatos = false
              this.$root.trataErro(error)
            })
          // ------------------------------------------------------------------
          this.loading.pendencias.relatorios = true
          axiosLaravel.get('atividade/pendencias/relatorios/' + this.numeroProjeto).then((response) => {
            if (_.has(response.data, 'situacao') && response.data.situacao === 'OK') {
              console.log('relatorio', response)
              this.pendencias.relatorios = response.data.dados.row
              // _.set(this.pendencias.relatorios[0], 'situacao', 'Devolvido para ajustes') // TODO excluir
              // _.set(this.pendencias.relatorios[1], 'antes_30_final_ciclo', '2021-09-10') // TODO excluir
            }
            this.loading.pendencias.relatorios = false
          })
            .catch((error) => {
              this.loading.pendencias.relatorios = false
              this.$root.trataErro(error)
            })
          // ------------------------------------------------------------------
          this.loading.pendencias.avaliacoes = true
          axiosLaravel.get('atividade/pendencias/avaliacoes/' + this.numeroProjeto).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              this.pendencias.avaliacoes = response.data.retorno
            }
            this.loading.pendencias.avaliacoes = false
          })
            .catch((error) => {
              this.loading.pendencias.avaliacoes = false
              this.$root.trataErro(error)
            })
          // ------------------------------------------------------------------
          this.loading.pendencias.itensOrcamento = true
          axiosLaravel.get('atividade/pendencias/orcamento/' + this.numeroProjeto).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              this.pendencias.itensOrcamento = response.data.retorno
              this.pendencias.itensOrcamento.forEach((item) => {
                item['mostrar'] = false
              })
            }
            this.loading.pendencias.itensOrcamento = false
          })
            .catch((error) => {
              this.loading.pendencias.itensOrcamento = false
              this.$root.trataErro(error)
            })
          // ------------------------------------------------------------------
          this.loading.pendencias.cadastro = true
          console.log('resposta pendencia cadastro')
          axiosLaravel.get('atividade/pendencias/cadastro/' + this.usuarioLogado.entidade.id).then((response) => {
            let responseData = null
            if (typeof response.data === 'string' && response.data.includes('HTTP/')) {
              const jsonString = response.data.substring(response.data.indexOf('{'))
              try {
                responseData = JSON.parse(jsonString)
              } catch (e) {
                console.error('Falha ao fazer o parse do JSON extraído da resposta.', e)
                this.loading.pendencias.cadastro = false
                return
              }
            } else {
              responseData = response.data
              console.log('resposta pendencia cadastro resposta', response)
            }
            if (_.has(responseData, 'codigo') && responseData.codigo === 'OK') {
              this.pendencias.cadastro = responseData.retorno
              this.respostaDevolucaoCadastro = responseData.retorno
              console.log('resposta pendencia cadastro', this.pendencias.cadastro)
            }
            this.loading.pendencias.revisoes = false
          })
            .catch((error) => {
              this.loading.pendencias.revisoes = false
              console.error('Tipo: Erro de Resposta do Servidor')
              console.error('Status HTTP:', error.response.status)
              console.error('Dados da Resposta:', error.response.data)
            })          // ------------------------------------------------------------------
          this.loading.pendencias.revisoes = true
          axiosLaravel.get('atividade/pendencias/revisoes/' + this.numeroProjeto).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              console.log('resposta revisoes resposta', response)
              this.pendencias.tarefasRevisao = response.data.retorno
            }
            this.loading.pendencias.revisoes = false
          })
            .catch((error) => {
              this.loading.pendencias.revisoes = false
              this.$root.trataErro(error)
            })
          // ------------------------------------------------------------------
          axiosLaravel.get('atividade/pendencias/projeto/' + this.numeroProjeto).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              this.projeto = response.data.retorno[0]
            }
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      },

      situacaoPendencia (data, tolerancia) {
        let dias = Math.trunc(moment().diff(moment(data)) / 86400000)
        return dias
      },
      mostraAtividade (itens) {
        itens.forEach((item) => {
          item['mostrar'] = !item['mostrar']
        })
        this.$forceUpdate()
      },
      relatorioDisponivel () {
        let vm = this
        let relatoriosAbertos = _.filter(this.pendencias.relatorios, function (rel) { return _.includes(['Pendente de pre', 'Não apresentado', 'Em análise pela', 'Devolvido para '], rel.situacao.substr(0, 15)) })
        let relatoriosForaPeriodoFuturos = _.filter(this.pendencias.relatorios, function (rel) { return _.includes(['Fora do período'], rel.situacao.substr(0, 15)) && vm.situacaoPendencia(rel.antes_30_final_ciclo) < 0 })
        let saida = [relatoriosAbertos.length > 0 ? _.head(relatoriosAbertos) : (relatoriosForaPeriodoFuturos.length > 0 ? _.head(relatoriosForaPeriodoFuturos) : null)]
        return saida
      },
      avaliacaoDisponivel () {
        let saida = []
        this.pendencias.avaliacoes.forEach((avaliacao) => {
          if (avaliacao.processo.situacao === 'EM_EXECUCAO') {
            let descricaoSituacao = 'XYZ' // TODO trocar depois de testar
            if (avaliacao.processo.ultimaTarefa.nome === 'SOLICITACAO') {
              descricaoSituacao = avaliacao.formulario.length === 0 ? 'Não iniciado' : 'Em preenchimento, mas não enviado ainda'
            } else {
              descricaoSituacao = avaliacao.processo.ultimaTarefa.nome === 'ANALISE' ? 'Em Análise na FBB' : (avaliacao.processo.ultimaTarefa.nome === 'REVISAO' ? 'Em revisão da entidade parceira' : 'Situação não informada')
            }
            // let limiteTerminoVigencia = '2020-11-28' // TODO não tem vigencia no objeto this.projeto mas tem no this.pendencias.relatorios[0]
            let limiteInicioProjeto = moment(this.projeto.inicio).add(_.toSafeInteger(avaliacao.cadastro.opcoes.periodicidade), 'month')
            let limiteTerminoProjeto = moment(this.projeto.termino).subtract(_.toSafeInteger(avaliacao.cadastro.opcoes.periodicidade), 'month')
            let infoPrazo = {texto: '', classe: ''}
            if (moment().isBefore(limiteInicioProjeto)) {
              infoPrazo.texto = 'Preencha o formulário de avaliação do projeto até ' + limiteInicioProjeto.format('DD/MM/YYYY')
              infoPrazo.classe = 'vence_breve'
            } else if (moment().isBefore(limiteTerminoProjeto)) {
              infoPrazo.texto = 'Ainda não preencheu o formulário de avaliação do projeto, tem até ' + limiteTerminoProjeto.format('DD/MM/YYYY')
              infoPrazo.classe = 'vence_hoje'
            } else {
              infoPrazo.texto = 'Este formulário de avaliação somente ficará disponível até ' + moment(this.projeto.termino).format('DD/MM/YYYY')
              infoPrazo.classe = 'venchaveAcessocido'
            }
            let tipoFormularioAvaliacao = avaliacao.cadastro.tipo === 'AVALIACAO_APROVACAO' ? 'Marco zero' : (avaliacao.cadastro.tipo === 'AVALIACAO_ENCERRAMENTO' ? 'Marco um' : (avaliacao.cadastro.tipo === 'AVALIACAO_GENERICO' ? 'Genérico' : 'Participante'))
            let chaveAcesso = _.split(avaliacao.link_acesso, '-')[_.includes(['SOLICITACAO', 'REVISAO'], avaliacao.processo.ultimaTarefa.nome) ? (avaliacao.formulario.length === 0 ? 0 : 1) : 2]
            saida.push({ acesso: chaveAcesso, tipo: tipoFormularioAvaliacao, nome: avaliacao.cadastro.nome, situacao: descricaoSituacao, info: infoPrazo, tarefaAtual: avaliacao.processo.ultimaTarefa.nome })
          }
        })
        return saida
      },
      periodoParaMesAno (periodo, inicioProjeto, formato) {
        return moment(inicioProjeto).add(periodo - 1, 'month').format(formato)
      },
      dataParaPeriodo (data, inicioProjeto) {
        const dataAjustada = moment(data).format('YYYY-MM-01')
        const inicioAjustado = moment(inicioProjeto).format('YYYY-MM-01')
        return moment(dataAjustada).diff(moment(inicioAjustado), 'month') + 1
      },
      carregarListaProjetos () {
        if (typeof Storage !== 'undefined' && _.isEmpty(_.get(JSON.parse(window.localStorage.getItem('projetos')), 'lista', []))) {
          // Não carregar nada, pois não tem projetos
        } else {
          this.loading.carregandoProjetos = true
          axiosLaravel.get('projetos').then((response) => {
            // Limitar acesso a projetos
            let listaProjetos = _.filter(response.data, function (projeto) { return _.has(projeto, 'ds_codigo_projeto_erp') && !_.isNull(projeto.ds_codigo_projeto_erp) && projeto.sitprj !== 'ENC' })
            let acessosProjetos = _.get(this.usuarioLogado, 'configuracoes.acesso_projetos')
            if (acessosProjetos) {
              acessosProjetos.forEach((projeto) => {
                if (_.find(projeto.acesso, ['codigo', 'SEM_ACESSO'])) {
                  _.remove(listaProjetos, ['ds_codigo_projeto_erp', projeto.numero])
                }
              })
            }
            this.listaProjetos = listaProjetos
            // TODO setar o projeto gravado nas configurações
            if (_.has(this.configuracoes, 'numeroProjetoSelecionado') && _.isNull(this.configuracoes.numeroProjetoSelecionado)) {
              if (_.find(this.listaProjetos, ['ds_codigo_projeto_erp', this.configuracoes.numeroProjetoSelecionado])) {
                this.configuracoes.numeroProjetoSelecionado = _.head(_.sortBy(this.listaProjetos, ['ds_codigo_projeto_erp']))['ds_codigo_projeto_erp']
              }
            }
            this.configuracoes.numeroProjetoSelecionado = _.head(_.sortBy(this.listaProjetos, ['ds_codigo_projeto_erp']))['ds_codigo_projeto_erp']
            this.loading.carregandoProjetos = false
            this.selecionaProjeto()
          })
            .catch((error) => {
              this.loading.carregandoProjetos = false
              this.$root.trataErro(error)
            })
        }
      },
      selecionaProjeto () {
        this.numeroProjeto = this.configuracoes.numeroProjetoSelecionado
        console.log('selecionaProjeto', this.numeroProjeto)
        this.carregaPendencias()
        this.salvarConfiguracoes()
      },
      percentual (valor, base, decimais = 0, limitar = true) {
        let percentagem = parseFloat(base) === 0 ? 0 : (parseFloat(valor) / parseFloat(base)) * 100
        if (limitar) {
          percentagem = percentagem < 0 ? 0 : (percentagem > 100 ? 100 : percentagem)
        }
        return percentagem.toFixed(decimais)
      },
      configuracaoPadrao () {
        this.configuracoes = {numeroProjetoSelecionado: null}
        this.salvarConfiguracoes()
      },
      salvarConfiguracoes () {
        _.set(this.usuarioLogado, 'configuracoes.pendencias_projeto', this.configuracoes)
        axiosLaravel.post('/usuario/configuracoes', {'configuracoes': this.usuarioLogado.configuracoes}).then((response) => {
          console.log('configuracoes', this.usuarioLogado.configuracoes)
        })
          .catch((error) => {
            if (error) {
              console.log('error', error)
              this.$root.trataErro(error)
            }
          })
      }
    }

  }
</script>

<style>

  #pendencias_projeto {
    position: relative;
  }

  #pendencias_projeto .esmaecido {
    color: var(--cor-fraca);
  }

  #pendencias_projeto .realce {
    color: var(--cor-azul);
  }



  /* Seção de Pendências  *********************/
  #pendencias_projeto #pendencias tr.atividade:hover {
    cursor: pointer;
    color: var(--cor-destaque);
  }

  #pendencias_projeto #pendencias .vencido {
    color: white;
    background: firebrick;
    padding: 1px 15px;
    border-radius: 20px;
  }

  #pendencias_projeto #pendencias .vence_breve {
    color: white;
    background: #e2ab3a;
    padding: 1px 15px;
    border-radius: 20px;
  }

  #pendencias_projeto #pendencias .vence_hoje {
    color: white;
    background: #e2810a;
    padding: 1px 15px;
    border-radius: 20px;
  }

  #pendencias_projeto #pendencias .b0 td {
    border: 0px;
  }

  #pendencias_projeto #pendencias table {
    margin-bottom: 0px;
  }

  #pendencias_projeto #pendencias .fa-external-link {
    cursor: pointer;
    font-size: small;
    color: var(--cor-azul);
  }

  #pendencias_projeto #pendencias .id_item {
    color: var(--cor-destaque) !important;
    font-style: italic;
    margin-right: 10px;
  }


</style>
