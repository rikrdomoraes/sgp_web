<template>
  <div>
      <div v-if="!visibleForm" class="content-wrapper " style="min-height: 870px;">

          <div class="fade-transition ng-scope " style=""><!-- content header (page header) -->
          <section class="content-header ng-scope">
            <h1>Solicitação de Pagamento</h1>
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

            <!--lista notas-->
            <div  class="row">
              <div  class="col-md-12 form-horizontal">
               <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
                <div class="box-header with-border">
                  <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Solicitação de Pagamento/Ressarcimento</h3>
                </div>
                <div class="box-body" >
                  <div v-show="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <div v-if="show.info" class="alert alert-warning alert-dismissible">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                    <h4><i class="fa fa-warning"></i> Alerta!</h4>
                    {{show.message}}
                  </div>

                  <!--Se for solicitacao de um novo pagamento mostra o campo de seleção de projeto-->
                  <div class="row" v-if="tipoTransacao === 'SOLICITACAO'">
                    <div class="col-sm-6" >
                      <div class="form-group required" :disabled="trava === 1">
                        <label for="projeto" class="control-label col-xs-4 col-sm-3 col-lg-2"><span class="pull-left">Projeto:</span></label>
                        <div class="col-sm-12">

                          <select name="projeto"
                                  v-model="projeto"
                                  class="form-control"
                                  :disabled="carregou !== 1"
                                  aria-hidden="true"
                                  @change="changeProjeto(projeto)" v-validate="'required'">
                            <option v-for="projeto in projetos" :value="projeto">{{projeto.Projeto}}</option>
                          </select>
                          <div v-if="carregou !== 1" >
                            <i class="fa fa-refresh fa-spin"></i>&nbsp;Carregando listagem de projetos....
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--<fieldset>-->
                    <!--<br/>-->
                    <!--<div class="row">-->
                      <!--<div class="col-md-12">-->
                        <!--&lt;!&ndash; grid &ndash;&gt;-->
                        <!--<div class="table-responsive">-->
                          <!--&lt;!&ndash;</table>&ndash;&gt;-->
                          <!--<b-container fluid>-->
                            <!--&lt;!&ndash; Main table element &ndash;&gt;-->
                            <!--<b-table show-empty-->
                                     <!--striped-->
                                     <!--stacked="md"-->
                                     <!--:bordered="table.bordered"-->
                                     <!--:items="table.items"-->
                                     <!--:fields="table.fields"-->
                                     <!--:filter="table.filter"-->
                                     <!--:current-page="table.currentPage"-->
                                     <!--:per-page="table.perPage"-->
                                     <!--:sort-by.sync="table.sortBy"-->
                                     <!--:sort-desc.sync="table.sortDesc"-->
                                     <!--empty-text="Nenhum registro encontrado"-->
                            <!--&gt;-->
                              <!--<template slot="dataInclusao" scope="row">{{row.value | moment("L")}}</template>-->
                              <!--<template slot="serieNota" scope="row">{{row.value | serie}}</template>-->
                              <!--<template slot="valor" scope="row">{{row.item.valorTotal | real}}</template>-->
                              <!--<template slot="cnpjFornecedor" scope="row">{{row.item.cnpjFornecedor ? row.item.cnpjFornecedor : row.item.cpfFornecedor}}</template>-->
                              <!--&lt;!&ndash;<template slot="statusERP" scope="row">&ndash;&gt;-->
                                <!--&lt;!&ndash;&lt;!&ndash;Aqui pega o valor do statusERP e muda o estilo do texto dependendo do valor&ndash;&gt;&ndash;&gt;-->
                                <!--&lt;!&ndash;<div v-if="row.value === 'INEXISTENTE'"><div style="font-family: sans-serif; color: silver">{{row.value}}</div></div>&ndash;&gt;-->
                                <!--&lt;!&ndash;<div v-else-if="row.value === 'DIGITADA'"><div style="font-family: sans-serif; color: cornflowerblue">{{row.value}}</div></div>&ndash;&gt;-->
                                <!--&lt;!&ndash;<div v-if="row.value === 'FECHADA'"><div style="font-family: sans-serif; font-weight: bold; color: green">{{row.value}}</div></div>&ndash;&gt;-->
                              <!--&lt;!&ndash;</template>&ndash;&gt;-->
                              <!--<template slot="actions" scope="row">-->
                                <!--<div>-->
                                  <!--&lt;!&ndash;Se a nota foi aprovada ou reprovada mostra a exclamação&ndash;&gt;-->
                                  <!--<i v-show="row.item.requestApprovalResult"-->
                                     <!--class="fa fa-exclamation fa-3" aria-hidden="true" v-tooltip.top="row.item.requestApprovalResult === 'APPROVED' ? 'Aprovado, na aprovação nota a nota!' : 'Encaminhado para análise, na aprovação nota a nota!'"-->
                                     <!--:style="{color: row.item.requestApprovalResult === 'APPROVED' ? 'blue' : 'red', marginRight: 10 + 'px', fontSize: 'large', cursor: 'pointer'}"></i>-->

                                  <!--<label v-if="mostraParaValidacaoPagamento"-->
                                         <!--class="checkbox-inline new-control new-control-checkbox" style="margin-bottom: 10px;">-->
                                    <!--&lt;!&ndash;Checkbox é desativado caso a nota já tenha sido aprovada ou colocada em revisão&ndash;&gt;-->
                                    <!--<input :disabled="row.item.requestApprovalResult"-->
                                           <!--type="checkbox"-->
                                           <!--:value="true"-->
                                           <!--@change=""-->
                                           <!--v-model="row.item.selecionado">-->
                                    <!--<div class="new-control-indicator"></div>-->
                                  <!--</label>-->
                                  <!--<button type="button" @click="onEdit(row)" class="btn btn-sm btn-flat btn-primary"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>Editar</button>-->
                                  <!--<button type="button" @click="excluir(row)" class="btn btn-sm btn-flat btn-danger"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>Excluir</button>-->
                                <!--</div>-->
                              <!--</template>-->
                            <!--</b-table>-->
                          <!--</b-container>-->
                        <!--</div>-->
                      <!--</div>-->

                      <!--&lt;!&ndash; download notas&ndash;&gt;-->
                      <!--<div class="col-md-12">-->
                        <!--<download-notas :propsValidacao="validacao"></download-notas>-->
                      <!--</div>-->

                      <!--&lt;!&ndash;&lt;!&ndash;Historico&ndash;&gt;&ndash;&gt;-->
                      <!--&lt;!&ndash;<div class="col-md-12">&ndash;&gt;-->
                        <!--&lt;!&ndash;<div class="box box-widget" >&ndash;&gt;-->
                          <!--&lt;!&ndash;<div class="box-header with-border">&ndash;&gt;-->
                            <!--&lt;!&ndash;<h3 class="box-title">Histórico de solicitação de pagamento</h3>&ndash;&gt;-->
                          <!--&lt;!&ndash;</div>&ndash;&gt;-->
                          <!--&lt;!&ndash;<div class="box-body">&ndash;&gt;-->
                            <!--&lt;!&ndash;<historico-solicitacao-pagamento :propsValidacao="validacao"></historico-solicitacao-pagamento>&ndash;&gt;-->
                          <!--&lt;!&ndash;</div>&ndash;&gt;-->
                        <!--&lt;!&ndash;</div>&ndash;&gt;-->
                      <!--&lt;!&ndash;</div>&ndash;&gt;-->


                    <!--</div>-->
                  <!--</fieldset>-->
                </div>

                 <!--Botões-->
                 <!--<div class="box-footer">-->
                   <!--<span v-tooltip.right="tooltipContext">-->
                     <!--<button @click="onConclude" type="button" class="btn btn-success btn-flat" :disabled="(this.table.items.length < 1) || restrict || blockStatusERP">-->
                       <!--<span><i class="fa fa-check-circle" aria-hidden="true"></i> Concluir</span>-->
                     <!--</button>-->
                   <!--</span>-->
                   <!--&lt;!&ndash; DEFAULT &ndash;&gt;-->
                   <!--<button v-if="!mostraParaValidacaoPagamento" @click="onNew" type="button" :disabled="(this.table.items.length > 0 || restrict) || blockStatusERP || carregou !== 1" class="btn btn-primary btn-flat">-->
                     <!--<i class="fa fa-plus-circle" aria-hidden="true"></i> Incluir-->
                   <!--</button>-->
                   <br><br>
                   <button v-if="mostraParaValidacaoPagamento" @click="onCancel" type="button" class="btn btn-default btn-flat">
                     <i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista
                   </button>
                   <!-- /DEFAULT -->

                   <!--&lt;!&ndash; APPROVER_TYPE &ndash;&gt;-->
                   <button @click="$router.go(-1)" v-tooltip.top="'Volta para lista'" type="button" class="btn btn-default btn-flat">
                     <i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar
                   </button>
                   <!--&lt;!&ndash; /APPROVER_TYPE &ndash;&gt;-->
                 <!--</div>-->
              </div>
              </div>
              </div>
            </div>
          </section>
        </div>
        </div>
    <div v-if="visibleForm">

      <!-- Quando evento 'concluiValidacaoNota' passa como paramentros a nota na posição 0 e validacao na posição 1-->
      <form-solicitacao-pagamento :propsNota="nota" :propsValidacao="validacao" :propsProjeto="projeto" @voltaPraSolicitacao="voltaPraSolicitacao" @concluiValidacaoNota="concluiValidacaoNota($event)"></form-solicitacao-pagamento>
    </div>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
    import DownloadNotas from '../../../modules/downloadNotas'
    import HistoricoSolicitacaoPagamento from '../../../solicitacoes/modulos/historicoSolicitacaoPagamento'
    import FormSolicitacaoPagamento from '../../../solicitacoes/pagamento/formSolicitacaoPagamento'
    import { mapGetters } from 'vuex'
    import moment from 'moment'

    export default {
      components: {
        FormSolicitacaoPagamento,
        HistoricoSolicitacaoPagamento,
        DownloadNotas},
      name: 'main-solicitacao-pagamentos',
      data () {
        return {
          modalShow: false,
          // Array que guarda as fases de analise e Autorização de pagamentos
          analiseAutorizacao: ['ANALYSIS', 'MONITORING'],
          loadingShow: false,
          carregou: 0,
          validacao: {
            id: null,
            projeto: {},
            documentosLiberacao: [],
            processo: {},
            tarefa: {}
          },
          nota: {
            receiptAttachments: []
          },
          notaIndex: 0,
          restrict: false,
          visibleForm: false,
          approval: {},
          table: {
            items: [],
            totalRows: 0,
            filter: null,
            hover: true,
            bordered: true,
            currentPage: 1,
            sortBy: 'createdAt',
            sortDesc: true,
            perPage: 10,
            fields: [
              { key: 'numeroNota', label: 'Número NF', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'cnpjFornecedor', label: 'CNPJ/CPF', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'serieNota', label: 'Série', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'dataInclusao', label: 'Data de emissão', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'valor', label: 'Valor', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              // { key: 'statusERP', sortable: true, label: 'Processamento', thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
            ]
          },
          projetos: [],
          tipoTransacao: '',
          projeto: {},
          blockStatusERP: null,
          show: {
            info: false,
            message: ''},
          statusERP: []
        }
      },
      computed: {
        tooltipContext () {
          return this.blockBatchApproval() ? 'Na aprovação em lote é necessário ao menos selecionar uma nota' : 'Conclui'
        },
        mostraAprovacaoBatch () {
          let result = true
          result = this.table.items.some(item => {
            return item.selecionado
          })
          return result
        },
        mostraParaValidacaoPagamento () {
          return _.includes(this.analiseAutorizacao, this.validacao.paymentRequestApprovalPhase)
        },
        ...mapGetters([
          'usuarioLogado'
        ])
      },
      watch: {
      },
      created () {
        this.tipoTransacao = 'SOLICITACAO'
        this.buscaProjetos()
      },
      filters: {
        serie (value) {
          return value.replace('_', ' ').replace('_', ' ')
        }
      },
      methods: {
        validateEntityChief (projectObj) {
          let activeChief = false
          if (projectObj.proposal.entity) {
            let entity = projectObj.proposal.entity
            entity.chiefs.forEach((chief) => {
              if (chief.active && moment(new Date()).isSameOrAfter(moment(chief.initialMandateDate), 'day') &&
                moment(new Date()).isSameOrBefore(moment(chief.endMandateDate), 'day')) {
                activeChief = true
              }
            })
          }
          return activeChief
        },
        changeProjeto: async function (projeto) {
          let idEntidade = projeto.fk_entidade
          let entityFilter = null
          let graphql = null
          if (idEntidade) {
            entityFilter = idEntidade
            graphql = { query: `query {
                    entidade(id: ${entityFilter}){
                      ds_nome
                      bt_ativo
                      dirigentes{
                        dt_fim_mandato
                        dt_inicio_mandato
                        bt_ativo
                      }
                    }
                  }
                `}
          } else {
            graphql = { query: `
                      query {
                     entidade(id: ${idEntidade}){
                      ds_nome
                      bt_ativo
                      dirigentes{
                        dt_fim_mandato
                        dt_inicio_mandato
                        bt_ativo
                      }
                    }
                  }
                  `}
          }
          await axiosLaravel.post('graphql', graphql).then((response) => {
            this.entidade = response.data.data.entidade
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
          // Zera os bloqueios
          this.restrict = false
          this.blockStatusERP = false
          this.show.info = false
          this.show.message = ''
          if (this.usuarioLogado.userType === 'ENTIDADE') { // SE usuário logado for da entidade faz algumas verificações a mais
            if (await this.verificaSeProjetoEsta90DiasAtrasado(projeto)) {
              this.show.info = true
              this.show.message = 'A solicitação de pagamento para este projeto está bloqueada devido à existência de prestações de contas em aberto em período superior ao previsto em convênio.'
              this.restrict = true
              return
            }
            if (await this.verificaSeProjetoEsta180DiasAtrasado(projeto)) {
              this.show.info = true
              this.show.message = 'A solicitação de pagamento para este projeto está bloqueada devido à existência de prestações de contas em aberto em período superior ao previsto em convênio.'
              this.restrict = true
              return
            }
          }
          if (this.entidade.bt_ativo === 0) {
            this.show.info = true
            this.show.message = 'A solicitação de pagamento para este projeto está bloqueada devido à Entidade estar inativa.'
            this.restrict = true
            return
          }
          if (projeto.Status_ERP !== '') {
            switch (projeto.Status_ERP) {
              case 'JUD':
              case 'DLG':
              case 'ETO':
              case 'SPS':
              case 'SO3':
              case 'SO4':
              case 'SAF':
              case 'SPA':
              case 'ENC':
              case 'ESE':
                this.blockStatusERP = true
                this.show.info = true
                this.show.message = 'Esta solicitação não pode ser realizada pois o projeto está em estado "' + projeto.Status_ERP + '".'
                break
              default:
                this.blockStatusERP = false
                this.show.info = false
                this.show.message = ''
            }
          }
          this.trava = 1
          if (this.show.info === false) {
            this.onNew()
          }
        },
        buscaProjetos () {
          this.$forceUpdate()
          this.loadingShow = true // bloquea a tela enquanto busca os dados
          // let entityId = null
          // this.usuarioLogado.entity ? entityId = this.usuarioLogado.entity.id : null
          axiosLaravel.post('processos/projetos', {processo: 'PAGAMENTO'}).then((response) => {
            this.projetos = response.data
            if (this.projetos) {
              this.carregou = 1
            } else {
              this.carregou = 0
            }
            this.$forceUpdate() // força o update da tela para não ter problema
            this.loadingShow = false // desbloquea a tela
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        valorTotalSolicitacao (item) {
          return item.receiptItems.totalValue
        },
        onNew () {
          this.nota = {
            receiptAttachments: []
          }
          this.visibleForm = !this.visibleForm
        },
        onEdit (row) {
          this.nota = row.item
          this.notaIndex = row.index
          this.visibleForm = !this.visibleForm
        },
        excluir (row) {
          this.table.items.splice(row.index, 1)
        },
        onConclude () {
          this.$validator.validateAll().then(result => {
            if (result) {
              // Cria objeto para envio a backend
              this.validacao.projeto = this.projeto
              this.validacao.documentosLiberacao = this.table.items
              this.validacao.documentosLiberacao[0].itens = this.validacao.documentosLiberacao[0].receiptItems
              this.validacao.documentosLiberacao[0].anexos = this.validacao.documentosLiberacao[0].receiptAttachments
              this.validacao.processo.nome = 'PAGAMENTO'
              this.validacao.processo.situacao = 'EM_EXECUCAO'
              this.validacao.tarefa.nome = 'SOLICITACAO'
              this.validacao.tarefa.tipo = 'USUARIO'
              this.validacao.tarefa.situacao = 'PADRAO'
              this.validacao.proximaEtapa = 'Análise'
              // Calcula o total da validacao
              // this.calculaTotal()
              // Chama backend
              this.enviaBackEnd()
            }
          })
        },
        enviaBackEnd () {
          this.$snotify.info('Atualizando Validação', {timeout: 0})
          axiosLaravel.post('processos/grava', this.validacao).then((response) => {
            this.$snotify.clear()
            if (_.hasIn(response, 'error')) {
              this.$snotify.error(response.data.value.error[0], '', 10000)
            } else {
              this.$snotify.success('Solicitação gravada com sucesso!')
              setTimeout(() => { this.$router.go(-1) }, 2000)
            }
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        // calculaTotal () {
        //   this.validacao.totalValue = this.validacao.receipts.reduce((total, nota) => total + nota.totalValue, 0)
        // },
        // Tratamento depois da validação da nota
        concluiValidacaoNota (evento) { // Passa como paramentros a nota na posição 0 e validacao na posição 1
          evento[0].selecionado = false
          this.table.items[this.notaIndex] = _.cloneDeep(evento[0])
          this.validacao = _.cloneDeep(evento[1])
          // this.validacao.paymentRequest.receipts.push(_.cloneDeep(evento[0]))
          this.visibleForm = !this.visibleForm
          this.$forceUpdate()
        },
        // Volta a exibir a grid de notas
        voltaPraSolicitacao () {
          this.visibleForm = !this.visibleForm
          this.$forceUpdate()
        },
        // Verifica se alguma nota foi selecionada ou validada
        blockBatchApproval (projeto) {
          let result = true
          result = this.table.items.some(item => {
            return item.selecionado !== true && !item.requestApprovalResult
          })
          return result
        },
        verificaSeProjetoEsta90DiasAtrasado (projeto) {
          // return axios.get('proxy/project/system-restriction/project/' + projeto.id + '/is-project-90-days-late').then((response) => {
          //   return response.data.value
          // })
          //   .catch((error) => {
          //     console.log('error', error)
          //     this.$root.trataErro(error)
          //   })
        },
        verificaSeProjetoEsta180DiasAtrasado (projeto) {
          // return axios.get('proxy/project/system-restriction/project/' + projeto.id + '/is-project-180-days-late').then((response) => {
          //   return response.data.value
          // })
          //   .catch((error) => {
          //     console.log('error', error)
          //     this.$root.trataErro(error)
          //   })
        }
      }
    }
</script>

<style scoped>

</style>
