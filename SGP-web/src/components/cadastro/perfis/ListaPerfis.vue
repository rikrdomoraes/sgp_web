<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Perfis</h1>
      <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
        }, {
          text: 'Cadastro',
          href: '#'
        }, {
          text: 'Perfis',
          active: true
        }]"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">
        <div class="col-md-12">
          <!-- grid -->
          <!-- ngIf: show.grid --><div ng-if="show.grid" class="ng-scope ng-isolate-scope"><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Consulta de Perfis</h3>
          </div>
          <div class="box-body" >
            <div class="row collapse in"  aria-expanded="true" aria-hidden="false" style="width: inherit; height: auto;">
              <div class="col-sm-12">
                <!--Botão novo perfil-->
                <div class="row">
                  <div class="col-sm-4">
                    <g-button-ujarak color="dark-primary" @click.native="$router.push({name: 'cadastro-perfis-edita'})" size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Perfil </g-button-ujarak>
                  </div>
                </div>
                <!--Campo de pesquisa-->
                <div class="row">
                  <div class="col-sm-offset-4 col-sm-4">
                    <div class="input-group">
                      <input v-model="filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
                      <span class="input-group-btn">
                        <button :disabled="!filter" @click="filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                      </span>
                    </div>
                  </div>

                  <br>
                  <br>
                  <br>

                  <div class="row">
                    <div class="col-sm-12">
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
                                 @filtered="onFiltered"
                                 :per-page="10"
                                 :sort-by.sync="sortBy"
                                 :sort-desc.sync="sortDesc"
                                 empty-text="Nenhum registro encontrado"
                        >
                          <template slot="active" scope="row">
                            <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                          </template>
                          <template slot="createdAt" scope="row">{{row.value | moment("L")}}</template>
                          <template slot="updatedAt" scope="row">{{row.value | moment("L")}}</template>
                          <template slot="actions" scope="row">
                             <!--We use @click.stop here to prevent a 'row-clicked' event from also happening-->
                            <div v-if="!row.item.admin">
                              <g-button-ujarak color="primary" size="button--size-ss" :disabled="!verificaAcesso('perfil-editar')" @click.native="$router.push({name: 'cadastro-perfis-edita', params: { id: row.item.id }})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp Editar</g-button-ujarak >
                              <g-button-ujarak color="warning" size="button--size-ss" :disabled="!verificaAcesso('perfil-ativar-inativar')" @click.native="inativa(row.item)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> {{row.item.active ? ' Inativar' : ' Ativar'}}</g-button-ujarak>
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
        </div>
        </div>
      </div>
    </section>
  </div>
  </div>

</template>

<script>
    export default {
      name: 'lista-perfis',
      data () {
        return {
          items: [],
          loadingShow: false,
          currentPage: 1,
          perPage: 10,
          // totalRows: items.length,
          sortBy: 'createdAt',
          sortDesc: true,
          bordered: true,
          filter: null,
          emptyText: 'Não tem nenhum registro para mostrar',
          fields: [
            { key: 'name', label: 'Perfil', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'description', label: 'Descrição', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'active', label: 'Ativo', thStyle: 'width: 5%', class: 'text-center' },
            { key: 'createdAt', label: 'Data de Criação', sortable: true, thStyle: 'text-align: center', class: 'centraliza' },
            { key: 'updatedAt', label: 'Data de inativação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'actions', label: 'Ações', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
          ]
        }
      },
      created: function () {
        this.loadProfiles()
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
        loadProfiles () {
          this.items = []
          axios.get('/proxy/account/profiles?tiny').then((response) => {
            this.items = response.data.value
            this.totalRows = this.items.length
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        onFiltered (filteredItems) {
          // Trigger pagination to update the number of buttons/pages due to filtering
          this.totalRows = filteredItems.length
          this.currentPage = 1
        },
        verificaAcesso (param) {
          return this.$root.authorize(param)
        },
        inativa (item) {
          axios.put('/proxy/account/profiles/' + item.id + '/status', item).then((response) => {
            item.active = !item.active
          })
            .catch((error) => {
              if (error) {
                this.$root.trataErro(error)
              }
            })
        }
      }
    }
</script>

<style scoped>

</style>
