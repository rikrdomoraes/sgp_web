<template>
      <div class="content-wrapper listaPropostas" style="min-height: 870px;">
        <vue-headful title="SGP - Listagem de Propostas"/>
          <div ng-view="" class="fade-transition ng-scope"><!-- content header (page header) -->
          <section class="content-header ng-scope">
            <h1>Propostas</h1>
            <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Proposta', href: '#'}, {text: 'Lista', active: true}]"/>
          </section>

          <!-- main content -->
          <section class="content ng-scope">

            <div class="row">
              <div class="col-md-12">
               <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
                <div class="box-header with-border">
                  <h3 class="box-title"><i class="fa fa-list" aria-hidden="true"></i> Lista de Propostas</h3>
                </div>
                <div class="box-body" >
                  <!--Formulario de pesquisa-->
                  <div class="row collapse in" aria-expanded="true" aria-hidden="false" style="width: inherit; height: auto;">

                    <div class="col-md-2">
                      <download-excel :data="_.filter(json_data, function(p) { return _.includes(_.toLower(p.NomeEntidade + p.ds_nome + p.ds_fase + p.ds_numero_edital), _.toLower(table.filter)) })" :meta="json_meta" type="xls" :fields="json_fields" name="propostas.xls">
                        <g-button-ujarak color="warning" size="button--size-ss"><i aria-hidden="true" class="fa fa-download"></i> Exportar para Excel</g-button-ujarak>
                      </download-excel>
                    </div>

                    <div class="col-md-8">
                      <form name="frmSearch" id="filtroProposta" class="form-horizontal ng-pristine ng-valid ng-valid-mask ng-valid-maxlength ng-valid-date" novalidate="">
                        <div class="form-group">
                          <!-- Busca de propostas -->
                          <div class="col-sm-offset-2 col-md-8">
                            <div class="input-group">
                              <input v-model="table.filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
                              <span class="input-group-btn">
                                <button :disabled="!table.filter" @click="table.filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                              </span>
                            </div>
                            <!--<div class="input-group">-->
                              <!--<input v-model="termoPesquisa" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">-->
                              <!--<span class="input-group-btn">-->
                                <!--<button :disabled="termoPesquisa.length == 0" @click="pesquisaFiltro" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>-->
                              <!--</span>-->
                            <!--</div>-->
                          </div>
                        </div>
                      </form>
                    </div>

                    <div class="col-md-2 text-right">
                      <g-button-ujarak onclick="location.reload(true)" color="success" size="button--size-ss"><i aria-hidden="true" class="fa fa-refresh"></i> Atualizar Lista</g-button-ujarak>
                    </div>

                  </div>
                  <!--Lista de Propostas-->
                  <div class="row">
                    <b-container fluid>
                      <!-- Main table element -->
                      <b-table show-empty
                               stacked="md"
                               :bordered="table.bordered"
                               :items="table.items"
                               :hover="table.hover"
                               :fields="table.fields"
                               :filter="table.filter"
                               :current-page="table.currentPage"
                               :per-page="table.perPage"
                               :sort-by.sync="table.sortBy"
                               :sort-desc.sync="table.sortDesc"
                               empty-text="Nenhum registro encontrado"
                      >
                        <template slot="ds_numero_edital" scope="row">{{row.value === '' ? 'Prospecção Direta' : row.value}}</template>
                        <template slot="NomeEntidade"  scope="row"><span v-if="usuarioLogado.userType === 'FUNDACAO'" class="esmaecido">[ <b>{{ row.item.id }}</b> ]</span><span class="esmaecido"> {{row.item.ds_cnpj | cnpj}}</span> {{row.value}} </template>
                        <template slot="dt_criado" scope="row">{{row.value | moment("L")}}</template>
                        <template slot="ds_fase" scope="row">
                          <!-- Editais --------------------------------------------------------------------------------------------------------------->
                          <span v-if="ehEdital(row.item)">
                            <span v-if="_.includes(['CADASTRO', 'REVISAO', '', 'ANALISE'], row.value)">
                              <span v-if="!ehEditalAtivoNaoFinalizado(row.item)">Edital finalizado</span>
                              <span v-if="ehEditalAtivoNaoFinalizado(row.item)">Edital em andamento</span>
                              <span v-if="!ehEditalAtivoNaoFinalizado(row.item) &&  _.includes(['ANALISE'], row.value) && usuarioLogado.userType === 'FUNDACAO'">
                                <router-link :to="{name: 'proposta-edita', params: { id: row.item.id, processo: row.item.ds_fase }}">{{ enumeradores[row.value] }}</router-link>
                              </span>
                              <span v-if="!ehEditalAtivoNaoFinalizado(row.item) &&  _.includes(['REVISAO'], row.value) && usuarioLogado.userType === 'FUNDACAO'">
                                <br>
                                <router-link :to="{name: 'proposta-edita', params: { id: row.item.id, processo: row.item.ds_fase }}">{{ enumeradores[row.value] }}</router-link>
                              </span>
                            </span>
                            <span v-else :class="_.includes(['ANULACAO', 'ANULADO'], row.value) ? 'text-red' : (_.includes(['APROVADO'], row.value) ? 'text-green' : '')">
                              <span v-if="usuarioLogado.userType === 'FUNDACAO' && !_.includes(['ANULACAO', 'ANULADO', 'APROVADO'], row.value) && !editalComLimitacaoAcesso()">
                                <router-link :to="{name: 'proposta-edita', params: { id: row.item.id, processo: row.item.ds_fase }}">{{ enumeradores[row.value] }}</router-link>
                              </span>
                              <span v-else>{{ enumeradores[row.value] }}</span>
                            </span>
                          </span>
                          <!-- Prospeção direta ----------------------------------------------------------------------------------------------------->
                          <span v-else :class="_.includes(['ANULACAO', 'ANULADO'], row.value) ? 'text-red' : (_.includes(['APROVADO'], row.value) ? 'text-green' : '')">
                            <span v-if="usuarioLogado.userType === 'FUNDACAO' && !_.includes(['ANULACAO', 'ANULADO', 'APROVADO'], row.value)">
                              <router-link :to="{name: 'proposta-edita', params: { id: row.item.id, processo: row.item.ds_fase }}">{{ enumeradores[row.value] }}</router-link>
                            </span>
                            <span v-else>{{ enumeradores[row.value] }}</span>
                          </span>
                        </template>

                        <template slot="actions" scope="row">
                          <span v-if="!ehEdital(row.item) || (ehEdital(row.item) && ((ehEditalAtivoNaoFinalizado(row.item) && usuarioLogado.userType !== 'FUNDACAO') || (!ehEditalAtivoNaoFinalizado(row.item) && usuarioLogado.userType === 'FUNDACAO')))">
                            <g-button-ujarak color="primary" target="_blank" size="button--size-ss" :disabled="false" @click.native="$router.push({name: 'imprimir-proposta', params: { id: row.item.id }})"
                                             :title="'<h5>Mostra uma versão para impressão do que já foi preenchida da proposta</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                              <i class="fa fa-file-text" aria-hidden="true"></i> Versão para impressão 
                            </g-button-ujarak>
                            <g-button-ujarak v-if="ehEdital(row.item) && (ehEditalAtivoNaoFinalizado(row.item) && usuarioLogado.userType !== 'FUNDACAO') && row.item.ds_fase === 'ANALISE'" color="error" size="button--size-ss" @click.native="alteraTarefaPropostaEdital(row.item)" class="btn-primary" style="margin-top: 10px">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Revisar Proposta
                            </g-button-ujarak>

                            <div v-if="($root.authorize('proposta-cadastro-completo') || $root.authorize('minha-proposta-editar')) && (_.includes(['CADASTRO', 'REVISAO', ''], row.item.ds_fase) || _.isNull(row.item.ds_fase))">
                              <div >
                                <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'proposta-edita', params: {id: row.item.id}})" class="btn-primary" style="margin-top: 10px">
                                  <i class="fa fa-pencil-square-o" aria-hidden="true"></i> {{ row.item.ds_fase === 'CADASTRO' || _.isNull(row.item.ds_fase) ? 'Editar' : (row.item.ds_fase === 'REVISAO' ? 'Revisar' : '') }}
                                </g-button-ujarak>

                                <g-button-ujarak color="error" size="button--size-ss" v-if="row.item.ds_fase === 'ANALISE'" @click.native="$router.push({name: 'proposta-edita', params: {id: row.item.id}})" class="btn-primary" style="margin-top: 10px">
                                  <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Devolver para revisão
                                </g-button-ujarak>
                              </div>
                            </div>
                          </span>
                          <span v-if="(ehEdital(row.item) && ((!ehEditalAtivoNaoFinalizado(row.item) && usuarioLogado.userType !== 'FUNDACAO')))">
                            <g-button-ujarak color="primary" target="_blank" size="button--size-ss" :disabled="false" @click.native="$router.push({name: 'imprimir-proposta', params: { id: row.item.id }})"
                                             :title="'<h5>Mostra uma versão para impressão do que já foi preenchida da proposta</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}">
                              <i class="fa fa-file-text" aria-hidden="true"></i> Versão para impressão
                            </g-button-ujarak>
                            <g-button-ujarak v-if="ehEdital(row.item) && (ehEditalAtivoNaoFinalizado(row.item) && usuarioLogado.userType !== 'FUNDACAO') && row.item.ds_fase === 'ANALISE'" color="error" size="button--size-ss" @click.native="alteraTarefaPropostaEdital(row.item)" class="btn-primary" style="margin-top: 10px">
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Revisar Proposta
                            </g-button-ujarak>

                            <g-button-ujarak 
                              v-if="ehEditalExcecao(row.item) && (row.item.ds_fase === 'CADASTRO' || row.item.ds_fase === 'REVISAO')" 
                              color="primary" 
                              size="button--size-ss" 
                              @click.native="$router.push({ name: 'proposta-edita', params: { id: row.item.id } })" 
                              class="btn-primary" 
                              style="margin-top: 10px"
                            >
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                              {{ row.item.ds_fase === 'CADASTRO' ? 'Editar' : 'Revisar' }}
                            </g-button-ujarak>

                            <div v-if="($root.authorize('proposta-cadastro-completo') || $root.authorize('minha-proposta-editar')) && (_.includes(['CADASTRO', 'REVISAO', ''], row.item.ds_fase) || _.isNull(row.item.ds_fase)) && ehEditalAtivoNaoFinalizado(row.item)">
                              <div >
                                <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'proposta-edita', params: {id: row.item.id}})" class="btn-primary" style="margin-top: 10px">
                                  <i class="fa fa-pencil-square-o" aria-hidden="true"></i> {{ row.item.ds_fase === 'CADASTRO' || _.isNull(row.item.ds_fase) ? 'Editar' : (row.item.ds_fase === 'REVISAO' ? 'Revisar' : '') }}
                                </g-button-ujarak>

                                <g-button-ujarak color="error" size="button--size-ss" v-if="row.item.ds_fase === 'ANALISE'" @click.native="$router.push({name: 'proposta-edita', params: {id: row.item.id}})" class="btn-primary" style="margin-top: 10px">
                                  <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Devolver para revisão
                                </g-button-ujarak>
                              </div>
                            </div>

                            <div v-if="($root.authorize('proposta-cadastro-completo') || $root.authorize('minha-proposta-editar')) && (_.includes(['REVISAO', ''], row.item.ds_fase) || _.isNull(row.item.ds_fase))">
                              <div >
                                <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'proposta-edita', params: {id: row.item.id}})" class="btn-primary" style="margin-top: 10px">
                                  <i class="fa fa-pencil-square-o" aria-hidden="true"></i> {{ row.item.ds_fase === 'CADASTRO' || _.isNull(row.item.ds_fase) ? 'Editar' : (row.item.ds_fase === 'REVISAO' ? 'Revisar' : '') }}
                                </g-button-ujarak>
                              </div>
                            </div>
                          </span>
                        </template>
                      </b-table>

                      <b-row v-if="table.items.length > table.perPage">
                        <b-col md="12" class="" right>
                          <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
                        </b-col>
                      </b-row>

                    </b-container>

                    <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

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
import moment from 'moment'
import { mapGetters } from 'vuex'

