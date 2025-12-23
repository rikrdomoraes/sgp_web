  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
  <template>
    <div class="content-wrapper" style="min-height: 870px;">
        <section class="content-header ng-scope">
            <vue-headful :title="'SGP - Solicitações'"/>
            <h1>Solicitações de Prestação de Contas (Modelo Simplificado)</h1>
            <b-breadcrumb :items="breadcrumb"/>
        </section>
  
        <section class="content ng-scope">
            Lista de todos os IDs em aberto e seus respectivos estados
        </section>
    </div>
  </template>
  
  <script>
    import { mapGetters } from 'vuex'
    import moment from 'moment'
    export default {
      components: {
      },
      name: 'ListaSolicitacaoPrestacaoContasSimplificado',
      data () {
        return {
          loading: {
            show: false
          },
          table: {
            items: [],
            currentPage: 0,
            perPage: 10,
            totalRows: 0,
            sortBy: 'id',
            sortDesc: true,
            filter: null,
            emptyText: 'Não tem nenhum registro para mostrar',
            fields: [
                { key: 'id', label: 'ID', sortable: true, thStyle: 'width: 5%; text-align: center', class: 'text-center' },
                { key: 'tipo_solicitacao', label: 'Tipo de Solicitação', sortable: true, thStyle: 'width: 6%; text-align: center', class: 'text-center' },
                { key: 'projeto', label: 'Projeto', sortable: true, thStyle: 'width: 34%; text-align: center', class: 'centraliza' },
                { key: 'data_solicitacao', label: 'Data de Solicitação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'valor', label: 'Valor', thStyle: 'text-align: center', class: 'text-center' },
                { key: 'etapa', label: 'Etapa', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'situacao', label: 'Situação', thStyle: 'text-align: center', class: 'text-center', sortable: true },
                { key: 'actions', label: 'Ações', thStyle: 'width: 25%; text-align: center', class: 'text-center' }
            ]
          },
          store: this.$store,
          breadcrumb: [{
            text: 'Inicial',
            href: '/'
          }, {
            text: 'Solcitações Prestação de Contas Simplificada',
            active: true
          }]
        }
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ]),
        chiefActive () {
          return this.usuarioLogado.entity.chiefs.some(chefe => {
            return chefe.active === true && moment(new Date()).isSameOrAfter(moment(chefe.initialMandateDate)) && moment(new Date()).isSameOrBefore(moment(chefe.endMandateDate))
          })
        }
      },
      created: function () {
      },
      mounted: function () {
      },
      methods: {
        async buscaDadosBancariosAdiantamento (idSolicitacao) {
          axiosLaravel.get('processos/dados_bancarios_adiantamento/' + idSolicitacao).then((response) => {
            // this.$forceUpdate() // força o update da tela para não ter problema
            this.dadosBancariosAdiantamento.banco = response.data[0].banco
            this.dadosBancariosAdiantamento.agencia = response.data[0].agencia
            this.dadosBancariosAdiantamento.conta = response.data[0].conta
            this.dadosBancariosAdiantamento.tipo = response.data[0].tipo
            this.$forceUpdate()
          })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
        }
      }
    }
  </script>
  
  <style src="../../../../static/css/prestacaoContasNovo.css">
  </style>
  