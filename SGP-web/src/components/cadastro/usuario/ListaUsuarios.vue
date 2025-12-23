<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Usuários</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">
        <div class="col-md-12">
          <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title"><i class="fa fa-list" aria-hidden="true"></i> Cadastro de Usuários</h3>
            </div>
            <div class="box-body" >
              <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
              <div class="row">
                <!--Campo de pesquisa-->
                <div class="col-sm-offset-4 col-sm-4">
                  <div class="input-group">

                    <input v-model="pesquisa" @keyup.enter="onSearch" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa..." autofocus>
                    <span class="input-group-btn">
                          <button @click="onSearch" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
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
                             :items="table.items"
                             :hover="hover"
                             :fields="table.fields"
                             :current-page="table.currentPage"
                             :per-page="table.perPage"
                             :filter="table.filter"
                             :sort-by.sync="table.sortBy"
                             :sort-desc.sync="table.sortDesc"
                             empty-text="Informe nome, login, e-mail ou tipo do usuário!"
                             table-layout: fixed
                             @filtered="onFiltered"
                    >
                      <template slot="ativo" scope="row">
                        <i :class="['fa fa-circle ', row.value == '1' ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                      </template>
                      <template slot="data_criacao" scope="row">{{row.value | moment("L")}}</template>
                      <template slot="email" scope="row">{{row.value}}</template>
                      <template slot="acoes" scope="row">

                        <div>
                          <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'cadastro-usuarios-altera', params: {id: row.item.id_usuario}})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp Editar</g-button-ujarak >
                        </div>

                      </template>
                    </b-table>

                    <b-row>
                      <b-col md="6" class="" right>
                        <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="" />
                      </b-col>
                    </b-row>


                  </b-container>

                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>


    </section>
    <!-- /.content -->
  </div>
<vue-snotify></vue-snotify>  </div></template>

<script>
  /* eslint-disable quotes,no-unused-vars */
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import Profiles from '../../modules/profiles'

  let items = []

  export default {
    name: 'Usuarios',
    components: {Profiles},
    data () {
      return {
        // data: [],
        loading: {
          show: false
        },
        perfis: {},
        usuario: {
          acao: 'LISTA',
          pesquisa: null,
          login: null
        },
        pesquisa: '',
        table: {
          items: [],
          filter: null,
          currentPage: 1,
          perPage: 10,
          totalRows: items.length,
          sortBy: 'userName',
          sortDesc: true,
          emptyText: 'Não tem nenhum registro para mostrar',
          fields: [
            { key: 'tipo_usuario', label: 'Tipo de usuário', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'login', label: 'Login', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'nome_usuario', label: 'Nome', sortable: true, thStyle: 'text-align: center; width: 25%; white-space:pre-wrap; word-wrap:break-word', class: 'centraliza' },
            { key: 'email', label: 'E-mail', sortable: true, thStyle: 'text-align: center; width: 30%; white-space:pre-wrap; word-wrap:break-word', class: 'text-center' },
            { key: 'ativo', label: 'Ativo', thStyle: 'text-align: center', class: 'text-center' },
            { key: 'data_criacao', label: 'Inclusão', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'acoes', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
          ]
        },
        store: this.$store,
        breadcrumb: [{
          text: 'Inicial',
          href: '/'
        }, {
          text: 'Cadastro',
          href: '#'
        }, {
          text: 'Usuário',
          active: true
        }]
      }
    },
    computed: {
      sortOptions () {
        // Create an options list from our fields
        return this.fields
          .table.filter(f => f.sortable)
          .map(f => { return { text: f.label, value: f.key } })
      },
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created: function () {
      this.onSearch()
      // this.loadProfiles()
    },
    mounted: function () {
    },
    methods: {
      onFiltered (filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.table.totalRows = filteredItems.length
        this.table.currentPage = 1
      },
      // Faz a busca no back-end
      onSearch () {
        if (this.pesquisa !== '') {
          this.usuario.acao = 'LISTA'
          this.usuario.pesquisa = this.pesquisa
          this.table.items = null
          this.loading.show = true
          this.$snotify.clear()
          this.$snotify.async('Listando usuários. Por favor, aguarde...', {timeout: 0})
          //
          axiosLaravel.post('/usuarios/acao', this.usuario).then((response) => {
            this.table.items = response.data.dados.row
            this.table.totalRows = this.table.items.length
            this.$snotify.clear()
            this.loading.show = false
          })
            .catch((error) => {
              if (error) {
                this.$root.trataErro(error)
              }
            })
        }
      },
      authorizeDeleteUser (user) {
        if (user.userType === "AGENCIA") {
          return this.$root.authorize('usuario-agencia-ativar-inativar')
        } else if (user.userType === "ENTIDADE") {
          return this.$root.authorize('usuario-entidade-ativar-inativar')
        } else if (user.userType === "PARCEIRO_ESTRATEGICO") {
          return this.$root.authorize('usuario-estrategico-ativar-inativar')
        } else if (user.userType === "SUPERINTENDENCIA") {
          return this.$root.authorize('usuario-superintendencia-ativar-inativar')
        }
        return true
      },
      onCleanSearch () {
        this.filtros = {userType: '', login: '', profile: {}, name: '', email: ''}
      }
    }
  }
</script>

<style>
  .centraliza {
    text-align: center;
  }

</style>
