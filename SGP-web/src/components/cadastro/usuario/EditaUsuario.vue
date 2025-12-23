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
              <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Cadastro do usuário: </h3>
            </div>
            <!-- /.box-header -->
            <div class="box-body" ><div class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: none;"><i class="fa fa-refresh fa-spin"></i></div>

              <div class="row">

                <div name="usuario" class="form-horizontal">

                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('nome')}">
                    <label for="nome" class="control-label col-sm-2">Nome:</label>
                    <div class="col-sm-4">
                      <input :disabled="true" v-model="usuario.nome"
                             id="nome"
                             name="nome"
                             class="form-control ng-pristine ng-untouched ng-valid-maxlength ng-valid-minlength ng-not-empty ng-valid ng-valid-required"
                             :class="{ 'has-error' : errors.first('nome')}"
                             v-validate="{required: true}"
                             type="text">
                      <span v-if="errors.first('nome')" class="label label-danger"> {{('O Nome do usuário é obrigatório') }}</span>
                    </div>
                  </div>

                  <div v-if="usuario.tipo === 'ENTIDADE'" class="form-group required-field" :class="{ 'has-error' : errors.first('cpf')}">
                    <label for="cpf" class="control-label col-sm-2">CPF:</label>
                    <div class="col-sm-4">
                      <input :disabled="true" v-model="usuario.cpf"
                             id="cpf"
                             name="cpf"
                             class="form-control ng-pristine ng-untouched ng-valid-maxlength ng-valid-minlength ng-not-empty ng-valid ng-valid-required"
                             :class="{ 'has-error' : errors.first('cpf')}"
                             v-validate="{required: true}"
                             type="text">
                      <span v-if="errors.first('cpf')" class="label label-danger"> {{('O CPF é obrigatório para esse usuário') }}</span>
                    </div>
                  </div>


                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('email')}">
                    <label for="email" class="control-label col-sm-2">E-mail:</label>
                    <div class="col-sm-4">
                      <input :disabled="true" v-model="usuario.email"
                             id="email"
                             name="email"
                             class="form-control ng-pristine ng-untouched ng-valid-maxlength ng-valid-minlength ng-not-empty ng-valid ng-valid-required"
                             :class="{ 'has-error' : errors.first('email')}"
                             v-validate="{required: true}"
                             minlength="1" maxlength="255"
                             type="text">
                      <span v-if="errors.first('email')" class="label label-danger"> {{('O E-mail é obrigatório') }}</span>
                    </div>
                  </div>

                  <div class="form-group required-field">
                    <label for="email" class="control-label col-sm-2">Situação do usuário:</label>
                    <div class="col-sm-4">
                      <b-form-group>
                      <b-form-radio-group
                        id="btn-radios-2"
                        v-model="usuario.ativo"
                        :options="situacao_opcoes"
                        size="xg"
                        name="radio-btn-outline"
                        button-variant="inline-primary"
                        buttons>
                      </b-form-radio-group>
                      </b-form-group>
                    </div>
                  </div>

                </div>

              </div>

              <div v-if="this.$root.authorize('usuario-fundacao-atribuir-perfil')" class="ng-scope ng-isolate-scope">
                <fieldset>
                  <legend>Perfis</legend>

                  <!-- grid -->
                  <div class="row">
                    <div class="col-sm-12">
                      <b-container fluid>
                        <!-- Main table element -->
                        <b-table show-empty
                                 stacked="md"
                                 :items="table.items"
                                 :hover="hover"
                                 :fields="table.fields"
                                 :filter="filter"
                                 :current-page="table.currentPage"
                                 :sort-by.sync="table.sortBy"
                                 :sort-desc.sync="table.sortDesc"
                                 empty-text="Preencha o filtro acima!"
                                 table-layout: fixed
                                 @filtered="onFiltered"
                                 :tbody-tr-class="formatarLinhas"
                        >
                          <template slot="ativo" scope="row">
                            <i :class="['fa fa-circle ', row.value == '1' ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                          </template>
                          <template slot="data_inicial" scope="row">{{row.value | moment("L")}}</template>
                          <template slot="data_alteracao" scope="row">{{row.value | moment("L")}}</template>

                          <template slot="data_inativacao" scope="row" style="text-align:center;">
                            <!--<input v-if="row.item.data_inativacao === '1900-01-01'" v-model="row.item.data_inativacao" min="2019-07-01" max="2020-12-31" name="data_inativar" id="data_inativar"
                                   class= "form-control" v-validate="{required: true}" style="text-align:center;" type='date'>-->
                            <datepicker  v-model="row.item.data_inativacao" name="data_inativar" id="data_inativar" input-class="form-control datepicker datapicker2"
                                         :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" :open-date="new Date()"
                                         format="dd/MM/yyyy" v-validate="'required'"  @input="alteradoPor(row.item)">
                            </datepicker>
                            <!--                            <span v-if="row.item.data_inativacao != '1900-01-01'">{{row.value | moment("L")}}</span>-->

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

                  <div class="row" style="margin: 10px 0">
                    <div class="col-sm-12">
                      <span style="color: red">- Para <b>Retirar</b> um acesso concedido, atribua uma data final ao perfil desejado na lista acima. Informando uma data menor que a atual, o acesso será interrompido de imediato.</span><br/>
                      <span style="color: darkblue">- Para <b>Conceder</b> um acesso, basta escolher abaixo um perfil da lista, informar a data da concessão e opcionalmente uma data de término</span>
                      <br>
                      <span style="color: black"><i>*Obs: A data 01/01/1900 é utilizada para identificar que o acesso em questão não tem vigência definida, portanto permanecerá ativo por tempo indeterminado.</i></span>
                    </div>
                  </div>

                  <div name="novo_perfil" class="form-horizontal well well-sm">

                    <div class="form-group required-field">
                      <label class="control-label col-sm-3">Adicionar o perfil:</label>
                      <div class="col-sm-4" :class="{ 'has-error' : errors.first('perfil')}">
                        <profiles
                          name="perfil"
                          v-model="perfil_novo.perfil"
                          :propsProfile="perfil_novo.perfil"
                          @profileSelected="perfil_novo.perfil = $event"
                          v-validate="{required: true}">
                        </profiles>
                        <span class="label label-danger">{{ errors.first('perfil') }}</span>
                      </div>
                    </div>


                    <div class="form-group required-field" :class="{ 'has-error' : errors.first('data_inicial')}">
                      <label for="data_inicial" class="control-label col-sm-3">Data inicial:</label>
                      <div class="col-sm-1">
                        <div class="input-group">
                          <!--<input v-model="perfil_novo.data_inicial" name="data_inicial" id="data_inicial" class="form-control"  v-validate="{required: true}" type='date'>-->
                          <datepicker  v-model="perfil_novo.data_inicial" name="data_inicial" id="data_inicial" input-class="form-control datepicker"
                                       :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                       format="dd/MM/yyyy" v-validate="'required'">
                          </datepicker>
                          <span class="label label-danger">{{ errors.first('data_inicial') }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="data_inativacao" class="control-label col-sm-3">Data final:</label>
                      <div class="col-sm-1">
                        <div class="input-group">
                          <!--<input v-model="perfil_novo.data_inativacao" min="2019-07-01" max="2020-12-31" name="data_inativacao" id="data_inativacao" class="form-control "type='date'>-->
                          <datepicker  v-model="perfil_novo.data_inativacao" min="2019-07-01" max="2020-12-31" name="data_inativacao" id="data_inativacao" input-class="form-control datepicker"
                                       :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" :open-date="new Date()"
                                       format="dd/MM/yyyy" v-validate="'required'">
                          </datepicker>
                        </div>
                      </div>
                    </div>

                    <div class="form-group" style="margin-bottom:0">
                      <div class="col-sm-10 col-sm-offset-3">
                        <g-button-ujarak
                          color="primary"
                          size="button--size-ss"
                          :disabled="!$root.authorize('perfil-atribuir-usuario')"
                          @click.native="adicionaPerfil()">
                          <i class="fa fa-check" aria-hidden="true"></i>&nbsp Incluir
                        </g-button-ujarak >
                      </div>
                    </div>

                  </div>


                </fieldset>
              </div>

              <div class="box-footer">
                <g-button-moema color="success" size="button--size-ss" @click.native="concluirAlteracoes"><i class="fa fa-floppy-o" aria-hidden="true"></i> Concluir</g-button-moema>
                <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>

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
    <vue-snotify></vue-snotify>  </div></template>

<script>
  import Profiles from '../../modules/profiles'
  import moment from 'moment'
  // import Profiles from "../../modules/profiles";
  import {authorize} from '../../../mixins/authorize'
  import { mapGetters } from 'vuex'

  let items = []

  export default {
    name: 'alteraUsuario',
    components: {Profiles},
    mixin: [authorize],
    data () {
      return {
        data: [],
        loading: {
          show: false
        },
        show: false,
        consulta: {},
        situacao_opcoes: [
          { text: 'Ativo', value: '1' },
          { text: 'Inativado', value: '0' }
        ],
        usuario: {
          acao: 'VISUALIZA',
          id: null,
          id_usuario: null,
          ativo: null,
          nome: null,
          tipo: null,
          email: null,
          login: null,
          data_criacao: null,
          cpf: null,
          perfis: []
        },
        initialDate: moment().format('YYYY-MM-DD'),
        perfil_novo: {
          perfil: null,
          data_inicial: moment().format('YYYY-MM-DD'),
          data_inativacao: '1900-01-01',
          alterado_por: null
        },
        perfis: {},
        profilesConstraint: [],
        inactivateDate: null,
        table: {
          items: [],
          currentPage: 1,
          perPage: 10,
          totalRows: items.length,
          sortBy: 'data_alteracao',
          sortDesc: false,
          filter: null,
          emptyText: 'Não tem nenhum registro para mostrar',
          fields: [
            { key: 'perfil', label: 'Perfil', sortable: true, thStyle: 'text-align: center', class: 'text-left' },
            { key: 'data_inicial', label: 'Data Inicial', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'data_inativacao', label: 'Data final', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'alterado_por', label: 'Alterado por', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'data_alteracao', label: 'Alterado em', thStyle: 'text-align: center', class: 'text-center' }
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
    mounted () {
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created () {
      this.usuario.id = this.$route.params.id
      this.perfil_novo.alterado_por = this.usuarioLogado.userName
      this.carregaDados()
    },
    methods: {
      alteradoPor (item) {
        item.alterado_por = this.usuarioLogado.userName
        this.$forceUpdate()
      },
      onFiltered (filteredItems) {
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
      carregaDados () {
        if (this.$route.params.id) {
          this.usuario.acao = 'VISUALIZA'
          this.table.items = []
          this.loading.show = true
          this.$snotify.clear()
          this.$snotify.async('Buscando informações do usuário. Por favor, aguarde...', {timeout: 0})
          //
          axiosLaravel.post('/usuarios/acao', this.usuario).then((response) => {
            this.consulta = response.data.dados
            this.usuario.id_usuario = this.consulta.usuario.id_usuario
            this.usuario.ativo = this.consulta.usuario.ativo
            this.usuario.nome = this.consulta.usuario.nome
            this.usuario.tipo = this.consulta.usuario.tipo
            this.usuario.email = this.consulta.usuario.email
            this.usuario.login = this.consulta.usuario.login
            this.usuario.data_criacao = this.consulta.usuario.data_criacao
            //
            if (this.consulta.perfis) {
              this.usuario.perfis = this.consulta.perfis.row
              this.table.items = this.usuario.perfis
              this.table.totalRows = this.table.items.length
            } else {
              this.table.items = this.usuario.perfis
              this.table.totalRows = 0
            }
            //
            this.usuario.perfis.forEach((perfil) => {
              perfil.data_inativacao = moment(perfil.data_inativacao, moment.defaultFormat).toDate()
            })
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
      adicionaPerfil () {
        this.perfil_novo.perfil.admin = this.perfil_novo.perfil.admin ? '1' : '0'
        this.perfil_novo.perfil.alterado_por = this.usuarioLogado.userName
        this.perfil_novo.perfil.ativo = this.perfil_novo.perfil.active ? '1' : '0'
        this.perfil_novo.perfil.data_alteracao = moment()
        this.perfil_novo.perfil.data_criacao = moment()
        this.perfil_novo.perfil.data_inicial = this.perfil_novo.data_inicial
        this.perfil_novo.perfil.data_inativacao = this.perfil_novo.data_inativacao
        this.perfil_novo.perfil.descricao = this.perfil_novo.perfil.description
        this.perfil_novo.perfil.perfil = this.perfil_novo.perfil.name
        //
        this.usuario.perfis.push(Object.assign({}, this.perfil_novo.perfil))
      },
      concluirAlteracoes () {
        this.usuario.acao = 'CONCLUSAO'
        this.loading.show = true
        this.$snotify.clear()
        this.$snotify.async('Atualizando usuário. Por favor, aguarde...', {timeout: 0})
        //
        axiosLaravel.post('/usuarios/acao', this.usuario).then((response) => {
          this.$snotify.clear()
          this.loading.show = false
          this.$snotify.success(response.data.dados.row[0].resultado)
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      formatarLinhas (item, type) {
        if (!item) return
        if (item.active) return 'registro_adicionado'
      }
    }
  }
</script>

<style>
  tr.registro_adicionado {
    color: forestgreen;
  }
  tr.registro_inativado {
    color: silver;
  }
  .datapicker2 {
    text-align: center;
  }
</style>
