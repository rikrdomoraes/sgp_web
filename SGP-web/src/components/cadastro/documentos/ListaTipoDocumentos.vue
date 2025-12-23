<template>
    <div class="content-wrapper" style="min-height: 870px;">
        <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
        <section class="content-header ng-scope">
          <h1>Tipo de Documentos</h1>
          <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
          }, {
          text: 'Cadastro',
          href: '#'
          }, {
          text: 'Tipo de Documentos',
          active: true
          }]"/>
        </section>

        <!-- main content -->
        <section class="content ng-scope">

          <div class="row">
            <div class="col-md-12">
             <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-list" aria-hidden="true"></i> Lista de Tipo de Documentos</h3>
              </div>
              <div class="box-body" >
                <div class="form-horizontal ng-pristine ng-valid-mask ng-valid-maxlength ng-valid-date ng-valid ng-valid-max">

                  <div class="col-sm-offset-4 col-sm-4">
                    <div class="input-group">
                      <input v-model="filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
                      <span class="input-group-btn">
                        <button :disabled="!filter" @click="filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                      </span>
                    </div>
                  </div>
                <br>
                </div>
                <!--Botão novo documento-->
                <div class="row">
                  <div class="col-md-12">
                    <g-button-ujarak color="dark-primary" :disabled="!this.$root.authorize('tipo-documento-novo')" @click.native="$router.push({name: 'cadastro-documentos-edita'})" size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Tipo de Documento </g-button-ujarak>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">

                    <div class="col-sm-12">
                      <br>
                      <b-container fluid>
                        <!-- Main table element -->
                        <b-table show-empty
                                 stacked="md"
                                 :bordered="bordered"
                                 :items="items"
                                 :hover="hover"
                                 :fields="fields"
                                 :filter="filter"
                                 :current-page="currentPage"
                                 :per-page="perPage"
                                 :sort-by.sync="sortBy"
                                 :sort-desc.sync="sortDesc"
                                 @filtered="onFiltered"
                                 empty-text="Nenhum registro encontrado"
                        >
                          <template slot="dt_data_inclusao" scope="row">{{row.value | moment('L')}}</template>
                          <template slot="dt_data_vigencia" scope="row">{{row.value | moment('L')}}</template>
                          <template slot="actions" scope="row">
                            <div>
                              <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'cadastro-documentos-edita', params: { id: row.item.id }})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp Editar</g-button-ujarak >
                            </div>
                          </template>
                        </b-table>
                        <b-row>
                          <b-col md="6" class="my-1" right>
                            <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-3" />
                          </b-col>
                        </b-row>


                      </b-container>
                      <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                        <i class="fa fa-refresh fa-spin"></i>
                      </div>
                    </div>
                    <!--<button @click="$router.push({ path: '/dashboard' })" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</button>-->
                  </div>
                  <!-- /.col -->
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
// eslint-disable-next-line no-unused-vars
    import moment from 'moment'
    export default {
      name: 'lista-tipo-documentos',
      data () {
        return {
          items: [],
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          // totalRows: 0,
          filter: null,
          sortBy: 'ds_tipo',
          sortDesc: false,
          emptyText: 'Não há registros a serem mostrados',
          fields: [
            { key: 'ds_tipo', label: 'Tipo de Documento', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'dt_data_inclusao', label: 'Data de Adição', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
            { key: 'dt_data_vigencia', label: 'Data de Inativação', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 15%', class: 'text-center' }
          ],
          filtros: {
            beginAdded: null,
            beginAddedDate: null,
            endAddedDate: null,
            beginInactivateDate: null,
            endInactivateDate: null,
            type: null
          },
          loading: {
            show: false
          }
        }
      },
      created () {
        this.buscaTipos()
      },
      computed: {
        totalRows: {
          get: function () {
            return this.items.length
          },
          set: function () {
          }
        }
      },
      methods: {
        onFiltered (filteredItems) {
          // Trigger pagination to update the number of buttons/pages due to filtering
          this.totalRows = filteredItems.length
          this.currentPage = 1
        },
        onNew () {
        },
        clear () {
          this.filtros = {}
          this.buscaTipos()
        },
        buscaTipos () {
          this.loading.show = true
          axiosLaravel.get('/documentos/tipo-documento', this.filtros).then((response) => {
            this.items = response.data
            // this.totalRows = this.items.length
            this.loading.show = false
            this.filtros = {}
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
