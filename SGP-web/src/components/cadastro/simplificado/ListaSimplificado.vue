<template>
      <div class="content-wrapper" style="min-height: 870px;">
          <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
          <section class="content-header ng-scope">
            <h1>Processos Simplificados</h1>
            <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Lista',
            href: '#'
            }, {
            text: 'Simplificado',
            active: true
            }]"/>
          </section>

          <!-- main content -->
          <section class="content ng-scope">

            <div class="row">
              <div class="col-md-12">
               <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
                <div class="box-header with-border">
                  <h3 class="box-title"><i class="fa fa-list" aria-hidden="true"></i> Cadastro de Processos</h3>
                </div>
                <div class="box-body" >
                  <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <div class="row">
                    <!--Botão novo Edital-->
                    <div class="col-sm-12">
                      <router-link :to="{name: 'cadastro-simplificado-edita'}" :disabled="!this.$root.authorize('edital-novo')" id="new-register" class="btn btn-primary btn-flat">
                        <i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Processo
                      </router-link>
                    </div>
                    <!--Campo de pesquisa-->
                    <div class="col-sm-offset-8 col-sm-4" style="margin-bottom: 1rem">
                      <div class="input-group">
                        <input v-model="table.filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
                        <span class="input-group-btn">
                          <button :disabled="!table.filter" @click="table.filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                        </span>
                      </div>
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
                          <template slot="active" scope="row">
                            <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                          </template>
                          <template slot="createdAt" scope="row">{{row.value | moment("L")}}</template>
                          <template slot="endDate" scope="row">{{row.value | moment("L")}}</template>
                          <template slot="updatedAt" scope="row">{{row.value | moment("L")}}</template>
                          <template slot="actions" scope="row">
                            <div>
                              <b-button type="button" :disabled="false" :to="{name: 'cadastro-simplificado-edita', params: { id: row.item.id }}" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                              <b-button type="button" :disabled="false" @click.stop="inativa(row.item)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> {{row.item.active ? 'Inativar' : 'Ativar'}}</b-button>
                            </div>
                          </template>
                        </b-table>
                        <b-row>
                          <b-col md="6" class="my-1" right>
                            <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-3" />
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
      name: 'lista-simplificado',
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
            sortBy: 'createdAt',
            sortDesc: true,
            fields: [
              { key: 'simplifiedNumber', label: 'Processo Simplificado', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
              { key: 'createdAt', label: 'Data Inicial', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
              { key: 'endDate', label: 'Data Final', sortable: true, thStyle: 'text-align: center; width: 20%', class: 'text-center' },
              { key: 'active', label: 'Ativo', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center' },
              { key: 'changedBy', label: 'Alterado por', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'updatedAt', label: 'Alterado em', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }

            ]
          }
        }
      },
      created () {
        axios.get('proxy/document/simplified').then((response) => {
          this.table.items = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      methods: {
        onFiltered (filteredItems) {
          // Trigger pagination to update the number of buttons/pages due to filtering
          this.totalRows = filteredItems.length
          this.currentPage = 1
        },
        inativa (item) {
          axios.put('proxy/document/simplified/' + item.id + '/status', item).then((response) => {
            this.$snotify.success('Edital atualizado com sucesso')
            item.active = !item.active
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
