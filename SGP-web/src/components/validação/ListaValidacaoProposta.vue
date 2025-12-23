<template>
      <div class="content-wrapper" style="min-height: 870px;">
        <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
          <section class="content-header ng-scope">
            <h1>Validação da Proposta</h1>
            <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Validação de Proposta',
            href: '#'
            }, {
            text: 'Primeira Aprovação',
            active: true
            }]"/>
          </section>

            <!-- Main content -->
            <section class="content">
              <div class="row" id="validaProp">
                <!--Coluna da esquerda-->
                <div class="col-md-3">
                  <div class="row">
                    <div class="col-md-12">
                      <h4>Pré-Análise</h4>
                      <div class="box box-solid">
                        <div class="box-body no-padding">
                          <ul class="nav nav-pills nav-stacked" id="filtroPre">

                            <li :class="{ 'active' : faseAtual === 'primeira'}"><a href="javascript:void(0)"  @click="faseAtual = 'primeira'"><i class="fa fa-hand-pointer-o"></i>Primeira Aprovação <span class="label label-primary pull-right">{{quantidadesPorFase.preAnalysisFirstApproval}}</span></a></li>
                            <li :class="{ 'active' : faseAtual === 'segunda'}" v-if="this.$root.authorize('pre-analise-segunda-aprovacao-validar')"><a href="javascript:void(0)" @click="faseAtual = 'segunda'"><i class="fa fa-hand-peace-o"></i>Segunda Aprovação <span class="label label-primary pull-right">{{quantidadesPorFase.preAnalysisSecondApproval}}</span></a></li>
                          </ul>
                        </div>
                        <!-- /.box-body -->
                      </div>
                      <!-- /. box -->
                    </div>
                  </div>
                  <div class="row" v-if="this.$root.authorize('aceite-proposta-validar')">
                    <div class="col-md-12">
                      <h4>Aceite</h4>
                      <div class="box box-solid">
                        <div class="box-body no-padding">
                          <ul class="nav nav-pills nav-stacked" id="filtroAceite">
                            <li :class="{'active' : faseAtual === 'aceite'}"><a href="javascript:void(0)" @click="faseAtual = 'aceite'"><i class="fa fa-hand-pointer-o"></i>Aprovação <span class="label label-primary pull-right">{{quantidadesPorFase.acceptanceApproval}}</span></a></li>
                          </ul>
                        </div>
                        <!-- /.box-body -->
                      </div>
                      <!-- /. box -->
                    </div>
                  </div>
                  <div class="row" v-if="this.$root.authorize('analise-aprovacao-validar|analise-pendencia-aprovacao-validar')">
                    <div class="col-md-12">
                      <h4>Análise</h4>
                      <div class="box box-solid">
                        <div class="box-body no-padding">
                          <ul class="nav nav-pills nav-stacked" id="filtroAnalise">
                            <li :class="{'active' : faseAtual === 'analise'}"><a href="javascript:void(0)" @click="faseAtual = 'analise'"><i class="fa fa-hand-pointer-o"></i>Aprovação <span class="label label-primary pull-right">{{quantidadesPorFase.analysisApproval + quantidadesPorFase.analysisPendency}}</span></a></li>
                          </ul>
                        </div>
                        <!-- /.box-body -->
                      </div>
                      <!-- /. box -->
                    </div>
                  </div>
                  <div class="row" v-if="this.$root.authorize('deferimento-aprovacao-validar')">
                    <div class="col-md-12">
                      <h4>Deferimento</h4>
                      <div class="box box-solid">
                        <div class="box-body no-padding">
                          <ul class="nav nav-pills nav-stacked" id="filtroDef">
                            <li :class="{'active' : faseAtual === 'deferimento'}"><a href="javascript:void(0)" @click="faseAtual = 'deferimento'"><i class="fa fa-hand-pointer-o"></i>Aprovação <span class="label label-primary pull-right">{{quantidadesPorFase.grantApproval}}</span></a></li>
                          </ul>
                        </div>
                        <!-- /.box-body -->
                      </div>
                      <!-- /. box -->
                    </div>
                  </div>
                  <div class="row" v-if="this.$root.authorize('preparacao-documentos-aprovacao-validar')">
                    <div class="col-md-12">
                      <h4>Preparação de Documentos</h4>
                      <div class="box box-solid">
                        <div class="box-body no-padding">
                          <ul class="nav nav-pills nav-stacked" id="filtroPrep">
                            <li :class="{'active' : faseAtual === 'preparacao'}"><a href="javascript:void(0)" @click="faseAtual = 'preparacao'"><i class="fa fa-hand-pointer-o"></i>Aprovação <span class="label label-primary pull-right">{{quantidadesPorFase.documentPreparationApproval}}</span></a></li>
                          </ul>
                        </div>
                        <!-- /.box-body -->
                      </div>
                      <!-- /. box -->
                    </div>
                  </div>
                  <div class="row" v-if="this.$root.authorize('formalizacao-projetos-aprovacao-validar')">
                    <div class="col-md-12">
                      <h4>Formalizar Projetos</h4>
                      <div class="box box-solid">
                        <div class="box-body no-padding">
                          <ul class="nav nav-pills nav-stacked" id="filtroForm">
                            <li :class="{'active' : faseAtual === 'formalizacao'}"><a href="javascript:void(0)" @click="faseAtual = 'formalizacao'"><i class="fa fa-hand-pointer-o"></i>Aprovação <span class="label label-primary pull-right">{{quantidadesPorFase.projectFormalizationApproval}}</span></a></li>
                          </ul>
                        </div>
                        <!-- /.box-body -->
                      </div>
                      <!-- /. box -->
                    </div>
                  </div>
                </div>
                <!-- /.col -->

                <!--Lista normal-->
                <div class="col-md-9">
                  <div class="box box-primary">
                    <div class="box-header with-border">
                      <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> {{descricaoFase}}</h3>
                      <div class="box-tools pull-right" style="position: relative;">
                      </div>
                      <h3 class="box-title"></h3>
                      <!-- /.box-tools -->
                      <div class="box-tools pull-right" style="position: relative; margin-right: 10px;">
                        <div class="has-feedback">
                          <input v-model="table.filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
                        </div>
                      </div>
                      <!-- /.box-tools -->
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body no-padding">
                      <div class="mailbox-controls">
                        <div class="btn-group">
                          <button type="button" class="btn btn-default btn-sm" v-model="filtro.favorite" @click="filtro.favorite = !filtro.favorite"><i class="fa fa-star"></i></button>
                          <button type="button" class="btn btn-default btn-sm" v-model="filtro.userId" @click="filtro.userId ? filtro.userId = null : filtro.userId = usuarioLogado.id"><i class="fa fa-user"></i></button>
                        </div>
                        <!-- /.btn-group -->
                        <button @click="onSearch" type="button" class="btn btn-default btn-sm"><i class="fa fa-refresh"></i></button>
                        <div class="pull-right">
                          <!--<ssm-simple-paginator offset="maiPreAnaFirAppCtrl.filter.offset" limit="maiPreAnaFirAppCtrl.filter.limit" total="maiPreAnaFirAppCtrl.total" on-update="maiPreAnaFirAppCtrl.onUpdatePaginator"></ssm-simple-paginator>-->
                        </div>
                        <!-- /.pull-right -->
                      </div>
                      <b-container fluid>
                        <!-- Main table element -->
                        <b-table show-empty
                                 striped
                                 stacked="md"
                                 :bordered="table.bordered"
                                 :items="table.items"
                                 :fields="table.fields"
                                 :filter="table.filter"
                                 :current-page="table.currentPage"
                                 @filtered="onFiltered"
                                 :per-page="table.perPage"
                                 :sort-by.sync="table.sortBy"
                                 :sort-desc.sync="table.sortDesc"
                                 empty-text="Nenhum registro encontrado"
                        >
                          <template slot="favorite" scope="row">
                            <i @click="onFavorite(row.item)" :class="['fa ', row.value ? 'fa-star text-warning' : 'fa-star-o']" aria-hidden="true"></i>
                            <!--<td class="mailbox-star">-->
                              <!--<span @click="onFavorite(item)" ng-bind-html="i.favorite | statusStarFilter" style="cursor:pointer" class="ng-binding"><i class="fa fa-star text-yellow"></i></span>-->
                            <!--</td>-->
                          </template>
                          <template slot="proposta" scope="row">
                            <div class="">
                              <div v-if="row.item.simplificado > '0'" >
                                <b>{{row.item.simplificado}}</b><br>
                              </div>
                                {{ row.item.companyName }}
                              <div>
                                {{ row.item.nomeProposta}}
                              </div>
                            </div>
                          </template>
                          <template slot="createdAt" scope="row">{{row.value | moment("L")}}</template>
                          <template slot="userName" scope="row">
                            <span v-if="row.value" style="font-weight: bold">{{row.value}}</span>
                            <span v-else>Aguardando atendimento</span>
                          </template>
                          <template slot="actions" scope="row">
                            <div>
                              <!--Botão para cadastramento de proposta Liberação ou simplificada-->
                              <div class="btn-group">
                                <button class="btn btn-default" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <!--id="proposal-approval-options-{{i.id}}">-->
                                <i class="fa fa-ellipsis-h"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-right"  role="menu" aria-labelledby="new-register">
                                  <li><a href="#"><i class="fa fa-eye" aria-hidden="true"></i> Ver mais</a></li>
                                  <li v-if="usuarioLogado.id !== row.item.userId" class="ng-scope" style=""><a @click="onAssign(row.item)" href="javascript:void(0)"><i class="fa fa-user" aria-hidden="true"></i> Atribuir a mim</a></li>
                                  <li v-if="usuarioLogado.id !== row.item.userId" class="ng-scope" style=""><a @click="onAssignAndDo(row.item)" href="javascript:void(0)"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i> Atribuir e Fazer</a></li>
                                  <li v-if="usuarioLogado.id === row.item.userId"><a @click="onUnassign(row.item)" href="javascript:void(0)"><i class="fa fa-user-times" aria-hidden="true"></i> Devolver</a></li>
                                  <li v-if="usuarioLogado.id === row.item.userId" role="separator" class="divider"></li>
                                  <li v-if="usuarioLogado.id === row.item.userId"><router-link :to="{name: rota1, params: {id: row.item.id}}"><i class="fa fa-play-circle" aria-hidden="true"></i> Fazer</router-link></li>
                                </ul>
                              </div>
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
                  <!-- /. box -->
                  <!--Lista secundaria usada para aceite e analise-->
                    <div v-if="faseAtual === 'aceite' || faseAtual === 'analise'" class="box box-primary">
                      <div class="box-header with-border">
                        <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> {{faseAtual === 'aceite' ? 'Aceite - Recusadas para Ajustes' : 'Análise - Pendências'}}</h3>
                        <div class="box-tools pull-right" style="position: relative;">
                          <div class="has-feedback">
                            <!--<input v-model="filtro.entityName" @change="onSearch" type="text" class="form-control input-sm" placeholder="Nome da Entidade">-->
                            <!---->
                            <!--<span class="glyphicon glyphicon-search form-control-feedback"></span>-->
                          </div>
                        </div>
                        <h3 class="box-title"></h3>
                        <!-- /.box-tools -->
                        <div class="box-tools pull-right" style="position: relative; margin-right: 10px;">
                          <div class="has-feedback">
                            <!--<input v-model="filtro.nomeProposta" @change="onSearch" type="text" class="form-control input-sm" placeholder="Nome da Proposta">-->
                            <!--<span class="glyphicon glyphicon-search form-control-feedback"></span>-->
                            <input v-model="table.filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
                          </div>
                        </div>
                        <!-- /.box-tools -->
                      </div>
                      <!-- /.box-header -->
                      <div class="box-body no-padding">
                        <div class="mailbox-controls">
                          <div class="btn-group">
                            <button type="button" class="btn btn-default btn-sm" v-model="filtro.favorite" @click="filtro.favorite = !filtro.favorite"><i class="fa fa-star"></i></button>
                            <button type="button" class="btn btn-default btn-sm" v-model="filtro.userId" @click="filtro.userId ? filtro.userId = null : filtro.userId = usuarioLogado.id"><i class="fa fa-user"></i></button>
                          </div>
                          <!-- /.btn-group -->
                          <button @click="onSearch" type="button" class="btn btn-default btn-sm"><i class="fa fa-refresh"></i></button>
                          <div class="pull-right">
                            <!--<ssm-simple-paginator offset="maiPreAnaFirAppCtrl.filter.offset" limit="maiPreAnaFirAppCtrl.filter.limit" total="maiPreAnaFirAppCtrl.total" on-update="maiPreAnaFirAppCtrl.onUpdatePaginator"></ssm-simple-paginator>-->
                          </div>
                          <!-- /.pull-right -->
                        </div>
                        <b-container fluid>
                          <!-- Main table element -->
                          <b-table show-empty
                                   striped
                                   stacked="md"
                                   :bordered="table2.bordered"
                                   :items="table2.items"
                                   :fields="table2.fields"
                                   :filter="table2.filter"
                                   :current-page="table2.currentPage"
                                   @filtered="onFilteredRejeitados"
                                   :per-page="table2.perPage"
                                   :sort-by.sync="table2.sortBy"
                                   :sort-desc.sync="table2.sortDesc"
                                   empty-text="Nenhum registro encontrado"
                          >
                            <template slot="favorite" scope="row">
                              <i @click="onFavorite(row.item)" :class="['fa ', row.value ? 'fa-star text-warning' : 'fa-star-o']" aria-hidden="true"></i>
                              <!--<td class="mailbox-star">-->
                              <!--<span @click="onFavorite(item)" ng-bind-html="i.favorite | statusStarFilter" style="cursor:pointer" class="ng-binding"><i class="fa fa-star text-yellow"></i></span>-->
                              <!--</td>-->
                            </template>
                            <template slot="proposta" scope="row">
                              <div class="">
                                <div v-if="row.item.simplificado > '0'" >
                                  <b>{{row.item.simplificado}}</b><br>
                                </div>
                                {{ row.item.companyName }}
                                <div>
                                  {{ row.item.nomeProposta}}
                                </div>
                              </div>
                            </template>
                            <template slot="createdAt" scope="row">{{row.value | moment("L")}}</template>
                            <template slot="userName" scope="row">
                              <span v-if="row.value" style="font-weight: bold">{{row.value}}</span>
                              <span v-else>Aguardando atendimento</span>
                            </template>
                            <template slot="actions" scope="row">
                              <div>
                                <!--Botão para cadastramento de proposta Liberação ou simplificada-->
                                <div class="btn-group">
                                  <button class="btn btn-default" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <!--id="proposal-approval-options-{{i.id}}">-->
                                    <i class="fa fa-ellipsis-h"></i>
                                  </button>
                                  <ul class="dropdown-menu dropdown-menu-right"  role="menu" aria-labelledby="new-register">
                                    <li><a href="#"><i class="fa fa-eye" aria-hidden="true"></i> Ver mais</a></li>
                                    <li v-if="usuarioLogado.id !== row.item.userId" class="ng-scope" style=""><a @click="onAssign(row.item)" href="javascript:void(0)"><i class="fa fa-user" aria-hidden="true"></i> Atribuir a mim</a></li>
                                    <li v-if="usuarioLogado.id !== row.item.userId" class="ng-scope" style=""><a @click="onAssignAndDo(row.item)" href="javascript:void(0)"><i class="fa fa-user" aria-hidden="true"></i> Atribuir e Fazer</a></li>
                                    <li v-if="usuarioLogado.id === row.item.userId"><a @click="onUnassign(row.item)" href="javascript:void(0)"><i class="fa fa-user-times" aria-hidden="true"></i> Devolver</a></li>
                                    <li v-if="usuarioLogado.id === row.item.userId" role="separator" class="divider"></li>
                                    <li v-if="usuarioLogado.id === row.item.userId"><router-link :to="{name: 'primeira-aprovacao', params: {id: row.item.id}}"><i class="fa fa-play-circle" aria-hidden="true"></i> Fazer</router-link></li>
                                  </ul>
                                </div>
                              </div>
                            </template>
                          </b-table>
                          <b-row>
                            <b-col md="6" class="my-1" right>
                              <b-pagination :total-rows="table2.totalRows" :per-page="table2.perPage" v-model="table2.currentPage" class="my-3" />
                            </b-col>
                          </b-row>
                        </b-container>
                        <div v-show="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                          <i class="fa fa-refresh fa-spin"></i>
                        </div>

                    </div>
                    <!-- /. box -->
                  </div>
                </div>


                <!-- /.col -->
              </div>
              <!-- /.row -->
            </section>

        </div>
      </div>

