<template>
  <div class="content-wrapper" ref="contentWrapper" id="liquidacoes" v-bind:style="'min-height: ' + alturaContentWrapper + 'px'">

    <vue-headful :title="'SGP - Liquidação Financeira'"/>

    <div class="row">

      <!------------------------------------------------------------------------------------------------------------>
      <section class="content-header">


        <h1 class="col-lg-8 text-left">
          Liquidação Financeira
          <g-button-ujarak color="warning" size="button--size-ss" @click.native="visualizarImpressao" v-if="!mostraCarregando">
            <i class="fa fa-print"></i> Impressão
          </g-button-ujarak>

          <div class="espacamento_botoes"></div>

          <g-button-ujarak :color="mostrarCampoEntrada ? 'primary' : 'warning'" size="button--size-ss" @click.native="mostrarCampoEntrada = !mostrarCampoEntrada, opcoesPesquisa = false" v-if="!mostraCarregando"
                     :title="'<h5>130 - Títulos em Pagamento Eletrônico - por remessa (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
            <i :class="'fa fa-caret-' + (mostrarCampoEntrada ? 'up': 'down')"></i> Relatório 130
          </g-button-ujarak>

          <!-- Botão ocultado esperando retorno de webservice da Senior para recuperação/processamento de arquivo retorno ---------------------->
          <!--<div class="espacamento_botoes"></div>-->
          <!--<g-button-ujarak :color="opcoesPesquisa ? 'primary' : 'warning'" size="button&#45;&#45;size-ss" @click.native="opcoesPesquisa = !opcoesPesquisa, mostrarCampoEntrada = false" v-if="!mostraCarregando"-->
                           <!--:title="'<h5>Pesquisar processos no banco de dados</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">-->
            <!--<i :class="'fa fa-caret-' + (opcoesPesquisa ? 'up': 'down')"></i> Pesquisar-->
          <!--</g-button-ujarak>-->

        </h1>

        <!-- Opções de filtro: mostrar ocultar itens pesquisados ---------------------------------------------->
        <div class="col-lg-4 pull-right">
          <div class="input-group">
            <input v-model="filtro" v-on:keyup.enter="filtrar()" type="text" class="form-control" placeholder="Procurar na lista abaixo..." ref="caixaPesquisa" @focus="$event.target.select()"
                   :title="'<h5>Digite uma palavra ou número e pressione Enter</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
            <span class="input-group-btn" v-if="filtro.length > 0" :title="'<h5>Limpar essa procura</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                <button @click="filtro = ''; filtrar()" type="button" class="btn" style="background: white; border-color: #d2d6de; border-width: 1px 0px;"><i class="fa fa-remove"></i></button>
              </span>
            <span class="input-group-btn">
                <button :disabled="!filtro" @click="filtrar()" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
              </span>
          </div>
        </div>


        <!-- Campos de entrada para relatório do Sapiens -------------------->
        <div v-if="mostrarCampoEntrada" class="col-lg-12">
          <div v-show="mostraProcessando" class="overlay" style="position: absolute;top: 10px;left: 15px;width: 98%;height: 100%;display: block;background: rgba(255,255,255,0.7);z-index: 1000;text-align: center;font-size: 30px;"><i data-v-45de4eed="" class="fa fa-refresh fa-spin"></i></div>
          <br/>
          <div class="col-lg-5">
            <multiselect v-model="parametrosEntradaParaRelatorio130.portador"
                         :options="dadosParaRelatorio130.portador"
                         :multiple="false"
                         :custom-label="portadorNome"
                         placeholder="Selecione um Portador"
                         label="DesPor"
                         track-by="DesPor"
                         :close-on-select="true"
                         selectLabel="Aperte ENTER para selecionar"
                         deselectLabel="Aperte ENTER para remover"
                         name="portador"
                         v-validate="'required'"
                         :value="DesPor">
              <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
              </multiselect>
            <span v-if="errors.first('portador')" class="label label-danger"> {{ errors.first('portador') }}</span>
          </div>


          <div class="col-lg-2">
            <multiselect v-model="parametrosEntradaParaRelatorio130.remessa"
                         :options="dadosParaRelatorio130.remessa"
                         :multiple="false"
                         :custom-label="remessaNome"
                         placeholder="Selecione uma Remessa"
                         label="NumArb"
                         track-by="NumArb"
                         :close-on-select="true"
                         selectLabel=""
                         deselectLabel=""
                         name="numero da remessa"
                         v-validate="''"
                         :value="NumArb">
              <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
            </multiselect>
            <span v-if="errors.first('numero da remessa')" class="label label-danger"> {{ errors.first('numero da remessa') }}</span>
          </div>


          <div class="col-lg-3">
            <multiselect v-model="parametrosEntradaParaRelatorio130.dataPagamento"
                         :options="dadosParaRelatorio130.dataPagamento"
                         :multiple="false"
                         :custom-label="dataPagamentoNome"
                         placeholder="Selecione uma Data de Pagamento"
                         label="DatPgt"
                         track-by="DatPgt"
                         :close-on-select="true"
                         selectLabel="Aperte ENTER para selecionar"
                         deselectLabel="Aperte ENTER para remover"
                         name="data de pagamento"
                         v-validate="''"
                         :value="DatPgt">
              <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
            </multiselect>
            <span v-if="errors.first('data de pagamento')" class="label label-danger"> {{ errors.first('data de pagamento') }}</span>
          </div>

          <div class="col-md-2">
            <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(130)">
              <i class="fa fa-print"></i> Emitir Relatório
            </g-button-ujarak>
          </div>

        </div>

        <!-- Opções de pesquisa: busca novo roll de itens, atualiza a tela, filtros e seleções ---------------------------------->
        <div v-if="opcoesPesquisa" class="col-lg-12">
          <br/>
          <div class="form-group col-lg-5">
            <label class="control-label col-md-3">Periodo de </label>
            <div class="col-md-4">
              <div class="input-group">
                <input type="text" name="pesquisaInicio" v-model="pesquisa.inicio" class="form-control"
                       v-mask="'##/##/####'" data-vv-as="Data de nascimento" :masked="masked"
                       v-validate="'validdate|dateeqpast|date_format:dd/MM/yyyy'">
              </div>
            </div>
            <label class="control-label col-md-1"> a </label>
            <div class="col-md-4">
              <div class="input-group">
                <input type="text" name="pesquisaTermino" v-model="pesquisa.termino" class="form-control"
                       v-mask="'##/##/####'" data-vv-as="Data de nascimento" :masked="masked"
                       v-validate="'validdate|dateeqpast|date_format:dd/MM/yyyy'">

              </div>
            </div>
          </div>

          <div class="col-lg-3">
            <multiselect v-model="pesquisa.forma_pagamento"
                         :options="listaFormasPagamento"
                         :multiple="true"
                         :custom-label="formaPagamentoNome"
                         placeholder="Selecione um ou mais Formas de Pagamento"
                         label="ds_description"
                         track-by="ds_description"
                         :preselect-first="false"
                         :close-on-select="false"
                         selectLabel="Aperte ENTER para selecionar"
                         deselectLabel="Aperte ENTER para remover"
                         selectedLabel=""
                         name="formasPagamento"
                         :value="ds_code">
              <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.option.type }}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
              <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
            </multiselect>
          </div>

          <div class="col-lg-3">
            <multiselect v-model="pesquisa.conta"
                         :options="listaContasMovimento"
                         :multiple="true"
                         :custom-label="contasMovimentoNome"
                         placeholder="Selecione um ou mais contaMovimento"
                         label="numero_conta"
                         track-by="numero_conta"
                         :preselect-first="false"
                         :close-on-select="false"
                         selectLabel="Aperte ENTER para selecionar"
                         deselectLabel="Aperte ENTER para remover"
                         selectedLabel=""
                         name="contaMovimento"
                         :value="numero_conta">
              <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.option.type }}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
              <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
            </multiselect>
          </div>

          <div class="col-lg-1">
            <g-button-ujarak color="primary" size="button--size-ss" @click.native="buscaProcessos"
                             :title="'<h5>Irá pesquisar todos os processo retornado o que foi pedido nas opções ao lado</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }">
              <i class="fa fa-search"></i> Pesquisar
            </g-button-ujarak>
          </div>

        </div>


        <!-- Contadores gerais ----------------------------------------------------------->
        <div class="col-lg-12">
          <br/>
          <span class="truncar" style="padding-top:5px; font-size:18px; color:darkgray;">
            <span style="margin-left: 5px;color: firebrick; font-weight: bold">{{totalTarefas(listaValidacoes)}}</span> tarefa(s)
            <span v-if="tarefasSelecionadas.length > 0"> com <span style="color: var(--cor-azul)">{{tarefasSelecionadas.length}}</span> selecionada{{tarefasSelecionadas.length > 1 ? 's' : ''}}</span>
          </span>

          <div class="espacamento_botoes"></div>

        <!-- Opções de seleção: formas de selecionar itens pesquisados e filtrados -->
          <span class="indicadores-cb-inline" :disabled="mostraProcessando" v-if="totalTarefas(listaValidacoes) > 0">
            <div class="juntos">
              <i @click="selecionarTarefas" :class="(listaValidacoes.length !== tarefasSelecionadas.length && listaValidacoes.length > 0 ? 'fa fa-square-o' : 'fa fa-check-square-o selecionado')" aria-hidden="true"></i>
              <span :class="listaValidacoes.length !== tarefasSelecionadas.length && listaValidacoes.length > 0 ? '' : 'selecionado'" >Selecionar tudo</span>
            </div>
          </span>
        </div>




        <!-- Botões de ação gerais ------------------------------------------>
        <div class="col-lg-12">
          <div v-if="tarefasSelecionadas.length > 0" class="text-left">

            <span v-if="!mostraProcessando">

