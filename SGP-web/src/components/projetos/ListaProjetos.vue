<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Projetos'"/>

    <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>Projetos</h1>
        <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Projeto', href: '#'}, {text: 'Lista', active: true}]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">

        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-rocket" aria-hidden="true"></i> Projetos <span v-if="!loading.show" style="font-size: small; color: var(--cor-fraca)">{{tableProjetos.totalRows}} localizado(s)</span></h3>
              </div>
              <div class="box-body" >
                <!--Formulario de pesquisa-->
                <div class="row">
                  <div class="box-body">
                    <div class="form-horizontal">

                      <div :class="(usuarioLogado.userType === 'FUNDACAO' ? 'col-md-offset-3 col-md-5' : 'col-md-offset-4 col-md-5')">
                        <div class="col-md-12">
                          <div class="input-group">
                            <input v-model="pesquisa" type="text" class="form-control" placeholder="Pesquisa..." v-on:keyup="ajustaPesquisa">
                            <span class="input-group-btn">
                              <button :disabled="!tableProjetos.filter" @click="tableProjetos.filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4" v-if="usuarioLogado.userType === 'FUNDACAO'">
                        <label class="control-label col-md-4">Carteira:</label>
                        <div class="col-md-8">
                          <select v-model="carteiraSelecionada" class="form-control" @change="selecionaCarteira" :value="configuracoes.tela_projetos.codigoCarteira">
                            <option :value="null">Todos os projetos</option>
                            <option v-for="carteira in listaCarteiras" :value="carteira.usu_codcart">{{carteira.usu_nomcart}}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!--Lista de Propostas-->
                <div class="box-body">
                  <b-container fluid>
                    <!-- Main table element -->
                    <b-table show-empty
                             stacked="md"
                             striped
                             :bordered="tableProjetos.bordered"
                             :items="itemsProjetos"
                             :fields="fieldsProjetos"
                             :current-page="tableProjetos.currentPage"
                             :per-page="tableProjetos.perPage"
                             :filter="tableProjetos.filter"
                             :filter-function="filtroPorItem"
                             @filtered="onFiltered"
                             empty-filtered-text="Nada foi encontrado. Refaça sua pesquisa!"
                             empty-text="Nenhum registro encontrado"
                             :sort-by.sync="tableProjetos.sortBy"
                             :sort-desc.sync="tableProjetos.sortDesc"
                    >

                      <template slot="actions" scope="row">
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'projeto', params: { numero: row.item.ds_codigo_projeto_erp }})"> <i class="fa fa-rocket" aria-label="false"></i> Projeto</g-button-ujarak >
                        <g-button-ujarak color="primary" v-if="usuarioLogado.userType !== 'PARCEIRO_ESTRATEGICO'" size="button--size-ss" @click.native="$router.push({name: 'visualiza-relatorio-execucao', params: { id: row.item.id }})"> <i class="fa fa-calendar-check-o" aria-label="false"></i> Relatório</g-button-ujarak >
                        <!-- Demanda 65971 inclusão da Emissão de Documentos pré-preenchidos -->
                        <g-button-ujarak title="Gerar documentos" color="primary" v-if="usuarioLogado.userType !== 'PARCEIRO_ESTRATEGICO'" size="button--size-ss" @click.native="$router.push({name: 'emissao-documentos', params: { numero: row.item.ds_codigo_projeto_erp }})"> <i class="fa fa-file" aria-label="false"></i></g-button-ujarak >
                        <g-button-ujarak color="primary" v-if="usuarioLogado.userType !== 'PARCEIRO_ESTRATEGICO' && row.item.qtdeAvaliacoesProjeto > 0" size="button--size-ss"
                                         @click.native="row.toggleDetails()">
                          <i class="fa fa-pencil" aria-label="false"></i>
                          {{row.item.qtdeAvaliacoesProjeto}} {{row.item.qtdeAvaliacoesProjeto > 1 ? 'Avaliações' : 'Avaliação'}}
                        </g-button-ujarak >
                      </template>

                      <template slot="row-details" scope="row">
                        <avaliacoes-projeto :numeroProjeto="row.item.ds_codigo_projeto_erp" :editavel="true"></avaliacoes-projeto>
                      </template>

                    </b-table>
                    <b-row>
                      <b-col md="6" class="my-1" right>
                        <b-pagination :total-rows="tableProjetos.totalRows" :per-page="tableProjetos.perPage" v-model="tableProjetos.currentPage" class="my-3" />
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
      </section>
    </div>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import AvaliacoesProjeto from '../modules/avaliacoesProjeto'

  export default {
    components: {
      AvaliacoesProjeto
    },
    name: 'lista-projetos',
    data () {
      return {
        data: [],
        loading: {
          show: false
        },
        itemsProjetos: [],
        items: [],
        configuracoes: {
          tela_projetos: {
            codigoCarteira: null
          }
        },
        listaCarteiras: [],
        carteiraSelecionada: null,
        pesquisa: '',
        filtrosProjetos: {
          createdAt: null
        },
        filtros: {
          createdBy: null
        },
        fieldsProjetos: [
            { key: 'ds_codigo_projeto_erp', label: 'Nº Projeto', thStyle: 'width: 100px; text-align: center', sortable: true, 'class': 'text-center' },
            { key: 'ds_nome', label: 'Projeto', thStyle: 'text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
            { key: 'usu_nomcart', label: 'Carteira', thStyle: 'width: 150px; text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
            { key: 'actions', label: 'Acessar:', thStyle: 'width: 300px; text-align: center', 'class': 'text-center' }
        ],
        tableProjetos: {
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'createdAt',
          sortDesc: true,
          filter: null,
          bordered: true
        },
        store: this.$store
      }
    },
    computed: {
      mounted: function () {
        // this.buscaProjetos()
      },
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created: function () {
      if (this.usuarioLogado.userType !== 'FUNDACAO') {
        _.remove(this.fieldsProjetos, function (campo) { return campo.key === 'usu_nomcart' })
      }
      this.buscaProjetos()
      this.$snotify.async('Buscando projetos. Por favor, aguarde...', {timeout: 0})
    },
    methods: {
      buscaProjetos () {
        this.itemsProjetos = null
        this.loading.show = true
        axiosLaravel.get('projetos').then((response) => {
          this.$snotify.clear()
          // Limitar acesso a projetos
          let listaProjetos = response.data
          let acessosProjetos = _.get(this.usuarioLogado, 'configuracoes.acesso_projetos')
          if (acessosProjetos) {
            acessosProjetos.forEach((projeto) => {
              if (_.find(projeto.acesso, ['codigo', 'SEM_ACESSO'])) {
                _.remove(listaProjetos, ['ds_codigo_projeto_erp', projeto.numero])
              }
            })
          }
          this.itemsProjetos = listaProjetos
          this.cleanItemsProjetos = this.itemsProjetos
          this.loading.show = false
          this.tableProjetos.totalRows = this.itemsProjetos.length
          if (this.usuarioLogado.userType === 'FUNDACAO') {
            this.carregarListaCarteiras()
          }
          this.$snotify.success('Projetos carregados com sucesso!', {timeout: 1000})
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onFiltered (filteredItems) {
        this.tableProjetos.totalRows = filteredItems.length
        this.tableProjetos.currentPage = 1
      },
      ajustaPesquisa () {
        // Para o b-table uma string vazia significa "não pesquise", então para efeito de forçar pesquisa deve sempre ter um valor quando for ''
        this.tableProjetos.filter = (_.isNull(this.pesquisa) || this.pesquisa === '') ? 'retornar_todos_projetos' : this.pesquisa
      },
      filtroPorItem (row, filter) {
        let saida = true
        if (!_.isNull(this.carteiraSelecionada) && _.isNumber(this.carteiraSelecionada)) { // Se tem algo setado na carteira, então use para filtrar
          saida = (row.usu_codcart === this.carteiraSelecionada)
        }
        if (filter !== 'retornar_todos_projetos') { // Se receber a string para filtrar tudo, então retorna o filtro como '' e não acrescenta a pesquisa por termo
          // Adiciona a filtragem se a string consta de número ou nome de projeto
          let termo = _.toLower(filter)
          saida = saida && (_.toLower(row.ds_codigo_projeto_erp).indexOf(termo) !== -1 || _.toLower(row.ds_nome).indexOf(termo) !== -1)
        }
        return saida
      },
      selecionaCarteira () {
        // if (_.isNull(this.pesquisa) || this.pesquisa === '') {
        //   // this.ajustaPesquisa()
        // } else {
        //   // let termo = this.tableProjetos.filter
        //   // this.tableProjetos.filter = ' '
        //   // this.$forceUpdate()
        //   // this.tableProjetos.filter = termo
        // }
        if (_.isNull(this.carteiraSelecionada)) {
          this.itemsProjetos = this.cleanItemsProjetos
        } else {
          // usu_ncodcart
          this.itemsProjetos = this.cleanItemsProjetos.filter(item =>
          item.usu_ncodcart === this.carteiraSelecionada)
        }
        this.configuracoes.tela_projetos.codigoCarteira = this.carteiraSelecionada
        this.salvarConfiguracoes()
      },
      carregarListaCarteiras () {
        this.loading.show = true
        axiosLaravel.get('carteira/lista').then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.listaCarteiras = response.data.retorno
            this.configuracoes.tela_projetos.codigoCarteira = _.get(this.usuarioLogado, 'configuracoes.tela_projetos.codigoCarteira') || null
            console.log('carrega carteiras this.configuracoes', this.configuracoes)
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.loading.show = false
        })
          .catch((error) => {
            this.loading.show = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      salvarConfiguracoes () {
        _.set(this.usuarioLogado, 'configuracoes', this.configuracoes)
        axiosLaravel.post('/usuario/configuracoes', {'configuracoes': this.usuarioLogado.configuracoes}).then((response) => {
          console.log('configuracoes', this.usuarioLogado.configuracoes)
        })
          .catch((error) => {
            if (error) {
              console.log('error', error)
              this.$root.trataErro(error)
            }
          })
      },
      onVisualizate (row) {
      }
    }
  }
</script>

<style scoped>
  small {
    display: block;
  }
  .lowercase {
    text-transform: none
  }
</style>