let defaultFiltro = {
  createdBy: null,
  currentPage: 1,
  pageSize: 20,
  projectProposals: true
}

export default {
  name: 'lista-proposta',
  data () {
    return {
      loading: {
        tela: false
      },
      hoje: new Date(),
      enumeradores: {'ANALISE': 'Análise', 'AUTORIZACAO': 'Autorização', 'REVISAO': 'Em Revisão - Análise', 'APROVADO': 'Aprovado', 'DEFERIMENTO': 'Deferimento', 'FORMALIZACAO': 'Formalização', 'APROVACAO_PROJETO': 'Aprovação', 'CADASTRO': 'Cadastro', '': 'Cadastro', 'ANULACAO': 'Anulado', 'ANULADO': 'Anulado'},
      json_data: [],
      json_fields: {
        'CNPJ': 'ds_cnpj',
        'Entidade': 'NomeEntidade',
        'Nome da Proposta': 'ds_nome',
        'Data de Inclusão': 'createdAt',
        'Fase': 'ds_fase',
        'Tipo': 'ds_numero_edital'
      },
      json_meta: [
        [{
          'key': 'charset',
          'value': 'utf-8'
        }]
      ],
      filtro: defaultFiltro,
      termoPesquisa: '',
      table: {
        items: [],
        filter: null,
        hover: true,
        bordered: true,
        table: 0,
        currentPage: 1,
        perPage: 20,
        sortBy: 'id',
        sortDesc: true,
        fields: [
          { key: 'NomeEntidade', label: 'Entidade', sortable: true, thStyle: 'text-align: left; width: 30%', class: 'text-left' },
          // { key: 'ds_cnpj', label: 'CNPJ Entidade', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
          { key: 'ds_nome', label: 'Proposta', sortable: true, thStyle: 'text-align: left; width: 30%', class: 'text-left' },
          { key: 'dt_criado', label: 'Inclusão', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center' },
          { key: 'ds_fase', label: 'Fase', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'ds_numero_edital', label: 'Tipo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
          { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 225px !important', class: 'text-center' }

        ]
      },
      simplificados: []
    }
  },
  computed: {
    ...mapGetters([
      'usuarioLogado'
    ])
  },
  created () {
    this.$snotify.clear()
    this.filtro = {}
  },
  mounted () {
    this.$snotify.async('Buscando propostas. Por favor, aguarde...', {timeout: 0})
    this.pesquisaFiltro()
  },
  methods: {
    onSearch () {
      this.loading.tela = true
      axiosLaravel.get('propostas').then((response) => {
        this.table.items = response.data
        this.json_data = response.data.reverse()
        this.$forceUpdate()
        this.$snotify.clear()
        this.$snotify.success('Propostas carregadas com sucesso!', {timeout: 1000})
        for (let i = 0; i < this.json_data.length; i++) {
          this.json_data[i].ds_cnpj = this.json_data[i].ds_cnpj + ' '
          if (this.json_data[i].ds_numero_edital === 'null') {
            this.json_data[i].createdAt = 'Prospecção Direta'
          }
          this.json_data[i].createdAt = moment(this.json_data[i].createdAt).format('DD/MM/YYYY')
        }
        this.table.totalRows = this.table.items.length
        this.loading.tela = false
      })
      .catch((error) => {
        this.$root.trataErro(error)
      })
    },
    pesquisaFiltro () {
      this.loading.tela = true
      axiosLaravel.post('propostas/pesquisaFiltro/', {'pesquisa': this.termoPesquisa}).then((response) => {
        this.table.items = response.data
        console.log('response.data', response.data)
        this.json_data = response.data.reverse()
        this.$forceUpdate()
        this.$snotify.clear()
        this.$snotify.success('Propostas carregadas com sucesso!', {timeout: 1000})
        for (let i = 0; i < this.json_data.length; i++) {
          this.json_data[i].ds_cnpj = this.json_data[i].ds_cnpj + ' '
          if (this.json_data[i].ds_numero_edital === 'null') {
            this.json_data[i].createdAt = 'Prospecção Direta'
          }
          this.json_data[i].createdAt = moment(this.json_data[i].createdAt).format('DD/MM/YYYY')
        }
        this.table.totalRows = this.table.items.length
        this.loading.tela = false
      })
        .catch((error) => {
          this.$root.trataErro(error)
        })
    },
    ehEdital (proposta) {
      return !_.isNil(proposta.idEdital)
    },
    // 74188 - Editar proposta pela Entidade em fase de Cadastro apos o termino do edital Mulheres Negras
    ehEditalExcecao (proposta) {
      if (!_.isNil(proposta.idEdital)) {
        if (proposta.idEdital === 12) {
          return true
        }
      } else {
        return false
      }
    },
    editalComLimitacaoAcesso (proposta) {
      return _.get(proposta, 'opcoesEdital.acesso.antecipado', false)
    },
    ehEditalAtivoNaoFinalizado (proposta) {
      let dataTerminoEdital = _.get(proposta, 'dt_data_final')
     // let ldsTerminoEdital = new Date(dataTerminoEdital + ' 00:00:00').toLocaleDateString('en-US', {timeZone: 'America/Sao_Paulo'})
      let ldsHojeBrasilia = new Date().toLocaleString('en-US', {timeZone: 'America/Sao_Paulo'})
      return proposta.bt_ativo === 1 && dataTerminoEdital && (new Date(ldsHojeBrasilia).getTime() < new Date(dataTerminoEdital).getTime())
    },
    onCleanSearch () {
      this.filtro = {}
      this.pesquisaFiltro()
    },
    async editalParaRevisao (proposta) {
      this.loading.tela = true
      await axiosLaravel.get('propostas/' + proposta.id).then((response) => {
        this.$snotify.clear()
        console.log('proposta', response.data)
        let propostaObj = response.data
        this.alteraTarefaPropostaEdital(propostaObj)
      })
        .catch((error) => {
          this.$snotify.clear()
          this.$root.trataErro(error)
          this.loading.tela = false
        })
    },
    async alteraTarefaPropostaEdital (proposta) {
      this.loading.tela = true
      let obj = {
        proximaEtapa: 'REVISAO',
        observacao: 'Voltando tarefa para revisão pela entidade',
        idProposta: proposta.id
      }
      await axiosLaravel.post('propostas/voltarRevisaoEdital/', obj).then((response) => {
        this.$snotify.clear()
        console.log('resultado', response.data)
        this.$snotify.success(response.data)
        setTimeout(() => {
          window.location.reload()
        }, 5000)
        this.loading.tela = false
      })
        .catch((error) => {
          this.$snotify.clear()
          this.$root.trataErro(error)
          this.loading.tela = false
        })
    }
  }
}
</script>
<style scoped>
  .lowercase {
    text-transform: none
  }
  .listaPropostas .esmaecido {
    color: silver;
  }
</style>
