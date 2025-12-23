<template>
  <div class="content-wrapper" style="min-height: 870px;">

      <section class="content-header">
        <h1>
          Plano de Trabalho
          <span v-if="!loading.tela">
            <g-button-ujarak color="warning" @click.native="imprimirRelatorio" size="button--size-ss"><i class="fa fa-print" aria-hidden="true"></i> Imprimir </g-button-ujarak>
            <g-button-ujarak color="error" @click.native="closewindow" size="button--size-ss"><i class="fa fa-sign-out" aria-hidden="true"></i> Sair do relatório </g-button-ujarak>
          </span>
        </h1>
        <!--<b-breadcrumb :items="[{text: 'Validação', href: '/'}, {text: 'Alterações de projetos', href: '/validacao/validacao-solicitacao/ALTERACOES_PROJETOS'}, {text: 'Plano de Trabalho', active: true}]"/>-->
      </section>


      <section class="content">
        <div class="row" id="planoTrabalho">
          <div class="col-md-12">
            <div class="box box-primary">
              <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

              <!--------------------------------------------------------------------------------------------------------------------------------------------------->

              <div id="guiaDadosCadastrais">

                <table class="w100 imprimir">
                  <tr>
                    <td><img src="/static/img/logo-login.png" class="logo_relatorio"></td>
                    <td></td>
                    <td class="direita">
                      <span style="font-size: 40px !important">Plano de Trabalho</span>
                    </td>
                  </tr>
                </table>

                <!-- Resumo do Projeto -->
                <div class="box-body">
                  <label class="control-label">Dados Cadastrais</label>
                  <div>
                    <table class="table table-condensed table-bordered m0">
                      <tbody>
                      <tr>
                        <td class="cabecalho w30">Projeto</td>
                        <td class="ressaltar">{{(_.has(proposta, 'ds_codigo_projeto_erp') && !_.isNull(proposta.ds_codigo_projeto_erp) ? proposta.ds_codigo_projeto_erp + ' - ' : ' ') +  proposta.ds_nome}}</td>
                      </tr>
                      </tbody>
                    </table>

                    <table class="table table-condensed table-bordered m0">
                      <tbody>
                      <tr>
                        <td class="cabecalho w30">Recursos do Projeto</td>
                        <td class="ressaltar">{{proposta.totalProjeto | real}}</td>
                      </tr>
                      </tbody>
                    </table>

                    <table class="table table-condensed table-bordered">
                      <thead>
                      <tr><th class="cabecalho">Fundação</th><th class="cabecalho">Proponente</th><th class="cabecalho">Terceiros</th></tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td class="ressaltar">{{proposta.totalFBB | real}}</td>
                        <td class="ressaltar">{{proposta.totalCtrp | real}}</td>
                        <td class="ressaltar">{{proposta.totalParc | real}}</td>
                      </tr>
                      </tbody>
                    </table>

                    <span v-if="loading.cidade" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando municípios ...</span>
                    <span v-else>
                      <table class="table table-condensed table-bordered m0">
                        <thead>
                        <tr><th colspan="2" class="cabecalho">Municípios de Desenvolvimento do Projeto</th></tr>
                        </thead>
                        <tbody>
                        <tr v-for="municipio in _.groupBy(proposta.municipalizacao, function (m) { return m.ds_municipio + '/' + m.ds_uf })">
                          <td class="ressaltar">{{municipio[0].ds_municipio}}</td>
                          <td class="ressaltar w10">{{municipio[0].ds_uf}}</td>
                        </tr>
                        </tbody>
                      </table>

                      <table class="table table-condensed table-bordered m0">
                        <tbody>
                        <tr>
                          <td class="cabecalho">Número de Participantes Diretos do Projeto</td>
                          <td class="ressaltar w10">{{_.sumBy(proposta.publicos_alvo, function (p) { return parseInt(p.nr_participantes_diretos) })}} pessoas</td>
                        </tr>
                        </tbody>
                      </table>
                    </span>

                  </div>
                </div>

                <!-- Entidade -->
                <span v-if="loading.entidade" class="etiquetaCarregando"><div class="box-body"><i class="fa fa-refresh fa-spin"></i> Carregando entidade ...</div></span>
                <span v-else>
                  <div class="box-body" v-if="_.has(proposta, 'entidade')">
                    <label class="control-label">Convenente</label>
                    <div>
                      <table class="table table-condensed table-bordered m0">
                        <tbody>
                        <tr>
                          <td class="cabecalho w30">Nome</td>
                          <td class="ressaltar">{{proposta.entidade.ds_nome}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">CNPJ</td>
                          <td class="ressaltar">{{proposta.entidade.ds_cnpj | cnpj}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Natureza Jurídica</td>
                          <td class="ressaltar">{{formaJuridica}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">E-mail</td>
                          <td class="ressaltar">{{proposta.entidade.ds_email}}</td>
                        </tr>
                        <tr v-if="proposta.entidade.contato">
                          <td class="cabecalho">Contato</td>
                          <td class="ressaltar" v-if="proposta.entidade && !_.isEmpty(proposta.entidade.contato)"><span proposta.entidade.contato.ds_telefone>{{proposta.entidade.contato.ds_telefone | telefone}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span proposta.entidade.contato.ds_celular>{{proposta.entidade.contato.ds_celular | telefone}}</span></td>
                        </tr>
                        </tbody>
                      </table>

                      <table class="table table-condensed table-bordered m0">
                        <thead>
                        <tr>
                          <th v-if="proposta.entidade.endereco" class="cabecalho">Endereço{{(proposta.entidade.endereco.length > 1 ? 's' : '')}}</th>
                          <th class="cabecalho">Número</th>
                          <th class="cabecalho">Bairro</th>
                          <th class="cabecalho">Complemento</th>
                          <th class="cabecalho">Cidade</th>
                          <th class="cabecalho centralizado">UF</th>
                          <th class="cabecalho centralizado">CEP</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="endereco in proposta.entidade.endereco">
                          <td class="ressaltar">{{endereco.ds_rua}}</td>
                          <td class="ressaltar">{{endereco.ds_numero}}</td>
                          <td class="ressaltar">{{endereco.ds_bairro}}</td>
                          <td class="ressaltar">{{endereco.ds_complemento}}</td>
                          <td class="ressaltar">{{endereco.ds_cidade}}</td>
                          <td class="ressaltar centralizado">{{endereco.ds_estado}}</td>
                          <td class="ressaltar centralizado">{{endereco.ds_cep | cep}}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </span>



                <!-- Lista de Dirigentes -->
                <span v-if="loading.entidade" class="etiquetaCarregando"><div class="box-body"><i class="fa fa-refresh fa-spin"></i> Carregando representante legal ...</div></span>
                <span v-else>
                  <div class="box-body m0">
                  <div class="w100 m0">
                    Representante Legal da Entidade (que assina pela entidade e tem mandato vigente)
                  </div>
                  <div v-for="dirigente in dirigentes">
                    <table class="table table-condensed table-bordered lista w100 m0">
                      <tbody v-if="dirigente.cargo">
                      <tr>
                        <td class="cabecalho">Nome</td>
                        <td class="ressaltar w30">{{dirigente.ds_nome}}</td>
                        <td class="cabecalho">Cargo</td>
                        <td class="ressaltar">{{dirigente.cargo.ds_descricao}}</td>
                        <td class="cabecalho">CPF</td>
                        <td class="ressaltar">{{dirigente.ds_cpf | cpf}}</td>
                        <td class="cabecalho">Final do Mandato</td>
                        <td class="ressaltar">{{dirigente.dt_fim_mandato | moment("L")}}</td>
                      </tr>
                      <tr>
                        <td class="cabecalho">RG</td>
                        <td class="ressaltar">{{dirigente.ds_rg}} - {{dirigente.ds_orgao_emissor}}/{{dirigente.ds_uf}}</td>
                        <td class="cabecalho">Estado Civil</td>
                        <td class="ressaltar">{{_.has(dirigente, 'ds_estado_civil') ? _.get(estadoCivil, dirigente.ds_estado_civil) : ''}}</td>
                        <td class="cabecalho">Profissão</td>
                        <td class="ressaltar">{{dirigente.ds_profissao}}</td>
                        <td class="cabecalho">Telefone</td>
                        <td class="ressaltar" v-if="dirigente.contato">{{dirigente.contato.ds_telefone | telefone}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                </span>

                <!-- Objeto -->
                <div class="box-body">
                  <label class="control-label">Objeto</label>
                  <div v-html="proposta.ds_objetivo_geral" class="caixa_texto"></div>
                </div>

                <!-- Período de Realização do Projeto -->
                <div class="box-body">
                  <label class="control-label">Prazo de Execução / Previsão de Início e Fim da Execução do Objeto</label>
                  <table class="table table-condensed table-bordered m0">
                    <tbody>
                    <tr>
                      <td class="ressaltar">
                        {{this.dataInicioExecucao | moment('MM/YYYY')}}  a  {{this.dataFimExecucao}}  ({{proposta.nr_periodos}} meses)
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>

              </div><!-- Guia de Dados Cadastrais -->

              <!-------------><div class="quebraPagina">&nbsp;</div><!-------------------------------------------------------------------------------------------------->

              <div id="guiaMetas">

                <span v-if="loading.tela" class="etiquetaCarregando"><div class="box-body"><i class="fa fa-refresh fa-spin"></i> Carregando Objetivos, Metas e Atividades ...</div></span>
                <span v-else>
                  <div v-if="proposta.projetoAprovado" class="nao_imprimir">

                    <!--Objetivos Específicos ------------>
                    <div v-if="mostrarRef('objetivo_especifico')" ref="objetivos">
                      <div class="box box-widget">
                        <objetivo-especifico :editavel="false" :propsObjetivos="proposta.objetivos" :propsProposta="proposta" @objetivoAdicionado="proposta.objetivos = $event"></objetivo-especifico>
                      </div>
                    </div>

                    <!--Metas ---------------------------->
                    <!-- TODO excluir coluna de Ações ------------------------->
                    <div v-if="mostrarRef('metas')" ref="metas">
                      <div class="box box-widget">
                        <metas :propsObjetivos="proposta.objetivos" :propsMetas="proposta.metas" :propsProposta="proposta" @metaAdicionada="proposta.metas = $event" :atvSemMetas="atvSemMetas"></metas>
                      </div>
                    </div>

                    <!--Atividades ----------------------->
                    <div v-if="mostrarRef('atividades')" ref="atividades">
                      <div class="box box-widget">
                        <atividades :meses="proposta.nr_periodos" :propsMetas="proposta.metas" :propsAtividades="proposta.atividades" :propsProposta="proposta" @atividadeAdicionada="proposta.atividades = $event"></atividades>
                      </div>
                    </div>

                  </div>

                  <div :class="proposta.projetoAprovado ? 'imprimir' : ''">

                    <!-- Objetivos, Metas e Atividades ----------------------->
                    <div class="box-body">
                      <label class="control-label">Objetivos, Metas e Atividades</label>
                      <div>

                        <table class="table table-condensed m0 obj_met_atv">
                          <tbody>
                          <!-- Objetivos ----------------------->
                          <template v-for="(objetivo, idxObjetivo) in proposta.objetivos">
                            <tr class="objetivo">
                              <td colspan="2" v-if="objetivo.ds_descricao"><span class="tag">objetivo</span>{{objetivo.ds_descricao}}</td>
                            </tr>

                            <!-- Metas ----------------------->
                            <template v-for="(meta, idxMeta) in proposta.metas" v-if="_.find(meta.objetivos, function(o) { return o.ds_descricao === objetivo.ds_descricao })">
                              <tr class="meta">
                                <td v-if="meta.ds_descricao"><span class="tag vertical">meta</span>{{meta.ds_descricao}}</td>
                                <td><span class="ressaltar">{{meta.nr_quantidade}} {{meta.ds_unidade_medida}}</span> e indicar a execução como <span class="ressaltar">{{meta.ds_indicadores_execucao}}</span></td>
                              </tr>

                              <!-- Atividades ---------------->
                              <template v-for="(atividade, idxAtividade) in proposta.atividades" v-if="_.find(atividade.metas, function(m) { return m.ds_descricao === meta.ds_descricao })">
                                <tr class="atividade">
                                  <td v-if="atividade.descricao"><span class="tag vertical">atividade</span>{{atividade.descricao}}</td>
                                  <td>Executar
                                    <span v-if="atividade.inicio === atividade.termino"> no {{atividade.inicio}}º </span>
                                    <span v-else> do {{atividade.inicio}}º  ao  {{atividade.termino}}º </span>
                                    mês e comprovar com <span class="ressaltar">{{atividade.ds_documento_comprobatorio}}</span></td>
                                </tr>
                              </template>

                              <!-- Quando Não houver Atividades para a Metas-->
                              <template v-if="!haObjetivoMeta(proposta.atividades, 'metas', meta.ds_descricao)">
                                <tr class="atividade atencao"><td colspan="2">* Não há atividades para a Meta acima</td></tr>
                              </template>

                            </template>

                            <!-- Quando Não houver Metas para o Objetivo-->
                            <template v-if="!haObjetivoMeta(proposta.metas, 'objetivos', objetivo.ds_descricao)">
                              <tr class="meta atencao"><td colspan="2">* Não há metas para o Objetivo acima</td></tr>
                            </template>

                          </template>

                          </tbody>

                        </table>

                      </div>

                    </div>

                  </div>
                </span>

              </div><!-- Guia de Objetivos, Metas e Atividades -->

              <!-------------><div class="quebraPagina">&nbsp;</div><!-------------------------------------------------------------------------------------------------->

              <div id="guiaCronogramaAtividades">

                <!--Cronograma de Execução das atividades-->
                <div class="box-body">
                  <label class="control-label">Cronograma de Execução das Atividades</label>
                  <table class="table table-condensed">
                    <thead>
                    <tr>
                      <th class="cabecalho w40 b1 b4">Atividade</th>
                      <th class="cabecalho direita w10 b1">Valor total</th>
                      <th class="centralizado b1 b2 b4" v-bind:style="'zoom:' + ganttZoom" v-for="mes in _.range([start=0], (proposta.nr_periodos || 0), [step=1])" >{{mes + 1}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="atividade in _.get(proposta, 'atividades', [])">
                      <td class="ressaltar b3 b4">{{atividade.ds_nome}}</td>
                      <td class="direita b3">{{_.sumBy(atividade.itens_orcamentos, function(a) { return a.valor_total }) | real}}</td> 
                      <td class="centralizado b2 b3 b4" v-for="m in _.range([start=0], proposta.nr_periodos, [step=1])" v-bind:style="(m >= (atividade.inicio -1) && m <= (atividade.termino - 1)) ? 'background: gray !important' : ''">
                      <span v-if="(m >= (atividade.inicio -1) && m <= (atividade.termino - 1))" v-bind:style="'zoom:' + ganttZoom + '; color: gray'">
                        <i class="fa fa-circle"></i>
                      </span>
                        <span v-else>&nbsp;</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <div v-if="periodoMesAno.length > 0">
                    Referência: 1º mês do projeto em <span class="ressaltar">{{_.head(periodoMesAno)['mes']+ '/'+ _.head(periodoMesAno)['ano']}}</span>
                    e {{periodoMesAno.length}}º (último) mês do projeto em <span class="ressaltar">{{_.last(periodoMesAno)['mes'] + '/' + _.last(periodoMesAno)['ano']}}</span>
                  </div>


                  <!-- Operacionalização -->
                  <div class="box-body">
                    <label class="control-label">Operacionalização</label>
                    <div v-html="_.get(proposta, 'ds_operacao', '')" class="caixa_texto"></div>
                  </div>

                </div>

              </div><!--Guia Cronograma Atividades -->

              <!-------------><div class="quebraPagina">&nbsp;</div><!-------------------------------------------------------------------------------------------------->

              <div id="guiaRecursosFinanceiros">

                <!-- Orçamento FF do projeto -->
                <div class="box-body">
                  <label class="control-label">Plano de Aplicação dos Recursos Financeiros</label>
                  <table class="w100">
                    <thead>
                    <tr>
                      <th class="cabecalho">Atividade / Recursos (itens do cronograma)</th>
                      <th colspan="2" class="cabecalho centralizado">Período<br/>Início / Fim</th>
                      <th class="cabecalho centralizado">Qtde</th>
                      <th class="cabecalho centralizado">Valor Unitário</th>
                      <th class="cabecalho centralizado">Valor Total</th>
                    </tr>
                    </thead>
                    <tbody>

                    <!-- Itens -->
                    <template v-for="atividade in proposta.atividades">

                      <tr class="" style="font-weight: bold">
                        <td class="esquerda nome_atividade bl1 bl3 bl4">{{atividade.ds_nome}}</td>
                        <td class="centralizado bl1 bl3">{{atividade.nr_periodo_inicial}}</td>
                        <td class="centralizado bl1 bl3">{{atividade.nr_periodo_final}}</td>
                        <td colspan="3" class="direita bl1 bl2 bl3">{{somarTotalAtividade(atividade) | real}}</td>
                      </tr>
                      <tr v-for="item in atividade.itens_orcamentos">
                        <template>
                          <td class="bl4 b3">
                            <span class="">
                              <span v-if="('' + item.origem).substr(0, 1) === '1'">Fundação</span>
                              <span v-else-if="('' + item.origem).substr(0, 1) === '2'">Contrapartida</span>
                              <span v-else-if="('' + item.origem).substr(0, 1) === '5'">P.Estratégico</span>
                              <span v-if="('' + item.adiantavel).substr(0, 1) === '1'" class="adiantavel"> (Adiantável)</span>
                            </span>

                            <span class="esmaecido">({{_.upperFirst(_.lowerCase(item.item.ds_type))}})  {{item.item.ds_code + ' / ' + item.item.ds_description}}</span>
                            <div class="observacao esquerda">{{item.observacao == 'undefined' ? '-' : item.observacao}}</div>
                          </td>

                          <td class="centralizado b3">{{item.nr_periodo_inicial}}</td>
                          <td class="centralizado b3">{{item.nr_periodo_final}}</td>
                          <td class="centralizado b3">{{ Math.round(item.quantidade) }}</td>
                          <td class="centralizado b3">{{ (_.includes(item.id, 'novo') ? _.toNumber(_.get(item, 'valorAlteracao', 0)) : (item.valor_total + _.toNumber(_.get(item, 'valorAlteracao', 0))).toFixed(2) ) / item.quantidade | real }}</td>
                          <td class="centralizado b3 bl2">{{ (_.includes(item.id, 'novo') ? _.toNumber(_.get(item, 'valorAlteracao', 0)) : (item.valor_total + _.toNumber(_.get(item, 'valorAlteracao', 0))).toFixed(2) ) | real }}</td>                        </template>
                      </tr>

                    </template>

                    </tbody>
                  </table>
                </div>

              </div><!--Guia Recursos Financeiros -->

              <!-------------><div class="quebraPagina">&nbsp;</div><!-------------------------------------------------------------------------------------------------->

              <div id="guiaDesembolso"><!--Guia Desembolso -->


                <div class="box-body">
                  <label class="control-label" style="zoom: 1">Cronograma de Desembolso (Cronograma Físico-financeiro)</label>


                  <template v-for="ano in _.keys(_.groupBy(periodoMesAno, 'ano'))"><!-- Ano -->

                    <div class="anoDesembolso">{{ano}}</div>

                    <template v-for="atividade in proposta.atividades">
                      <table class="w100 juntos">
                        <caption>{{atividade.ds_nome}}</caption>
                        <thead>
                        <tr>
                          <th rowspan="2" class="b3">Item</th>
                          <th colspan="2" v-for="c in 12" class="b3">{{meses[c-1]}}</th>
                        </tr>
                        <tr>
                          <template v-for="d in 12">
                            <th class="b3">Qtde</th><th class="b3">Valor</th>
                          </template>
                        </tr>
                        </thead>

                        <tfoot>
                        <tr>
                          <td class="b3">Total da atividade</td>
                          <template v-for="mesAtv in 12">
                            <!--<td class="b3">0</td><td class="b3">0,00</td>-->
                            <td class="b3">{{desembolsoMesAno(atividade, ano, mesAtv, 'quantidade')}}</td>
                            <td class="b3">{{desembolsoMesAno(atividade, ano, mesAtv, 'valor') | decimal2}}</td>
                          </template>
                        </tr>
                        </tfoot>

                        <tbody>

                        <template v-for="item in atividade.itens_orcamentos">

                          <tr>
                            <td class="b3">({{item.item.ds_type}}) {{item.item.ds_description}}</td>
                            <template v-for="mesIte in 12">
                              <td class="b3">{{desembolsoMesAno(item, ano, mesIte, 'quantidade')}}</td>
                              <td class="b3 direita">{{desembolsoMesAno(item, ano, mesIte, 'valor')| decimal2}}</td>
                            </template>
                          </tr>

                        </template>

                        </tbody>
                      </table>
                    </template> <!-- Atividades por Ano-->


                  </template>

                </div>

              </div>

              <!-------------><div class="quebraPagina">&nbsp;</div><!-------------------------------------------------------------------------------------------------->

              <div id="guiaParcelasAdiantamento">
                <!-- Parcelas de Adiantamento no Projeto -->
                <div class="box-body">
                  <label class="control-label">Parcelas de Adiantamento</label>
                  <table class="table table-condensed">
                    <thead>
                    <tr>
                      <th class="cabecalho centralizado w20 b1 b4">Número</th>
                      <th class="cabecalho centralizado w20 b1">Origem Recurso</th>
                      <th class="cabecalho centralizado b1 b2">Valor Adiantável</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="adiantamento in _.get(proposta, 'adiantamentos', [])">
                      <td class="centralizado b3 b4">{{adiantamento.parcela}}</td>
                      <td class="centralizado b3">{{ adiantamento.origem === 1 ? 'Fundação' : 'Parceiro Estratégico' }}</td>
                      <td class="centralizado ressaltar b3 b2">{{ adiantamento.valor | real}}</td>
                    </tr>
                    </tbody>
                  </table>
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
  import HistoricoProposta from '../../../components/modules/historicoProposta'
  import ObjetivoEspecifico from '../../../components/modules/objetivoEspecifico'
  import Metas from '../../../components/modules/metas'
  import Atividades from '../../../components/modules/atividades'
  import moment from 'moment'

  export default {
    components: {
      HistoricoProposta,
      Atividades,
      Metas,
      ObjetivoEspecifico
    },
    name: 'alteracoes-projeto-plano-trabalho',
    data () {
      return {
        progressBar: {
          stepAtual: null,
          stepTotal: null,
          tarefaAtual: null
        },
        loading: {
          tela: false,
          cidade: false,
          entidade: false,
          fluxo: false
        },
        array: [],
        esconder: true,
        fluxo: {},
        elementos: {
          visivel: ''
        },
        carregou: false,
        dirigentes: [],
        documentosProposta: [],
        bloqueiaBotoes: false,
        ganttZoom: 1,
        projetoPeriodos: 0,
        proposta: {
          projetoAprovado: false,
          dataFinal: '',
          totalProjeto: 0,
          totalFBB: 0,
          totalParc: 0,
          totalCtrp: 0,
          entidade: {},
          documentos: {
            proposta: []
          }
        },
        id: null,
        processo: null,
        ehVisualizacao: false,
        etapa: 'Solicitação',
        tarefas: [],
        ultimaTarefa: {},
        tarefaNome: {'ANALISE': 'Análise', 'AUTORIZACAO': 'Autorização', 'REVISAO': 'Revisão', 'SOLICITACAO': 'Solicitação', 'DELIBERACAO': 'Deliberação', 'PENDENCIAS': 'Pendências'},
        propostaBackup: {},
        solicitacao: {
          instrumentosLidos: {
            ok: false,
            usuario: null,
            data: null
          },
          justificativa: null,
          motivosDevolucao: [],
          anexos: [],
          processos: [],
          aditivo: {
            modelo: {},
            conteudo: '',
            anexos: []
          },
          planoTrabalho: {
            conteudo: {},
            anexos: []
          },
          notaTecnica: {
            conteudo: {},
            anexos: []
          },
          sumula: {
            textoAnalise: null,
            textoProposta: null,
            textoContexto: null,
            textoSituacaoProblema: null,
            textoParecer: null,
            questionario: [],
            parceriaEstrategica: null,
            providencias: [],
            anexos: [],
            resumoAlteracoes: {
              metas: 0,
              contrapartidas: 0,
              substituicaoItens: 0,
              ajusteQuantidade: 0,
              novosItens: 0,
              prorrogacaoExecucao: [0, 0],
              prorrogacaoVigencia: [0, 0],
              municipiosAlterados: 0,
              percentualRemanejamentosConcedidos: 0,
              percentualRemanejamentoSolicitado: 0,
              percentualRemanejamentoAcumulado: 0,
              valorSuplementacao: 0,
              valorTotalComSuplementacao: 0,
              enquadramentoOrcamentarioFEP: null,
              outrasAlteracoes: null
            },
            alcada: {}
          }
        },
        formaJuridica: '',
        componentKey: 0,
        ultimaTarefaEntidade: {},
        periodoMesAno: [],
        estadoCivil: {'SOLTEIRO': 'Solteiro(a)', 'CASADO': 'Casado(a)', 'DIVORCIADO': 'Divorciado(a)', 'VIUVO': 'Viúvo(a)'},
        meses: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        estados: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'],
        // demanda 65278 - Atualizacao do prazo de excecução para impressao de relatório
        dataInicioExecucao: '',
        dataFimExecucao: ''
      }
    },
    watch: {
      loading: {
        deep: true,
        handler (carregando) {
          if (!carregando.cidade && !carregando.entidade && !carregando.fluxo) { // A tela só "destrava" o loading após os demais loading terem terminado
            this.loading.tela = false
            this.$snotify.clear()
            this.$snotify.success('Plano de Trabalho carregada com sucesso!', {timeout: 2000})
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created () {
      console.log('iniciando plano de trabalho')
      if (_.has(this.$route.params, 'id')) {
        this.id = this.$route.params
        this.carregarDados({'id': this.$route.params.id})
      }
    },
    methods: {
      carregarDados (requisicao) {
        this.loading.tela = true
        this.loading.cidade = true
        this.loading.entidade = true
        this.loading.fluxo = true
        this.$snotify.async('Carregando Plano de Trabalho. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('projeto/alteracoes', requisicao).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let proposta = response.data.retorno.projeto
            this.propostaBackup = _.cloneDeep(proposta) // Guarda a proposta sem alterações para comparar ao final e ver se houve alterações com a original
            //
            let solicitacao = response.data.retorno.solicitacao
            if (!_.isEmpty(solicitacao)) { // Se houver solicitação então carrega este objeto e transforma a proposta com as alterações dele
              this.solicitacao = solicitacao.dados
              this.processo = solicitacao.processo
              this.id = this.processo.id
              this.ultimaTarefa = _.last(_.filter(solicitacao.tarefas, ['tipo', 'USUARIO']))
              this.tarefas = _.get(_.last(solicitacao.tarefas), 'tipo', 'USUARIO') === 'USUARIO' ? _.initial(solicitacao.tarefas) : solicitacao.tarefas // Todos os elementos exceto o ultimo
              this.etapa = this.tarefaNome[this.ultimaTarefa['nome']]
              if (!this.ehVisualizacao) { // Quando não esta em modo de Visualização, deve verificar se há alguma outra condição para alterar para o modo de Visualização
                this.ehVisualizacao = _.includes(['FEITO', 'CANCELADO'], this.processo.situacao) || (this.usuarioLogado.userType !== 'FUNDACAO' && !_.includes(['Revisão', 'Solicitação'], this.etapa))
              }
              if (!_.includes(['FEITO', 'CANCELADO'], this.processo.situacao)) {
                let objetosRefProcesso = {'ALTERACAO_METAS': 'metas', 'ALTERACAO_ATIVIDADES': 'atividades', 'ALTERACAO_PARCELAS_ADIANTAMENTO': 'adiantamentos', 'ALTERACAO_MUNICIPIOS': 'municipalizacao', 'ALTERACAO_PERIODO_PROJETO': ''}
                this.solicitacao.processos.forEach((processo) => {
                  // Processa as Exclusões -------------------------------------------
                  let exclusoes = _.get(processo, 'exclusao', [])
                  exclusoes.forEach((exclusao) => {
                    _.remove(_.get(proposta, objetosRefProcesso[processo.nome], []), ['id', exclusao])
                  })
                  // Processa as Alterações -------------------------------------------
                  let alteracoes = _.get(processo, 'alteracao', [])
                  alteracoes.forEach((alteracao) => {
                    let registroAlterado = proposta // Inicialmente é proposta que vai ser alterada
                    if (_.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], processo.nome)) {
                      proposta.atividades.forEach((atividade) => { // Caso se trate de alteração de extrato (remanejamento ou suplementacao), então deve se pegar o item específico dentro das atividades
                        let itemAlterado = _.find(_.get(atividade, 'itens_orcamentos', []), ['id', alteracao.id])
                        if (itemAlterado) {
                          registroAlterado = itemAlterado
                        }
                      })
                    } else if (processo.nome !== 'ALTERACAO_PERIODO_PROJETO') { // Caso não se trate de prorrogação (que altera a proposta diretamente) nem de alteração de extrato, então deve se pegar o objeto específico dentro da proposta para se alterado
                      registroAlterado = _.find(_.get(proposta, objetosRefProcesso[processo.nome], []), ['id', alteracao.id])
                    }
                    _.forIn(alteracao, function (value, key, obj) { // Passa por cada alteração reatribuindo ao objeto a ser alterado
                      if (key !== 'id') {
                        let valor = _.isNaN(_.toNumber(value[1])) ? value[1] : _.toNumber(value[1]) // Se conversível para numero então use se devolve como está
                        _.set(registroAlterado, key, valor)
                      }
                    })
                  })
                  // Processa as Inclusões ------------------------------------------
                  let inclusoes = _.get(processo, 'inclusao', [])
                  let lista = _.get(proposta, [objetosRefProcesso[processo.nome]], [])
                  inclusoes.forEach((inclusao) => {
                    if (_.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], processo.nome)) {
                      lista = _.get(_.find(proposta.atividades, ['id', inclusao.atividade.id]), 'itens_orcamentos')
                    }
                    if (_.isArray(lista)) {
                      lista.push(inclusao)
                    }
                  })
                })
              }
            }
            //
            this.proposta = _.cloneDeep(proposta)
            this.projetoPeriodos = this.propostaBackup.nr_periodos
            this.ajustesDiversosDadosComplementares()
            //
            this.$forceUpdate()
          } else {
            this.loading.tela = false
            this.$snotify.error(response.data.mensagem)
          }
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      ajustesDiversosDadosComplementares () {
        this.buscaCidades()
        this.buscaEntidades()
        this.buscaFluxo()
        this.proposta['projetoAprovado'] = (_.has(this.proposta, 'ds_situacao_erp') && !_.isNull(this.proposta.ds_situacao_erp) && !_.includes(['ANA', 'DEF', 'ANU', 'CAN', 'IND', 'ENC', 'DLG', 'JUD', 'OPE'], this.proposta.ds_situacao_erp))
        this.projetoPeriodos = this.proposta.nr_periodos
        this.proposta.totalFBB = this.totalizar('1')
        this.proposta.totalParc = this.totalizar('5')
        this.proposta.totalCtrp = this.totalizar('2')
        this.proposta.totalProjeto = this.proposta.totalFBB + this.proposta.totalParc + this.proposta.totalCtrp
        this.dataInicioExecucao = _.includes(['ANA', 'DEF'], this.proposta.ds_situacao_erp) ? this.proposta.dt_data_inicial : this.ehNulo(this.proposta.dt_assinatura_convenio, this.proposta.dt_data_inicial)
        this.dataFimExecucao = moment(this.dataInicioExecucao).add(this.proposta.nr_periodos, 'M').format('MM/YYYY')
        this.proposta.dataFinal = moment(this.ehNulo(this.proposta.dt_assinatura_convenio, this.proposta.dt_data_inicial)).add(this.proposta.nr_periodos, 'M').format('MM/YYYY')
        this.ganttZoom = (parseInt(this.proposta.nr_periodos) > 24 ? (1 - (parseInt(this.proposta.nr_periodos) - 24) * 0.035) : 1)
        this.equivalenciaPeriodoMesAno()
        // Acrescentando mensalização simples porque antes de concluir o projeto não há orcamentos_mensalizados
        for (let a in this.proposta.atividades) {
          let atv = this.proposta.atividades[a]
          // console.log('atv', atv)
          if (_.has(atv, 'itens_orcamentos')) {
            for (let i in atv.itens_orcamentos) {
              let ite = atv.itens_orcamentos[i]
              // console.log('item: ', ite.observacaoOriginal)
              // console.log('item objeto: ', ite)
              // vm.truncarValor((item.valorOrcado > 0) ? item.valorOrcado + (!_.includes(item.id, 'novo') ? (_.toNumber(_.get(item, 'valorAlteracao', 0))) : 0) : item.valorOrcado + (_.toNumber(_.get(item, 'valorAlteracao', 0))))
              let valorTotal = ite.valor_total + (!_.includes(ite.id, 'novo') ? _.toNumber(_.get(ite, 'valorAlteracao', 0)) : 0)
              // let valorTotal = ite.valor_total + _.toNumber(_.get(ite, 'valorAlteracao', 0))
              // console.log('valor_total: ', ite.valor_total)
              // console.log('valorAlteracao: ', (_.toNumber(_.get(ite, 'valorAlteracao', 0))))
              // console.log('valorTotal >>> ', valorTotal)
              let quantidadeTotal = Math.round(parseFloat(ite.quantidade))
              if ('' + ite.origem === '2') { // Contrapartida no último mês do seu período
                ite['orcamentos_mensalizados'] = [{
                  'periodo': parseInt(ite.nr_periodo_final),
                  'quantidade': quantidadeTotal,
                  'valor': valorTotal
                }]
              } else {
                if (ite.item['ds_type'] === 'PRODUTO') {
                  // Produtos no primeiro mês do período
                  ite['orcamentos_mensalizados'] = [{
                    'periodo': parseInt(_.get(ite, 'periodo_inicial', ite.nr_periodo_inicial)),
                    'quantidade': quantidadeTotal,
                    'valor': valorTotal
                  }]
                } else {
                  let meses = parseInt(_.get(ite, 'periodo_final', ite.nr_periodo_final)) - parseInt(_.get(ite, 'periodo_inicial', ite.nr_periodo_inicial)) + 1
                  let parcValor = valorTotal / meses
                  let parcQtde = parseInt(quantidadeTotal / meses)
                  let difValor = (valorTotal) - (parcValor * meses)
                  let difQtde = quantidadeTotal - (parcQtde * meses)
                  // console.log('VALOR PARC: ', parcValor * meses)
                  ite['orcamentos_mensalizados'] = []
                  for (let p = 1; p <= meses; p++) {
                    // Servicos rateados no período
                    let orcMes = {
                      'periodo': parseInt(_.get(ite, 'periodo_inicial', ite.nr_periodo_inicial)) + p - 1,
                      'quantidade': p === meses ? parcQtde + difQtde : parcQtde,
                      'valor': p === meses ? parcValor + difValor : parcValor
                    }
                    ite.orcamentos_mensalizados.push(orcMes)
                  }
                }
              }
            }
          }
        }
        this.$forceUpdate()
        this.carregou = true
      },
      buscaCidades () {
        this.loading.cidade = true
        let lista = _.uniq(_.map(this.proposta.municipalizacao, 'ds_cep'))
        axiosLaravel.post('projeto/cidades', {'referencia': 'CEP', 'lista': lista}).then((response) => {
          this.proposta.municipalizacao.forEach((municipio) => {
            let cidade = _.find(response.data, function (cid) {
              return _.toNumber(municipio.ds_cep) >= _.toNumber(cid.nr_cep_inicio) && _.toNumber(municipio.ds_cep) <= _.toNumber(cid.nr_cep_final)
            })
            _.set(municipio, 'ds_uf', cidade.ds_uf)
          })
          this.loading.cidade = false
        })
          .catch((error) => {
            this.loading.cidade = false
            this.$root.trataErro(error)
          })
      },
      somarTotalAtividade (atividade) {
        let total = _.sumBy(atividade.itens_orcamentos, function (a) {
          console.log('id ', a.id)
          console.log('valor total: ', a.valor_total)
          let valorItem = 0
          if (String(a.id).includes('novo')) {
            console.log('includes novo')
            valorItem = (_.toNumber(_.get(a, 'valorAlteracao', 0)))
          } else {
            console.log('item antigo')
            valorItem = a.valor_total + (_.toNumber(_.get(a, 'valorAlteracao', 0)))
          }
          console.log(valorItem)
          return valorItem
        })
        console.log('VALOR TOTAL CALCULADO ', total)
        return total
      },
      buscaEntidades () {
        this.loading.entidade = true
        let currentDate = new Date()
        let hoje = moment(currentDate).format('YYYYMMDD')
        axiosLaravel.get('entidades/' + this.proposta.fk_entidade).then((response) => {
          this.proposta.entidade = response.data
          let codigo = this.proposta.entidade.fk_forma_juridica
          let descricao = this.ehNulo(_.find(this.$store.state.formasJuridicas, ['codigo', codigo])['descricao'], '!')
          this.formaJuridica = codigo + ' - ' + descricao
          let array = _.filter(response.data.dirigentes, function (o) {
            if (o.bt_assinatura_entidade === 1 && o.bt_ativo === 1 && o.bt_representante_legal === 1 && o.bt_assinatura_requerida === 1) {
              let dataInicial = moment(o.dt_inicio_mandato).format('YYYYMMDD')
              let dataFinal = moment(o.dt_fim_mandato).format('YYYYMMDD')
              if (dataInicial <= hoje && hoje <= dataFinal) {
                return o
              }
            }
          })
          this.dirigentes = array
          this.loading.entidade = false
          this.$forceUpdate
        })
          .catch((error) => {
            this.loading.entidade = false
            this.$root.trataErro(error)
          })
      },
      buscaFluxo () {
        //  Verificar no retorno se a atividade atual é referente a esta página se não então erro
        //  Carregar array de refs de elementos ou não (v-if)
        this.loading.fluxo = true
        axiosLaravel.post('fluxo/', {'id_proposta': this.proposta.id, 'atividade': 'SOLICITACAO'}).then((response) => {
          this.fluxo = response.data
          this.elementos = this.fluxo.elementos
          this.loading.fluxo = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.fluxo = false
            this.$root.trataErro(error)
          })
      },
      closewindow () {
        close()
      },
      ehNulo (valor, opcao) {
        return _.isNull(valor) || _.isNil(valor) || _.isUndefined(valor) ? opcao : valor
      },
      equivalenciaPeriodoMesAno () {
        let inicio = new Date(this.ehNulo(this.proposta.dt_assinatura_convenio, this.proposta.dt_data_inicial).toString())
        let mes = parseInt(inicio.getMonth() + 1)
        let ano = parseInt(inicio.getFullYear())
        for (let p = 1; p <= parseInt(this.proposta.nr_periodos); p++) {
          this.periodoMesAno.push({'periodo': p, 'ano': ano, 'mes': mes})
          ano += mes === 12 ? 1 : 0
          mes += mes === 12 ? -11 : 1
        }
      },
      haObjetivoMeta (listaOrigem, vinculo, descricao) {
        let c = 0
        _.forEach(_.map(listaOrigem, vinculo), function (o) {
          _.forEach(o, function (d) {
            c += (_.has(d, 'ds_descricao') && d.ds_descricao === descricao) || (_.has(d, 'descricao') && d.descricao === descricao) ? 1 : 0
          })
        })
        return c > 0
      },
      desembolsoMesAno (obj, ano, mes, tipo) { // obj pode ser uma atividade ou um item
        let mesAno = _.find(this.periodoMesAno, {'ano': parseInt(ano), 'mes': parseInt(mes)}) // Na lista de mês/ano do projeto procurando o registro equivalente ao mês e ano na tela
        if (_.isUndefined(mesAno)) { // O item não está mensalizado nesse mês
          return '-'
        } else {
          let itens = obj
          if (_.has(obj, 'itens_orcamentos')) { // Se tem itens_orcamentos, então deve se tratar de atividade
            itens = obj.itens_orcamentos // Ou seja, itens será um array de item
          }
          //
          if (_.isEmpty(itens) || itens.length === 0) {
            return '*' // Não há conteúdo para calcular
          } else {
            // if (_.has(obj, 'orcamentos_mensalizados')) {
            if (_.isArray(itens)) { // Atividade
              let total = _.sumBy(itens, function (ite) { return _.sumBy(ite.orcamentos_mensalizados, function (iVQ) { return (iVQ.periodo === mesAno.periodo) ? iVQ[tipo] : 0 }) })
              return total === 0 ? '-' : total
            } else { // Item de despesa
              let total = _.sumBy(obj.orcamentos_mensalizados, function (iVQ) { return (iVQ.periodo === mesAno.periodo) ? iVQ[tipo] : 0 })
              return total === 0 ? '-' : total
            }
          }
        }
      },
      // Suporte 60686 - Falha na soma do Plano de Trabalho. Alterei o sumBy para fazer a mesma soma sem considerar o objeto orcamentos_mensalizados.
      // Tratar solução e ver porque orcamentos_mensalizados está gravando de forma errada alguns registros. (Juliano - 2020-11-24)
      totalizar (origem) {
        return this.proposta.atividades.reduce((total, atividade) => {
          const somaItens = atividade.itens_orcamentos.reduce((soma, item) => {
            if (String(item.id).includes('novo')) {
              return soma
            }
            return soma + (origem === String(item.origem).substring(0, 1) ? item.valor_total : 0)
          }, 0)
          return total + somaItens
        }, 0)
      },
      mostrarRef (ref) {
        return _.filter(this.elementos, item => item.nome === ref).some((item) => { return item.visivel })
      },
      irTopo () {
        this.$nextTick(() => {
          this.$refs['topo'].scrollIntoView()
        })
      },
      imprimirRelatorio () {
        window.print()
      },

      // demanda 65278 - Atualizacao do prazo de excecução para impressao de relatório
      atualizarPrazoExecucao (e) {
        // verifica se o valor do input está dentro do prazo inicial e final
        if (e.target.value < this.projetoPeriodos) e.target.value = this.projetoPeriodos
        if (e.target.value > this.proposta.periodo_vigencia) e.target.value = this.proposta.periodo_vigencia
        // atualiza variavel nr_periodos e dataFinal
        this.proposta.nr_periodos = parseInt(e.target.value)
        this.dataInicioExecucao = this.proposta.ds_situacao_erp !== 'ANA' || 'DEF' ? this.proposta.dt_data_inicial : this.ehNulo(this.proposta.dt_assinatura_convenio, this.proposta.dt_data_inicial)
        // this.proposta.dataFinal = moment(this.ehNulo(this.proposta.dt_assinatura_convenio, this.proposta.dt_data_inicial)).add(this.proposta.nr_periodos, 'M').format('MM/YYYY')
        this.dataFimExecucao = moment(this.dataInicioExecucao).add(this.proposta.nr_periodos, 'M').format('MM/YYYY')
      }
    }
  }
</script>

<style scoped>
  .m0 {
    margin: 0px !important;
  }

  #planoTrabalho {
    --cor-padrao: black;
    --cor-fraca: silver;
    --cor-destaque: cornflowerblue;
    --cor-alerta: darkgoldenrod;
    --cor-atencao: firebrick;
    --cor-borda: rgb(221, 221, 221);
  }

  #planoTrabalho .cabecalho {
    text-align: left;
    font-weight: normal;
    font-size: x-small !important;
  }

  #planoTrabalho .textoAlerta {
    font-size: 14px;
    color: var(--cor-atencao);
  }

  #planoTrabalho .ressaltar {
    font-weight: bold;
  }

  #planoTrabalho .box-body {
    margin-top: 20px;
  }

  #planoTrabalho .objetivo td:nth-child(1) {
    vertical-align: top;
  }
  #planoTrabalho .meta td:nth-child(1) {
    padding-left: 35px !important;
    vertical-align: top;
  }
  #planoTrabalho .atividade td:nth-child(1) {
    padding-left: 50px !important;
    vertical-align: top;
  }
  #planoTrabalho span.tag {
    padding: 0 10px 0 0;
    margin-right: 5px;
    color: silver;
    font-weight: bold;
    font-size: small;
  }

  #planoTrabalho .atencao {
    color: var(--cor-atencao);
    font-weight: bold;
  }

  #planoTrabalho .obj_met_atv td, #planoTrabalho .obj_met_atv th {
    border: 0px 1px solid silver;
  }

  #planoTrabalho .borda {
    border: 1px solid var(--cor-borda) !important;
  }
  #planoTrabalho .b1 {
    border-top: 1px solid var(--cor-borda) !important;
  }
  #planoTrabalho .b2 {
    border-right: 1px solid var(--cor-borda) !important;
  }
  #planoTrabalho .b3 {
    border-bottom: 1px solid var(--cor-borda) !important;
  }
  #planoTrabalho .b4 {
    border-left: 1px solid var(--cor-borda) !important;
  }
  #planoTrabalho .bl1 {
    border-top: 2px solid var(--cor-borda) !important;
  }
  #planoTrabalho .bl2 {
    border-right: 2px solid var(--cor-borda) !important;
  }
  #planoTrabalho .bl3 {
    border-bottom: 2px solid var(--cor-borda) !important;
  }
  #planoTrabalho .bl4 {
    border-left: 2px solid var(--cor-borda) !important;
  }
  #planoTrabalho .direita, #planoTrabalho .esquerda, #planoTrabalho .centralizado {
    padding: 1px 3px;
  }

  #planoTrabalho .direita {
    text-align: right;
  }
  #planoTrabalho .esquerda {
    text-align: left;
  }
  #planoTrabalho .centralizado {
    text-align: center;
  }

  #planoTrabalho .lista tr td:first-child {
    border-left: 3px solid silver;
  }

  #planoTrabalho .caixa_texto {
    border: 1px solid var(--cor-borda);
    padding: 6px 12px;
    white-space: pre-wrap
  }

  .quebraPagina::before {
    content: 'término dessa página';
    font-size: 10px;
    font-style: italic;
  }
  .quebraPagina {
    page-break-after: always;
    width: 100%;
    border-top: 1px dashed silver;
    margin-top: 20px;
  }

  #guiaDadosCadastrais {
    display: block;
  }
  #guiaMetas {
    display: block;
  }
  #guiaCronogramaAtividades {
    display: block;
  }
  #guiaRecursosFinanceiros {
    display: block;
  }
  #guiaDesembolso {
    display: block;
  }

  #guiaDesembolso {
    font-family: sans-serif;
    zoom: .6;
  }

  #guiaDesembolso table {
    margin-bottom: 20px;
  }

  #guiaDesembolso tfoot {
    font-weight: bold;
  }

  #guiaDesembolso .anoDesembolso {
    font-weight: bold;
    text-align: center;
    width: 100%;
    margin-top: 20px;
  }

  #guiaDesembolso caption {
    text-align: left;
    font-weight: bold;
  }

  #guiaDesembolso caption {
    text-align: left;
    font-weight: bold;
  }

  #guiaDesembolso th {
    font-weight: normal;
    text-align: center;
  }

  #guiaDesembolso td:first-child {
    width: 300pt;
    padding: 5px 0px;
  }

  #guiaDesembolso tr:not(:first-child) th:nth-child(odd), #guiaDesembolso td:not(:first-child):nth-child(even) {
    text-align: center;
    padding-left: 10px;
  }

  #guiaDesembolso tr:not(:first-child) th:nth-child(even), #guiaDesembolso td:not(:first-child):nth-child(odd) {
    text-align: center;
    padding-right: 10px;
  }

  #planoTrabalho .textoAlerta {
    font-size: 14px;
    margin-top: 8px;
    color: firebrick;
    font-weight: bold;
  }

  /********************************************************************************************************************************************/

  @media print {

    * {
      font-size: 14px !important;
    }

    .control-label {
      text-transform: uppercase;
    }

    div.nao_imprimir {
      display: none !important;
    }
    table.nao_imprimir {
      visibility: collapse !important;
    }

    div.imprimir {
      display: block !important;
    }
    table.imprimir {
      visibility: visible !important;
    }

    .tabela_consultas .valores input {
      text-align: left;
      border: 0;
    }

    .juntos {
      page-break-inside: avoid;
    }

    button {
      display: none !important;
    }

    select, input {
      border: 0;
      padding-left: 20px;
    }

    .bloco {
      border: 1px solid #d2d6de;
    }

    @page {
      /*size: landscape;*/
      margin-left: 0px !important;
    }

    #guiaDesembolso {
      /*page: paisagem;*/
    }

    @page paisagem {
      /*size: landscape;*/
    }

    body, .col-md-12, .box-body {
      padding: 0px !important;
      background: white !important;
    }

    .content-wrapper, .box.box-primary {
      border: 0 !important;
    }
    .content {
      margin: 0px !important;
    }

    #Header, #Footer { display: none !important; }

    .sidebar-mini.sidebar-collapse .content-wrapper, .sidebar-mini.sidebar-collapse .right-side, .sidebar-mini.sidebar-collapse .main-footer {
      margin-left: 0px !important;
    }

    #app .content-wrapper * {
      background: white !important;
    }

  }

</style>
