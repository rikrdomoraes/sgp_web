<template>
  <div class="content-wrapper">
    <vue-headful
      title="SGP - Plano de Trabalho"
    />
    <div id="planoTrabalho">
      <section class="content-header">
        <h1>Plano de Trabalho
          <!-- Botões -->
          <span v-if="bloqueiaBotoes === false">
            <g-button-ujarak color="warning" @click.native="imprimirRelatorio" size="button--size-ss"><i class="fa fa-print" aria-hidden="true"></i> Imprimir </g-button-ujarak>
            <g-button-ujarak color="error" @click.native="closewindow" size="button--size-ss"><i class="fa fa-sign-out" aria-hidden="true"></i> Sair do relatório </g-button-ujarak>
          </span>
          <div class="textoAlerta">O Plano de Trabalho é somente para impressão. Alterações realizadas não serão salvas!</div>
        </h1>
        <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Proposta', href: '/proposta/lista'}, {text: 'Imprime', active: true}]"/>
      </section>



      <section class="content">

        <div class="row">

          <div>

            <div class="col-md-12">

              <div class="box box-primary">
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>

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

                    </div>
                  </div>



                  <!-- Entidade -->
                  <div class="box-body">
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



                  <!-- Lista de Dirigentes -->
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
                      <td v-if="proposta.projetoAprovado">
                        <div v-if="mostrarRef('projeto_periodo_execucao')" class="nao_imprimir">
                          <!-- demanda 65278 - Atualizacao do prazo de excecução para impressao de relatório -->
                          <input v-model="proposta.nr_periodos" @change="atualizarPrazoExecucao" data-vv-as="Número de Meses do Projeto" name="periodo" class="form-control" type="number"
                                 :min="projetoPeriodos" :max="proposta.periodo_vigencia">
                          <span class="esmaecido">* mínimo de {{projetoPeriodos}} meses e máximo (vigência) de {{proposta.periodo_vigencia}} meses</span>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                    </table>
                  </div>

                </div><!-- Guia de Dados Cadastrais -->


<!-------------><div class="quebraPagina">&nbsp;</div><!-------------------------------------------------------------------------------------------------->


                <div id="guiaMetas">

                  <div v-if="proposta.projetoAprovado" class="nao_imprimir">

                    <!--Objetivos Específicos ------------>
                    <div v-if="mostrarRef('objetivo_especifico')" ref="objetivos">
                      <div class="box box-widget">
                        <objetivo-especifico :editavel="false" :propsObjetivos="proposta.objetivos" :propsProposta="proposta" @objetivoAdicionado="proposta.objetivos = $event"></objetivo-especifico>
                      </div>
                    </div>

                    <!--Metas ---------------------------->
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

                </div><!-- Guia de Objetivos, Metas e Atividades -->


<!-------------><div class="quebraPagina">&nbsp;</div><!-------------------------------------------------------------------------------------------------->

                  <!--Cronograma de Execução das atividades-->
                  <div class="box-body">
                    <label class="control-label">Cronograma de Execução das Atividades</label>
                    <table class="table table-condensed">
                      <thead>
                      <tr>
                        <th class="cabecalho w40 b1 b4">Atividade</th>
                        <th class="cabecalho direita w10 b1">Valor total</th>
                        <th class="centralizado b1 b2 b4" v-bind:style="'zoom:' + ganttZoom" v-for="mes in _.range([start=0], proposta.nr_periodos, [step=1])" >{{mes + 1}}</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="atividade in proposta.atividades">
                        <td class="ressaltar b3 b4">{{atividade.ds_nome}}</td>
                        <td class="direita b3">{{_.sumBy(atividade.itens_orcamentos, function(a) { return parseFloat(a.quantidade) * parseFloat(a.valor_unitario) }) | real}}</td>
                        <td class="centralizado b2 b3 b4" v-for="m in _.range([start=0], proposta.nr_periodos, [step=1])" v-bind:style="(m >= (atividade.inicio -1) && m <= (atividade.termino - 1)) ? 'background: gray !important' : ''">
                        <span v-if="(m >= (atividade.inicio -1) && m <= (atividade.termino - 1))" v-bind:style="'zoom:' + ganttZoom + '; color: gray'">
                          <i class="fa fa-circle"></i>
                        </span>
                          <span v-else>&nbsp;</span>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <div>
                      Referência: 1º mês do projeto em <span class="ressaltar">{{_.head(periodoMesAno)['mes']+ '/'+ _.head(periodoMesAno)['ano']}}</span>
                      e {{periodoMesAno.length}}º (último) mês do projeto em <span class="ressaltar">{{_.last(periodoMesAno)['mes'] + '/' + _.last(periodoMesAno)['ano']}}</span>
                    </div>


                    <!-- Operacionalização -->
                    <div class="box-body">
                      <label class="control-label">Operacionalização</label>
                      <div v-html="proposta.ds_operacao" class="caixa_texto"></div>
                    </div>

                    <!-- Acões de Comunicação -->
                    <div class="box-body">
                      <label class="control-label">Ações de Comunicação</label>
                      <div v-html="proposta.ds_acoes_comunicacao" class="caixa_texto"></div>
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
                          <td colspan="3" class="direita bl1 bl2 bl3">{{_.sumBy(atividade.itens_orcamentos, function(a) { return parseFloat(a.quantidade) * parseFloat(a.valor_unitario) }) | real}}</td>
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
                              <div class="observacao esquerda">{{item.observacao}}</div>
                            </td>

                            <td class="centralizado b3">{{item.nr_periodo_inicial}}</td>
                            <td class="centralizado b3">{{item.nr_periodo_final}}</td>
                            <td class="centralizado b3">{{item.quantidade}}</td>
                            <td class="centralizado b3">{{item.valor_unitario | real}}</td>
                            <td class="centralizado b3 bl2">{{item.quantidade * item.valor_unitario | real}}</td>
                          </template>
                        </tr>

                      </template>

                      </tbody>
                    </table>
                  </div>

                </div><!--Guia Recursos Financeiros -->




