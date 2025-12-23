<template>
  <div style="min-height: 870px;">
      <!-- Quando evento 'concluiValidacaoNota' passa como paramentros a nota na posição 0 e validacao na posição 1-->
    <formValidacaoPrestacaoContas :propsNota="nota" :propsValidacao="validacao" :propsHistorico="historicoTarefas"></formValidacaoPrestacaoContas>
    <!--</div>-->
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
    import DownloadNotas from '../../../modules/downloadNotas'
    import HistoricoSolicitacaoPagamento from '../../../solicitacoes/modulos/historicoSolicitacaoPagamento'
    import formValidacaoPrestacaoContas from '../prestacaoContas/formValidacaoPrestacaoContas'

    export default {
      components: {
        formValidacaoPrestacaoContas,
        HistoricoSolicitacaoPagamento,
        DownloadNotas},
      name: 'validacao-solicitacao-prestacaContas',
      data () {
        return {
          // Array que guarda as fases de analise e Autorização de pagamentos
          analiseAutorizacao: ['ANALYSIS', 'MONITORING'],
          loadingShow: false,
          validacao: {
            paymentRequest: {
              project: {
                proposal: {
                  id: null
                }
              },
              notas: {}
            },
            aprovacao: {}
          },
          nota: {},
          notaIndex: 0,
          restrict: false,
          visibleForm: false,
          approval: {}
        }
      },
      computed: {
        // tooltipContext () {
        //   return this.blockBatchApproval() ? 'Na aprovação em lote é necessário ao menos selecionar uma nota' : 'Conclui'
        // },
        // mostraAprovacaoBatch () {
        //   let result = true
        //   result = this.table.items.some(item => {
        //     return item.selected
        //   })
        //   return result
        // },
        // mostraParaValidacaoPagamento () {
        //   if (this.validacao.tarefas[0].nome === 'Em Revisão') {
        //     return 'Revisar'
        //   } else {
        //     return 'Validar'
        //   }
        // }
      },
      created () {
        this.valorTotal = 0
        this.loadingShow = true
        axiosLaravel.get('processos/' + this.$route.params.id).then((response) => {
          this.validacao = response.data
          this.validacao.processo = _.omit(response.data, ['documentos_liberacao', 'tarefas'])
          this.historicoTarefas = _.cloneDeep(response.data.tarefas)
          let array = this.historicoTarefas.filter((item) => {
            return item.tipo === 'Usuário'
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
          // for (i = 0; i < this.validacao.documentos_liberacao[0].itens_liberados.length; i++) {
          //   if (this.validacao.documentos_liberacao[0].itens_liberados[i].valor > 0) {
          //     this.valorTotal = this.valorTotal + this.validacao.documentos_liberacao[0].itens_liberados[i].valor
          //   }
          // }
          // this.validacao.data = response.data.value.data ? JSON.stringify(response.data.value.data) : undefined
          // this.table.items = _.cloneDeep(this.validacao.documentos_liberacao) // Faz um clone das notas e joga na tabela para não influenciar nos dados originais
          // this.validacao.aprovacao = [] // Limpa os dados das notas que serão aprovadas (estava acontecendo erro que os dados estavam vindo preenchidos)
          this.$forceUpdate()
          this.loadingShow = false
          // this.onEdit()
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      }
    }
</script>

<style scoped>

</style>
