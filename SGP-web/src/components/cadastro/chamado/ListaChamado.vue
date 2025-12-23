<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Consulta de Chamados'"/>

    <div  class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Chamados</h1>
        <b-breadcrumb :items="[{
            text: 'Inicial',
            href: '/'
            }, {
            text: 'Lista',
            href: '#'
            }, {
            text: 'Chamados',
            active: true
            }]"/>
      </section>

      <!-- main content -->
      <section class="content">

        <div class="row">
          <div class="col-md-12">
            <div class=""><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-list" aria-hidden="true"></i> Consulta de Chamados</h3>
              </div>
              <div class="box-body" >
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <div class="row">
                  <div class="col-sm-offset-3 col-sm-5">
                    <div class="input-group">
                      <input v-model="table.filter" type="text" class="form-control" placeholder="Pesquisa...">
                      <span class="input-group-btn">
                          <button :disabled="!table.filter" @click="table.filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                        </span>
                    </div>
                    <br>
                    <div class="col-md-3" v-if="usuarioLogado.userType === 'FUNDACAO'" style="z-index: 9;">
                      Status:
                      <select v-model="listaStatus" class="form-control" name="abrangencia" v-validate="'required'" @change="buscaStatus(listaStatus)">
                        <option value=1>Aguardando Atendimento</option>
                        <option value=2>Em Atendimento</option>
                        <option value=3>Aguardando Avaliação</option>
                        <option value=4>Chamado Avaliado</option>
                        <option value=5>Chamado Encerrado</option>
                      </select>
                    </div>
                    <div class="col-md-4" v-if="usuarioLogado.userType === 'FUNDACAO'" style="z-index: 9; ">
                      Área Responsável:
                      <select v-model="areaResponsavel" class="form-control" name="abrangencia" v-validate="'required'" @change="buscaPorArea">
                        <option :value="area.area_responsavel" v-for="area in areas">{{area.area_responsavel}}</option>
                      </select>
                    </div>
                    <div class="col-md-4" v-if="usuarioLogado.userType === 'FUNDACAO'" style="z-index: 9;">
                      Carteira:
                      <select v-model="carteira" class="form-control" name="carteira" v-validate="" @change="buscaPorCarteira">
                        <option :value="carteira" v-for="carteira in carteiras"> {{ carteira }}</option>
                      </select>
                    </div>
                    <div class="col-md-4" v-if="usuarioLogado.userType === 'FUNDACAO'" style="z-index: 9;">
                      Analista:
                      <select v-model="usuarioSelecionado" class="form-control" name="usuario" @change="buscaStatus(usuarioSelecionado)">
                        <option :value="usu.id" v-for="usu in usuarios">{{usu.ds_nome_usuario}}</option>
                      </select>
                    </div>
                    <div class="alinhar" v-if="usuarioLogado.userType === 'FUNDACAO'">
                      <button @click="limpaFiltros" type="button"  class="btn btn-default btn-flat"
                       :title="'<h5>' + '<span style=\'color: #7adddd\'> Limpar todos os filtros </span> </h5>'"
                       v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right" }'>
                       <i class="fa fa-eraser" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                  <!--Campo de pesquisa-->
                  <div class="col-sm-3" style="position: relative; right: -50px; top: -15px;" v-if="usuarioLogado.userType === 'FUNDACAO'">
                    <table width="90%" height="80%" style="opacity:0.8;" id="table-delegate">
                      <caption style="text-align:center; color: #0f7b9f"><b>Total de Chamados por Status</b></caption>
                      <thead>
                      <tr>
                        <th class="text-center" style="text-align: center; width: 13%;">Status</th>
                        <th class="text-center" style="text-align: center; width: 13%;">Quantidade de Chamados</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="chamado in quantidadeChamadosResult">
                        <td class="text-center" style="text-align: center; width: 13%;">{{chamado.status}}</td>
                        <td class="text-center" style="text-align: center; width: 13%;">{{chamado.quantidade}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="col-sm-6" style="position: relative; right: -50px; top: -140px;" v-if="usuarioLogado.userType === 'FUNDACAO' && meusChamados === false">
                    <div>
                      <br>
                      Olá, <b>{{this.usuarioLogado.ds_nome_usuario}}</b>.
                      <br>
                      Você tem <span style="color: red"><b> {{qtdMeusChamados}} </b></span> <span v-if="qtdMeusChamados === 1">chamado </span> <span v-else>chamados </span> em seu nome.
                      <br>
                      <!--<span @click="filtraMeusChamados" style="color: #0a568c;cursor: pointer;"> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp - Listar meus chamados - </span>-->
                      <div><span @click="filtraMeusChamados" style="color: #0a568c;cursor: pointer;"> <i class="fa fa-user"></i>&nbsp;&nbsp;&nbsp;Mostrar Meus Chamados</span></div>
                      <!--<div><span @click="filtraChamadosMinhaArea" style="color: #0a568c;cursor: pointer;"> <i class="fa fa-users"></i> &nbsp;Mostrar Chamados Minha Área</span></div>-->
                    </div>
                  </div>
                  <div class="col-sm-6" style="position: relative; right: -50px; top: -140px;" v-if="usuarioLogado.userType === 'FUNDACAO' && meusChamados === true">
                    <div>
                      <br>
                      Olá, <b>{{this.usuarioLogado.ds_nome_usuario}}</b>.
                      <br>
                      Você tem <span style="color: red"><b> {{qtdMeusChamados}} </b></span> <span v-if="qtdMeusChamados === 1">chamado </span> <span v-else>chamados </span> em seu nome.
                      <br>
                      <!--<span @click="filtraMeusChamados" style="color: #0a568c;cursor: pointer;"> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp - Listar meus chamados - </span>-->
                      <div><span @click="filtraMeusChamados" style="color: #0a568c;cursor: pointer;"> <i class="fa fa-user"></i>&nbsp;&nbsp;&nbsp;Mostrar Meus Chamados</span></div>
                      <!--<div><span @click="filtraChamadosMinhaArea" style="color: #0a568c;cursor: pointer;"> <i class="fa fa-users"></i> &nbsp;Mostrar Chamados Minha Área</span></div>-->
                    </div>
                  </div>
                  <!--Lista de Chamados FBB-->
                  <div class="col-sm-12" style="position: relative; top: -50px;" v-if="usuarioLogado.userType === 'FUNDACAO'">
                    <b-container fluid>
                      <!-- Main table element -->
                      <b-table show-empty
                               stacked="md"
                               ref="table"
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

                        <template slot="bt_ativo" scope="row">
                          <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                        </template>
                        <template slot="data_inclusao" scope="row">{{row.value | moment("L")}}</template>
                        <template slot="projeto" scope="row">
                          <div   :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'ID:  ' + '</span>' + row.item.processo_id + '</h5>'" v-if="row.item.processo_id"
                                 v-tippy='{ inertia : true, arrow : true,  animation : "perspective", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "left" }'>
                            {{row.value}}
                          </div>
                          <div v-if="!row.item.processo_id">
                            {{row.value}}
                          </div>

                        </template>
                        <template slot="status.status" scope="row">
                          <span style="color: #f40022" v-if="row.value === 'Aguardando Atendimento'">{{row.value}}</span>
                          <span style="color: #67af6a" v-if="row.value === 'Em Atendimento'">{{row.value}}</span>
                          <span style="color: #00569f" v-if="row.value === 'Aguardando Avaliação'">{{row.value}}</span>
                          <span style="color: #000c9f" v-if="row.value === 'Chamado Avaliado'">{{row.value}}<br><span style="color: #a0a0a0; font-size: small">(Aguardando Encerramento)</span></span>
                          <span style="color: #020202" v-if="row.value === 'Chamado Encerrado'"
                                :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'Data de Encerramento:  ' + '</span>' + formata(row.item.data_encerramento) + '</h5>'"
                                v-tippy='{ inertia : true, arrow : true,  animation : "perspective", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "left" }'
                          >{{row.value}}</span>
                        </template>
                        <template slot="descricao" scope="row">
                          <div   :title="'<h5>' + row.value + '</h5>'"
                                 v-tippy='{ inertia : true, arrow : true,  animation : "perspective", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "left" }'>
                            <span v-if="row.value.length > 50">{{row.value.substring(0,50) + "..."}}</span><span v-else>{{row.value}}</span>
                          </div>
                        </template>
                        <template slot="data_encerramento" scope="row">{{row.value | moment("L")}}</template>
                        <template slot="dt_atualizado" scope="row">{{row.value | moment("L")}}</template>
                        <template slot="actions" scope="row">
                          <div>
                            <b-button type="button" :disabled="false" :to="{name: 'cadastro-chamado-edita', params: { id: row.item.id }}" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Entrar</b-button>
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
                  <!--Lista de Chamados FBB-->
                  <div class="col-sm-12" style="position: relative; top: 30px;" v-if="usuarioLogado.userType === 'ENTIDADE'">
                    <b-container fluid>
                      <!-- Main table element -->
                      <b-table show-empty
                               stacked="md"
                               ref="table"
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

                        <template slot="bt_ativo" scope="row">
                          <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                        </template>
                        <template slot="data_inclusao" scope="row">{{row.value | moment("L")}}</template>
                        <template slot="projeto" scope="row">
                          <div   :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'ID:  ' + '</span>' + row.item.processo_id + '</h5>'" v-if="row.item.processo_id"
                                 v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right" }'>
                            {{row.value}}
                          </div>
                          <div v-if="!row.item.processo_id">
                            {{row.value}}
                          </div>

                        </template>
                        <template slot="carteira" scope="row">{{row.value}}</template>
                        <template slot="status.status" scope="row">
                          <span style="color: #f40022" v-if="row.value === 'Aguardando Atendimento'">{{row.value}}</span>
                          <span style="color: #67af6a" v-if="row.value === 'Em Atendimento'">{{row.value}}</span>
                          <span style="color: #00569f" v-if="row.value === 'Aguardando Avaliação'">{{row.value}}</span>
                          <span style="color: #000c9f" v-if="row.value === 'Chamado Avaliado'">{{row.value}}<br><span style="color: #a0a0a0; font-size: small">(Aguardando Encerramento)</span></span>
                          <span style="color: #020202" v-if="row.value === 'Chamado Encerrado'">{{row.value}}</span>
                        </template>
                        <template slot="descricao" scope="row">
                          <div   :title="'<h5>' + row.value + '</h5>'"
                                 v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right" }'>
                            <span v-if="row.value.length > 50">{{row.value.substring(0,50) + "..."}}</span><span v-else>{{row.value}}</span>
                          </div>
                        </template>
                        <template slot="data_encerramento" scope="row">{{row.value | moment("L")}}</template>
                        <template slot="dt_atualizado" scope="row">{{row.value | moment("L")}}</template>
                        <template slot="actions" scope="row">
                          <div>
                            <b-button type="button" :disabled="false" :to="{name: 'cadastro-chamado-edita', params: { id: row.item.id }}" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Entrar</b-button>
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
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  export default {
    name: 'lista-chamado',
    data () {
      return {
        loading: {
          show: false
        },
        carteira: '',
        carteiras: [
          'AABB Comunidade',
          'Ajuda Humanitária',
          'Educação',
          'Esporte e Cultura',
          'Geração de Renda',
          'Meio Ambiente',
          'Saúde e Bem-Estar',
          'Voluntariado'
        ],
        qtdMeusChamados: 0,
        listaStatus: 0,
        areaResponsavel: '',
        usuarioSelecionado: 0,
        usuarios: [],
        meusChamados: false,
        areas: [],
        usu: {},
        filtro: '',
        // areasFBB: [
        //     {id: 1, nome: 'Gerência de Implementação e Assessoria de Projetos', uor: 341860},
        //     {id: 2, nome: 'Gerência de Prospecção e Análise de Projetos', uor: 529170},
        //     {id: 3, nome: 'Gerência de Marketing e comunicação', uor: 341857},
        //     {id: 4, nome: 'Gerência de Monitoramento e Avaliação', uor: 341861}],
        table: {
          items: [],
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          fields: [
            { key: 'id', label: 'Número do Chamado', sortable: true, thStyle: 'text-align: center; width: 7%', class: 'text-center' },
            { key: 'data_inclusao', label: 'Data Abertura', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
            { key: 'projeto', label: 'Projeto', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center' },
            { key: 'carteira', label: 'Carteira', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center' },
            { key: 'status.status', label: 'Status', sortable: true, thStyle: 'text-align: center; width: 13%', class: 'text-center' },
            { key: 'assunto.assunto', label: 'Assunto', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
            { key: 'assunto.area_responsavel', label: 'Área Responsável', sortable: true, thStyle: 'text-align: center; width: 17%', class: 'text-center' },
            { key: 'descricao', label: 'Descrição do Chamado', sortable: true, thStyle: 'text-align: center; width: 20%', class: 'text-center' },
            { key: 'usuario_atendimento.ds_nome_usuario', label: 'Analista', sortable: true, thStyle: 'text-align: center; width: 21%', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'urlLaravel',
        'usuarioLogado'
      ])
    },
    mounted () {
      let vm = this
      $('#table-delegate').on('click', 'tr', function (e) {
        let obj = e.target
        this.filtro = $(obj).text()
        vm.table.filter = this.filtro
      })
      // if (vm.usuarioLogado.uor === 341862) {
      //   vm.table.filter = 'Gerência de Pagamentos e Contratações'
      // }
      // if (vm.usuarioLogado.uor === 341860) {
      //   vm.table.filter = 'Gerência de Monitoramento'
      // }
      // if (vm.usuarioLogado.uor === 341861) {
      //   console.log('caiu aqui')
      //   vm.table.filter = 'Gerência de Análise e Avaliação'
      // }
      // if (vm.usuarioLogado.uor !== 341860 && vm.usuarioLogado.uor !== 341861 && vm.usuarioLogado.uor !== 341862) {
      //   vm.table.filter = ''
      // }
    },
    created () {
      this.loading.show = true
      if (this.usuarioLogado.userType === 'FUNDACAO') {
        this.quantidadeMeusChamados()
      }
      this.listaAreas()
      this.quantidadeChamados()
      this.buscaUsuarios()
      axiosLaravel.get('chamado/').then((response) => {
        this.table.items = this.limitarAcessoProjetos(response.data)
        this.table.totalRows = response.data.length
        this.loading.show = false
      })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
        })
      this.$forceUpdate()
    },
    methods: {
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      formata (row) {
        return moment(row).format('DD/MM/YYYY')
      },
      buscaPorArea () {
        let vm = this
        vm.table.filter = this.areaResponsavel
      },
      buscaPorCarteira () {
        let vm = this
        vm.table.filter = this.carteira
      },
      quantidadeMeusChamados () {
        axiosLaravel.post('chamado/buscaStatus', {
          'analista': this.usuarioLogado.id
        }).then((response) => {
          this.qtdMeusChamados = _.toArray(response.data).length
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      filtraMeusChamados () {
        this.meusChamados = true
        this.loading.show = true
        this.quantidadeChamadosUsuario()
        axiosLaravel.post('chamado/buscaStatus', {
          'analista': this.usuarioLogado.id
        }).then((response) => {
          this.table.items = this.limitarAcessoProjetos(_.toArray(response.data))
          this.table.totalRows = this.table.items.length
          this.$forceUpdate()
          this.$refs.table.refresh()
          this.loading.show = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      filtraChamadosMinhaArea () {
        this.loading.show = true
        this.quantidadeChamadosMinhaArea()
        axiosLaravel.post('chamado/buscaMinhaArea', {
          'uor': this.usuarioLogado.uor
        }).then((response) => {
          this.table.items = this.limitarAcessoProjetos(_.toArray(response.data))
          this.table.totalRows = this.table.items.length
          this.$forceUpdate()
          this.$refs.table.refresh()
          this.loading.show = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      buscaStatus (parm) {
        if (this.listaStatus > 0 && this.usuarioSelecionado > 0) {
          this.loading.show = true
          axiosLaravel.post('chamado/buscaStatus', {
            'status': this.listaStatus,
            'analista': this.usuarioSelecionado
          }).then((response) => {
            this.table.items = this.limitarAcessoProjetos(_.toArray(response.data))
            this.table.totalRows = this.table.items.length
            this.$forceUpdate()
            this.$refs.table.refresh()
            this.loading.show = false
          })
            .catch((error) => {
              this.$root.trataErro(error)
              this.loading.show = false
            })
        } else if (this.usuarioSelecionado > 0) {
          this.loading.show = true
          axiosLaravel.post('chamado/buscaStatus', {
            'analista': this.usuarioSelecionado
          }).then((response) => {
            this.table.items = this.limitarAcessoProjetos(_.toArray(response.data))
            this.table.totalRows = this.table.items.length
            this.$forceUpdate()
            this.$refs.table.refresh()
            this.loading.show = false
          })
            .catch((error) => {
              this.$root.trataErro(error)
              this.loading.show = false
            })
        } else if (this.listaStatus > 0) {
          this.loading.show = true
          axiosLaravel.post('chamado/buscaStatus', {
            'status': this.listaStatus
          }).then((response) => {
            this.table.items = this.limitarAcessoProjetos(_.toArray(response.data))
            this.table.totalRows = this.table.items.length
            this.$forceUpdate()
            this.$refs.table.refresh()
            this.loading.show = false
          })
            .catch((error) => {
              this.$root.trataErro(error)
              this.loading.show = false
            })
        }
        this.$forceUpdate()
        this.$refs.table.refresh()
      },
      limitarAcessoProjetos (lista) {
        // Limitar acesso a projetos
        let listaProjetos = lista
        let acessosProjetos = _.get(this.usuarioLogado, 'configuracoes.acesso_projetos')
        if (acessosProjetos) {
          acessosProjetos.forEach((projeto) => {
            if (_.find(projeto.acesso, ['codigo', 'SEM_ACESSO'])) {
              _.remove(listaProjetos, ['projeto', projeto.numero])
            }
          })
        }
        return listaProjetos
      },
      buscaUsuarios () {
        axiosLaravel.post('chamado/buscaUsuarios').then((response) => {
          this.usuarios = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      listaAreas () {
        axiosLaravel.post('chamado/listaAreas').then((response) => {
          this.areas = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      quantidadeChamados () {
        axiosLaravel.post('chamado/quantidadeChamados').then((response) => {
          this.quantidadeChamadosResult = response.data
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      quantidadeChamadosUsuario () {
        axiosLaravel.post('chamado/quantidadeChamadosUsuario').then((response) => {
          this.quantidadeChamadosResult = response.data
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      quantidadeChamadosMinhaArea () {
        axiosLaravel.post('chamado/quantidadeChamadosMinhaArea').then((response) => {
          this.quantidadeChamadosResult = response.data
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      limpaFiltros () {
        this.meusChamados = false
        this.listaStatus = 0
        this.usuarioSelecionado = 0
        this.table.filter = ''
        this.areaResponsavel = ''
        this.carteira = ''
        this.loading.show = true
        this.quantidadeChamados()
        axiosLaravel.get('chamado/').then((response) => {
          this.table.items = this.limitarAcessoProjetos(response.data)
          this.loading.show = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      }
    }
  }
</script>

<style scoped>
  .alinhar {
    float: right;
    margin-left: -30%;
    margin-top: 19px;
  }
  table, th, td {
    border: 1px solid lightgrey;
  }
</style>