<!-------------><div class="quebraPagina">&nbsp;</div><!-------------------------------------------------------------------------------------------------->

                <!-- Guia de Adiantamento -->
                <div class="box-body">
                <label class="control-label">Parcelas de Adiantamento</label>
                <div class="table-responsive" >
                      <table class="table table-condensed table-bordered table-striped" v-if="proposta.adiantamentos">
                        <thead style="text-align: center;">
                        <tr>
                          <td><b>Parcela</b></td>
                          <td><b>Origem</b></td>
                          <td><b>Valor</b></td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="adiantamento in proposta.adiantamentos">
                          <td class="text-center w20">{{adiantamento.parcela}}</td>
                          <td class="text-center w40">
                            <span v-if="adiantamento.origem === 1">Fundação</span>
                            <span v-if="adiantamento.origem === 5">Parceiro Estratégico</span>
                          </td>
                          <td class="text-center w40">{{adiantamento.valor | real}}</td>
                        </tr>
                        <tr>
                          <td colspan="2" class="ressaltar">Total adiantável</td>
                          <td class="text-center ressaltar">{{_.sumBy(proposta.adiantamentos, function (p) { return p.valor }) | real}}   ({{ ( (_.sumBy(proposta.adiantamentos, function (p) { return p.valor }))/(totalFBB + totalParceiro) ) | percentage}})</td>
                        </tr>
                        </tbody>
                        <tr v-if="((proposta.adiantamentos && proposta.adiantamentos.length === 0) || (!proposta.adiantamentos))">
                          <td colspan="100%" class="text-center">Nenhuma parcela de adiantamento cadastrada.</td>
                        </tr>
                      </table>
                    </div>
                  </div>


                <div id="guiaCronogramaAtividades">

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

              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import HistoricoProposta from '../modules/historicoProposta'
  import ObjetivoEspecifico from '../modules/objetivoEspecifico'
  import Metas from '../modules/metas'
  import Atividades from '../modules/atividades'
  import moment from 'moment'

  export default {
    components: {
      HistoricoProposta,
      Atividades,
      Metas,
      ObjetivoEspecifico
    },
    name: 'plano-trabalho',
    data () {
      return {
        progressBar: {
          stepAtual: null,
          stepTotal: null,
          tarefaAtual: null
        },
        loading: {
          show: false
        },
        tel: '',
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
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    async created () {
      this.$snotify.async('Abrindo a proposta. Por favor, aguarde...', {timeout: 0})
      // TODO: criar parâmetro de ativo na proposta para situações de duplicidade
      axiosLaravel.get('projeto/id/' + this.$route.params.id).then((response) => {
        this.proposta = response.data
        this.proposta['projetoAprovado'] = (_.has(this.proposta, 'ds_situacao_erp') && !_.isNull(this.proposta.ds_situacao_erp) && !_.includes(['ANA', 'DEF', 'ANU', 'CAN', 'IND', 'ENC', 'DLG', 'JUD', 'OPE'], this.proposta.ds_situacao_erp))
        // Se o projeto ainda não está aprovado e tem snapshot, então a proposta terá o conteúdo do snapshot
        if (!this.proposta['projetoAprovado'] && !_.isNull(response.data.snapshot)) {
          this.proposta = response.data.snapshot
        }
        this.projetoPeriodos = this.proposta.nr_periodos
        this.buscaEntidades()
        this.buscaFluxo()
        this.proposta.totalFBB = this.totalizar('1')
        this.proposta.totalParc = this.totalizar('5')
        this.proposta.totalCtrp = this.totalizar('2')
        this.proposta.totalProjeto = this.proposta.totalFBB + this.proposta.totalParc + this.proposta.totalCtrp
        // demanda 65278 - Atualizacao do prazo de excecução para impressao de relatório
        // this.dataInicioExecucao = this.proposta.ds_situacao_erp !== 'ANA' || 'DEF' ? this.proposta.dt_data_inicial : this.ehNulo(this.proposta.dt_assinatura_convenio, this.proposta.dt_data_inicial)
        this.dataInicioExecucao = _.includes(['ANA', 'DEF'], this.proposta.ds_situacao_erp) ? this.proposta.dt_data_inicial : this.ehNulo(this.proposta.dt_assinatura_convenio, this.proposta.dt_data_inicial)
        this.dataFimExecucao = moment(this.dataInicioExecucao).add(this.proposta.nr_periodos, 'M').format('MM/YYYY')
        this.proposta.dataFinal = moment(this.ehNulo(this.proposta.dt_assinatura_convenio, this.proposta.dt_data_inicial)).add(this.proposta.nr_periodos, 'M').format('MM/YYYY')
        this.ganttZoom = (parseInt(this.proposta.nr_periodos) > 24 ? (1 - (parseInt(this.proposta.nr_periodos) - 24) * 0.035) : 1)
        this.equivalenciaPeriodoMesAno()
        // Acrescentando mensalização simples porque antes de concluir o projeto não há orcamentos_mensalizados
        for (let a in this.proposta.atividades) {
          let atv = this.proposta.atividades[a]
          if (_.has(atv, 'itens_orcamentos')) {
            for (let i in atv.itens_orcamentos) {
              let ite = atv.itens_orcamentos[i]
              // if (!_.has(ite, 'orcamentos_mensalizados')) {
              //   console.log('       ite', ite)
              //   if ('' + ite.origem === '2') { // Contrapartida no último mês do seu período
              //     ite['orcamentos_mensalizados'] = [{
              //       'periodo': parseInt(ite.nr_periodo_final),
              //       'quantidade': parseFloat(ite.quantidade),
              //       'valor': (parseFloat(ite.quantidade) * parseFloat(ite.valor_unitario))
              //     }]
              //     console.log('       contrapartida', ite['orcamentos_mensalizados'])
              //   } else {
              //     if (ite.item['ds_type'] === 'PRODUTO') {
              //       // Produtos no primeiro mês do período
              //       ite['orcamentos_mensalizados'] = [{
              //         'periodo': parseInt(_.has(ite, 'periodo_inicial') ? ite.periodo_inicial : ite.nr_periodo_inicial),
              //         'quantidade': parseFloat(ite.quantidade),
              //         'valor': (parseFloat(ite.quantidade) * parseFloat(ite.valor_unitario))
              //       }]
              //       console.log('       Produtos', ite['orcamentos_mensalizados'])
              //     } else {
              //       let meses = parseInt(_.has(ite, 'periodo_final') ? ite.periodo_final : ite.nr_periodo_final) - parseInt(_.has(ite, 'periodo_inicial') ? ite.periodo_inicial : ite.nr_periodo_inicial) + 1
              //       console.log('meses', meses)
              //       let parcValor = parseInt((parseFloat(ite.quantidade) * parseFloat(ite.valor_unitario)) / meses)
              //       let parcQtde = parseInt(parseFloat(ite.quantidade) / meses)
              //       let difValor = (parseFloat(ite.quantidade) * parseFloat(ite.valor_unitario)) - (parcValor * meses)
              //       let difQtde = (parseFloat(ite.quantidade)) - (parcQtde * meses)
              //       console.log('parcValor', parcValor)
              //       ite['orcamentos_mensalizados'] = []
              //       for (let p = 1; p <= meses; p++) {
              //         // Servicos rateados no período
              //         let orcMes = {
              //           'periodo': parseInt(_.has(ite, 'periodo_inicial') ? ite.periodo_inicial : ite.nr_periodo_inicial) + p - 1,
              //           'quantidade': p === meses ? parcQtde + difQtde : parcQtde,
              //           'valor': p === meses ? parcValor + difValor : parcValor
              //         }
              //         ite.orcamentos_mensalizados.push(orcMes)
              //         console.log('       Servicos', ite['orcamentos_mensalizados'], orcMes)
              //       }
              //     }
              //   }
              // } else {
              if ('' + ite.origem === '2') { // Contrapartida no último mês do seu período
                ite['orcamentos_mensalizados'] = [{
                  'periodo': parseInt(ite.nr_periodo_final),
                  'quantidade': parseFloat(ite.quantidade),
                  'valor': (parseFloat(ite.quantidade) * parseFloat(ite.valor_unitario))
                }]
              } else {
                if (ite.item['ds_type'] === 'PRODUTO') {
                  // Produtos no primeiro mês do período
                  ite['orcamentos_mensalizados'] = [{
                    'periodo': parseInt(_.has(ite, 'periodo_inicial') ? ite.periodo_inicial : ite.nr_periodo_inicial),
                    'quantidade': parseFloat(ite.quantidade),
                    'valor': (parseFloat(ite.quantidade) * parseFloat(ite.valor_unitario))
                  }]
                } else {
                  let meses = parseInt(_.has(ite, 'periodo_final') ? ite.periodo_final : ite.nr_periodo_final) - parseInt(_.has(ite, 'periodo_inicial') ? ite.periodo_inicial : ite.nr_periodo_inicial) + 1
                  let parcValor = parseInt((parseFloat(ite.quantidade) * parseFloat(ite.valor_unitario)) / meses)
                  let parcQtde = parseInt(parseFloat(ite.quantidade) / meses)
                  let difValor = (parseFloat(ite.quantidade) * parseFloat(ite.valor_unitario)) - (parcValor * meses)
                  let difQtde = (parseFloat(ite.quantidade)) - (parcQtde * meses)
                  ite['orcamentos_mensalizados'] = []
                  for (let p = 1; p <= meses; p++) {
                    // Servicos rateados no período
                    let orcMes = {
                      'periodo': parseInt(_.has(ite, 'periodo_inicial') ? ite.periodo_inicial : ite.nr_periodo_inicial) + p - 1,
                      'quantidade': p === meses ? parcQtde + difQtde : parcQtde,
                      'valor': p === meses ? parcValor + difValor : parcValor
                    }
                    ite.orcamentos_mensalizados.push(orcMes)
                  }
                }
                // }
              }
            }
          }
        }
        //
        this.$forceUpdate()
        this.carregou = true
        this.$snotify.clear()
        setTimeout(() => {
          this.$snotify.success('Proposta carregada com sucesso!', {timeout: 4000})
          if (this.$route.query.print) {
            this.imprimirRelatorio()
          }
        }, 4000)
      })
        .catch((error) => {
          // console.log('>>>> error', error)
          this.$root.trataErro(error)
        })
    },
    methods: {
      closewindow () {
        close()
      },
      ehNulo (valor, opcao) {
        return _.isNull(valor) || _.isNil(valor) || _.isUndefined(valor) ? opcao : valor
      },
      equivalenciaPeriodoMesAno () {
        // TODO corrigir mes final de 'Período de Realização do Projeto' na proposta impressa, plano de trabalho etc
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
        let t = 0
        _.forEach(this.proposta.atividades, function (a) {
          t += _.sumBy(a.itens_orcamentos, function (i) {
            return ((origem === ('' + i.origem).substr(0, 1)) ? (_.has(i, 'orcamentos_mensalizados') ? parseFloat(i.quantidade) * parseFloat(i.valor_unitario) : parseFloat(i.quantidade) * parseFloat(i.valor_unitario)) : 0)
            // return ((origem === ('' + i.origem).substr(0, 1)) ? (_.has(i, 'orcamentos_mensalizados') ? _.sumBy(i.orcamentos_mensalizados, 'valor') : parseFloat(i.quantidade) * parseFloat(i.valor_unitario)) : 0)
          })
        })
        return t
      },
      mostrarRef (ref) {
        return _.filter(this.elementos, item => item.nome === ref).some((item) => { return item.visivel })
      },
      async buscaEntidades () {
        let currentDate = new Date()
        let hoje = moment(currentDate).format('YYYYMMDD')
        await axiosLaravel.get('entidades/' + this.proposta.entidade.id).then((response) => {
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
          this.$forceUpdate
        })
          .catch((error) => {
            if (error) {
              this.$snotify.clear()
              this.$root.trataErro(error)
            }
          })
      },
      buscaFluxo () {
        //  Verificar no retorno se a atividade atual é referente a esta página se não então erro
        //  Carregar array de refs de elementos ou não (v-if)
        axiosLaravel.post('fluxo/', {'id_proposta': this.proposta.id, 'atividade': 'SOLICITACAO'}).then((response) => {
          this.fluxo = response.data
          this.elementos = this.fluxo.elementos
          this.loading.show = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
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
