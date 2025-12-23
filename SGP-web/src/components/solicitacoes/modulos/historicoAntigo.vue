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
                   :items="propsHistorico"
                   :fields="table.fields"
                   :filter="table.filter"
                   :current-page="table.currentPage"
                   :per-page="table.perPage"
                   :sort-by.sync="table.sortBy"
                   :sort-desc.sync="table.sortDesc"
                   empty-text="Nenhum registro encontrado"
          >
            <template slot="inicio" scope="row">{{row.value | moment("DD/MM/YYYY HH:mm")}}</template>
            <template slot="usuario.ds_tipo_usuario" scope="row">
              <span v-if="row.value === 'ENTIDADE'">Parceiro</span>
              <span v-if="row.value === 'FUNDACAO'">FBB</span>
            </template>
            <!--<div>-->
            <!--<button type="button" @click="openRequestSnapshotModal(row.item.id)"-->
            <!--class="btn btn-primary btn-sm btn-flat" disabled><i class="fa fa-search" aria-hidden="true"></i></button>-->
            <!--</div>-->
          </b-table>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'historico-antigo',
    data () {
      return {
        table: {
          items: [],
          listaHistorico: [],
          totalRows: 0,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          sortBy: 'termino',
          sortDesc: false,
          perPage: 50,
          fields: [
            { key: 'inicio', label: 'Data Início', sortable: true, thStyle: 'text-align: center; width: 12%', class: 'text-center' },
            { key: 'nome', label: 'Fase', sortable: true, thStyle: 'text-align: center; width: 12%', class: 'text-center' },
            { key: 'usuario.ds_nome_usuario', label: 'Usuário Responsável', sortable: true, thStyle: 'text-align: center; width: 25%', class: 'text-center' },
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
        console.log('this.historico', this.historico)
      }
    },
    created () {
    },
    mounted () {
      var j = 0
      let historico = []
      if (this.propsHistorico) {
        this.tarefas = this.propsHistorico
        for (j = 0; j < this.tarefas.length; j++) {
          if (this.tarefas[j].tipo === 'Usuário') {
            historico[j].push(this.tarefas[j])
          }
        }
        this.propsHistorico = historico
        this.table.items = historico
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
