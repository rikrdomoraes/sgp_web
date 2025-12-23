<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Cadastro de FEP'"/>

    <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>FEP</h1>
        <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Lista',
            href: '#'
            }, {
            text: 'Editais',
            active: true
            }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">

        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-list" aria-hidden="true"></i> Cadastro de FEP</h3>
              </div>
              <div class="box-body" >
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <div class="row">
                  <!--Botão novo Edital-->
                  <!--<div class="col-sm-12">-->
                  <!--<router-link :to="{name: 'cadastro-editais-edita'}" :disabled="!this.$root.authorize('edital-novo')" id="new-register" class="btn btn-primary btn-flat">-->
                  <!--<i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Edital-->
                  <!--</router-link>-->
                  <div class="col-sm-12">
                    <!--<g-button-ujarak color="dark-primary" :disabled="!this.$root.authorize('edital-novo')" @click.native="$router.push({name: 'cadastro-fep-edita'})" size="button&#45;&#45;size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova FEP </g-button-ujarak>-->

                    <g-button-ujarak color="dark-primary" :disabled="!this.$root.authorize('edital-novo')" @click.native="$router.push({name: 'relatorio-fep-aberto'})" size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i> Gerar FEP Manual</g-button-ujarak>
                  </div>
                  <!--</div>-->
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
                        <!--<template slot="bt_ativo" scope="row">-->
                          <!--<i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>-->
                        <!--</template>-->

                        <!--<template slot="proposta" scope="row">-->
                          <!--<span v-if="!_.isNull(row.item.proposta)">-->
                            <!--<span v-if="!_.isNull(row.item.proposta.ds_codigo_projeto_erp)">-->
                            <!--{{row.item.proposta.ds_codigo_projeto_erp}} - -->
                          <!--</span>-->
                          <!--{{row.item.proposta.ds_nome}}-->
                          <!--</span>-->
                        <!--</template>-->
                        <!--<template slot="proposta" scope="row">-->
                          <!--<span v-if="!_.isNull(row.item.proposta)">-->
                            <!--<span v-if="!_.isNull(row.item.proposta.ds_codigo_projeto_erp)">-->
                            <!--{{row.item.proposta.ds_codigo_projeto_erp}} - -->
                          <!--</span>-->
                          <!--{{row.item.proposta.ds_nome}}-->
                          <!--</span>-->
                        <!--</template>-->
                        <template slot="fep" scope="row">
                          <span v-if="!_.isNull(row.item.fep)">{{JSON.parse(row.item.fep).nome_projeto}}</span>
                          <span v-if="_.isNull(row.item.fep) && !_.isNull(row.item.proposta)">{{row.item.proposta.ds_nome}}</span>
                        </template>

                        <template slot="created_at" scope="row">{{row.value | moment("L")}}</template>
                        <template slot="updated_at" scope="row">{{row.value | moment("L")}}</template>
                        <template slot="actions" scope="row">
                          <div>
                            <b-button v-if="!_.isNull(row.item.fep)" type="button" :disabled="false" :to="{name: 'relatorio-fep-aberto', params: { id: row.item.id }}" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                            <!--<b-button type="button" :disabled="false" @click.stop="inativa(row.item)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> {{row.item.bt_ativo ? 'Inativar' : 'Ativar'}}</b-button>-->
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
    name: 'ListaFep',
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
          sortBy: 'id',
          sortDesc: true,
          fields: [
            { key: 'id', label: 'Id', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
            { key: 'fep', label: 'Proposta', sortable: true, thStyle: 'text-align: center; width: 40%', class: 'text-center' },
            { key: 'ano', label: 'Ano', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
            { key: 'numero', label: 'Número', sortable: true, thStyle: 'text-align: center;width: 15%', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 10%', class: 'text-center' }

          ]
        }
      }
    },
    created () {
      this.loading.show = true
      axiosLaravel.get('fep/').then((response) => {
        // console.log('response.data', response.data)
        // let array = []
        // for (let i = 0; i < response.data.length; i++) {
        //   if (response.data[i].fep !== null) {
        //     array.push(response.data[i])
        //   }
        // }
        // this.table.items = array
        // console.log('array', array)
        this.table.items = response.data
        this.table.totalRows = this.table.items.length
        this.loading.show = false
      })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
        })
    },
    methods: {
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      inativa (item) {
        // console.log('item', item)
        // axiosLaravel.delete('propostas/fep/' + item.id).then((response) => {
        //   this.$snotify.success('Edital ' + item.ds_numero_fep + ' atualizado com sucesso!')
        //   item.bt_ativo = !item.bt_ativo
        // })
        //   .catch((error) => {
        //     this.$root.trataErro(error)
        //   })
      }
    }
  }
</script>

<style scoped>

</style>
