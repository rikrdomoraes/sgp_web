<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Solicitação de Contrapartida</h1>
        <b-breadcrumb :items="[{
        text: 'Inicial',
        href: '/'
        }, {
        text: 'Solicitações',
        href: '#'
        }, {
        text: 'Contrapartoda',
        active: true
        }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">


        <div class="row">
          <div class="col-md-12 form-horizontal">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Solicitação de Contrapartida - <i><font color="black" size="3">Projeto: </font><font color="black" size="3">{{projeto.Projeto}}</font></i></h3>
              </div>
              <div class="box-body" >
                <fieldset>
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
                  <cronograma-solicitacao-contrapartida :propsNota="nota" :propsProjeto="projeto" :propsValidacao="validacao" :propsEtapa="etapa"></cronograma-solicitacao-contrapartida>

                  <!--Documentos de solicitação de contrapartida-->
                  <div class="col-md-12">
                    <div class="box-header with-border">
                      <h3 class="box-title">Documentos de solicitação de Contrapartida</h3>
                    </div>
                    <upload-documentos-php :propDocumentos="nota.receiptAttachments" :documentTypes="''" :disable="''"></upload-documentos-php>
                  </div>

                </fieldset>
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
                    <!--<button @click="onSave" type="button" class="btn btn-success btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Concluir</button>-->
                    <!--<button @click="onClean" type="button" class="btn btn-default btn-flat"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</button>-->
                    <!--<button @click.native="voltaPraSolicitacao" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</button>-->
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
  import CronogramaSolicitacaoContrapartida from '../modulos/cronograma-solicitacao-contrapartida'
  import DocumentoFiscalSolicitacaoPagamento from '../modulos/documentoFiscalSolicitacaoPagamento'
  import FormaPagamento from '../modulos/formaPagamento'
  import Fornecedor from '../modulos/fornecedor'
  import UploadDocumentosPhp from '../../modules/uploadDocumentosPhp'
  import DadosBancarios from '../modulos/dadosBancarios'
  import moment from 'moment'

  export default {
    components: {
      DadosBancarios,
      UploadDocumentosPhp,
      Fornecedor,
      FormaPagamento,
      DocumentoFiscalSolicitacaoPagamento,
      CronogramaSolicitacaoContrapartida},
    name: 'form-solicitacao-pagamento',
    data () {
      return {
        // Array que guarda as fases de analise e Autorização de pagamentos
        analiseAutorizacao: ['ANALYSIS', 'MONITORING'],
        checkedNames: [],
        validacao: {
          processo: [],
          tarefa: []
        },
        nota: {
          receiptAttachments: []
        },
        etapa: 'Solicitação',
        aprovacao: {},
        data_edicao: '',
        projeto: {}
      }
    },
    computed: {
      mostraParaValidacaoPagamento () {
        return _.includes(this.analiseAutorizacao, this.validacao.paymentRequestApprovalPhase)
      }
    },
    props: ['propsNota', 'propsValidacao', 'propsProjeto'],
    watch: {
      propsNota () {
        this.nota = _.cloneDeep(this.propsNota)
      },
      propsValidacao () {
        this.validacao = _.cloneDeep(this.propsValidacao)
      },
      propsProjeto () {
        this.projeto = _.cloneDeep(this.propsProjeto)
      }
    },
    mounted () {
      this.data_edicao = moment().format('YYYY-MM-DD HH:mm:ss')
      this.nota = _.cloneDeep(this.propsNota)
      this.validacao = _.cloneDeep(this.propsValidacao)
      this.projeto = _.cloneDeep(this.propsProjeto)
      if (!_.isEmpty(this.projeto)) {
        this.buscaCronograma()
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
        this.$validator.validateAll().then(result => { // Validação geral
          if (result) {
            this.aprovacao = this.trataNota(this.nota) // Trata a nota para ficar no formato que queremos
            console.log('this.nota', this.nota)
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
            this.validacao.processo.nome = 'CONTRAPARTIDA'
            this.validacao.processo.situacao = 'EM_EXECUCAO'
            this.validacao.tarefa.nome = 'SOLICITACAO'
            this.validacao.tarefa.tipo = 'USUARIO'
            this.validacao.tarefa.situacao = 'PADRAO'
            this.validacao.dataInclusao = this.aprovacao.dataInclusao
            this.validacao.dataValidade = this.aprovacao.dataValidade
            this.validacao.enderecoFornecedor = this.aprovacao.enderecoFornecedor
            this.validacao.estadoFornecedor = this.aprovacao.estadoFornecedor
            this.validacao.forma_pagamento = this.aprovacao.forma_pagamento
            this.validacao.nomeFornecedor = this.aprovacao.nomeFornecedor
            this.validacao.tipoFornecedor = this.aprovacao.tipoFornecedor
            this.validacao.numeroNota = this.aprovacao.numeroNota
            this.validacao.serieNota = this.aprovacao.serieNota
            this.validacao.pagamentoPrioritario = this.aprovacao.pagamentoPrioritario
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
        this.$snotify.async('Enviando Solicitação de Contrapartida. Por favor, aguarde...', {timeout: 0})
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
      voltaPraSolicitacao () {
        window.location.reload()
      },
      gravaHistorico (parm) {
        axiosLaravel.post('historico-tarefas/', parm).then((response) => {
          console.log(response.data)
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
      buscaCronograma () {
        this.loadingShow = true
        let documento = 0
        let idProposta = _.isUndefined(this.projeto.Id_proposta) ? this.projeto.fk_proposta : this.projeto.Id_proposta
        axiosLaravel.post('processos/cronograma/projeto/', {'proposta': idProposta, 'processo': 'CONTRAPARTIDA', 'aglutinado': 'Não', 'documento': documento}).then((response) => {
          this.projetos = response.data
          this.$forceUpdate() // força o update da tela para não ter problema
          this.loadingShow = false // desbloquea a tela
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
