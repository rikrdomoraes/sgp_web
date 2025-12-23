<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Validação de Parceiro Estratégico</h1>
        <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Aprovação de Parceiro Estratégico',
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
                <div class="box box-solid">
                  <div class="box-body no-padding">
                    <ul class="nav nav-pills nav-stacked" id="filtroPre">

                      <li :class="{ 'active' : faseAtual === 'primeira'}"><a href="javascript:void(0)"  @click="faseAtual = 'primeira'"><i class="fa fa-hand-pointer-o"></i>Primeira Aprovação <span class="label label-primary pull-right">{{quantidadesPrimeiraAprov}}</span></a></li>
                      <li :class="{ 'active' : faseAtual === 'segunda'}"><a href="javascript:void(0)" @click="faseAtual = 'segunda'"><i class="fa fa-hand-peace-o"></i>Segunda Aprovação <span class="label label-primary pull-right">{{quantidadesSegundaAprov}}</span></a></li>
                      <li :class="{ 'active' : faseAtual === 'finalizada'}"><a href="javascript:void(0)" @click="faseAtual = 'finalizada'"><i class="fa fa-flag-checkered"></i>Finalizadas <span class="badge">{{quantidadesFinalizadas}}</span></a></li>
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
                  <div class="btn-group"  v-if="faseAtual !== 'finalizada'">
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
                    <template slot="createdAt" scope="row">{{row.value | moment("L")}}</template>
                    <template slot="userName" scope="row">
                      <span v-if="row.value" style="font-weight: bold">{{row.value}}</span>
                      <span v-else>Aguardando atendimento</span>
                    </template>
                    <template slot="actions" scope="row">
                      <div>
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
                            <li v-if="usuarioLogado.id === row.item.userId && faseAtual !== 'finalizada'"><router-link :to="{name: rota1, params: {id: row.item.id}}"><i class="fa fa-play-circle" aria-hidden="true"></i> Fazer</router-link></li>
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
      name: 'ListaValidacaoParcEst',
      data () {
        return {
          quantidadesPrimeiraAprov: '',
          quantidadesSegundaAprov: '',
          quantidadesFinalizadas: '',
          faseAtual: '',
          descricaoFase: '',
          filtro: {
            strategicPartnerName: null,
            eventStatus: 'OPEN',
            favorite: null,
            limit: 50,
            offset: 0,
            strategicPartnerApprovalType: 'FIRST_APPROVAL',
            userId: null
          },
          filtro2: {
            strategicPartnerName: null,
            eventStatus: 'OPEN',
            favorite: null,
            limit: 50,
            offset: 0,
            strategicPartnerApprovalType: 'SECOND_APPROVAL',
            userId: null
          },
          filtro3: {
            strategicPartnerName: null,
            eventStatus: 'DONE',
            favorite: null,
            limit: 50,
            offset: 0,
            strategicPartnerApprovalType: 'SECOND_APPROVAL',
            approvalResult: 'APPROVED',
            userId: null
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
              { key: 'companyName', label: '', thStyle: 'text-align: left; width: 60%', class: 'text-left' },
              { key: 'userName', label: '', thStyle: 'font-weight: bold' },
              { key: 'createdAt', label: '', thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: '', thStyle: 'text-align: center', class: 'text-center' }
            ]
          },
          rota1: 'validacao-parceiro'
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
          this.filtro.userId = null
          this.filtro.favorite = null
          this.filtro.eventStatus = 'OPEN'
          this.onSearch()
        }
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ])
      },
      created () {
      },
      mounted () {
        this.onSearch()
      },
      methods: {
        quantidadePrimeiraFase () {
          let filtroQuantidade = {
            strategicPartnerName: null,
            eventStatus: 'OPEN',
            favorite: null,
            limit: 50,
            offset: 0,
            strategicPartnerApprovalType: 'FIRST_APPROVAL',
            userId: null
          }
          // Busca quantidade de registro por fase de validação
          axios.post('proxy/account/approval-strategic-partner/search', filtroQuantidade).then((response) => {
            this.quantidadesPrimeiraAprov = response.data.value.total
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        quantidadeSegundaFase () {
          let filtroQuantidade2 = {
            strategicPartnerName: null,
            eventStatus: 'OPEN',
            favorite: null,
            limit: 50,
            offset: 0,
            strategicPartnerApprovalType: 'SECOND_APPROVAL',
            userId: null
          }
          // Busca quantidade de registro por fase de validação
          axios.post('proxy/account/approval-strategic-partner/search', filtroQuantidade2).then((response) => {
            this.quantidadesSegundaAprov = response.data.value.total
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        quantidadeFinalizadas () {
          let filtroQuantidade3 = {
            strategicPartnerName: null,
            eventStatus: 'DONE',
            approvalResult: 'APPROVED',
            favorite: null,
            limit: 50,
            offset: 0,
            strategicPartnerApprovalType: 'SECOND_APPROVAL',
            userId: null
          }
          // Busca quantidade de registro por fase de validação
          axios.post('proxy/account/approval-strategic-partner/search', filtroQuantidade3).then((response) => {
            this.quantidadesFinalizadas = response.data.value.total
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
        buscaBackEnd (url) {
          axios.post(url, this.filtro).then((response) => {
            this.carregaTabela(response)
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
        onSearch () {
          this.loadingShow = true
          switch (this.faseAtual) {
            case 'primeira':
              this.filtro.strategicPartnerApprovalType = 'FIRST_APPROVAL'
              this.descricaoFase = 'Primeira Aprovação'
              this.filtro.eventStatus = 'OPEN'
              this.buscaBackEnd('proxy/account/approval-strategic-partner/search')
              break
            case 'segunda':
              this.filtro.strategicPartnerApprovalType = 'SECOND_APPROVAL'
              this.descricaoFase = 'Segunda Aprovação'
              this.filtro.eventStatus = 'OPEN'
              this.buscaBackEnd('proxy/account/approval-strategic-partner/search')
              break
            case 'finalizada':
              this.filtro.strategicPartnerApprovalType = 'SECOND_APPROVAL'
              this.descricaoFase = 'Finalizadas'
              this.filtro.eventStatus = 'DONE'
              this.buscaBackEnd('proxy/account/approval-strategic-partner/search')
              break
            default:
              this.faseAtual = 'primeira'
              this.filtro.strategicPartnerApprovalType = 'FIRST_APPROVAL'
              this.descricaoFase = 'Primeira Aprovação'
              this.filtro.eventStatus = 'OPEN'
              this.buscaBackEnd('proxy/account/approval-strategic-partner/search')
          }
          this.quantidadePrimeiraFase()
          this.quantidadeSegundaFase()
          this.quantidadeFinalizadas()
        },
        onFavorite (item) {
          let url = ''
          switch (this.faseAtual) {
            case 'primeira':
              url = 'proxy/account/approval-strategic-partner/'
              break
            case 'segunda':
              url = 'proxy/account/approval-strategic-partner/'
              break
          }
          axios.put(url + item.id + '/favorite', '').then((response) => {
            this.onSearch()
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        onAssign (item) {
          let url = ''
          switch (this.faseAtual) {
            case 'primeira':
              url = 'proxy/account/approval-strategic-partner/'
              break
            case 'segunda':
              url = 'proxy/account/approval-strategic-partner/'
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
        },
        onUnassign (item) {
          let url = ''
          switch (this.faseAtual) {
            case 'primeira':
              url = 'proxy/account/approval-strategic-partner/'
              break
            case 'segunda':
              url = 'proxy/account/approval-strategic-partner/'
              break
          }
          axios.put(url + item.id + '/unassign', '').then((response) => {
            this.onSearch()
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