<!-- Botão ocultado enquanto não fia pronto webservice para gerar remessa ---------------------->
              <!--<span :title="'<h5>Criar arquivo remessa com <span class=\'realce\'>' + tarefasSelecionadas.length + '</span> item(ns) selecionado(s</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }" style="display: inline-block;">-->
                <!--<g-button-ujarak color="primary" size="button&#45;&#45;size-ss" @click.native="preparandoRemessa">-->
                  <!--<i class="fa fa-download"></i> Gerar Remessa-->
                <!--</g-button-ujarak>-->
              <!--</span>-->
              <!--<div class="espacamento_botoes"></div>-->


              <g-button-ujarak color="success" size="button--size-ss" @click.native="atribuirLote(false)" v-if="false"
                               :title="'<h5>Finalizar no SGP os processos selecionados</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }">
                <i class="fa fa-check"></i> Concluir Processo
              </g-button-ujarak>

              <div class="espacamento_botoes"></div>

               <span :title="'<h5>Baixar <span class=\'realce\'>' + tarefasSelecionadas.length + '</span> item(ns) selecionado(s) em Excel</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }" style="display: inline-block;">
                <download-excel
                  :data   = "tarefasSelecionadas"
                  :meta   = "excel_meta"
                  :fields = "excel_campos"
                  type    = "xls"
                  name    = "LiquidaçõesSelecionadas.xls">
                  <g-button-ujarak color="primary" size="button--size-ss">
                    <i class="fa fa-download" aria-hidden="true"></i> Baixar planilha
                  </g-button-ujarak>
                </download-excel>
              </span>

            </span>

            <span v-if="mostraProcessando">
              <i class="fa fa-refresh fa-spin"></i>
            </span>
          </div>
        </div>

      </section>

    </div>

    <!-- Main content :: Lista de Processos, Atividades e Tarefas ------------------------------------------------>
    <section class="content" style="padding-top: 60px;">
      <p class="visible-sm visible-xs nao_imprimir">&nbsp;</p><p class="visible-xs nao_imprimir">&nbsp;</p><p class="visible-xs nao_imprimir">&nbsp;</p>
      <div v-if="tarefasSelecionadas.length > 0"><p>&nbsp;</p></div>

      <table class="w100 imprimir">
        <tr>
          <td><img src="/static/img/logo-login.png" class="logo_relatorio"></td>
          <td></td>
          <td class="direita">
            <span style="font-size: 40px !important">Lista de Liquidações Financeiras</span>
          </td>
        </tr>
      </table>


      <h4 v-if="mostraCarregando" class="box-body text-center"><i class="fa fa-refresh fa-spin"></i></h4>
      <h4 v-if="somenteComTarefas === 'sim' && totalTarefas(listaValidacoes) === 0" class="box-body">Não há tarefas para o filtro selecionado</h4>

      <!-------------------------------------------------------------------------------------------------------------------------------------------->
      <div class="box box-widget" v-if="!mostraCarregando">

        <div class="box-header">
          <h3 class="box-title">
            <span> Lista de processos para liquidação<span class="contador">{{totalTarefas(listaValidacoes)}}</span></span>
          </h3>
        </div>

        <div class="box-body">

          <!-------------------------------------------------------------------------------------------------------------------------------------------->
          <div v-show="mostraProcessando" class="overlay box box-widget" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
            <i class="fa fa-refresh fa-spin"></i>
          </div>

          <div>
            <div fluid>

              <div class="col-md-12">

                <div class="row tarefa nao_imprimir" v-for="tarefa in listaValidacoes">

                  <div class="col-lg-1 col-md-2 col-sm-2 col-xs-2" style="height: 46px;">
                      <span class="indicadores">
                        <i @click="selecionarItem(tarefa)" :class="(_.find(tarefasSelecionadas, ['id_processo', tarefa.id_processo]) ? 'fa fa-check-square-o' : 'fa fa-square-o') + ' selecao'" class="nao_imprimir" aria-hidden="true"></i>
                        <span class="text-muted" v-html="tarefa.id_processo"></span>
                        <p class="truncar" :class="tarefa.situacao_processo === 'EM_EXECUCAO' ? 'text-green' : 'text-blue'">{{ enumeradores[tarefa.situacao_processo] }}</p>
                      </span>
                  </div>

                  <div class="col-lg-4 col-md-10 col-sm-10 col-xs-10" style="height: 46px;">
                    <div class="projeto truncar" v-html="tarefa.projeto"></div>
                    <div class="fornecedor truncar">{{tarefa.fornecedor_codigo}} - {{tarefa.fornecedor_nome}}</div>
                  </div>

                  <div class="visible-xs col-xs-2" style="height: 46px;">&nbsp;</div>

                  <div class="col-lg-1 col-md-2 col-sm-2 col-xs-3" style="height: 46px;">
                      <span v-if="tarefa.contas.length === 1">
                        <span>{{_.head(tarefa.contas)}}</span>
                      </span>
                    <span v-if="tarefa.contas.length > 1"
                          :title="'<h5>Há <span class=\'realce\'>' + tarefa.contas.length + '</span> contas vinculadas a este projeto:<br/><span class=\'realce\'>' + _.join(tarefa.contas, '<br/>') + '</span></h5>'"
                          v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                        <span>{{_.head(tarefa.contas)}}</span>
                        <i class="fa fa-exclamation-circle text-red nao_imprimir"></i>
                      </span>
                    <br/>
                    <span>{{tarefa.projeto_mci}}</span>
                  </div>

                  <div class="col-lg-1 col-md-2 col-sm-2 col-xs-2" style="height: 46px;">
                    <span><span class="esmaecido">Nº</span> {{tarefa.documento_numero}}</span>
                    <!--<span><span class="esmaecido">Série</span> {{tarefa.documento_serie}}</span>-->
                  </div>

                  <div class="col-lg-2 col-md-3 col-sm-3 col-xs-5" style="height: 46px;">
                    <span>{{tarefa.banco}} <span class="esmaecido">/</span> {{tarefa.agencia}} <span class="esmaecido">/</span> {{tarefa.conta}}</span> <br/>
                    <div class="truncar">{{tarefa.codigo_forma_pagamento}} - {{tarefa.descricao_forma_pagamento}}</div>
                  </div>

                  <div class="visible-xs col-xs-2" style="height: 46px;">&nbsp;</div>

                  <div class="col-lg-1 col-md-2 col-sm-2 col-xs-3" style="height: 46px;">
                    <span>{{tarefa.valor_informado | real}}</span> <br/>
                    <span>{{tarefa.valor_liquido | real}}</span>
                  </div>

                  <div class="col-lg-1 col-md-2 col-sm-2 col-xs-4" style="height: 46px;">
                    {{tarefa.data_solicitacao | moment("DD/MM/YYYY HH:mm")}}
                  </div>

                  <div class="col-lg-1 col-md-1 col-sm-1 col-xs-3 text-right" style="height: 46px; padding: 2px 0;">
                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="atribuirFazer(tarefa)"
                                     :title="'<h5>Assumir e Fazer</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }">
                      <i class="fa fa-pencil" aria-hidden="true"></i>
                    </g-button-ujarak>
                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="segueReanalisarOuReanalisar(tarefa.situacao_processo, tarefa.id_processo)"
                                     :title="'<h5>Está ' + enumeradores[tarefa.situacao_processo] + '. Clique para ' + (tarefa.situacao_processo === 'EM_EXECUCAO' ? 'Reanalisar' : 'Reativar') + ' este processo</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }">
                      <i :class="'fa fa-' + (tarefa.situacao_processo === 'EM_EXECUCAO' ? 'undo' : 'play')" aria-hidden="true"></i>
                    </g-button-ujarak>
                  </div>

                </div>


              <!-- Versão para impressão  -->
                <div class="row imprimir zoom70">
                  <table class="table table-condensed table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Fornecedor</th>
                        <th>Conta</th>
                        <th>MCI</th>
                        <th>Nº Doc</th>
                        <th>Forma de Pagamento</th>
                        <th>Dados Bancários</th>
                        <th>Valor Inf.</th>
                        <th>Valor Liq.</th>
                        <th>Data da Solicitação</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr v-for="tarefa in listaValidacoes">
                      <td>{{tarefa.id_processo}}</td>
                      <td>{{tarefa.fornecedor_codigo}} - {{tarefa.fornecedor_nome}}</td>
                      <td>{{_.head(tarefa.contas)}}</td>
                      <td>{{tarefa.projeto_mci}}</td>
                      <td>{{tarefa.documento_numero}}</td>
                      <td>{{tarefa.codigo_forma_pagamento}} - {{tarefa.descricao_forma_pagamento}}</td>
                      <td><span>{{tarefa.banco}} <span class="esmaecido">/</span> {{tarefa.agencia}} <span class="esmaecido">/</span> {{tarefa.conta}}</span></td>
                      <td>{{tarefa.valor_informado | real}}</td>
                      <td>{{tarefa.valor_liquido | real}}</td>
                      <td>{{tarefa.data_solicitacao | moment("DD/MM/YYYY HH:mm")}}</td>
                    </tr>
                    </tbody>
                  </table>
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

  export default {
    name: 'LiquidacaoFinanceira',
    data () {
      return {
        opcoesPesquisa: false,
        pesquisa: {
          inicio: null,
          termino: null,
          forma_pagamento: [],
          conta: []
        },
        filtro: '',
        listaFormasPagamento: [],
        listaContasMovimento: [],
        selecionarTodasTarefas: 'nao',
        somenteComTarefas: 'nao',
        // meusFavoritados: 'nao',
        minhasTarefas: 'nao',
        comProjetos: 'nao',
        processos: [],
        tarefas: [],
        excel_campos: {
          'ID': 'id_processo',
          'Processo': 'nome_processo',
          'Atividade': 'nome_tarefa',
          'Projeto': 'projeto',
          'Cód. Fornecedor': 'fornecedor_codigo',
          'Nome Fornecedor': 'fornecedor_nome',
          'Contas': 'contas',
          'MCI Projeto': 'projeto_mci',
          'Nr. Documento': 'documento_numero',
          'Banco': 'banco',
          'Agencia': 'agencia',
          'Conta': 'conta',
          'Cód Forma de Pag': 'codigo_forma_pagamento',
          'Forma de Pagamento': 'descricao_forma_pagamento',
          'Valor Original': 'valor_informado',
          'Valor Líquido': 'valor_liquido',
          'Data de solicitação': 'data_solicitacao'
        },
        excel_meta: [[{'key': 'charset', 'value': 'utf-8'}]],
        validacao: 'LIQUIDACAO',
        mostraCarregando: true,
        mostraProcessando: false,
        mostrarCampoEntrada: false,
        dadosParaRelatorio130: {},
        parametrosEntradaParaRelatorio130: {},
        tarefasSelecionadas: [],
        mostrarProcesso: [],
        mostrarAtividade: [],
        listaValidacoesBackup: {},
        listaValidacoes: {
          PAGAMENTO: {
            LIQUIDACAO_FINNCEIRA: []
          },
          PRESTACAO_DE_CONTAS: {
            LIQUIDACAO_FINNCEIRA: []
          }
        },
        listaContasProjetos: [],
        opcoes: '',
        enumeradores: { 'PAGAMENTO': 'Pagamento', 'PRESTACAO_DE_CONTAS': 'Prestação de Contas', 'LIQUIDACAO_FINANCEIRA': 'Liquidação Financeira', 'FEITO': 'Feito', 'EM_EXECUCAO': 'Em Execução', 'CANCELADO': 'Cancelado' },
        processosPorValidacao: {
          'SOLICITACOES': ['PAGAMENTO', 'PRESTACAO_DE_CONTAS']
        },
        // limparPesquisa: false,
        alturaContentWrapper: window.innerHeight - 51
      }
    },
    watch: {
      minhasTarefas () {
        this.filtrar()
      },
      comProjetos () {
        this.filtrar()
      },
      somenteComTarefas () {
        this.filtrar()
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    async created () {
      this.buscaFormasPagamento()
      this.buscarContasMovimento()
      this.buscaProcessos()
      this.buscarDadosParaRelatorio130()
    },
    methods: {
      portadorNome (option) {
        return `${option.CodPor + ' - ' + option.DesPor + ' - ' + option.NumCco}`
      },
      remessaNome (option) {
        return `${option.NumArb}`
      },
      dataPagamentoNome (option) {
        return `${option.DatPgt}`
      },
      contasMovimentoNome (option) {
        return `${option.numero_conta}`
      },
      buscaFormasPagamento () {
        axiosLaravel.get('pagamento/formasPagamento').then(async (response) => {
          console.log('FP: ', response.data)
          this.listaFormasPagamento = response.data
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
            this.$snotify.clear()
          })
      },
      buscarContasMovimento () {
        axiosLaravel.get('pagamento/contasMovimento').then(async (response) => {
          console.log('FP: ', response.data)
          this.listaContasMovimento = response.data
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
            this.$snotify.clear()
          })
      },
      selecionarTarefas (opcao) {
        this.selecionarTodasTarefas = _.includes(['sim', 'nao'], opcao) ? opcao : ((this.selecionarTodasTarefas === 'nao') ? 'sim' : 'nao')
        this.tarefasSelecionadas = []
        if (this.selecionarTodasTarefas === 'sim') {
          this.listaValidacoes.forEach((processo) => {
            this.tarefasSelecionadas.push(processo)
          })
        }
        this.$forceUpdate()
      },
      totalTarefas (item) {
        // Se trata de uma função recursiva que busca N níveis de objetos até achar um array onde devolve a quantidade de elementos dele acumulativamente
        let vm = this
        if (_.isArray(item)) {
          return item.length
        } else {
          let total = 0
          _.forEach(_.keys(item), function (i) {
            total += vm.totalTarefas(item[i])
          })
          return total
        }
      },
      mostrar (secao, elemento) {
        let mostrarSecao = (secao === 'processo') ? this.mostrarProcesso : this.mostrarAtividade
        if (_.isUndefined(_.find(mostrarSecao, function (s) { return s === elemento }))) {
          mostrarSecao.push(elemento)
        } else {
          _.pull(mostrarSecao, elemento)
        }
        this.$forceUpdate()
        this.salvarConfiguracoes()
      },
      aviso (retorno) {
        console.log('retorno', retorno)
        if (_.has(retorno, 'codigo') && _.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) {
          this.$snotify.clear()
          if (retorno.codigo === 'ERRO') {
            this.$snotify.error(retorno.mensagem)
          } else {
            if (retorno.codigo === 'OK') {
              this.$snotify.success(retorno.mensagem, {timeout: 3000})
            }
          }
        }
      },
      async buscaProcessos () {
        this.mostraProcessando = true
        // let vm = this
        let pesquisa = this.pesquisa
        pesquisa['contasFinanceirasSelecionadas'] = _.map(pesquisa.conta, 'numero_conta')
        pesquisa['formasPagamentoSelecionados'] = _.map(pesquisa.forma_pagamento, 'nr_code')
        console.log('pesquisa >>>>>>>', pesquisa)
        await axiosLaravel.post('pagamento/liquidacoes', {'pesquisa': pesquisa}).then(async (response) => {
          console.log('liquidacoes : response.data >>>>>>>', response.data)
          this.listaContasProjetos = response.data.retorno.contas
          //
          let idProcessosValidos = _.uniq(_.map(this.listaContasProjetos, 'id_processo'))
          this.listaValidacoes = _.filter(response.data.retorno.tarefas, function (tarefa) {
            return _.includes(idProcessosValidos, tarefa.id_processo)
          })
          //
          this.listaValidacoes.forEach((item) => {
            item['contas'] = _.map(_.filter(this.listaContasProjetos, function (contas) {
              return item.id_processo === contas.id_processo
            }), 'conta')
          })
          //
          this.listaValidacoesBackup = _.cloneDeep(this.listaValidacoes)
          this.aviso(response.data)
          this.mostraProcessando = false
          this.mostraCarregando = false
          this.opcoesPesquisa = false
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
            this.$snotify.clear()
          })
      },
      visualizarImpressao () {
        window.print()
      },
      downloadLote () {
        // TODO implementar futuramente download em lote dos anexos
        axiosLaravel.post('processos/download/lote', this.listarSelecionados()).then((response) => {
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      salvarConfiguracoes () {
        let vm = this
        _.set(this.usuarioLogado, 'configuracoes.tela_validacao', {
          'pesquisa': vm.pesquisa,
          'mostrarProcesso': _.uniq(vm.mostrarProcesso),
          'mostrarAtividade': _.uniq(vm.mostrarAtividade),
          'somenteComTarefas': vm.somenteComTarefas,
          // 'meusFavoritados': vm.meusFavoritados,
          'minhasTarefas': vm.minhasTarefas,
          'comProjetos': vm.comProjetos
        })
        //
        axiosLaravel.post('/usuario/configuracoes', {'configuracoes': this.usuarioLogado.configuracoes}).then((response) => {
          console.log('configuracoes', this.usuarioLogado.configuracoes)
        })
          .catch((error) => {
            if (error) {
              console.log('error', error)
              this.$root.trataErro(error)
            }
          })
      },
      filtrar () {
        // TODO excluir campo de filtro e funcionalidades ligadas a ele
        this.mostraProcessando = true
        this.mostraProcessando = false
        if (this.selecionarTodasTarefas === 'sim') {
          this.selecionarTarefas('nao')
        }
        this.$refs.caixaPesquisa.focus()
        this.$forceUpdate()
        this.salvarConfiguracoes()
      },
      atribuirLote (atribuir) {
        this.mostraProcessando = true
        axiosLaravel.post('processos/validacao/atribuir/lote', {'lista': this.tarefasSelecionadas, 'atribuir': atribuir}).then((response) => {
          let vm = this
          let idUsuario = atribuir ? vm.usuarioLogado.id : null
          let nomeUsuario = atribuir ? vm.usuarioLogado.userName : null
          _.forEach(this.listaValidacoes, function (processo) {
            _.forEach(processo, function (atividade) {
              _.forEach(atividade, function (tarefa) {
                if (_.includes(_.map(vm.tarefasSelecionadas, 'id_tarefa_atual'), tarefa.id_tarefa_atual)) {
                  tarefa.id_usuario = idUsuario
                  tarefa.nome_usuario = nomeUsuario
                }
              })
            })
          })
          // Alterar tambem na listaValidacoesBackup assim não precisará fazer reload da página
          _.forEach(this.listaValidacoesBackup, function (processo) {
            _.forEach(processo, function (atividade) {
              _.forEach(atividade, function (tarefa) {
                if (_.includes(_.map(vm.tarefasSelecionadas, 'id_tarefa_atual'), tarefa.id_tarefa_atual)) {
                  tarefa.id_usuario = idUsuario
                  tarefa.nome_usuario = nomeUsuario
                }
              })
            })
          })
          //
          this.tarefasSelecionadas = []
          this.selecionarTodasTarefas = 'nao'
          this.mostraProcessando = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.mostraProcessando = false
            this.$root.trataErro(error)
          })
      },
      selecionarItem (item) {
        if (_.find(this.tarefasSelecionadas, ['id_processo', item.id_processo])) {
          _.remove(this.tarefasSelecionadas, function (i) {
            return i['id_processo'] === item.id_processo
          })
        } else {
          this.tarefasSelecionadas.push(item)
        }
        this.selecionarTodasTarefas = this.tarefasSelecionadas.length === this.listaValidacoes.length && this.listaValidacoes.length > 0 ? 'sim' : 'nao'
        this.$forceUpdate()
      },
      segueReanalisarOuReanalisar (situacao, idProcesso) {
        let vm = this
        let acao = _.includes(['FEITO', 'CANCELADO'], situacao) ? 'reativar' : 'reanalisar'
        this.$dialog.confirm('Tem certeza que deseja ' + acao + ' esta solicitação de id <b>' + idProcesso + '</b>?', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
          let rota = 'processos/' + acao + '/'
          vm.$snotify.async('Processando ação para ' + acao + ' esta solicitação...', {timeout: 0})
          axiosLaravel.put(rota + idProcesso).then((response) => {
            vm.$snotify.clear()
            vm.$snotify.success('Solicitação executada com sucesso!')
            vm.buscaProcessos()
          })
            .catch((error) => {
              vm.$snotify.clear()
              vm.$root.trataErro(error)
            })
          //
        }).catch(function () {
        })
      },
      atribuirFazer (item) {
        let padrao = new RegExp('<(mark|/mark|br|p|/p)[^>]{0,}>', 'gi') // Eliminar marcações desnecessárias ou que atrapalham o formato do objeto
        _.forEach(item, function (valor, parametro) {
          item[parametro] = ('' + valor).replace(padrao, '')
        })
        if (('' + item.id_usuario) !== ('' + this.usuarioLogado.id)) {
          axiosLaravel.put('processos/validacao/assumir/', {'id_tarefa': item.id_tarefa_atual}).then((response) => {
            console.log('Tarefa assumida')
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
        this.$router.push({name: 'solicitacao-pagamento', params: {id: item.id_processo, row: item, acao: 'VALIDAR'}})
      },
      preparandoRemessa () {
        let conteudo = '00100000         2016410000001330007121050126       01607100000040224830FUNDACAO BANCO DO BRASIL      BANCO DO BRASIL S/A                     12810202007530001736105000000                                                   CSP000            \r\n' +
          '00100011C2001031 2089297480001850007121050126       00220800001735622050ASSOCIACAO DE VOLUNTARIOS PARA                                        RUA FREDERICO SIMOES          0000013  ANDAR      SALVADOR            41820774BA                  \r\n' +
          '0010001300001A0000000010279950000000332603 0001ASSOCIACAO DE VOLUNTF17356095272330451-01 MIX 28102020BRL000000000000000000000000038760                    28102020000000000038760                                                    5          \r\n' +
          '0010001300002B   208929748000185RUA FREDERICO SIMOES          0000013  ANDAR      CAMINHO DAS ARVSALVADOR            41820774BA28102020000000000038760000000000000000000000000000000000000000000000000000000000000000000000095272               \r\n' +
          '00100015         000004000000000000038760                                                                                                                                                                                                       \r\n' +
          '00100021C2001031 2177541360001900007121050126       00344100002020202070MUNICIPIO DE DIAMANTINA                                               RUA DA GLORIA, N  394, CENTRO 00000CENTRO         DIAMANTINA          39100000MG                  \r\n' +
          '0010002300001A0000000010034410000000029696 0001MUNICIPIO DE DIAMANTF17402003269213-01    MIX 28102020BRL000000000000000000000000050000                    28102020000000000050000                                                    5          \r\n' +
          '0010002300002B   217754136000190RUA DA GLORIA, N  394, CENTRO 00000CENTRO         CENTRO         DIAMANTINA          39100000MG28102020000000000050000000000000000000000000000000000000000000000000000000000000000000000000003269               \r\n' +
          '00100025         000004000000000000050000                                                                                                                                                                                                       \r\n' +
          '00100031C2001031 2067400960001000007121050126       00094900001729200000ASSOCIACAO CRISTA DE BASE ACB                                         RUA CARIRIS                   00000CENTRO         CRATO               63113622CE                  \r\n' +
          '0010003300001A0000000010170720000001294849 0001F ROUMES R DE AGUIARF172921057285169-01   MIX 28102020BRL000000000000000000000000131865                    28102020000000000131865                                                    5          \r\n' +
          '0010003300002B   220169492000150RUA CONS. LAFAYETTE, 1046, JAR00000                              FORTALEZA           60340005CE28102020000000000131865000000000000000000000000000000000000000000000000000000000000000000000105728               \r\n' +
          '00199999         000010000042000000                                                                                                                                                                                                             \r\n' +
          'ARQUIVO FAKE PARA TESTES'
        // TODO criar código para gerar layout do CNAB240 em https://www.bb.com.br/docs/pub/emp/empl/dwn/PgtVer03BB.pdf
        this.downloadRemessa(conteudo, 'Remessa ' + moment().format('YYYY-MM-DD-HH-mm-ss'))
      },
      downloadRemessa (conteudo, nome) {
        const contentType = 'text/plain'
        let file = new Blob([conteudo], {type: contentType})
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        if (!ie) {
          let blob = file
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = nome
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          let blob = file
          let link = document.createElement('blob')
          link.href = window.navigator.msSaveOrOpenBlob(blob, nome)
          link.download = nome
          link.click()
        }
        this.$snotify.clear()
        this.$snotify.success('Remessa gerada com sucesso!')
        this.mostraCarregando = false
      },
      buscarDadosParaRelatorio130 () {
        axiosLaravel.get('/pagamento/dados/130').then((response) => {
          console.log('dadosParaRelatorio130', response.data)
          this.aviso(response.data)
          if (response.data.codigo === 'OK') {
            this.dadosParaRelatorio130 = response.data.retorno
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      emitir (relatorio) {
        this.$validator.validateAll().then(validado => {
          if (validado && relatorio === 130) {
            let param = this.parametrosEntradaParaRelatorio130
            if (!_.has(param, 'remessa') && !_.has(param, 'dataPagamento')) {
              this.$dialog.alert('Só foi selecionado o portador<br/>Além ele deve selecionar uma remessa OU uma data de pagamento', {html: true, animation: 'fade', customClass: 'avisoAlerta'})
            } else {
              this.mostraProcessando = true
              let arquivoRelatorio = 'FPCP130.GER'
              // let parametros = '<ECodPro=' + param.portador['CodPor'] + '>,<ENumRem=' + param.remessa['NumArb'] + '>,<EDatPgt=' + param.dataPagamento['DatPgt'] + '>'
              let parametros = '<ECodPro=' + param.portador['CodPor'] + '>'
              parametros += _.has(param, 'remessa') ? ',<ENumRem=' + param.remessa['NumArb'] + '>' : ''
              parametros += _.has(param, 'dataPagamento') ? '>,<EDatPgt=' + param.dataPagamento['DatPgt'] + '>' : ''
              console.log('parametros >>>>>>>>>>> ', parametros)
              this.$snotify.clear()
              this.$snotify.async('Gerando relatório ' + relatorio + '. Por favor, aguarde...', {timeout: 0})
              axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': arquivoRelatorio}, params: parametros}).then((response) => {
                this.onDownload(response, '130', this)
                this.mostraProcessando = false
              })
                .catch((error) => {
                  this.$snotify.clear()
                  this.mostraProcessando = false
                  this.$root.trataErro(error)
                })
            }
          }
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
          link.download = 'Relatório ' + relatorio
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          let blob = file
          let link = document.createElement('blob')
          link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
          link.download = 'Relatório ' + relatorio
          link.click()
        }
        this.$snotify.clear()
        this.$snotify.success('Relatório gerado com sucesso!')
        this.mostraCarregando = false
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
      }
    }
  }
</script>

<style scoped>
  #liquidacoes .esmaecido {
    color: var(--cor-fraca);
  }
  #liquidacoes .aprovado_por {
    color: #3c763d;
    text-align: left;
  }
  #liquidacoes .espacamento_botoes {
    margin: 0px 5px;
    display: inline-block;
  }

  #liquidacoes .indicadores-cb-inline div {
    display: inline;
  }

  #liquidacoes .indicadores-cb-inline div span {
    font-size: 14px;
    color: gray;
    vertical-align: text-bottom;
    padding-right: 15px;
  }

  #liquidacoes .indicadores-cb-inline div i {
    font-size: 20px;
    cursor: pointer;
  }
  #liquidacoes .indicadores-cb-inline div i:hover, .indicadores-cb-inline .selecionado {
    color: var(--cor-azul);
  }

  #liquidacoes .indicadores {
    font-size: 14px;
    color: silver;
  }

  #liquidacoes .indicadores i.selecao {
    cursor: pointer;
    padding-right: 10px;
  }

  #liquidacoes .indicadores i.selecao:hover {
    color: steelblue;
  }

  #liquidacoes .indicadores i.fa-star-o {
    color: #ddd;
  }

  div#listaValidacoes ul li a {
    zoom: 1.3;
  }
  #liquidacoes h4 {
    margin: 0;
  }

  #liquidacoes .grupoMostrarOcultar {
    color: steelblue;
  }
  #liquidacoes .grupoMostrarOcultar:hover {
    color: cornflowerblue;
    text-decoration: underline;
    cursor: pointer;
  }
  #liquidacoes .contador {
    margin-left: 50px;
    color: firebrick;
  }

  #liquidacoes i.opcao:hover {
    color: white;
    background: gray;
    border: 0;
  }

  #liquidacoes i.opcao {
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 5px;
    margin: 0 10px 0 0;
    font-size: 14px;
    min-width: 30px;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important;
  }
  #liquidacoes .opcao span {
    font-family: sans-serif, Arial, Verdana, "Trebuchet MS";
    padding-left: 5px;
  }
  #liquidacoes .projeto {
    font-weight: bold;
  }
  #liquidacoes .fornecedor {
    font-style: italic;
  }
  #liquidacoes .usuario {
    color: steelblue;
  }
  #liquidacoes .tarefa:hover {
    background: #ecf0f5;
  }
  #liquidacoes .tarefa {
    border-top: 1px solid silver;
  }
  #liquidacoes mark {
    background: #f9dd16 !important;
  }
  #liquidacoes .truncar {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  #liquidacoes .juntos {
    page-break-inside: avoid;
  }
  #liquidacoes .content-header {
    width: auto !important;
  }

/*Impressão *************************************************/
  #liquidacoes div.imprimir, #liquidacoes span.imprimir {
    display: none !important;
  }

  @media print {
    .control-label {
      text-transform: uppercase;
    }

    #liquidacoes div.nao_imprimir, #liquidacoes i.nao_imprimir, #liquidacoes p.nao_imprimir {
      display: none !important;
    }

    #liquidacoes table.nao_imprimir {
      visibility: collapse !important;
    }

    #liquidacoes div.imprimir, #liquidacoes span.imprimir {
      display: block !important;
    }

    #liquidacoes table.imprimir {
      visibility: visible !important;
    }
    #liquidacoes .zoom70 {
      zoom: .7;
    }
  }
</style>
