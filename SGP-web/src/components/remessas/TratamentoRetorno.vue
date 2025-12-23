<template>
  <div class="content-wrapper" ref="contentWrapper" id="liquidacoes" v-bind:style="'min-height: ' + alturaContentWrapper + 'px'">

    <vue-headful :title="'SGP - Tratamento de Retorno'"/>

    <section class="content-header">
      <h1> Liquidação Financeira</h1>
      <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Retorno', href: '#'}, {text: 'Tratamento de Retorno', active: true}]"/>
    </section>

    <section class="content" style="padding-top: 20px;">
      <p class="visible-sm visible-xs nao_imprimir">&nbsp;</p><p class="visible-xs nao_imprimir">&nbsp;</p><p class="visible-xs nao_imprimir">&nbsp;</p>

      <table class="w100 imprimir">
        <tr>
          <td><img src="/static/img/logo-login.png" class="logo_relatorio"></td>
          <td></td>
          <td class="direita">
            <span style="font-size: 40px !important">Títulos Diversos</span>
          </td>
        </tr>
      </table>


      <!-- Tratamento / Analise do Retorno -->
      <div class="box box-widget nao_imprimir">
        <div class="box-header with-border">
          <h3 class="box-title"><i class="fa fa-truck"></i> Retorno de Pagamento Eletrônico</h3>
        </div>

        <span class="box-body">
          <div v-show="loading.tela" class="overlay box box-widget" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

          <div class="col-lg-4" v-if="loading.retornos"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Retornos...</span></div>
          <div class="col-lg-4" v-else>
            <multiselect v-model="retorno"
                         :options="retornos"
                         :multiple="false"
                         placeholder="Selecione um lote de arquivos de Retorno"
                         @input="buscarConteudoArquivoRetorno"
                         label="numerador"
                         track-by="numerador"
                         :close-on-select="true"
                         selectLabel=""
                         deselectLabel=""
                         selectedLabel=""
                         name="retorno"
                         :value="usu_nomarq">
              <template slot="noResult">Nenhum registro localizado!</template>

              <template slot="option" slot-scope="props">
                <div v-if="props.option.usu_datoco === 'Data do retorno'" class="col-md-12">
                  <div class="col-md-6">{{ props.option.usu_datoco}}</div>
                  <div class="col-md-3 centralizar_elemento">Arquivos</div>
                  <div class="col-md-3 centralizar_elemento">Registros</div>
                </div>
                <div v-else class="col-md-12">
                  <div class="col-md-6">{{ props.option.usu_datoco | moment("L") }}</div>
                  <div class="col-md-3 centralizar_elemento"><div class="contadorRegistros" v-html="props.option.ArquivosRetorno"></div></div>
                  <div class="col-md-3 centralizar_elemento"><div class="contadorRegistros" v-html="props.option.QtdeRegistros"></div></div>
                </div>
              </template>

              <template slot="singleLabel" slot-scope="props"><div class="etiquetaRetorno"><span class="text-bold">{{ props.option.usu_datoco | moment('L') }}</span> Arquivos: <span class="contadorRegistros">{{ props.option.ArquivosRetorno }} </span> Registros: <span class="contadorRegistros">{{ props.option.QtdeRegistros }} </span></div></template>
            </multiselect>
          </div>


<!-- Processa os registros de retorno no Sapiens e no SGP ------------------------------------------------------------->
          <div class="col-lg-4" v-if="processamentoRetorno.length > 0 && _.get(retorno, 'usu_tiparq', 'PREVIA') !== 'PREVIA'">
            <g-button-ujarak color="warning" size="button--size-ss" @click.native="processarRetorno()" :title="'<h5>Processará o(s) <span class=\'realce\'>' + (retorno.ArquivosRetorno) + '</span> arquivo(s) abaixo</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', arrow: true}"><i class="fa fa-gears"></i> Processa retorno</g-button-ujarak>
          </div>
            