</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'lista-validacao-proposta',
    data () {
      return {
        quantidadesPorFase: {},
        simplificados: [],
        faseAtual: '',
        descricaoFase: '',
        filtro: {
          entityName: null,
          eventStatus: 'OPEN',
          favorite: null,
          limit: 50,
          nomeProposta: null,
          offset: 0,
          preAnalysisApprovalType: 'FIRST_APPROVAL',
          userId: null,
          flowType: null
        },
        aprovacaoLista: [],
        aprovacaoTotal: null,
        loadingShow: false,
        table: {
          items: [],
          totalRows: 0,
          filter: null,
          hover: false,
          bordered: false,
          currentPage: 1,
          sortBy: 'createdAt',
          sortDesc: true,
          perPage: 10,
          fields: [
            { key: 'favorite', label: '', thStyle: 'text-align: center; width: 3%', class: 'text-center' },
            { key: 'proposta', label: '', thStyle: 'text-align: left; width: 60%', class: 'text-left' },
            { key: 'userName', label: '', thStyle: 'font-weight: bold' },
            { key: 'createdAt', label: '', thStyle: 'text-align: center', class: 'text-center' },
            { key: 'actions', label: '', thStyle: 'text-align: center', class: 'text-center' }
          ]
        },
        table2: {
          items: [],
          totalRows: 0,
          filter: null,
          hover: false,
          bordered: false,
          currentPage: 1,
          sortBy: 'createdAt',
          sortDesc: true,
          perPage: 10,
          fields: [
            { key: 'favorite', label: '', thStyle: 'text-align: center; width: 3%', class: 'text-center' },
            { key: 'proposta', label: '', thStyle: 'text-align: left; width: 60%', class: 'text-left' },
            { key: 'userName', label: '', thStyle: 'font-weight: bold' },
            { key: 'createdAt', label: '', thStyle: 'text-align: center', class: 'text-center' },
            { key: 'actions', label: '', thStyle: 'text-align: center', class: 'text-center' }
          ]
        },
        rota1: '',
        rota2: ''
      }
    },
    watch: {
      'filtro.favorite' () {
        this.onSearch()
      },
      'filtro.userId' () {
        this.onSearch()
      },
      'faseAtual' () {
        this.onSearch()
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created () {
      this.buscaQuantidadePorFase()
      // Busca processos simplificados
      axios.get('proxy/document/simplified/geral/list').then((response) => {
        this.simplificados = response.data.value
      })
        .catch((error) => {
          this.$root.trataErro(error)
        })
    },
    mounted () {
      this.onSearch()
    },
    methods: {
      buscaQuantidadePorFase () {
        // Busca quantidade de registro por fase de validação
        axios.get('proxy/project/proposal-approval/count').then((response) => {
          this.quantidadesPorFase = response.data.value
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
      onFilteredRejeitados (filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      onSearch () {
        this.loadingShow = true
        this.filtro.flowType = null
        switch (this.faseAtual) {
          case 'primeira':
            this.filtro.preAnalysisApprovalType = 'FIRST_APPROVAL'
            this.descricaoFase = 'Pré-Análise - Primeira Aprovação'
            this.buscaBackEnd('proxy/project/approval-pre-analysis/search/sql')
            this.rota1 = 'proposta-primeira-validacao'
            break
          case 'segunda':
            this.filtro.preAnalysisApprovalType = 'SECOND_APPROVAL'
            this.descricaoFase = 'Pré-Análise - Segunda Aprovação'
            this.buscaBackEnd('proxy/project/approval-pre-analysis/search/sql')
            this.rota1 = 'proposta-primeira-validacao'
            break
          case 'aceite':
            this.descricaoFase = 'Aceite - Primeira Aprovação/Recusa'
            this.buscaBackEnd('proxy/project/approval-acceptance/search')
            this.rota1 = 'validacao-proposta-aceite'
            break
          case 'analise':
            this.descricaoFase = 'Análise - Aprovação'
            this.buscaBackEnd('proxy/project/approval-analysis/search/sql')
            this.buscaAnalisePendencia('pendência')
            this.rota1 = 'validacao-proposta-analise'
            this.rota2 = ''
            break
          case 'deferimento':
            this.descricaoFase = 'Deferimento - Aprovação'
            this.buscaBackEnd('proxy/project/approval-grant/search/sql')
            this.rota1 = 'validacao-proposta-deferimento'
            break
          case 'preparacao':
            this.descricaoFase = 'Preparação de Documentos - Aprovação'
            this.buscaBackEnd('proxy/project/document-preparation/search/sql')
            this.rota1 = 'validacao-proposta-preparacao-documento'
            break
          case 'formalizacao':
            this.descricaoFase = 'Formalizar Projetos - Aprovação'
            this.buscaBackEnd('proxy/project/project-formalization/search/sql')
            this.rota1 = 'validacao-proposta-formalizacao'
            break
          default:
            this.faseAtual = 'primeira'
            this.filtro.preAnalysisApprovalType = 'FIRST_APPROVAL'
            this.descricaoFase = 'Pré-Análise - Primeira Aprovação'
            this.buscaBackEnd('proxy/project/approval-pre-analysis/search/sql')
        }
        this.buscaQuantidadePorFase()
      },
      buscaBackEnd (url) {
        axios.post(url, this.filtro).then((response) => {
          this.carregaTabela(response)
          if (this.faseAtual === 'aceite') {
            this.buscaAceiteRejeitados()
          } else if (this.faseAtual === 'analise') {
            this.buscaAnalisePendencia()
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaAceiteRejeitados () {
        this.filtro.flowType = 'REJECTED'
        axios.post('proxy/project/approval-acceptance/search/sql', this.filtro).then((response) => {
          this.table2.items = response.data.value.list
          this.table2.totalRows = response.data.value.total
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      buscaAnalisePendencia () {
        axios.post('proxy/project/approval-analysis-pendency/search/sql', this.filtro).then((response) => {
          this.table2.items = response.data.value.list
          this.table2.totalRows = response.data.value.total
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      carregaTabela (response) {
        this.table.items = response.data.value.list
        this.table.totalRows = response.data.value.total
        this.loadingShow = false
      },
      onFavorite (item) {
        let url = ''
        switch (this.faseAtual) {
          case 'primeira':
            url = 'proxy/project/approval-pre-analysis/'
            break
          case 'segunda':
            url = 'proxy/project/approval-pre-analysis/'
            break
          case 'aceite':
            break
          case 'analise':
            url = 'proxy/project/approval-analysis/'
            break
          case 'deferimento':
            url = 'proxy/project/approval-grant/'
            break
          case 'preparacao':
            url = 'proxy/project/document-preparation/'
            break
          case 'formalizacao':
            url = 'proxy/project/project-formalization/'
            break
        }
        axios.put(url + item.id + '/favorite', '').then((response) => {
          this.onSearch()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onUnassign (item) {
        let url = ''
        switch (this.faseAtual) {
          case 'primeira':
            url = 'proxy/project/approval-pre-analysis/'
            break
          case 'segunda':
            url = 'proxy/project/approval-pre-analysis/'
            break
          case 'aceite':
            url = 'proxy/project/approval-acceptance/'
            break
          case 'analise':
            url = 'proxy/project/approval-analysis/'
            break
          case 'deferimento':
            url = 'proxy/project/approval-grant/'
            break
          case 'preparacao':
            url = 'proxy/project/document-preparation/'
            break
          case 'formalizacao':
            url = 'proxy/project/project-formalization/'
            break
        }
        axios.put(url + item.id + '/unassign', '').then((response) => {
          this.onSearch()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onAssign (item) {
        let url = ''
        console.log('this.faseAtual', this.faseAtual)
        switch (this.faseAtual) {
          case 'primeira':
            url = 'proxy/project/approval-pre-analysis/'
            break
          case 'segunda':
            url = 'proxy/project/approval-pre-analysis/'
            break
          case 'aceite':
            url = 'proxy/project/approval-acceptance/'
            break
          case 'analise':
            url = 'proxy/project/approval-analysis/'
            break
          case 'deferimento':
            url = 'proxy/project/approval-grant/'
            break
          case 'preparacao':
            url = 'proxy/project/document-preparation/'
            break
          case 'formalizacao':
            url = 'proxy/project/project-formalization/'
            break
        }
        axios.put(url + item.id + '/assign', '').then((response) => {
          this.onSearch()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onAssignAndDo (item) {
        this.onAssign(item)
        this.$router.push({name: this.rota1, params: {id: item.id}})
      }
    }
  }
</script>

<style scoped>
  /*.text-warning {*/
    /*color: #f39c12;*/
  /*}*/
</style>
