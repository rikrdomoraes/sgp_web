<template>
  <div>
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
              <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Cadastro de usuário: Fundação</h3>
            </div>
            <!-- /.box-header -->
            <div class="box-body" ><div class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: none;"><i class="fa fa-refresh fa-spin"></i></div>


<!--              <div class="form-group">-->
<!--                <div class="col-sm-8">-->

<!--                  <g-button-ujarak-->
<!--                    color="dark-primary"-->
<!--                    @click.native="onNew"-->
<!--                    size="button&#45;&#45;size-ss">-->
<!--                    <i class="fa fa-plus-circle" aria-hidden="true"></i> &nbsp Atribuir-->
<!--                  </g-button-ujarak>-->

<!--                  &lt;!&ndash;                        v-show="this.$root.authorize('perfil-novo')"&ndash;&gt;-->

<!--                </div>-->
<!--              </div>-->

              <form name="user" class="form-horizontal ng-pristine ng-valid-maxlength ng-valid-minlength ng-valid-mask ng-valid-parse ng-valid-date ng-valid-max ng-valid ng-valid-required" novalidate="" style="">
                <br>
                <br>
              <div class="form-group required" ng-class="{ 'has-error' : frmRegUserFbb.$submitted &amp;&amp; frmRegUserFbb.userName.$error.required }">
                <label for="nome" class="control-label col-sm-2">Nome:</label>
                <div class="col-sm-4">
                  <input v-model="user.userName"
                         name="userName"
                         class="form-control ng-pristine ng-untouched ng-valid-maxlength ng-valid-minlength ng-not-empty ng-valid ng-valid-required"
                         v-validate="{required: true}"
                         type="text">
                </div>
              </div>
                <div v-if="user.userType === 'ENTIDADE'" class="form-group required" :class="{ 'has-error' : errors.first('cpf')}">
                  <label for="cpf" class="control-label col-sm-2">CPF:</label>
                  <div class="col-sm-4">
                    <input v-model="user.cpf" v-mask="'###.###.###-##'" v-validate="{cpf: true}" name="cpf" class="form-control" type="text">
                    <span class="label label-danger">{{ errors.first('cpf') }}</span>
                  </div>
                </div>

                <div class="form-group required">
                  <label for="email" class="control-label col-sm-2">E-Mail:</label>
                  <div class="col-sm-4">
                    <input v-validate="{required: true}"
                           v-model="user.email"
                           name="email"
                           class="form-control ng-pristine ng-untouched ng-isolate-scope ng-valid-maxlength ng-valid-minlength ng-not-empty ng-valid ng-valid-required"
                           type="text" minlength="1"
                           maxlength="255"
                          >
                  </div>
                </div>


                <div v-if="this.$root.authorize('usuario-fundacao-atribuir-perfil')" class="ng-scope ng-isolate-scope"><fieldset>
                  <legend>Perfis</legend>


                  <!-- form -->
