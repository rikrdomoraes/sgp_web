<template>
  <div class="row">
    <div class="col-md-12">
      <div class="table-responsive">
        <b-container fluid>
          <!-- Main table element -->
          <b-table show-empty
                   striped
                   stacked="md"
                   :bordered="table.bordered"
                   :items="table.items"
                   :fields="table.fields"
                   :filter="table.filter"
                   :current-page="table.currentPage"
                   :per-page="table.perPage"
                   :sort-by.sync="table.sortBy"
                   :sort-desc.sync="table.sortDesc"
                   empty-text="Nenhum registro encontrado"
          >
            <template slot="createdAt" scope="row">{{row.value | moment("L")}}</template>
            <template slot="view" scope="row">
              <div>
                <button type="button" @click="openRequestSnapshotModal(row.item.id)"
                        class="btn btn-primary btn-sm btn-flat" disabled><i class="fa fa-search" aria-hidden="true"></i></button>
              </div>
            </template>
          </b-table>
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
              { key: 'eventDate', label: 'Data', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'result', label: 'Evento', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'phase', label: 'Fase', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'justify', label: 'Justificativa', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'usu', label: 'Usuário Responsável', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'view', label: 'Visualização', thStyle: 'text-align: center', class: 'text-center' }
            ]
          }
        }
      },
      props: ['propsValidacao'],
      watch: {
        propsValidacao () {
          this.buscaHistorico()
        }
      },
      mounted () {
        if (this.propsValidacao.counterpartRequest.id) {
          this.buscaHistorico()
        }
      },
      methods: {
        buscaHistorico () {
          axios.get('proxy/project/requests/payments/' + this.propsValidacao.counterpartRequest.id + '/history').then((response) => {
            this.table.items = response.data.value
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        openRequestSnapshotModal (id) {
        }
      }
    }
</script>

<style scoped>

</style>