<!-- Resultado da analise do registro de retorno ---------------------------------------------------------------------->
          <span v-if="processamentoRetorno.length > 0">
            <div class="col-xs-12">&nbsp;</div>
            <div class="" v-if="processamentoRetorno.length > 0">

              <div class="col-xs-5">
                <div class="btn-group dropdown" style="padding: 6px 0;">
                  <div class="btn-group">
                    <span class="esmaecido" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="cursor: pointer">
                      Resumo: <span style="color: var(--cor-azul);font-weight: bold;">{{ (_.keys(_.groupBy(processamentoRetorno, 'usu_nomarq'))).length }}</span> arquivo(s) <i class="fa fa-exclamation-circle"></i>
                    </span>

                    <div class="dropdown-menu">
                      <table class="table table-striped" style="width: 400px">
                        <thead><tr role="menuitem"><th>Arquivo</th><th>Tipo</th><th><i class="fa fa-check" style="color: var(--cor-verde); font-weight: bold"></i></th><th><i class="fa fa-ban" style="color: var(--cor-vermelha); font-weight: bold"></i></th></tr></thead>
                        <tbody>
                        <tr role="menuitem" v-for="(titulos, arquivo) in _.groupBy(processamentoRetorno, 'usu_nomarq')" class="">
                          <td>{{ arquivo }}</td>
                          <td>{{ titulos[0].usu_tiparq }}</td>
                          <td>{{ (_.filter(titulos, ['processamento', 1])).length }}</td>
                          <td>{{ (_.filter(titulos, ['processamento', 2])).length }}</td>
                        </tr>
                        </tbody>
                        <tfoot><tr><th colspan="2" style="font-style: italic; color: var(--cor-fraca)">Total de <span style="color: var(--cor-azul);">{{ processamentoRetorno.length }}</span> título(s)</th><th style="color: var(--cor-verde);">{{ (_.filter(processamentoRetorno, ['processamento', 1])).length }}</th><th style="color: var(--cor-vermelha);">{{ (_.filter(processamentoRetorno, ['processamento', 2])).length }}</th></tr></tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-xs-7 pull-right">
                <span style="float: right;">
                  <select class="form-control" v-model="ordenacao.por" style="width: auto; float: left;" :title="'<h5>Selecione por qual critério deseja ordenar</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                    <option value="id">ID</option>
                    <option value="processamento">Com ou Sem Erros</option>
                    <option value="usu_octban">Código Retorno</option>
                    <option value="usu_nomarq">Arquivo</option>
                    <option value="usu_numtit">Número do Título</option>
                    <option value="numarb">Número da Remessa</option>
                    <option value="vlrmov">Valor</option>
                  </select>
                  <button type="button" @click="ordenacao.ordem = ordenacao.ordem === 'asc' ? 'desc' : 'asc'" class="btn btn-default btn-flat" style="float: left;"
                          :title="'<h5>Clique para inverter a ordenação</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                    <i :class="'fa fa-sort-alpha-' + ordenacao.ordem" style="font-size: 14px;"></i>
                  </button>
                </span>
              </div>

            </div>
            <div class="col-xs-12">&nbsp;</div>
          </span>