<!--                  <div v-show="show" class="well well-sm no-shadow animated fadeInDownOutUp ng-pristine ng-valid-mask ng-invalid ng-invalid-required ng-valid-maxlength ng-valid-max ng-valid-date ng-hide">-->
                  <div class="well well-sm no-shadow animated fadeInDownOutUp ng-pristine ng-valid-mask ng-invalid ng-invalid-required ng-valid-maxlength ng-valid-max ng-valid-date ng-hide">
                    <!-- profile type -->
                    <div class="form-group required">
                      <label class="control-label col-sm-2">Adicionar o perfil:</label>
                      <div class="col-sm-4" :class="{ 'has-error' : errors.first('profile')}">
                        <profiles name="profile" v-model="profileConstraint.profile" :propsProfile="profileConstraint.profile" @profileSelected="profileConstraint.profile = $event" v-validate="{required: true}"></profiles>
                        <!--:disabled="bloqueiaPerfil(profileConstraint.profile.name)"-->
                        <span class="label label-danger">{{ errors.first('profile') }}</span>
                      </div>
                    </div>

                    <!-- initial date -->
                    <div class="form-group required" :class="{ 'has-error' : errors.first('initialDate')}">
                      <label for="dt_inicial" class="control-label col-sm-2">Data inicial:</label>
                      <div class="col-sm-2">
                        <div class="input-group">
                          <input type='date' name="initialDate" v-model="profileConstraint.initialDate" class="form-control" v-validate="{required: true}" />
                          <span class="label label-danger">{{ errors.first('initialDate') }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- final date -->
                    <div class="form-group">
                      <label for="dt_final" class="control-label col-sm-2">Data final:</label>
                      <div class="col-sm-2">
                        <div class="input-group">
                          <input name="inactivateDate" v-model="profileConstraint.inactivateDate" type="date" class="form-control" v-validate="{required: true}" />
                        </div>
                        <!--<span ng-show="frmAddProfile.$submitted &amp;&amp; frmAddProfile.inactivateDate.$error.date" class="label label-danger ng-hide">Data inválida</span>-->
                      </div>
                    </div>

                    <!-- buttons -->
                    <div class="form-group" style="margin-bottom:0">
                      <div class="col-sm-10 col-sm-offset-2">
                        <button @click="onAdd()" type="button" class="btn btn-primary btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Incluir</button>
                        <button @click="onCancel()" type="button" class="btn btn-default btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Limpar</button>
                      </div>
                    </div>

                  </div>

                  <!-- grid -->
                  <div class="row">
                    <div class="col-sm-12">
                      <b-container fluid>
                        <!-- Main table element -->
                        <b-table show-empty
                                 stacked="md"
                                 :items="items"
                                 :hover="hover"
                                 :fields="fields"
                                 :filter="filter"
                                 :current-page="table.currentPage"
                                 :per-page="table.perPage"
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
                          <template slot="profile.createdAt" scope="row">{{row.value | moment("L")}}</template>
<!--                          <template slot="profile.inactivateDate" scope="row">{{row.value | moment("L")}}</template>-->

                          <template slot="actions" scope="row">

                            <div>
                              <g-button-ujarak
                                color="primary"
                                size="button--size-ss"
                                :disabled="!$root.authorize('perfil-atribuir-usuario')"
                                @click.prevent="onEdit(p)">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp Editar
                              </g-button-ujarak >

                              <g-button-ujarak
                                color="warning"
                                size="button--size-ss"
                                @click.prevent="onDelete(p)"
                                :disabled="!$root.authorize('perfil-atribuir-usuario')">
                                <i class="fa fa-trash" aria-hidden="true"> Excluir</i>
                              </g-button-ujarak>
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

                  </div>




                </fieldset>
                </div>
              </form>


              <div class="box-footer">
                <g-button-moema color="success" size="button--size-ss" @click.native="onSave"><i class="fa fa-floppy-o" aria-hidden="true"></i> Concluir</g-button-moema>
                <g-button-moema color="primary" size="button--size-ss" @click.native="onClean"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</g-button-moema>
                <g-button-moema color="warning" size="button--size-ss" :to="{name: 'cadastro-usuarios-lista'}"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
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
    </div>
'<vue-snotify></vue-snotify>  </div></template>

<script>
  import Profiles from '../../modules/profiles'
  import moment from 'moment'
  // import Profiles from "../../modules/profiles";
  import {authorize} from '../../../mixins/authorize'

  let items = []

  export default {
    name: 'editaUsuario',
    components: {Profiles},
    mixin: [authorize],
    data () {
      return {
        data: [],
        loading: {
          show: false
        },
        show: false,
        user: {},
        perfis: {},
        profileConstraint: {
          profile: null
        },
        profilesConstraint: [],
        items: [],
        initialDate: moment().format('YYYY-MM-DD'),
        inactivateDate: null,
        fields: [
          { key: 'profile.name', label: 'Perfil', sortable: true, thStyle: 'text-align: center', class: 'text-left' },
          { key: 'profile.createdAt', label: 'Data Inicial', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'profile.inactivateDate', label: 'Data final', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'changedBy', label: 'Alterado por', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'createdAt', label: 'Alterado em', thStyle: 'text-align: center', class: 'text-center' },
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
    mounted () {
    },
    created: function () {
      // this.loadProfiles()
      // fetch the data when the view is created and the data is
      // already being observed
      this.fetchData()
    },
    methods: {
      onFiltered (filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.table.totalRows = filteredItems.length
        this.table.currentPage = 1
      },
      loadProfiles () {
        axios.get('/proxy/account/profiles?tiny').then((response) => {
          this.perfis = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      fetchData () {
        // this.error = this.post = null
        // this.loading = true
        // replace `getPost` with your data fetching util / API wrapper
        //
        //
        this.user = this.$route.params
        this.profilesConstraint = this.$route.params.profileConstraint.row
        this.items = this.profilesConstraint
        //
        // axiosLaravel.post('/usuario/busca_usuario', this.$route.params).then((response) => {
        //   console.log('>>>>> response.data.value.list', response.data)
        //   this.items = response.data.dados.row
        //   this.table.totalRows = this.items.length
        //   this.$snotify.clear()
        //   this.loading.show = false
        // })
        //   .catch((error) => {
        //     if (error) {
        //       this.$root.trataErro(error)
        //     }
        //   })
        //
        //
        // axios.get('/proxy/account/users/' + this.$route.params.id).then((response) => {
        //   this.user = response.data.value
        // })
        // .catch((error) => {
        //   if (error) {
        //     this.$root.trataErro(error)
        //   }
        // })
      },
      // onNew () {
      //   this.show = !this.show
      //   this.errors.clear()
      //   this.profileConstraint.initialDate = moment().format('YYYY-MM-DD')
      // },
      onAdd () {
        this.$validator.errors.remove('profile')
        this.errors.clear()

        // this.profileConstraint.forEach((item) => {
        //   if (item.profile === null) {
        //     this.errors.add('profile', 'campo perfil é obrigatorio')
        //   }
        // })
        if (!this.profileConstraint.profile) {
          this.errors.add('profile', 'campo perfil é obrigatorio')
        }
        if (this.errors.items.length !== 0) {
          return
        }
        // verifica se no user.profilesConstraint já tem um perfil com o msmo nome que esta sendo selecionado
        // se ja tem tira o parfil do array do user
        this.items.forEach((item, index, object) => {
          // if (Object.values(item.profile).indexOf(this.profileConstraint.profile.name) > -1) {
          //   this.items.splice(index, 1)
          // }
        })

        this.items.push(Object.assign({}, this.profileConstraint))
        // this.onCancel()
      },
      onCancel () {
        this.profileConstraint.profile = {}
        this.profileConstraint.initialDate = moment().format('YYYY-MM-DD')
        this.profileConstraint.inactivateDate = ''
        this.show = false
      },
      onSave () {
        axios.put('/proxy/account/users/' + this.user.id, this.user).then((response) => {
          this.$snotify.success('usuário atualizado com sucesso')
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onClean () {
        this.profileConstraint.profile = {}
        this.profileConstraint.initialDate = moment().format('YYYY-MM-DD')
        this.profileConstraint.inactivateDate = ''
        this.user.cpf = null
      },
      onReturn () {
      },
      onEdit (p) {
        this.profileConstraint = p
        this.show = true
      },
      onDelete (p) {
        this.user.profilesConstraint.forEach((item, index, object) => {
          if (Object.values(item.profile).indexOf(p.profile.name) > -1) {
            this.user.profilesConstraint.splice(index, 1)
          }
        })
      },
      bloqueiaPerfil (name) {
        console.lof(name)
        this.user.profilesConstraint.forEach((item) => {
          if (Object.values(item).indexOf(name)) return true
        })
        return false
      }
    }
    // components: {
    //   profiles
    // }
  }
</script>

<style scoped>

</style>
