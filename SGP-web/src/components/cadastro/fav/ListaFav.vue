<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>FAV</h1>
        <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Lista',
            href: '#'
            }, {
            text: 'FAV',
            active: true
            }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">

        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-list" aria-hidden="true"></i> Cadastro de Fav</h3>
              </div>
              <div class="box-body" >
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <div class="row">
                  <div class="col-sm-12">
                    <g-button-ujarak color="dark-primary" :disabled="!this.$root.authorize('fav-editar')" @click.native="$router.push({name: 'cadastro-fav-nova'})" size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova Fav </g-button-ujarak>
                  </div>
                  <!--Campo de pesquisa-->
                  <div class="col-sm-offset-4 col-sm-4">
                    <div class="input-group">
                      <input v-model="table.filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
                      <span class="input-group-btn">
                          <button :disabled="!table.filter" @click="table.filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                        </span>
                    </div>
                    <br><br>
                  </div>
                  <!--Lista de Editais-->
                  <div class="col-sm-12">
                    <b-container fluid>
                      <!-- Main table element -->
                      <b-table show-empty
                               stacked="md"
                               :bordered="table.bordered"
                               :items="table.items"
                               :hover="table.hover"
                               :fields="table.fields"
                               :filter="table.filter"
                               :current-page="table.currentPage"
                               @filtered="onFiltered"
                               :per-page="table.perPage"
                               :sort-by.sync="table.sortBy"
                               :sort-desc.sync="table.sortDesc"
                               empty-text="Nenhum registro encontrado"
                      >
                        <template slot="situation" scope="row">
                          <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                        </template>
                        <template slot="actions" scope="row">
                          <div>
                            <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'cadastro-fav-edita', params: { fav: row.item }})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp Editar</g-button-ujarak >
                            <g-button-ujarak color="warning" size="button--size-ss" @click.native="inativa(row.item)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> {{row.item.situation ? ' Inativar' : ' Ativar'}}</g-button-ujarak>
                          </div>
                        </template>
                      </b-table>
                      <b-row>
                        <b-col md="6" class="my-1" right>
                          <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
                        </b-col>
                      </b-row>


                    </b-container>
                    <div v-show="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                      <i class="fa fa-refresh fa-spin"></i>
                    </div>
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
  export default {
    name: 'ListaFav',
    data () {
      return {
        loading: {
          show: false
        },
        table: {
          items: [],
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          sortBy: 'situation',
          sortDesc: true,
          fields: [
            { key: 'name', label: 'FAV', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
            { key: 'situation', label: 'Ativo', sortable: true, thStyle: 'text-align: center; width: 0.2%', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 3%', class: 'text-center' }
          ]
        }
      }
    },
    watch: {
      onEdit (item) {
        this.$root.$broadcast('editFavEvent', item)
      }
    },
    created () {
      this.carregaFav()
    },
    methods: {
      carregaFav () {
        axios.get('proxy/project/favs').then((response) => {
          this.table.items = response.data.value
          this.table.totalRows = this.table.items.length
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onFiltered (filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.table.totalRows = this.table.items.length
        this.currentPage = 1
      },
      inativa (item) {
        item.situation = !item.situation
        axios.put('proxy/project/favs/' + item.id, item).then((response) => {
          this.$snotify.success('FAV atualizada com sucesso', '', this.$root._data.sucesso)
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      }
    }
  }
</script>
<style scoped>
</style>
