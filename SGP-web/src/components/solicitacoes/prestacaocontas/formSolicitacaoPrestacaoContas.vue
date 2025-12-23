<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Solicitação de Prestação de Contas</h1>
        <b-breadcrumb :items="[{
        text: 'Inicial',
        href: '/'
        }, {
        text: 'Solicitações',
        href: '#'
        }, {
        text: 'Prestação de Contas',
        active: true
        }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">


        <div class="row">
          <div class="col-md-12 form-horizontal">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Solicitação de Prestação de Contas - <i><font color="black" size="3">Projeto: </font><font color="black" size="3">{{projeto.Projeto}}</font></i></h3>
              </div>
              <div class="box-header with-border">
                <div class="row" ng-if="$ctrl.approvalState != 'DEFAULT'">
                  <div class="col-sm-12" >
                    <form name="frmSearch" class="form-horizontal" novalidate>
                      <div class="form-group required" >
                        <div class="col-md-5">
                          <dl class="proposal-definition-list">
                            <dt>Objetivo Geral: </dt>
                            <dd>{{projeto.Objetivo}}</dd>

                            <dt>Situação:</dt>
                            <dd><span>{{validacao.situacao || 'Em Preenchimento'}}</span></dd>
                          </dl>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="box-header with-border">
                <h3 class="box-title">Solicitações concedidas</h3>
              </div>
              <div class="box-body" >
                <table class="table table-condensed table-bordered">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Processo de solicitação em andamento</th>
                    <th>Valor liberado</th>
                    <th>Valor não solicitado</th>
                    <th>Data limite para prestação de contas</th>
                    <th>Data da última prestação de contas</th>
                    <th>Percentual a comprovar</th>
                    <th>Valor devolvido</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="o in adiantamentos">
                    <td data-title="'ID'"
                        class="text-center">{{o.id}}</td>
                    <td data-title="'Processo de solicitação em andamento'" sortable="'projectName'"
                        class="text-center">{{o.projectName +' - '+ o.createDate}}</td>
                    <td data-title="'Valor liberado'" sortable="'valueReleased'"
                        class="text-center">{{o.totalValue | real}}</td>
                    <td data-title="'Valor não solicitado'" sortable="'totalValueBalance'"
                        class="text-center">{{o.totalValueBalance | real}}</td>
                    <td data-title="'Data limite para prestação de contas'" sortable="'datLimAcc'"
                        class="text-center">{{o.limitDate}}</td>
                    <td data-title="'Data da última prestação de contas'" sortable="'lastDatLimAcc'"
                        class="text-center">{{o.accountabilityDate1}}</td>
                    <td data-title="'Percentual a comprovar'" sortable="'percentual_comprovado'"
                        class="text-center">{{o.percentual_comprovado}} %</td>
                    <td data-title="'Valor devolvido'" sortable="'percentual_comprovado'"
                        class="text-center">{{o.devolvido | real}}</td>
                  </tr>
                  </tbody>
                </table>
                <fieldset>
                  <cronograma-solicitacao-prestacaocontas
                    :propsNota="nota"
                    :propsProjeto="projeto"
                    :propsValidacao="validacao"
                    :propsEtapa="etapa"
                  ></cronograma-solicitacao-prestacaocontas>
                  <documento-fiscal :propsNota="nota" :propsEtapa="etapa"></documento-fiscal>
                  <forma-pagamento :propsNota="nota" :propsValidacao="validacao"></forma-pagamento>
                  <fornecedor :propsNota="nota" :propsValidacao="validacao"></fornecedor>
                  <dados-bancarios v-if="nota.forma_pagamento === '3'" :propsNota="nota"></dados-bancarios>

                  <!--Documentos de solicitação de pagamento-->
                  <div class="col-md-12">
                    <div class="box-header with-border">
                      <h3 class="box-title">Documentos da Solicitação de Prestação de Contas</h3>
                    </div>
                    <upload-documentos-php :propDocumentos="nota.receiptAttachments" :documentTypes="''" :disable="''"></upload-documentos-php>
                  </div>

                </fieldset>
                <!--<div class="col-md-12">-->
                  <!--<download-notas :propsValidacao="validacao"></download-notas>-->
                <!--</div>-->

                <!--<div class="col-md-12">-->
                  <!--<div class="box box-widget" >-->
                    <!--<div class="box-header with-border">-->
                      <!--<h3 class="box-title">Histórico de solicitação</h3>-->
                    <!--</div>-->
                    <!--<div class="box-body">-->
                      <!--<div class="table-responsive" >-->
                        <!--<table class="table table-condensed table-bordered table-striped">-->
                          <!--<thead style="text-align: center;">-->
                          <!--<tr>-->
                            <!--<td>Data</td>-->
                            <!--<td>Fase</td>-->
                            <!--<td>Justificativa</td>-->
                            <!--<td>Usuário Responsável</td>-->
                          <!--</tr>-->
                          <!--</thead>-->
                          <!--<tbody>-->
                          <!--<tr v-for="lista in listaHistorico">-->
                            <!--<td-->
                              <!--class="text-center">{{lista.inicio}}</td>-->
                            <!--<td data-title="'Processo de solicitação em andamento'"-->
                                <!--class="text-center">{{lista.nome}}</td>-->
                            <!--<td data-title="'Valor liberado'"-->
                                <!--class="text-center">{{lista.observacao}}</td>-->
                            <!--<td data-title="'Valor não solicitado'"-->
                                <!--class="text-center">{{usuario}}</td>-->
                            <!--&lt;!&ndash;<td data-title="'Visualização'" ng-if="!grantedSolicCtrl.hideSnapshot" class="text-center">&ndash;&gt;-->
                            <!--&lt;!&ndash;<button type="button" ng-click="grantedSolicCtrl.openGrantedSnapshotModal(o.eventId, o.discriminator)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-search" aria-hidden="true"></i></button>&ndash;&gt;-->
                            <!--&lt;!&ndash;</td>&ndash;&gt;-->
                          <!--</tr>-->
                          <!--</tbody>-->
                          <!--<tr v-show="(listaHistorico.length === 0)">-->
                            <!--<td colspan="100%" class="text-center">Nenhum registro encontrado!</td>-->
                          <!--</tr>-->
                        <!--</table>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->


                <div class="col-md-12" v-if="!mostraParaValidacaoPagamento">
                  <div class="box-footer">
                    <!--<button @click="onSave" type="button" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</button>-->
                    <g-button-moema color="success" size="button--size-ss" @click.native="onSave"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>
                    <g-button-moema color="primary" size="button--size-ss" @click.native="onClean"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</g-button-moema>
                    <g-button-moema color="warning" size="button--size-ss" @click.native="voltaPraSolicitacao"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
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
  import DocumentoFiscal from '../modulos/documentoFiscal'
  import FormaPagamento from '../modulos/formaPagamento'
  import Fornecedor from '../modulos/fornecedor'
  import UploadDocumentosPhp from '../../modules/uploadDocumentosPhp'
  import DadosBancarios from '../modulos/dadosBancarios'
  import CronogramaSolicitacaoPrestacaocontas from '../modulos/cronograma-solicitacao-prestacaocontas'
  import moment from 'moment'
  import { cpf, cnpj } from 'cpf-cnpj-validator'

  export default {
    components: {
      CronogramaSolicitacaoPrestacaocontas,
      DadosBancarios,
      UploadDocumentosPhp,
      Fornecedor,
      FormaPagamento,
      DocumentoFiscal},
    name: 'form-solicitacao-prestacaocontas',
    data () {
      return {
        // Array que guarda as fases de analise e Autorização de pagamentos
        analiseAutorizacao: ['ANALYSIS', 'MONITORING'],
        checkedNames: [],
        validacao: {
          processo: {
            nome: 'PRESTACAO_DE_CONTAS'
          }
        },
        nota: {
          receiptAttachments: []
        },
        itensProjeto: [],
        etapa: 'Solicitação',
        data_edicao: '',
        aprovacao: {},
        projeto: {}
      }
    },
    computed: {
      mostraParaValidacaoPagamento () {
        return _.includes(this.analiseAutorizacao, this.validacao.paymentRequestApprovalPhase)
      }},
    props: ['propsNota', 'propsValidacao', 'propsProjeto'],
    watch: {
      propsNota () {
        this.nota = _.cloneDeep(this.propsNota)
      },
      propsValidacao () {
        this.validacao = _.cloneDeep(this.propsValidacao)
      },
      propsProjeto () {
        console.log('entrou no watch')
        this.projeto = _.cloneDeep(this.propsProjeto)
      }
    },
    mounted () {
      this.data_edicao = moment().format('YYYY-MM-DD HH:mm:ss')
      this.nota = _.cloneDeep(this.propsNota)
      this.validacao = _.cloneDeep(this.propsValidacao)
      this.validacao.processo.nome = 'PRESTACAO_DE_CONTAS'
      console.log('mounted')
      this.projeto = _.cloneDeep(this.propsProjeto)
      if (!_.isEmpty(this.projeto)) {
        // this.buscaCronograma()
        this.buscaAdiantamentos()
        // this.nota = this.projeto.projectItems
      }
      // this.historico()
    },
    methods: {
      trataNota: function (nota) {
        nota.receiptItems.forEach((item) => {
          let receiptItem = {
            createdAt: null,
            id: 0,
            item: item.item,
            projectItem: null,
            quantity: item.quantityRequest,
            totalValue: item.valueRequest,
            updatedAt: null
          }
          item = receiptItem
        })
        return nota
      },
      onClean () {
        this.nota = []
      },
      onSave () {
        // verifica se todos os campos dos componentes filhos foram preenchidos
        if (!this.$root.verificaFormulario(this)) {
          this.$snotify.error('Formulario possui erros favor verificar')
          return
        }
        // verifica se foi preenchido algum item do cronograma
        if (_.isUndefined(this.nota.receiptItems)) {
          this.$snotify.error('Favor preencher o cronograma com algum valor')
          return
        }
        if (this.nota.receiptAttachments.length === 0) {
          this.$snotify.error('É obrigatório a apresentação de um documento')
          return
        }
        //
        // Verifica CPF/CNPJ
        let valido = true
        if (this.nota.cpfFornecedor) {
          valido = cpf.isValid(this.nota.cpfFornecedor)
        }
        if (this.nota.cnpjFornecedor) {
          valido = cnpj.isValid(this.nota.cnpjFornecedor)
        }
        if (valido === false) {
          this.$snotify.error('O campo CPF/CNPJ está incorreto.')
          return
        }
        //
        this.$validator.validateAll().then(result => { // Validação geral
          if (result) {
            this.aprovacao = this.trataNota(this.nota) // Trata a nota para ficar no formato que queremos
            if (this.nota.receiptItems) {
              var i = 0
              let valorTotal = 0
              for (i = 0; i < this.nota.receiptItems.length; i++) {
                valorTotal = valorTotal + this.nota.receiptItems[i].valueRequest
              }
              this.nota.valorTotal = valorTotal
            }
            this.validacao.cepFornecedor = this.aprovacao.cepFornecedor
            this.validacao.cidadeFornecedor = this.aprovacao.cidadeFornecedor
            if (this.aprovacao.cnpjFornecedor) {
              this.validacao.cnpjFornecedor = this.aprovacao.cnpjFornecedor
            } else {
              this.validacao.cpfFornecedor = this.aprovacao.cpfFornecedor
            }
            // monta objeto final
            this.validacao.processo.situacao = 'EM_EXECUCAO'
            this.validacao.tarefa.nome = 'SOLICITACAO'
            this.validacao.tarefa.tipo = 'USUARIO'
            this.validacao.tarefa.situacao = 'PADRAO'
            this.validacao.dataInclusao = this.nota.emissao
            this.validacao.dataValidade = this.nota.validade
            this.validacao.enderecoFornecedor = this.aprovacao.enderecoFornecedor
            this.validacao.estadoFornecedor = this.aprovacao.estadoFornecedor
            this.validacao.forma_pagamento = this.aprovacao.forma_pagamento
            this.validacao.nomeFornecedor = this.aprovacao.nomeFornecedor
            this.validacao.tipoFornecedor = this.aprovacao.tipoFornecedor
            this.validacao.numeroNota = this.nota.numero
            this.validacao.serieNota = this.nota.serie
            this.validacao.pagamentoPrioritario = this.nota.prioridade
            this.validacao.valorTotal = this.aprovacao.valorTotal
            this.validacao.itens = this.aprovacao.receiptItems
            this.validacao.anexos = this.aprovacao.receiptAttachments
            this.validacao.projeto = this.projeto
            if (this.aprovacao.banco) {
              this.validacao.banco = this.aprovacao.banco
            }
            if (this.aprovacao.agencia) {
              this.validacao.agencia = this.aprovacao.agencia
            }
            if (this.aprovacao.conta) {
              this.validacao.conta = this.aprovacao.conta
            }
            // Calcula o total de adiantamento
            let totalAdiantamento = this.adiantamentos.reduce((total, item) => total + item.totalValue, 0)
            // Calcula o total solicitado
            let totalSolicitado = this.nota.receiptItems.reduce((total, item) => total + item.valorSolicitado, 0)
            // Limita a quantidade de casas decimais e transforma a string retornada para float
            if (parseFloat(totalSolicitado.toFixed(2)) > parseFloat(totalAdiantamento.toFixed(2))) {
              this.$snotify.error('Total do valor solicitado ' + this.$root.formataNumero(totalSolicitado, 'moeda') + ' é maior que o liberado no adiantamento ' + this.$root.formataNumero(totalAdiantamento, 'moeda'))
              return
            }
            this.validacao.proximaEtapa = 'Análise'
            // fim
            //
            this.validacao.proxima_etapa = this.validacao.proximaEtapa
            this.validacao.tarefa.data_edicao = this.data_edicao
            this.validacao.tarefa.inicio = this.data_edicao
            this.enviaBackEnd()
          } else {
            this.$snotify.error('existem campos com erro favor verificar')
          }
        })
      },
      enviaBackEnd () {
        this.$snotify.async('Validando Solicitação de Prestação de Contas. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('processos/grava', this.validacao).then((response) => {
          this.$snotify.clear()
          if (_.hasIn(response, 'error')) {
            this.$snotify.clear()
            this.$snotify.error(response.data.value.error[0], '', 10000)
          } else {
            this.gravaHistorico(response.data)
            this.$snotify.clear()
            this.$snotify.success('Solicitação gravada com sucesso!')
            setTimeout(() => { this.$router.go(-1) }, 2000)
          }
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      // historico () {
      //   console.log('this.validacao', this.projeto)
      //   axiosLaravel.get('processos/' + this.row.item.id).then((response) => {
      //     this.req = response.data
      //     this.tarefas = this.req.tarefas
      //     let array = []
      //     for (let i = 0; i < this.tarefas.length; i++) {
      //       if (this.tarefas[i].tipo === 'Usuário') {
      //         array.push(this.tarefas[i])
      //       }
      //     }
      //     this.listaHistorico = _.cloneDeep(array)
      //     for (let i = 0; i < this.listaHistorico.length; i++) {
      //       if (this.listaHistorico.usuario !== null) {
      //         this.usuario = this.listaHistorico.usuario
      //       }
      //     }
      //   })
      //     .catch((error) => {
      //       console.log('error', error)
      //       this.$root.trataErro(error)
      //     })
      // },
      voltaPraSolicitacao () {
        window.location.reload()
      },
      gravaHistorico (parm) {
        axiosLaravel.post('historico-tarefas/', parm).then((response) => {
          console.log(response.data)
        })
      },
      // buscaCronograma () {
      //   this.loadingShow = true
      //   let documento = 0
      //   axiosLaravel.post('processos/cronograma/projeto/', {'projeto': this.projeto.Id_projeto, 'processo': 'PAGAMENTO', 'aglutinado': 'Não', 'documento': documento}).then((response) => {
      //     this.itensProjeto = response.data.itens
      //     this.$forceUpdate() // força o update da tela para não ter problema
      //     this.loadingShow = false // desbloquea a tela
      //   })
      //     .catch((error) => {
      //       console.log('error', error)
      //       this.$root.trataErro(error)
      //     })
      // },
      async buscaAdiantamentos () {
        let idProposta = _.isUndefined(this.propsProjeto.Id_proposta) ? this.propsProjeto.fk_proposta : this.propsProjeto.Id_proposta
        await axiosLaravel.get('processos/adiantamento/recursos/' + idProposta).then((response) => {
          this.adiantamentos = response.data.adiantamentos_concedidos.row
          this.$forceUpdate()
          for (var i = 0; i < this.adiantamentos.length; i++) {
            this.adiantamentos[i].accountabilityDate1 = ''
            this.adiantamentos[i].createDate = moment(this.adiantamentos[i].createAt).format('DD/MM/YYYY')
            this.adiantamentos[i].limitDate = moment(this.adiantamentos[i].createDate, 'DD-MM-YYYY').add(90, 'days').format('DD/MM/YYYY')
            if (this.adiantamentos[i].accountabilityDate) {
              this.adiantamentos[i].accountabilityDate1 = moment(this.adiantamentos[i].accountabilityDate).format('DD/MM/YYYY')
            } else {
              this.adiantamentos[i].accountabilityDate1 = '-'
            }
            if (this.adiantamentos[i].percentual_comprovado) {
              this.adiantamentos[i].percentual_comprovado = parseFloat(this.adiantamentos[i].percentual_comprovado.toFixed(4) * 100)
            }
          }
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      }
    }
  }
</script>

<style scoped>

</style>
