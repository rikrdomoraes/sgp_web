<template>
      <div class="content-wrapper" style="min-height: 870px;">
          <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
          <section class="content-header ng-scope">
            <h1>Ações e Proprietário</h1>
            <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Cadastro',
            href: '#'
            }, {
            text: 'Ações e Proprietário',
            active: true
            }]"/>
          </section>

          <!-- main content -->
          <section class="content ng-scope">


            <div class="row">
              <div class="col-md-12">
                <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
                  <div class="box-header with-border">
                    <h3 class="box-title"><i class="fa fa-check" aria-hidden="true"></i> Permissões de Gerência</h3>
                  </div>
                  <div class="box-body" >
                    <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                      <i class="fa fa-refresh fa-spin"></i>
                    </div>
                  <form name="authForm" class="ng-pristine ng-invalid ng-invalid-required">
                    <div class="form-group col-md-6">
                      <label class="control-label col-sm-1">Perfil:</label>
                      <div class="col-md-5">
                        <profiles :disabled="true" v-model="profile" :propsProfile="profile" @profileSelected="profile = profile"></profiles>
                      </div>
                      </div>
                  </form>
                  <br>
                  <br>
                  <br>
                  <div class="row" >
                    <div class="col-md-12">

                      <div v-for="(item,index) in auths" class="col-lg-6 col-md-2 col-sm-12" >
                        <div class="box box-default box-solid">
                          <div class="box-header with-border">
                            <h3 class="box-title ng-binding">{{$t('authority.register.' + index)}}</h3>
                            <div class="pull-right">
                              <label class="checkbox-inline new-control new-control-checkbox" style="margin-top: -20px">
                                <input :disabled="true" type="checkbox" name="selectAll" ng-model="selectAll" ng-change="change(item, selectAll)" class="ng-pristine ng-untouched ng-valid ng-empty"/>
                                <div class="new-control-indicator"></div>
                              </label>
                            </div>
                          </div>
                          <div class="box-body permission-list">
                            <div v-for="authority in item" class="ng-scope">
                                <div class="checkbox-inline col-md-6 col-sm-12">
                                  <label class="checkbox-inline new-control new-control-checkbox ng-binding">
                                    <input :checked="verifica(authority.name)" :disabled="true" type="checkbox" @change="adiciona(authority)"
                                           class="ng-pristine ng-untouched ng-valid ng-empty"/>{{$t('authority.register.' + authority.name)}}
                                    <div class="new-control-indicator"></div>
                                  </label>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <!--<div class="col-md-12">-->
                          <!--<button :disabled="!$root.authorize('permissao-editar') && Object.keys(profile).length < 1" class="btn btn-success btn-flat" @click="saveAuthoritiesToProfile(profileSelected)"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar </button>-->
                        <!--</div>-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>




                 <div class="row">
                   <div class="col-md-12">
                     <div class="box box-widget">
                       <div class="box-header with-border">
                         <h3>Usuários com estas permissões</h3>
                       </div>
                       <div class="box-body">
                         <div class="row">
                           <fieldset>
                             <!--Botão atribuir e pesquisa-->
                             <div class="">
                               <div class="col-sm-7">
                                 <div class="form-group">
                                   <button @click="show.userForm = true" :disabled="show.userForm || Object.keys(this.profile).length < 1 || profile.authorities.some((o) => o.name === 'perfil-admin' || true)"  class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Atribuir</button>
                                 </div>
                               </div>
                               <div class="col-sm-5">
                                 <div class="input-group">
                                   <input v-model="filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
                                   <span class="input-group-btn">
                                    <button :disabled="!filter" @click="filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                                  </span>
                                 </div>
                               </div>
                             </div>
                             <!--Formulário para adicionar novo usuário no perfil-->
                             <div class="col-sm-12">
                               <form name="formUsuario" v-show="show.userForm" class="form-horizontal well well-sm no-shadow">
                                 <br>
                                 <!-- Usuario -->
                                 <div class="form-group required" :class="{ 'has-error' : errors.first('usuarios')}">
                                   <label for="usersProfile" class="control-label col-sm-2">Usuários:</label>
                                   <div class="col-sm-3">
                                     <div class="input-group borda" :class="{ 'has-error' : errors.first('usuarios')}">
                                     <multiselect name="usuarios" v-model="usersAdicionar" :options="usuariosPesquisa" :close-on-select='true' :hide-selected="true" :preserve-search="false" placeholder="Escolha um usuário" label="userName" track-by="userName" :preselect-first="true">
                                        <template slot="tag" slot-scope="props"><span class="custom__tag"><span>{{ props.option.userName }}</span><span class="custom__remove" style="cursor: pointer" @click="props.remove(props.option)">❌</span></span></template>
                                      </multiselect>
                                       <!--<multiselect v-model="value" :options="options" :custom-label="nameWithLang" placeholder="Select one" label="name" track-by="name"></multiselect>-->
                                     </div>
                                     <span class="label label-danger">{{ errors.first('usuarios') }}</span>
                                   </div>
                                 </div>
                                 <!-- Data inicial -->
                                 <div class="form-group required" :class="{ 'has-error' : errors.first('dataInicial')}">
                                   <label for="dataInicial" class="control-label col-sm-2">Data inicial:</label>
                                   <div class="col-sm-3">
                                     <div class="input-group">
                                      <!-- <input v-validate="{required: true}" name="dataInicial" v-model="profileConstraint.initialDate" type="date" class="form-control">-->
                                       <datepicker name="dataInicial" v-model="profileConstraint.initialDate" input-class="form-control datepicker"
                                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                   format="dd/MM/yyyy" v-validate="'required'">
                                       </datepicker>
                                     </div>
                                     <span class="label label-danger">{{ errors.first('dataInicial') }}</span>
                                   </div>
                                 </div>
                                 <!-- Data Final -->
                                 <div class="form-group">
                                   <label for="dt_inicial" class="control-label col-sm-2">Data final:</label>
                                   <div class="col-sm-3">
                                     <div class="input-group">
                                      <!-- <input v-model="profileConstraint.inactivateDate" type="date" class="form-control " name="inactivateDate">-->
                                       <datepicker name="inactivateDate" v-model="profileConstraint.inactivateDate" input-class="form-control datepicker"
                                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                   format="dd/MM/yyyy" v-validate="'required'">
                                       </datepicker>
                                     </div>
                                   </div>
                                 </div>
                                 <!-- Botões -->
                                 <div class="form-group" style="margin-bottom:0">
                                   <div class="col-sm-10 col-sm-offset-2 ng-binding">
                                     <span @click.stop="adicionaUsuario" type="button" class="btn btn-success btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</span>
                                     <span @click.stop="onCancelUserToProfile" class="btn btn-default btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</span>
                                   </div>
                                 </div>
                               </form>
                             </div>
                             <!--Lista de usuários daquele perfil-->
                             <div class="col-sm-12">
                               <b-container fluid>
                                 <!-- Main table element -->
                                 <b-table show-empty
                                          stacked="md"
                                          :bordered="bordered"
                                          :items="users"
                                          :hover="hover"
                                          :fields="fields"
                                          :filter="filter"
                                          :current-page="currentPage"
                                          @filtered="onFiltered"
                                          :per-page="5"
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
                                     <div>
                                       <b-button type="button" :disabled="profile.name === 'Administrador'" :to="{name: 'cadastro-usuarios-altera', params: { id: row.item.user.id }}" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                                       <b-button type="button" :disabled="profile.name === 'Administrador'" @click.stop="deleteUser(row.item.user.id)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
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
                           </fieldset>
                         </div>
                         <button @click="$router.go(-1)" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</button>
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
    import Profiles from '../../modules/profiles'
    import { mapGetters } from 'vuex'

    export default {
      components: {Profiles},
      name: 'cadastro-acoes-lista',
      data () {
        return {
          loading: {
            show: false
          },
          profileConstraint: {},
          filtros: {
            email: '',
            login: '',
            name: '',
            profile: {},
            userType: '',
            createdAt: null,
            id: ''
          },
          usuario: {
            acao: 'LISTA',
            pesquisa: null,
            login: null
          },
          profile: [],
          auths: {},
          error: 'error',
          users: [],
          usersAdicionar: [],
          todosUsuarios: [],
          loadingShow: false,
          perPage: 5,
          currentPage: 1,
          // totalRows: items.length,
          sortBy: 'initialDate',
          sortDesc: true,
          bordered: true,
          filter: null,
          emptyText: 'Não tem nenhum registro para mostrar',
          fields: [
            { key: 'username', label: 'Usuário', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'initialDate', label: 'Data Inicial', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'inactivateDate', label: 'Data Final', thStyle: 'width: 10%', class: 'text-center' },
            { key: 'changedBy', label: 'Alterado Por', sortable: true, thStyle: 'text-align: center', class: 'centraliza' },
            { key: 'updatedAt', label: 'Alterado em', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'actions', label: 'Ações', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
          ],
          show: {
            userForm: false
          },
          usuariosPesquisa: [],
          usuariosPraGravar: []
        }
      },
      created () {
        axios.get('/proxy/account/permissions?group=true').then((response) => {
          this.$snotify.async('Buscando permissões. Por favor, aguarde...', {timeout: 0})
          this.auths = response.data.value
          this.$snotify.clear()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        this.usuario.pesquisa = this.usuarioLogado.profilesConstraint[0].profile
        console.log('this.usuario.pesquisa', this.usuario.pesquisa)
        axiosLaravel.post('/usuarios/acao/', this.usuario).then((response) => {
          this.todosUsuarios = response.data.dados.row
          this.$snotify.clear()
          this.$snotify.success('Usuários carregados com sucesso!', {timeout: 1000})
          this.$snotify.clear()
          this.profile = this.usuarioLogado.profilesConstraint[0].profile
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      watch: {
        profile: function (newProfile, oldProfile) {
          this.buscaUsuariosProfile()
        }
      },
      mounted: function () {
        // this.buscaUsuariosProfile()
      },
      computed: {
        totalRows: {
          get: function () {
            return this.users.length
          },
          set: function () {
          }
        },
        ...mapGetters([
          'usuarioLogado'
        ])
      },
      methods: {
        translate (index) {
          index = 'hello'
          let v = 'messages.error'
          return v
        },
        camelize (str) {
          return str.replace(/\W+(.)/g, function (match, chr) {
            return chr.toUpperCase()
          })
        },
        verifica (name) {
          if (Object.keys(this.profile).length > 0) {
            return this.profile.authorities.some((o) => {
              return o.name === name
            })
          } else {
            return false
          }
        },
        adiciona (authority) {
          if (this.profile.authorities.some((o) => {
            return o.name === authority.name
          })) {
            this.profile.authorities = this.profile.authorities.filter((o) => o.name !== authority.name)
          } else this.profile.authorities.push(authority)
        },
        onFiltered (filteredItems) {
          // Trigger pagination to update the number of buttons/pages due to filtering
          this.totalRows = filteredItems.length
          this.currentPage = 1
        },
        saveAuthoritiesToProfile () {
          axios.post('proxy/account/profiles/' + this.profile.id + '/authorities', this.profile.authorities).then((response) => {
            this.$snotify.success('Permissões salvas com sucesso')
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        onCancelUserToProfile () {
          this.show.userForm = false
          this.profileConstraint = {}
          this.usersAdicionar = []
          this.$validator.errors.clear()
        },
        adicionaUsuario () {
          if (Object.keys(this.usersAdicionar).length === 0) {
            this.errors.add('usuarios', 'campo usuarios é obrigatorio')
          } else {
            this.errors.remove('usuarios')
          }
          this.$validator.validateAll().then((result) => {
            if (result && Object.keys(this.errors.items).length === 0) {
              this.montaArrayUsuarios()
              // Se tudo certo chama backend
              axios.post('proxy/account/profiles/' + this.profile.id + '/users', this.usuariosPraGravar).then((response) => {
                this.$snotify.success('Usuário adicionado com sucesso')
                this.buscaUsuariosProfile()
                this.onCancelUserToProfile()
              })
                .catch((error) => {
                  this.$root.trataErro(error)
                })
            }
          })
        },
        montaArrayUsuarios () {
          this.usuariosPraGravar = []
          let userObject = {}
          // this.usersAdicionar.forEach((user) => {
          let usuario = this.todosUsuarios.find((element) => {
            // return element.id === user.id
            return element.id === this.usersAdicionar.id
          })
          userObject.initialDate = this.profileConstraint.initialDate
          if (this.profileConstraint.inactivateDate) {
            userObject.inactivateDate = this.profileConstraint.inactivateDate
          }
          userObject.user = usuario
          this.usuariosPraGravar.push(userObject)
          // })
        },
        buscaUsuariosProfile () {
          let perfil = this.usuarioLogado.profilesConstraint[0].profile.id
          console.log('perfil', perfil)
          axios.get('/proxy/account/profiles/' + perfil + '/users').then((response) => {
            this.users = response.data.value
            this.usuariosPesquisa = []
            let temporario = {id: 0, userName: ''}
            // Monta array com os usuários que ainda não tem esse profile assinado
            this.todosUsuarios.forEach((option) => { // Varre todos os usuários
              if (this.users.some((o) => o.id === option.id)) { // Se não tem correspondência entao adiciona
              } else {
                // Cria variavel temporaria para simplificar o objeto para a pesquisa não ficar pesada
                temporario = {id: 0, userName: ''}
                temporario.id = option.id
                temporario.userName = option.userName
                // Passa para a variavel que vai guardar os usuários que ainda não tem o profile assinado
                this.usuariosPesquisa.push(temporario)
              }
            })
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        deleteUser (id) {
          axios.delete('proxy/account/profiles/' + this.profile.id + '/users/' + id).then((response) => {
            this.$snotify.success('Usuário exlucido com sucesso')
            this.buscaUsuariosProfile()
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      }
    }
</script>

<style scoped>

  .input-group .form-control {
    z-index: 0;
  }
  .input-group-btn:last-child > .btn, .input-group-btn:last-child > .btn-group {
    z-index: 0;
  }
  .borda.has-error {
    border: solid 1px;
    border-color: #dd4b39;
  }
</style>
