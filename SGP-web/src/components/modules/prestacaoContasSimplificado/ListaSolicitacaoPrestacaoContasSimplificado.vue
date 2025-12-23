<!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
<template>
    <div class="content-wrapper" style="min-height: 870px;">
        <section class="content-header ng-scope">
            <vue-headful :title="'SGP - Solicitações'"/>
            <h1>Gerenciador de Arquivos de Documentos Fiscais</h1>
            <b-breadcrumb :items="breadcrumb"/>
        </section>
        <div v-if="loading.show" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i></div>
        <div v-if="mostrarEmails" class="column all-centered prest-emails-container" @click="toggleEmails(false)">
          <prestacao-simplificada-emails :toggleEmails="toggleEmails" @click.stop></prestacao-simplificada-emails>
        </div>
        <section class="content ng-scope">
          <div class="prest-main-container">
            <div class="prest-header row-flex centered-between">
              <div class="box-header with-border">
                <h3 class="prest-box-title row-flex centered-start">Prestação de Contas <i class="fa fa-file" aria-hidden="true"></i></h3>
              </div>
              <div v-if="usuarioLogado.userType === 'FUNDACAO'" class="row-flex centered-start prest-header-emails" title="<h5>Verifica log de e-mails enviados</h5>" v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', placement: 'top'}" @click="toggleEmails(true)">
                <div>E-mails <i class="fa fa-envelope" aria-hidden="true"></i></div>
              </div>
            </div>
                <div class="column start-centered">
                    <div class="box-header">
                        <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Status de Prestação de Contas <span v-if="this.usuarioLogado.userType === 'FUNDACAO'"> do Processo Simplificado</span></h3>
                    </div>
                </div>
                <div class="box-body row-flex centered-start prest-row-input" v-if="usuarioLogado.userType === 'FUNDACAO'">
                    <div class="prest-input-group">
                        <div class="input-group"
                            :title="'<h5>Pesquise por nome, partes do nome, proposta ou número do projeto.<h5>'"
                            v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', placement: 'top'}">
                            <input v-model="pesquisa" @keyup.enter="onSearch" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa..." autofocus>
                            <span class="input-group-btn">
                                <button @click="onSearch()" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i>&nbsp;</button>
                            </span>
                        </div>
                    </div>
                </div>

                <b-container fluid>
                  <!-- Main table element -->
                  <b-table show-empty
                           stacked="md"
                           :bordered="true"
                           :items="table.items"
                           striped hover
                           :fields="table.fields"
                           :current-page="table.currentPage"
                           :per-page="table.perPage"
                           :filter="table.filter"
                           :sort-by.sync="table.sortBy"
                           :sort-desc.sync="table.sortDesc"
                           empty-text="Faça uma pesquisa acima"
                           table-layout: fixed
                  >
                  <template slot="data_atualizacao" scope="row">
                    <div v-if="row.item.data_atualizacao">
                      {{ row.item.data_atualizacao | moment('DD/MM/YYYY HH:mm:ss') }}
                    </div>
                    <div v-else>
                      Não iniciado.
                    </div>
                  </template>
                  <template slot="processos" scope="row">
                    <div v-if="row.value.length > 0">
                      <div v-for ="(item, index) in row.value" :key="index" class="column all-centered">
                        <div class="prest-item-processo">
                           <b>#{{ item.fk_processo }}</b> {{ item.situacao.replace('_', ' ') }}
                        </div>
                      </div>
                    </div> 
                    <div v-else>
                      Nenhum Processo encontrado.
                    </div>
                  </template>
                  <template slot="valor_liberado" scope="row">
                    <div v-if="row.item.valor_liberado">
                      {{row.value | real}}
                    </div>
                    <div v-else>
                      Nenhum Adiantamento encontrado.
                    </div>
                  </template>
                  <template slot="total_gravado" scope="row">
                    <div v-if="row.item.total_gravado">
                      {{row.value | real}}
                      <!-- {{row.value | real}} ({{ totalPorcentagem(row.item.total_gravado, row.item.valor_liberado) }}%) -->
                    </div>
                    <div v-else>
                      -
                    </div>
                  </template>
                  <template slot="ds_nome" scope="row">
                    <div class="column all-start">
                      <div>
                        <router-link :title="'<h5>Ir para a página do Projeto</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'small', arrow : true }" :to="{name: 'projeto', params: { numero: row.item.ds_codigo_projeto_erp }}" target="_blank">&nbsp<i class="fa fa-external-link"></i></router-link> [<b>{{ row.item.id }}</b>] {{ row.value }}
                      </div>
                      <div class="column all-end prest-item-entidade">
                        <b><router-link :title="'<h5>Ir para o Cadastro da entidade</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" :to="{name: 'cadastro-entidade-visualiza', params: { id: row.item.id_entidade }}" target="_blank"> <i class="fa fa-user"></i></router-link> {{ row.item.ds_cnpj_entidade | cnpj }}</b>
                        <i> {{ row.item.ds_nome_entidade }}</i> 
                      </div>
                    </div>
                  </template>
                  <template slot="status" scope="row">
                    <div v-if="row.item.data_atualizacao && !row.item.processos" class="prest-status-iniciado">
                      <b>Cadastro Iniciado</b>
                    </div>
                    <div v-if="row.item.processos && row.item.data_atualizacao" class="prest-status-tarefa">
                      Tarefa de Prestação de Contas
                    </div>
                    <div v-if="!row.item.data_atualizacao" class="prest-status-pendente">
                      <b>Pendente Cadastro</b>
                    </div>
                  </template>
                  <template slot="actions" scope="row">
                        <g-button-ujarak v-if="usuarioLogado.userType === 'ENTIDADE' && row.item.valor_liberado" color="primary" size="button--size-ss"  @click.native="editarGED(row.item)"><i class="fa fa-pencil-square-o" aria-hidden="true" ></i> Editar</g-button-ujarak>
                        <g-button-ujarak v-if="usuarioLogado.userType === 'FUNDACAO'" color="success" size="button--size-ss"  @click.native="editarGED(row.item)"><i class="fa fa-search" aria-hidden="true" ></i> Visualizar</g-button-ujarak>
                        <div v-if="usuarioLogado.userType === 'ENTIDADE' && !row.item.valor_liberado">
                          Sem parcela de Adiantamento.
                        </div>
                  </template>
                  </b-table>
                  <b-row class="row-flex all-end">
                    {{ table.totalRows }} registro(s) encontrado(s).
                  </b-row>
                  <b-row>
                    <b-col md="8" class="my-1" right>
                        <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
                    </b-col>
                  </b-row>
                </b-container>
            </div>
        </section>
    </div>
  </template>
  
  <script>
    import { mapGetters } from 'vuex'
    import moment from 'moment'
    import PrestacaoSimplificadaEmails from './PrestacaoSimplificadaEmails.vue'
    export default {
      components: {
        PrestacaoSimplificadaEmails
      },
      name: 'ListaSolicitacaoPrestacaoContasSimplificado',
      data () {
        return {
          loading: {
            show: false
          },
          prompt: '',
          mostrarEmails: false,
          moment: moment,
          table: {
            items: [],
            listaInicial: [],
            currentPage: 1,
            perPage: 10,
            totalRows: 0,
            pesquisa: '',
            sortBy: 'data_atualizacao',
            sortDesc: true,
            filter: null,
            emptyText: 'Não tem nenhum registro para mostrar',
            fields: [
                { key: 'ds_codigo_projeto_erp', label: 'Projeto', sortable: true, thStyle: 'width: 5%; text-align: center', class: 'text-center' },
                { key: 'ds_nome', label: 'Nome', sortable: true, thStyle: 'width: 40%; text-align: left', class: 'text-left' },
                { key: 'data_atualizacao', label: 'Atualizado em', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'valor_liberado', label: 'Parcelas Adiantamento', thStyle: 'text-align: center', class: 'text-center' },
                { key: 'total_gravado', label: 'Valor Registrado', thStyle: 'text-align: center', class: 'text-center' },
                { key: 'status', label: 'Situação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'processos', label: 'Tarefas', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
                { key: 'actions', label: 'Ações', thStyle: 'width: 10%; text-align: center', class: 'text-center' }
            ]
          },
          store: this.$store,
          breadcrumb: [{
            text: 'Inicial',
            href: '/'
          }, {
            text: 'Solcitações de Prestação de Conta',
            active: true
          }]
        }
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ]),
        chiefActive () {
          return this.usuarioLogado.entity.chiefs.some(chefe => {
            return chefe.active === true && moment(new Date()).isSameOrAfter(moment(chefe.initialMandateDate)) && moment(new Date()).isSameOrBefore(moment(chefe.endMandateDate))
          })
        }
      },
      created: function () {
      },
      mounted: function () {
        if (this.usuarioLogado.userType === 'FUNDACAO') {
          this.getListaInicial()
        } else {
          this.getListaInicialEntidade(this.usuarioLogado.entity.id)
        }
      },
      methods: {
        toggleEmails (valor) {
          this.mostrarEmails = valor
        },
        async getListaInicial () {
          console.log('CARREGANDO LISTA INICIAL...')
          this.loading.show = true
          await axiosLaravel.get('prestacaoSimplificada/getProjetos/').then((response) => {
            this.loading.show = false
            this.listaInicial = response.data
            this.table.items = _.cloneDeep(this.listaInicial)
            this.table.totalRows = response.data.length
          })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
        },
        async getListaInicialEntidade (idEntidade) {
          console.log('CARREGANDO LISTA INICIAL...')
          this.loading.show = true
          await axiosLaravel.get('prestacaoSimplificada/getProjetosEntidade/' + idEntidade).then((response) => {
            this.loading.show = false
            this.listaInicial = response.data
            this.table.items = _.cloneDeep(this.listaInicial)
            this.table.totalRows = response.data.length
          })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
        },
        editarGED (item) {
          console.log('EDITAR GED', item)
          this.$router.push({ name: 'prestacao-contas-simplificada-ged', params: { id: item.id } })
        },
        totalPorcentagem (valorParcela, totalRegistrado) {
          let total = 0
          if (valorParcela && totalRegistrado) {
            total = (parseFloat(valorParcela) / parseFloat(totalRegistrado)) * 100
          } else if (valorParcela && !totalRegistrado) {
            total = parseFloat(valorParcela) * 100
          } else {
            total = 0
          }
          // faz um pad de 2 casas decimais
          total = parseFloat(total).toFixed()
          return parseFloat(total)
        },
        onSearch () {
          this.table.items = this.listaInicial.filter(item => {
            return item.ds_codigo_projeto_erp.toLowerCase().includes(this.pesquisa.toLowerCase()) || item.ds_nome.toLowerCase().includes(this.pesquisa.toLowerCase() || item.ds_codigo_projeto_erp.toLowerCase().includes(this.pesquisa.toLowerCase()) || item.id.toString().includes(this.pesquisa.toLowerCase()))
          })
          this.table.totalRows = this.table.items.length
        }
      }
    }
  </script>
  
  <style src="../../../../static/css/prestacaoContasNovo.css">
  </style>
  