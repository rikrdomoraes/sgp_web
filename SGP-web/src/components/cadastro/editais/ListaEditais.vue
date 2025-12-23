<template>
      <div class="content-wrapper" style="min-height: 870px;">

        <vue-headful :title="'SGP - Cadastro de Editais'"/>

          <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
          <section class="content-header ng-scope">
            <h1>Edital</h1>
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
                  <h3 class="box-title"><i class="fa fa-list" aria-hidden="true"></i> Cadastro de Editais</h3>
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
                        <g-button-ujarak color="dark-primary" :disabled="!this.$root.authorize('edital-novo')" @click.native="$router.push({name: 'cadastro-editais-edita'})" size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Edital </g-button-ujarak>
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

<!--                          <template slot="parametro" scope="row">-->
<!--                            <a :href="'http://projetos.fbb.org.br/autocredenciamento?' + row.value">{{row.value}}</a>-->
<!--                          </template>-->

                          <template slot="parametro" scope="row">
                            {{row.value}} <a :href="urlLaravel + '/autocredenciamento?' + row.value" target="_blank"> <i class="fa fa-external-link"></i> </a>
                          </template>

                          <template slot="bt_ativo" scope="row">
                            <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                          </template>
                          <template slot="edicao" scope="row">
                            <i :class="['fa fa-circle ', row.value === 'S' ? 'text-green' : 'text-red']" aria-hidden="true"></i><span>{{ row.value === 'S' ? '  Ativo' : '  Desabilitado' }}</span>
                          </template>
                          <template slot="dt_data_inicial" scope="row">{{row.value | moment(("DD/MM/YYYY [-] H[h]mm"))}}</template>
                          <template slot="dt_data_final" scope="row">{{row.value | moment("DD/MM/YYYY [-] H[h]mm")}}</template>
                          <template slot="dt_atualizado" scope="row">{{row.value | moment("DD/MM/YYYY [-] H[h]mm")}}</template>
                          <template slot="actions" scope="row">
                            <div>
                              <b-button type="button" :disabled="false" :to="{name: 'cadastro-editais-edita', params: { id: row.item.id }}" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                              <!-- <b-button type="button" :disabled="false" @click.stop="inativa(row.item)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> {{row.item.bt_ativo ? 'Inativar' : 'Ativar'}}</b-button> -->
                            </div>
                          </template>
                        </b-table>
                        <b-row v-if="table.items.length > table.perPage">
                          <b-col md="12" class="" right>
                            <b-pagination :total-rows="table.items.length" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
                          </b-col>
                        </b-row>
-

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
    import { mapGetters } from 'vuex'
    export default {
      name: 'lista-editais',
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
            sortBy: 'bt_ativo',
            sortDesc: true,
            fields: [
              { key: 'ds_numero_edital', label: 'Tipo do Edital', sortable: true, thStyle: 'text-align: center; width: 20%', class: 'text-center' },
              { key: 'parametro', label: 'Parâmetro URL', sortable: true, thStyle: 'text-align: center; width: 30%', class: 'text-center' },
              { key: 'dt_data_inicial', label: 'Início da vigência', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
              { key: 'dt_data_final', label: 'Fim da vigência', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
              { key: 'bt_ativo', label: 'Ativo', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center' },
              { key: 'edicao', label: 'Edição', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
            ]
          }
        }
      },
      computed: {
        ...mapGetters([
          'urlLaravel'
        ])
      },
      created () {
        this.loading.show = true
        axiosLaravel.get('editais/').then((response) => {
          this.table.items = response.data
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
          console.log('item', item)
          axiosLaravel.delete('editais/' + item.id).then((response) => {
            this.$snotify.success('Edital ' + item.ds_numero_edital + ' atualizado com sucesso!')
            item.bt_ativo = !item.bt_ativo
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
