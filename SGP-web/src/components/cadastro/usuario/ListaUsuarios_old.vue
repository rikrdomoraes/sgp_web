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
          <!-- grid -->
          <!-- ngIf: show.grid --><div ng-if="show.grid" class="ng-scope ng-isolate-scope"><div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Consulta de Usuários</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body" >
            <div class="row collapse in"  aria-expanded="true" aria-hidden="false" style="width: inherit; height: auto;">
              <div class="col-sm-12">
                <form name="frmSearch" class="form-horizontal ng-pristine ng-valid ng-valid-mask ng-valid-maxlength ng-valid-date" novalidate="">
                  <div class="form-group">

                    <!-- user type -->
                    <label for="userType" class="control-label col-sm-2">Tipo de usuário:</label>
                    <div class="col-sm-2">

                      <select v-model="filtros.userType" name="userType" class="form-control ng-pristine ng-untouched ng-valid ng-empty">
                       <option v-if="this.$root.authorize('usuario-entidade-visualizar')" value="" class="ng-scope"></option>
                        <option v-if="this.$root.authorize('usuario-entidade-visualizar')" value="ENTIDADE" class="ng-scope">Entidade</option>
                        <option v-if="this.$root.authorize('usuario-agencia-visualizar')" value="AGENCIA" class="ng-scope">Agência</option>
                        <option v-if="this.$root.authorize('usuario-estrategico-visualizar')" value="PARCEIRO_ESTRATEGICO" class="ng-scope">Parceiro estratégico</option>
                        <option v-if="this.$root.authorize('usuario-superintendencia-visualizar')" value="SUPERINTENDENCIA" class="ng-scope">Superintendência</option>
                        <option v-if="this.$root.authorize('usuario-fundacao-visualizar')" value="FUNDACAO" class="ng-scope">Fundação</option>
                      </select>
                    </div>

                    <!-- login -->
                    <label for="login" class="control-label col-sm-1">Login:</label>
                    <div class="col-sm-2">
                      <input v-model="filtros.login"
                             name="login"
                             class="form-control ng-pristine ng-untouched ng-valid ng-empty"
                             type="text" autocomplete="off"
                             @keydown.enter="onSearch">
                    </div>

                    <!-- profile -->
                    <label for="profiles" class="control-label col-sm-1">Perfil:</label>
                    <div class="col-sm-2">
                      <!--<select v-model="filtros.profile" name="profiles"  class="form-control ng-pristine ng-untouched ng-valid ng-not-empty">-->
                        <!--<option :label="perfil.name" :value="perfil.id" v-for="perfil in perfis"></option>-->
                      <!--</select>-->
                      <profiles v-model="filtros.profile" :propsProfile="filtros.profile" @profileSelected="filtros.profile = $event"></profiles>
                    </div>

                  </div>

                  <div class="form-group">

                    <!-- name -->
                    <label for="name" class="control-label col-sm-2">Nome:</label>
                    <div class="col-sm-2">
                      <input v-model="filtros.name" name="name" class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" @keydown.enter="onSearch">
                    </div>

                    <!-- e-mail -->
                    <label for="email" class="control-label col-sm-1">E-mail:</label>
                    <div class="col-sm-2">
                      <input v-model="filtros.email" name="email" class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" @keydown.enter="onSearch">
                    </div>

                    <!-- createdAt -->
                    <label for="createdAt" class="control-label col-sm-1">Data de inclusão:</label>
                    <div class="col-sm-2">
                      <div class="input-group">
                        <!--<datepicker v-model="filtros.createdAt" input-class="form-control" :use-utc="true" :language="$datePickerPtBR" format="dd/MM/yyyy"></datepicker>-->
                        <input v-model="filtros.createdAt" type="date" class="form-control" v-validate="{required: true}" />
                      </div>
                    </div>
                  </div>

                  <div class="form-group">

                    <!-- active -->
                    <label for="status" class="control-label col-sm-2">Status:</label>
                    <div class="col-md-2 ">
                      <select v-model="filtros.active" name="status" class="form-control ng-pristine ng-untouched ng-valid ng-empty">
                        <option value="? undefined:undefined ?"></option>
                        <option value="true">Ativa</option>
                        <option value="false">Inativa</option>
                      </select>
                    </div>

                  </div>

                </form>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="col-sm-3">
                <div class="btn-group dropdown">
                  <div class="btn-group">

                    <g-button-ujarak color="dark-primary" size="button--size-ss"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i> &nbsp Novo Usuário </g-button-ujarak>

                    <ul class="dropdown-menu">
                      <li role="menuitem" v-if="this.$root.authorize('usuario-agencia-novo')" class="ng-scope"><a ng-click="onNew('AGENCIA')" href="javascript:void(0)"><i class="fa fa-angle-right"></i> Agência</a></li>
                      <li role="menuitem" v-if="this.$root.authorize('usuario-entidade-novo')" class="ng-scope"><a ng-click="onNew('ENTIDADE')" href="javascript:void(0)"><i  class="fa fa-angle-right"></i> Entidade</a></li>
                      <li role="menuitem" v-if="this.$root.authorize('usuario-estrategico-novo')" class="ng-scope"><a ng-click="onNew('PARCEIRO_ESTRATEGICO')" href="javascript:void(0)"><i class="fa fa-angle-right"></i> Parceiro Estratégico</a></li>
                      <li role="menuitem" v-if="this.$root.authorize('usuario-superintendencia-novo')" class="ng-scope"><a ng-click="onNew('SUPERINTENDENCIA')" href="javascript:void(0)"><i class="fa fa-angle-right"></i> Superintendência</a></li>
                    </ul>

                  </div>
                </div>
              </div>

              <div class="col-sm-6"></div>

              <div class="col-sm-3">
                <g-button-ujarak
                  color="dark-primary"
                  @click.native="onSearch()"
                  size="button--size-ss"
                  aria-haspopup="true"
                  aria-expanded="false">
                  <i class="fa fa-search" aria-hidden="true"></i> Pesquisar
                </g-button-ujarak>

                <g-button-ujarak
                  color="warning"
                  @click.native="onCleanSearch()"
                  size="button--size-ss"
                  aria-haspopup="true"
                  aria-expanded="false">
                  <i class="fa fa-eraser" aria-hidden="true"></i> Limpar
                </g-button-ujarak>

              </div>


              <!-- /.col -->
            </div>
            <!-- /.row -->
            <br>
            <div class="row">
              <div class="col-sm-12">
                <b-container fluid>
                  <!-- Main table element -->
                  <b-table show-empty
                           stacked="md"
                           :items="items"
                           :hover="hover"
                           :fields="fields"
                           :current-page="table.currentPage"
                           :per-page="table.perPage"
                           :filter="filter"
                           :sort-by.sync="table.sortBy"
                           :sort-desc.sync="table.sortDesc"
                           empty-text="Preencha o filtro acima!"
                           table-layout: fixed
                           @filtered="onFiltered"
                  >
                    <template slot="active" scope="row">
                      <i :class="['fa fa-circle ', row.value == 'true' ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                    </template>
                    <template slot="createdAt" scope="row">{{row.value | moment("L")}}</template>
                    <template slot="actions" scope="row">

                      <div>
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'cadastro-usuarios-edita', params: row.item })"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp Editar</g-button-ujarak >
                        <g-button-ujarak color="warning" size="button--size-ss" @click.native="inativa(row.item)" :disabled="!authorizeDeleteUser(row.item)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> {{row.item.active === 'true' ? ' Inativar' : ' Ativar'}}</g-button-ujarak>
                      </div>

                    </template>
                  </b-table>

                  <b-row>
                    <b-col md="6" class="" right>
                      <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="" />
                    </b-col>
                  </b-row>


                </b-container>
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <!--v-show="loading.show"-->

              </div>
              <!-- /.col -->
            </div>
            <!-- /.row -->
          </div>
          <!-- /.box-body -->
        </div>
          <!-- /.box -->
        </div><!-- end ngIf: show.grid -->

        </div>
        <!-- /.col -->


      </div>
      <!-- /.row -->

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
    name: 'ListaUsuarios',
    components: {Profiles},
    data () {
      return {
        data: [],
        loading: {
          show: false
        },
        items: [],
        perfis: {},
        filtros: {
          email: '',
          login: '',
          name: '',
          profile: {},
          userType: '',
          createdAt: null,
          id: ''
        },
        fields: [
          { key: 'userType', label: 'Tipo de usuário', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'login', label: 'Login', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'userName', label: 'Nome', sortable: true, thStyle: 'text-align: center', class: 'centraliza' },
          { key: 'email', label: 'E-mail', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'active', label: 'Ativo', thStyle: 'text-align: center', class: 'text-center' },
          { key: 'createdAt', label: 'Inclusão', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
        ],
        table: {
          currentPage: 1,
          perPage: 10,
          totalRows: items.length,
          sortBy: 'userName',
          sortDesc: true,
          filter: null,
          emptyText: 'Não tem nenhum registro para mostrar'
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
      // this.onSearch()
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
        if (this.filtros.createdAt) {
          this.filtros.createdAt = moment(this.filtros.createdAt).format()
        }
        this.items = null
        this.loading.show = true
        this.$snotify.clear()
        this.$snotify.async('Buscando usuários. Por favor, aguarde...', {timeout: 0})
        // axios.post('/proxy/account/users/search', this.filtros).then((response) => {
        // axios.post('/proxy/account/users/search/sql', this.filtros).then((response) => {
        axiosLaravel.post('/usuario/busca_usuario', this.filtros).then((response) => {
          // Pega a lista de usuários
          this.items = response.data.dados.row
          this.table.totalRows = this.items.length
          this.$snotify.clear()
          this.loading.show = false
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      inativa (item) {
        axios.put('/proxy/account/users/' + item.id + '/status', item).then((response) => {
          item.active = !item.active
        })
        .catch((error) => {
          if (error) {
            this.$root.trataErro(error)
          }
        })
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
