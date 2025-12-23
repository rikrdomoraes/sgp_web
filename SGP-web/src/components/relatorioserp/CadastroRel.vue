<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Cadastros de Relatórios Sapiens'"/>

    <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Cadastro de Relatórios ERP</h1>
        <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Relatórios ERP',
            href: '#'
            }, {
            text: 'Cadastro',
            active: true
            }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">

        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Consulta de Relatórios ERP</h3>
              </div>
              <div class="box-body" >
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <div class="row">
                  <!--Botão novo Relatório-->
                  <div class="col-sm-12">
                    <!--<router-link :to="{name: 'edita-relatorio'}" :disabled="!this.$root.authorize('relatorio-erp-editar')" id="new-register" class="btn btn-primary btn-flat">
                      <i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Relatório
                    </router-link>-->
                    <g-button-ujarak color="dark-primary" @click.native="$router.push({name: 'edita-relatorio'})" size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Relatório </g-button-ujarak>
                  </div>
                  &nbsp;
                  <!--Lista de Relatórios-->
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
                        <template slot="actions" scope="row">
                          <div>
                            <!--<b-button type="button" :disabled="false" :to="{name: 'edita-relatorio', params: { number: row.item.fav }}" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>-->
                            <!--<b-button type="button" :disabled="false" @click.stop="inativa(row.item)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> {{row.item.active ? 'Excluir' : 'Excluir'}}</b-button>-->
                            <g-button-ujarak color="primary" size="button--size-ss" :disabled="false" @click.native="$router.push({name: 'edita-relatorio', params: { id: row.item }})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak >
                            <g-button-ujarak color="warning" size="button--size-ss" :disabled="false" @click.native="inativa(row.item)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> {{row.item.active ? ' Inativar' : ' Ativar'}}</g-button-ujarak>
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
      name: 'CadastroRel',
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
            totalRows: 0,
            sortBy: 'active',
            sortDesc: true,
            fields: [
              { key: 'code', label: 'Código do Relatório', sortable: true, thStyle: 'text-align: center; width: 3%', class: 'text-center' },
              { key: 'title', label: 'Título do Relatório', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center' },
              { key: 'reportOrder', label: 'Ordem do Relatório', thStyle: 'text-align: center; width: 0.2%', class: 'text-center' },
              { key: 'active', label: 'Ativo', sortable: true, thStyle: 'text-align: center; width: 0.2%', class: 'text-center' },
              { key: 'actions', label: 'Ações', sortable: true, thStyle: 'text-align: center; width: 1%', class: 'text-center' }
            ]
          }
        }
      },
      created () {
        axios.get('proxy/utility/erp-report').then((response) => {
          this.table.items = response.data.value
          this.table.totalRows = this.table.items.length
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      methods: {
        onFiltered (filteredItems) {
          // Trigger pagination to update the number of buttons/pages due to filtering
         // this.table.totalRows = filteredItems.length
          this.currentPage = 1
        },
        inativa (item) {
          axios.get('proxy/utility/erp-report').then((response) => {
            item.active = !item.active
            this.$snotify.success('Relatório atualizado com sucesso')
            // this.$toast.show('Relatório atualizado com sucesso', '', this.$root._data.sucesso)
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
