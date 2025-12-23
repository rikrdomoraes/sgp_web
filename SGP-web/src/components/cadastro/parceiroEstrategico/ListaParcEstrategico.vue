<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Parceiros Estratégicos'"/>

    <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Parceiros Estratégicos</h1>
        <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Cadastro',
            href: '#'
            }, {
            text: 'Parceiros Estratégicos',
            active: true
            }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">

        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-users" aria-hidden="true"></i> Consulta de Parceiros Estratégicos</h3>
              </div>
              <div class="box-body" >
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <!--Campo de pesquisa-->
                <div class="col-sm-offset-4 col-sm-4" style="margin-bottom: 1rem">
                  <div class="input-group">
                    <input v-model="table.filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
                    <span class="input-group-btn">
                          <button :disabled="!table.filter" @click="table.filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                        </span>
                  </div>
                </div>
                <div class="row col-sm-12">
                  <div class="col-sm-12">
                    <g-button-ujarak color="dark-primary"
                                     :disabled="!this.$root.authorize('parceiro-estrategico-novo')"
                                     @click.native="$router.push({name: 'cadastro-parceiro-estrategico-novo'})"
                                     size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Parceiro Estratégico </g-button-ujarak>
                  </div>
                  <br><br><br>
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
                        <template slot="ds_cnpj"  scope="row">{{row.value | cnpj}}</template>
                        <template slot="actions" scope="row">
                          <div>
                            <g-button-ujarak color="success" size="button--size-ss"  type="button" @click.native="$router.push({name: 'cadastro-parceiro-estrategico-edita', params: { id: row.item.id, opcao: 'visualizar' }})">
                              <i class="fa fa-search" aria-hidden="true"></i>&nbsp&nbspVisualizar</g-button-ujarak>
                            <!--<b-button type="button" :disabled="false" :to="{name: 'cadastro-parceiro-estrategico-edita', params: { id: row.item.id, opcao: 'visualizar' }}" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Visualizar</b-button>-->
                            <g-button-ujarak color="primary" size="button--size-ss"  @click.native="$router.push({name: 'cadastro-parceiro-estrategico-edita', params: {id: row.item.id}})"><i class="fa fa-pencil-square-o" aria-hidden="true" ></i> Editar</g-button-ujarak>
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
      name: 'ListaParcEstrategico',
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
            sortBy: 'active',
            sortDesc: true,
            totalRows: 0,
            fields: [
              { key: 'ds_nome', label: 'Razão Social', sortable: true, thStyle: 'text-align: center; width: 40%', class: 'text-center' },
              { key: 'ds_cnpj', label: 'CNPJ', sortable: true, thStyle: 'text-align: center; width: 25%', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 10%', class: 'text-center' }
            ]
          }
        }
      },
      created () {
        axiosLaravel.get('parceiros/').then((response) => {
          console.log('response.data', response.data)
          this.table.items = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      methods: {
        onFiltered (filteredItems) {
          // Trigger pagination to update the number of buttons/pages due to filtering
          this.table.totalRows = filteredItems.length
          this.table.currentPage = 1
        }
      }
    }
</script>

<style scoped>

</style>