<!-- Lista de Títulos do Retorno -------------------------------------------------------------------------------------->
          <div class="">
            <div class="col-xs-12">

              <div v-for="titulo in ordenacao.por === 'vlrmov' ?
                                    _.orderBy(processamentoRetorno, [function(termo) { return parseFloat(termo[ordenacao.por]) }, ordenacao.por], [ordenacao.ordem]) :
                                    _.orderBy(processamentoRetorno, [ordenacao.por], [ordenacao.ordem])"
                   :class="'tarefa col-xs-12 ' + ('retornoProcessamento' + titulo.processamento)"
                   :ref="titulo.usu_numtit + titulo.usu_codtpt + titulo.usu_codfor">

                <div class="col-lg-1 col-md-2 col-sm-3 col-xs-3" style="height: 46px;">
                  <span class="indicadores">
                    <span class="text-muted" v-html="titulo.id"></span>
                    <p v-if="_.has(titulo, 'loading')" :class="'label label-' + titulo.loading.classe">{{ titulo.loading.texto }}</p>
                    <p v-else class="truncar" :class="titulo.situacao === 'EM_EXECUCAO' ? 'text-green' : 'text-blue'">{{ enumeradores[titulo.situacao] }}</p>
                  </span>
                </div>

                <div class="col-lg-3 col-md-5 col-sm-9 col-xs-9" style="height: 46px;">
                  <div class="text-bold truncar">{{titulo.usu_octban}} - {{_.get(_.find(ocorrencias, ['OctBan', titulo.usu_octban]), 'DesBan', '')}}</div>
                  <div class="truncar"> {{titulo.usu_desban}}</div>
                </div>

                <div class="col-lg-1 col-md-2 col-sm-3 col-xs-5 alinha_vertical" style="height: 46px;">
                  <div class="">{{titulo.usu_numtit}}</div>
                  <div><span class="text-bold">{{titulo.usu_codtpt}}</span> / <span>{{titulo.usu_codfor}}</span></div>
                </div>

                <div class="col-lg-2 col-md-3 col-sm-4 col-xs-7 alinha_vertical" style="height: 46px;">
                  <div><span class="text-blue">{{ titulo.numarb }}</span> / {{ titulo.numcco }}</div>
                  <div class="truncar">{{ titulo.tippgt }} - {{ tiposPagamento[titulo.tippgt] }}</div>
                </div>


                <div class="col-lg-2 col-md-4 col-sm-5 col-xs-5 alinha_vertical" style="height: 46px;">
                  <div v-if="('' + titulo.codfpg) === '4'" class="truncar">{{ titulo.codbar }}</div>
                  <div v-else>{{titulo.codban}} <span class="esmaecido">/</span> {{titulo.codage}} <span class="esmaecido">/</span> {{titulo.ccbfor}}</div>
                  <div class="truncar">{{titulo.codfpg}} - {{titulo.desfpg}}</div>
                </div>


                <div class="col-lg-1 col-md-3 col-sm-3 col-xs-7 alinha_vertical text-center" style="height: 46px;">
                  <div class="esmaecido">{{titulo.sittit}}</div>
                  <div v-if="titulo.sittit === 'LQ' && (!_.isNull(titulo.usu_autbb) || (_.trim(titulo.usu_autban)).length > 5)" class="truncar">
                    <span class="label label-default clicavel" @click="emitir611(_.trim(titulo.usu_numtit), _.trim(titulo.usu_codfor))"
                          :title="'<h5>Autenticação bancária. Clique para gerar comprovante</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay:[500, 0]}">
                      {{!_.isNull(titulo.usu_autbb) ? titulo.usu_autbb : (_.trim(titulo.usu_autban)).length > 5 ? titulo.usu_autban : ''}}
                    </span>
                  </div>
                </div>

                <div class="col-lg-1 col-md-3 col-sm-4 col-xs-7" style="height: 46px;">
                  <span class="text-muted">{{titulo.vlrmov | real}}</span> <br/>
                  <span>{{titulo.vlrliq | real}}</span>
                </div>

                <div class="col-lg-1 col-md-2 col-sm-5 col-xs-5 text-right" style="height: 46px;">
                  <g-button-ujarak v-show="false" color="error" size="button--size-ss" @click.native="excluirTituloArquivoRetorno(titulo)" v-if="titulo.sittit !== 'LQ'"
                                   :title="'<h5>Excluirá este títulos da remessa</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                    <i class="fa fa-ban" aria-hidden="true"></i>
                  </g-button-ujarak>
                </div>

                <!-- Retorno de processamento e outros alertas -------------------------------------------------------->
                <div class="box-body" v-if="_.has(titulo, 'retorno')">
                  <span v-for="detalhe in _.get(titulo, 'retorno', [])" :class="'label ' + (_.includes(_.toLower(detalhe.RDesBan), 'erro') ? 'label-danger' : (_.isEmpty(_.trim(detalhe.ROctBan)) ? 'label-warning' : 'label-success'))">{{detalhe.RDesBan}}<br/></span>
                </div>

              </div>

            </div>

          </div>

        </span>

      </div>

    </section>

  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import boleto from '@mrmgomes/boleto-utils'

  export default {
    name: 'TratamentoRetorno',
    data () {
      return {
        portadores: [],
        portador: [],
        //
        remessas: [],
        remessa: [],
        //
        retornos: [],
        retorno: [],
        //
        titulos: [],
        titulosBackup: [],
        titulosSelecionados: [],
        tituloEditando: null,
        //
        processamentoRetorno: [],
        ocorrencias: [],
        //
        diretorioDestino: null,
        loading: {
          tela: false,
          titulos: false,
          retornos: false,
          portadores: false,
          remessas: false
        },
        ordenacao: {
          por: 'processamento',
          ordem: 'desc'
        },
        excelCampos: {
          basico: {
            'ID SGP': 'id',
            'Situação Processo ': 'situacao',
            'Projeto': 'numprj',
            'Cód. Entidade': 'codfor',
            'Título': 'numtit',
            'Tipo Título': 'codtpt',
            'Tipo de Pagamento': 'codfpg',
            'Forma de Pagamento': 'tippgt',
            'MCI Projeto': 'usu_mci',
            'Conta Movimento': 'numcco',
            'Banco': 'codban',
            'Agencia': 'codage',
            'Conta': 'ccbfor',
            'Cód. de Barras': 'boleto.linhaDigitavel',
            'Valor Original': 'vlrori',
            'Valor Líquido': 'vlrabe'
          },
          posProcessamento: {
            'Remessa': 'processamento.remessa'
          }
        },
        excelMeta: [[{'key': 'charset', 'value': 'utf-8'}]],
        enumeradores: { 'PAGAMENTO': 'Pagamento', 'PRESTACAO_DE_CONTAS': 'Prestação de Contas', 'LIQUIDACAO_FINANCEIRA': 'Liquidação Financeira', 'FEITO': 'Feito', 'EM_EXECUCAO': 'Em Execução', 'CANCELADO': 'Cancelado' },
        tiposPagamento: {'CA': 'Cheque administrativo', 'CC': 'Crédito em Conta Corrente', 'CH': 'Cheque', 'CP': 'Crédito em Conta Poupança', 'CS': ' Crédito em Conta Salário', 'DB': 'Débito em Conta Corrente', 'DC': 'Documento em Crédito - Mesmo Titular', 'DF': 'DARF', 'DJ': 'DARJ', 'DO': 'Documento de Crédito - Outro Titular', 'DP': 'Débito em Conta Poupança', 'DS': 'DARF Simples', 'DV': 'DPVAT', 'EC': 'Extrato de Conta Corrente', 'FG': 'FGTS', 'GS': 'GARE-SP (ICMS/DR/ITCMD)', 'IP': 'IPVA', 'LC': 'LICENCIAMENTO', 'OP': 'Ordem de Pagamento', 'OU': 'Outros Pagamentos', 'PA': 'Pagamento com Autenticação', 'PC': 'Pagamento p/ Cartão', 'PO': 'Pagamento Concessionária', 'PQ': 'PIX QR Code', 'PS': 'Guia da Previdência Social', 'PT': 'Pagamento Tributos', 'PX': 'PIX Transferência', 'TE': 'TED - Mesmo Titular', 'TN': 'Títulos não registrados', 'TO': 'TED - Outro Titular', 'TR': 'Títulos registrados'},
        alturaContentWrapper: window.innerHeight - 51
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
      this.buscarArquivosRetornos()
      this.buscarListaOcorrenciasRetorno()
    },
    methods: {
      buscarArquivosRetornos () {
        let dias = 3 // Corte de datas... traz os arquivos dos útimos três dias corridos antes de trazer o resto
        this.loading.retornos = true
        let numeradorTrackBy = 0
        axiosLaravel.post('pagamento/retornos/lista', {'faixa': '>=', 'corte': dias, 'tipo': ['PREVIA']}).then((response) => {
          response.data.forEach((registro) => { _.set(registro, 'numerador', ++numeradorTrackBy) })
          this.retornos = response.data
          this.retornos.unshift({'usu_datoco': 'Data do retorno', 'ArquivosRetorno': 'Arquivos', 'usu_tiparq': '', 'QtdeRegistros': 'Títulos', $isDisabled: true})
          this.loading.retornos = false
          this.retornos.push({'usu_datoco': 'Carregando retornos mais antigos', 'ArquivosRetorno': '<i class=\'fa fa-refresh fa-spin\'></i>', 'usu_tiparq': '', 'QtdeRegistros': '<i class=\'fa fa-refresh fa-spin\'></i>', $isDisabled: true})
          if (!_.isEmpty(this.retorno)) {
            this.retorno = _.find(this.retorno, {'usu_datoco': this.retorno.usu_datoco}) || []
          }
          //
          // 'Segundo turno' chamada complementar que ocorre em background e complementa os dados da primeira consulta
          axiosLaravel.post('pagamento/retornos/lista', {'faixa': '<', 'corte': dias, 'tipo': ['PREVIA']}).then((response) => {
            _.remove(this.retornos, {'usu_datoco': 'Carregando retornos mais antigos'})
            response.data.forEach((registro) => { _.set(registro, 'numerador', ++numeradorTrackBy) })
            this.retornos = _.union(this.retornos, response.data)
            if (!_.isEmpty(this.retorno)) {
              this.retorno = _.find(this.retorno, {'usu_datoco': this.retorno.usu_datoco}) || []
            }
            // 69144 - Listar numero de IDs de tarefas para remessas AMT e AMP
            this.retornos = _.orderBy(this.retornos, 'numerador', 'desc')
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        })
          .catch((error) => {
            this.loading.retornos = false
            this.$root.trataErro(error)
          })
      },
      buscarConteudoArquivoRetorno () {
        this.inicializandoListas()
        let vm = this
        if (!_.isEmpty(this.retorno)) {
          this.loading.tela = true
          axiosLaravel.post('pagamento/retornos/conteudo/', {'data': this.retorno['usu_datoco'], 'tipo': this.retorno['usu_tiparq']}).then((response) => {
            if (_.isEmpty(this.ocorrencias)) {
              this.buscarListaOcorrenciasRetorno()
            }
            let retorno = response.data
            console.log('conteudoRetorno: ', retorno)
            // Excluir da listagem os títulos que não faem parte de remessa algum (provavelmente foram excluídos da remessa)
            this.processamentoRetorno = _.filter(retorno, function (titulo) { return !_.isNull(titulo.numarb) })
            this.$forceUpdate()
            //
            // this.processamentoRetorno[1]['id'] = 793590
            // this.processamentoRetorno[1]['situacao'] = 'EM_EXECUCAO'
            //
            // this.processamentoRetorno[2]['id'] = 789827
            // this.processamentoRetorno[2]['situacao'] = 'EM_EXECUCAO'
            //
            // this.processamentoRetorno[3]['id'] = 789853
            // this.processamentoRetorno[3]['situacao'] = 'EM_EXECUCAO'
            //
            // Finalizar os processos cujos titulos não deram erro, são do SGP (tem ID) e estão em execução
            let titulosParaProcessar = _.filter(this.processamentoRetorno, function (titulo) { return !_.isNull(titulo.id) && titulo.situacao === 'EM_EXECUCAO' && titulo.processamento === 1 })
            let qtdeTitulosParaProcessar = titulosParaProcessar.length
            if (qtdeTitulosParaProcessar > 0) {
              vm.$snotify.async('Concluindo ' + qtdeTitulosParaProcessar + (qtdeTitulosParaProcessar > 1 ? ' processos' : ' processo') + ' em execução...', {timeout: 0})
              titulosParaProcessar.forEach((titulo, idx) => {
                --qtdeTitulosParaProcessar
                titulo['loading'] = {'texto': 'Concluindo...', 'situacao': 'processando', 'classe': 'info'}
                axiosLaravel.get('/pagamento/finaliza/processo/' + titulo.id).then((response) => {
                  if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                    titulo.loading = {'texto': 'Finalizado!', 'situacao': 'feito', 'classe': 'success'}
                    _.set(titulo, 'situacao', response.data.retorno.situacao)
                  } else {
                    titulo.loading = {'texto': 'Ocorreu erro', 'situacao': 'erro', 'classe': 'error'}
                    this.$snotify.error('Erro ao finalizar id ' + titulo.id + ': ' + response.data.mensagem)
                  }
                  setTimeout(function () {
                    _.unset(titulo, 'loading')
                    vm.$forceUpdate()
                    if (qtdeTitulosParaProcessar === 0) {
                      vm.$snotify.clear()
                      vm.loading.tela = false
                    }
                  }, 3000)
                })
                .catch((error) => {
                  titulo.loading = {'texto': 'Ocorreu erro', 'situacao': 'erro', 'classe': 'error'}
                  if (qtdeTitulosParaProcessar === 0) {
                    vm.$snotify.clear()
                    vm.loading.tela = false
                  }
                  this.$root.trataErro(error)
                })
              })
            } else {
              this.loading.tela = false
            }
          })
            .catch((error) => {
              this.loading.tela = false
              this.$root.trataErro(error)
            })
        }
      },
      processarRetorno () {
        this.loading.tela = true
        axiosLaravel.post('pagamento/retornos/processar/', {'arquivo': this.processamentoRetorno[0]['usu_nomarq']}).then((response) => {
          console.log('processarRetorno: ', response.data)
          let listaTitulos = _.clone(this.processamentoRetorno)
          listaTitulos.forEach((titulo) => {
            var retorno = _.filter(response.data.dadosGeraisLog, {RNumTit: titulo.usu_numtit, RCodTpt: titulo.usu_codtpt, RCodFor: titulo.usu_codfor})
            titulo['retorno'] = _.orderBy(retorno, ['RSeqOco'], ['asc'])
            titulo['processamento'] = _.some(retorno, function (r) { return _.includes(_.toLower(r.RDesBan), 'erro') }) ? 2 : 1
          })
          this.processamentoRetorno = _.clone(listaTitulos)
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      buscarListaOcorrenciasRetorno () {
        axiosLaravel.get('pagamento/retornos/ocorrencias/').then((response) => {
          this.ocorrencias = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscarPortadores () {
        this.loading.portadores = true
        axiosLaravel.get('pagamento/portadores').then((response) => {
          console.log('Portadores: ', response.data)
          let portadores = response.data
          // portadores.unshift({'CodPor': 'Todos', 'DesPor': '', 'CodBan': '', 'CodAge': '', 'NumCco': '', 'DirPrm': '', 'DirPrt': ''})
          this.portadores = portadores
          this.loading.portadores = false
        })
          .catch((error) => {
            this.loading.portadores = false
            this.$root.trataErro(error)
          })
      },
      inicializandoListas () {
        this.processamentoRetorno = []
        this.titulos = []
        this.titulosBackup = []
        this.titulosSelecionados = []
        this.tituloEditando = null
      },
      portadorSelecionado () {
        if (this.processamentoRetorno.length > 0) {
          this.inicializandoListas()
        }
        let titulos = _.clone(this.titulosBackup)
        this.titulos = this.portador.CodPor === 'Todos' ? titulos : _.filter(titulos, ['numcco', this.portador.NumCco])
        this.retorno = []
      },
      arquivoRetornoSelecionado () {
        console.log('arquivoRetornoSelecionado')
      },
      remessaSelecionada () {
        console.log('remessaSelecionada')
        this.inicializandoListas()
      },
      editaTituloParaRemessa (titulo) {
        if (!titulo.boleto) { // Se não tiver boleta, no início da edição inicializa o objeto
          titulo.boleto = {sucesso: false, mensagem: null, tipoCodigoInput: null, tipoBoleto: null, codigoBarras: null, linhaDigitavel: null, numeroInformadoTela: null, vencimento: null, valor: null}
        }
        this.tituloEditando = _.clone(titulo)
      },
      salvaEdicaoTituloParaRemessa () {
        console.log(this.errors.first('código de barras'))
        if (!this.errors.first('código de barras') && _.get(this.tituloEditando, 'boleto.sucesso', false) && (_.get(this.tituloEditando, 'boleto.linhaDigitavel', '')).length > 5) {
          this.titulos[_.findIndex(this.titulos, {numtit: this.tituloEditando.numtit, codtpt: this.tituloEditando.codtpt, codfor: this.tituloEditando.codfor})] = _.clone(this.tituloEditando)
          this.tituloEditando = null
          this.$forceUpdate()
        }
      },
      cancelaEdicaoTituloParaRemessa () {
        this.tituloEditando = null
      },
      validaAjustaCodigoBarras () {
        let numeroInformadoLimpo = ('' + this.tituloEditando.boleto.numeroInformadoTela).replace(/\D+/g, '')
        if (numeroInformadoLimpo.length > 0 && ('' + this.tituloEditando.codfpg) === '4') {
          let tipo = boleto.identificarTipoCodigo(numeroInformadoLimpo)
          this.errors.remove('código de barras')
          if (tipo === 'TAMANHO_INCORRETO' || !_.includes([44, 47, 48], numeroInformadoLimpo.length)) {
            this.errors.add({field: 'código de barras', msg: 'Tamanho do número incorreto!'})
          } else {
            let validacao = boleto.validarBoleto(numeroInformadoLimpo, tipo)
            if (validacao.sucesso) {
              this.tituloEditando.boleto = validacao
              _.set(this.tituloEditando.boleto, 'numeroInformadoTela', numeroInformadoLimpo)
            } else {
              let mensagem = _.capitalize(tipo.replaceAll('_', ' ')) + ' acima está incorreto!'
              this.errors.add({field: 'código de barras', msg: mensagem})
            }
          }
        }
      },
      salvarConfiguracoes () {
        // TODO criar chamada background, tal como para configuraçoes de usuario para guardar todas as ações executadas
        // TODO guardarHistoricoAcoes () {
        let vm = this
        _.set(this.usuarioLogado, 'configuracoes.tela_liquidacao', {
          'selecionado': vm.selecionado
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
      selecionarItem (item) {
        let jaSelecionado = _.find(this.titulosSelecionados, function (sel) { return sel.numtit + sel.codtpt + sel.codfor === item.numtit + item.codtpt + item.codfor })
        if (jaSelecionado) {
          _.remove(this.titulosSelecionados, jaSelecionado)
        } else {
          this.titulosSelecionados.push(item)
        }
        this.$forceUpdate()
      },
      selecionarTodosItens (selecionaTudo = true) {
        this.titulosSelecionados = []
        if (selecionaTudo) {
          this.titulos.forEach((titulo) => {
            this.titulosSelecionados.push(titulo)
          })
        }
        this.$forceUpdate()
      },
      excluirTituloArquivoRetorno (titulo) {
        console.log('excluirTituloArquivoRetorno titulo', titulo)
        // TODO rota para excluir titulo (gerarRemessa) com um título a menos)
        // TODO   se o retorno for OK então exclui registro e força atualização
        axiosLaravel.post('pagamento/remessas/excluir_titulo', {'remessa': titulo.numarb, 'portador': titulo.usu_codpor, 'titulo': titulo}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            _.remove(this.processamentoRetorno, {usu_numtit: titulo.usu_numtit, usu_codtpt: titulo.usu_codtpt, usu_codfor: titulo.usu_codfor})
            --this.retorno.QtdeRegistros
            this.$forceUpdate()
          } else {
            this.$snotify.error('Erro ao finalizar id ' + titulo.id + ': ' + response.data.mensagem)
          }
        })
          .catch((error) => {
            if (error) {
              console.log('error', error)
              this.$root.trataErro(error)
            }
          })
      },
      segueReanalisarOuReativar (situacao, idProcesso) {
        let vm = this
        let acao = _.includes(['FEITO', 'CANCELADO'], situacao) ? 'reativar' : 'reanalisar'
        this.$dialog.confirm('Tem certeza que deseja ' + acao + ' esta solicitação de id <b>' + idProcesso + '</b>?', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
          vm.loading.tela = true
          let rota = 'processos/' + acao + '/'
          vm.$snotify.async('Processando ação para ' + acao + ' esta solicitação...', {timeout: 0})
          axiosLaravel.put(rota + idProcesso).then((response) => {
            console.log('acao > response', acao, response)
            vm.$snotify.clear()
            vm.$snotify.success('ID ' + idProcesso + ' movido para análise!')
            _.remove(vm.titulos, ['id', idProcesso])
            _.remove(vm.titulosSelecionados, ['id', idProcesso])
            vm.titulosBackup = _.clone(vm.titulos)
            vm.loading.tela = false
          })
            .catch((error) => {
              vm.$snotify.clear()
              vm.loading.tela = false
              vm.$root.trataErro(error)
            })
          //
        }).catch(function () {
        })
      },
      atribuirFazer (item) {
        console.log('atribuirFazer (item)', item)
        console.log('  validacao de usuario', ('' + item.id_usuario), ('' + this.usuarioLogado.id))
        if (('' + item.id_usuario) !== ('' + this.usuarioLogado.id)) {
          console.log('    usuario diferente', item.id_usuario, this.usuarioLogado.id)
          axiosLaravel.put('processos/validacao/assumir/', {'item': item, 'id_tarefa': item['id_tarefa_atual']}).then((response) => {
            console.log('      Tarefa assumida', response)
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
        this.$router.push({name: 'solicitacao-pagamento', params: {id: item.id, row: item, acao: 'VALIDAR'}})
      },
      jsonValido (json) {
        // Aceita objeto ou string que represente objeto ou array válidos, não aceita números, funções, strings vazias, null etc
        try {
          if (typeof json !== 'string' && typeof json !== 'object') {
            json = undefined
          } else if (typeof json === 'string' && json.length > 0) {
            json = JSON.parse(json)
          } else if (typeof json === 'object') {
            json = JSON.parse(JSON.stringify(json))
          } else {
            json = undefined
          }
          json = _.isObjectLike(json) ? json : undefined
        } catch (e) {
          if (e instanceof SyntaxError) {
            json = undefined
          }
        }
        return json
      },
      emitir611 (numeroTitulo, codigoFornecedor) {
        this.loading.tela = true
        let parametros = '<ECodEmp=1>,<ECodFil=1>,<ETitBai=S>,<ENumTit="' + numeroTitulo + '">,<ECodFor=' + codigoFornecedor + '>'
        this.$snotify.async('Gerando comprovante do titulo ' + numeroTitulo + ' ...', {timeout: 0})
        axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': 'FPCP611.GER'}, params: parametros}).then((response) => {
          this.onDownload(response, 'Comprovante » ' + numeroTitulo + ' » ' + codigoFornecedor)
          this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      onDownload (response, relatorio) {
        let item = response.data.arquivo
        const contentType = 'application/pdf'
        const b64Data = response.data.arquivo
        let file = this.b64toBlob(b64Data, contentType)
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        if (!ie) {
          let blob = file
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = relatorio
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          let blob = file
          let link = document.createElement('blob')
          link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
          link.download = relatorio
          link.click()
        }
        this.$snotify.clear()
        this.$snotify.success('Gerado com sucesso!')
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
      }
    }
  }
</script>

<style scoped>
  #liquidacoes .esmaecido {
    color: var(--cor-fraca);
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
    font-size: 16px;
    color: silver;
  }

  #liquidacoes .indicadores i.selecao {
    cursor: pointer;
    padding-right: 10px;
  }

  #liquidacoes .indicadores i.selecao:hover {
    color: steelblue;
  }

  #liquidacoes .projeto {
    font-weight: bold;
  }
  #liquidacoes .fornecedor {
    font-style: italic;
  }
  #liquidacoes .tarefa:hover {
    background: #ecf0f5;
  }
  #liquidacoes .tarefa {
    border-top: 1px solid silver;
  }
  #liquidacoes .tarefa.selecionada {
    background: #dcebff;
  }
  #liquidacoes .truncar {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  #liquidacoes .retornoProcessamento1 {
    background: #dfd;
    padding: 0;
  }
  #liquidacoes .retornoProcessamento2 {
    background: #fdd;
    padding: 0;
  }

  #liquidacoes .etiquetaPortador, #liquidacoes .etiquetaRemessa, #liquidacoes .etiquetaRetorno {
    display: flex;
    justify-content: space-between;
  }

  #liquidacoes .alinha_vertical {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  #liquidacoes .clicavel {
    cursor: pointer;
  }
  /*#liquidacoes .impressao_comprovante:hover:after {*/
    /*color: var(--cor-destaque-dark);*/
    /*content: " Comprovante";*/
  /*}*/

  #liquidacoes .esmaecido .contadorRegistros {
    display: none;
  }
  #liquidacoes .contadorRegistros {
    border-radius: 20px;
    background: steelblue;
    font-size: 14px;
    color: white;
    width: 20px;
    height: 20px;
    text-align: center;
    vertical-align: middle;
  }

  #liquidacoes .centralizar_elemento {
    display: flex;
    justify-content: center;
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
