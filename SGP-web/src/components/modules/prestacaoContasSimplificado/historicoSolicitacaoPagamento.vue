<template>
  <div class="row-flex prest-historico-container">
    <div class="col-md-12">
      <div class="table-responsive">
        <b-container fluid>
          <!-- Main table element -->
          <b-table show-empty
                   striped
                   stacked="md"
                   :bordered="table.bordered"
                   :items="propsHistorico"
                   :fields="table.fields"
                   :filter="table.filter"
                   :current-page="table.currentPage"
                   :per-page="table.perPage"
                   :sort-by.sync="table.sortBy"
                   :sort-desc.sync="table.sortDesc"
                   empty-text="Nenhum registro encontrado"
          >
            <template slot="inicio" scope="row">
              <span v-if="row.item.data_edicao">{{row.item.data_edicao | moment("DD/MM/YYYY HH:mm")}}</span>
              <span v-else>{{row.value | moment("DD/MM/YYYY HH:mm")}}</span>
            </template>
            <template slot="termino" scope="row">{{row.value | moment("DD/MM/YYYY HH:mm")}}</template>
            <template slot="nome" scope="row">
              <span v-if="row.value === 'DEVOLVE_ATRIBUICAO'">{{dePara(row.item.etapa_anterior)}}</span>
              <span v-if="row.value === 'REVISAO' || row.value === 'Revisão'">Revisão</span>
              <span v-if="row.value === 'TAREFA_REATIVADA'">Tarefa Reativada</span>
              <span v-if="row.value === 'CANCELADO'">Processo Cancelado</span>
              <span v-if="row.value === 'TAREFA_ASSUMIDA'">{{dePara(row.item.etapa_anterior)}}</span>
              <span v-if="row.value !== 'TAREFA_ASSUMIDA' && row.value !== 'DEVOLVE_ATRIBUICAO'">{{dePara(row.value)}}</span>
              <span v-if="row.value == 'ANALISE_FINANCEIRA' && row.value == 'Análise Financeira'">Acerto Contábil</span> 
            </template>
            <template slot="proxima_etapa" scope="row">
              <span v-if="!_.isNull(row.item.termino)">
                <span v-if="row.item.nome === 'TAREFA_ASSUMIDA'"> Tarefa Assumida</span>
                <span v-if="row.item.nome === 'DEVOLVE_ATRIBUICAO'"> Devolvido para a Caixa</span>
                <span v-if="row.item.nome === 'Reabilita'"> Tarefa Reabilitada</span>
                <span v-if="_.includes(['ANALISE', 'Análise'], row.item.proxima_etapa) && _.includes(['AUTORIZACAO', 'Autorização', 'ANALISE_TRIBUTARIA', 'Análise Tributária', 'ANALISE_FINANCEIRA', 'LIQUIDACAO_FINANCEIRA', 'Liquidação'], row.item.nome)"> Devolvido para Análise</span>
                <span v-if="row.item.proxima_etapa === 'REVISAO' || row.item.proxima_etapa === 'Revisão'"> Enviado para Revisão da Entidade</span>
                <span v-if="row.item.proxima_etapa === 'AUTORIZACAO' || row.item.proxima_etapa === 'Autorização'"> Enviado para Autorização</span>
                <span v-if="row.item.proxima_etapa === 'ANALISE_FINANCEIRA' || row.item.proxima_etapa === 'Análise Financeira'"> Enviado para Acerto Contábil</span>
                <span v-if="row.item.proxima_etapa === 'ANALISE_TRIBUTARIA' || row.item.proxima_etapa === 'Análise Tributária'"> Enviado para Análise Tributária</span>
                <!--<span v-if="row.item.proxima_etapa === 'LIQUIDACAO_FINANCEIRA' || row.item.proxima_etapa === 'Liquidação'">  Enviado para Liquidação</span>-->
                <!--<span v-if="row.item.proxima_etapa === 'CONCLUSAO' || row.item.proxima_etapa === 'Conclusão'"> Enviado para Liquidação</span>-->
                <span v-if="row.item.proxima_etapa === 'LIQUIDACAO_FINANCEIRA' || row.item.proxima_etapa === 'Liquidação'"> Enviado para Liquidação</span>
                <span v-if="row.item.proxima_etapa === 'CONCLUSAO' || row.item.proxima_etapa === 'Conclusão'"> {{ meuStatus }}</span>
                <span v-if="row.item.nome === 'Solicitação'"> Enviado para Análise</span>
                <span v-if="row.item.nome === 'SOLICITACAO'"> Enviado para Análise</span>
                <span v-if="row.item.nome === 'Revisão' || row.item.nome === 'REVISAO'"> Enviado para Análise</span>
                <span v-if="row.item.nome === 'TAREFA_REATIVADA'"> Enviado para Análise</span>
              </span>
            </template>
            <template slot="usuario.ds_tipo_usuario" scope="row">
              <span v-if="row.value === 'ENTIDADE'">Parceiro</span>
              <span v-if="row.value === 'FUNDACAO'">FBB</span>
            </template>
          </b-table>
          <b-row>
            <b-col md="6" class="my-1" right>
              <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'historico-solicitacao-pagamento',
    data () {
      return {
        meuStatus: 'ValorInicial',
        table: {
          items: [],
          listaHistorico: [],
          totalRows: null,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          sortBy: 'termino',
          sortDesc: false,
          perPage: 20,
          fields: [
            { key: 'inicio', label: 'Data Início', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
            { key: 'termino', label: 'Data Término', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
            { key: 'nome', label: 'Fase', sortable: true, thStyle: 'text-align: center; width: 9%', class: 'text-center' },
            { key: 'proxima_etapa', label: 'Status', sortable: true, thStyle: 'text-align: center; width: 13%', class: 'text-center' },
            { key: 'usuario.ds_nome_usuario', label: 'Usuário Responsável', sortable: true, thStyle: 'text-align: center; width: 18%', class: 'text-center' },
            { key: 'usuario.ds_tipo_usuario', label: 'FBB/Parceiro', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
            { key: 'observacao', label: 'Observação', sortable: true, thStyle: 'text-align: center; width: 30%', class: 'text-center' }
          ]
        }
      }
    },
    props: ['propsValidacao', 'propsHistorico'],
    watch: {
      propsHistorico () {
        this.historico = this.propsHistorico
        this.table.totalRows = this.propsHistorico.length
      }
    },
    async created () {
      this.processo = this.$route.path.indexOf('prestacaocontas') >= 0 ? 'PRESTACAO_DE_CONTAS' : this.$route.path.indexOf('contrapartida') >= 0 ? 'CONTRAPARTIDA' : this.$route.path.indexOf('adiantamento') >= 0 ? 'ADIANTAMENTO' : this.$route.path.indexOf('devolucaoAdiantamento') >= 0 ? 'DEVOLUCAO_DE_ADIANTAMENTO' : this.$route.path.indexOf('ressarcimento') >= 0 ? 'RESSARCIMENTO' : 'PAGAMENTO'
      await this.statusProcesso()
    },
    mounted () {
      this.table.items = this.propsHistorico
      this.table.totalRows = this.propsHistorico.length
      this.$forceUpdate()
      // }
    },
    methods: {
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      dePara (parametro) {
        let parametroTratado = ''
        if (parametro === 'SOLICITACAO' || parametro === 'Solicitação') {
          parametroTratado = 'Solicitação'
        }
        if (parametro === 'ANALISE' || parametro === 'Análise') {
          parametroTratado = 'Análise'
        }
        if (parametro === 'AUTORIZACAO' || parametro === 'Autorização') {
          parametroTratado = 'Autorização'
        }
        if (parametro === 'ANALISE_FINANCEIRA' || parametro === 'Análise Financeira') {
          parametroTratado = 'Acerto Contábil'
        }
        // correção de log - suporte 63162
        if (parametro === 'ANALISE_TRIBUTARIA' || parametro === 'Análise Tributária') {
          parametroTratado = 'Análise Tributária'
        }
        if (parametro === 'LIQUIDACAO_FINANCEIRA') {
          parametroTratado = 'Liquidação'
        }
        return parametroTratado
      },
      // Suporte 62292 - Ajuste no texto de conclusão das solicitações.
      async statusProcesso () {
        if (this.$route.params.tipo) {
          if (!_.isNull(this.$route.params.tipo)) {
            switch (this.$route.params.tipo) {
              case 'Adiantamento':
                this.meuStatus = 'Enviado para Liquidação'
                break
              case 'Devolução de Adiantamento':
                this.meuStatus = 'Devolução Liquidada'
                break
              default:
                this.meuStatus = 'Enviado para Liquidação'
            }
          }
        } else {
          this.meuStatus = this.processo
          switch (this.processo) {
            case 'PRESTACAO_DE_CONTAS':
              this.meuStatus = 'Liquidado'
              break
            case 'CONTRAPARTIDA':
              this.meuStatus = 'Contrapartida Aprovada'
              break
            case 'RESSARCIMENTO':
              this.meuStatus = 'Enviado para Liquidação'
              break
            case 'PAGAMENTO':
              this.meuStatus = 'Enviado para Liquidação'
              break
            default:
              this.meuStatus = 'Enviado para Liquidação'
          }
        }
        this.$forceUpdate()
      }
    }
  }
</script>

<style scoped>

</style>
