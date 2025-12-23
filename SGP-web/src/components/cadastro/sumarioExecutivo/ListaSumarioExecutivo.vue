<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Sumários Executivos'"/>

    <div>
      <section class="content-header">
        <h1>Sumários Executivos</h1>
        <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Cadastro', href: '#'}, {text: 'Sumários Executivos', active: true}]"/>
      </section>

      <section class="content">

        <div class="row" id="listaSumarioExecutivo">

          <div class="col-md-12">

            <div class="box box-primary">

              <div class="box-header with-border">
                <h3 class="box-title">
                  <i class="fa fa-pencil" aria-hidden="true"></i> Lista de Sumários Executivos <span v-if="!loading.tela" class="info_discreto">{{tabelaSumarioExecutivo.totalRows}} localizado(s)</span>
                </h3>
              </div>

              <div class="box-body" >
                <div class="row">
                  <div class="box-body">
                    <div class="form-horizontal">

                      <div class="col-md-3">
                        <g-button-ujarak color="primary" size="button--size-ss" type="button" @click.native="$router.push({name: 'edita-sumario-executivo', params: {id: null}})"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Sumário </g-button-ujarak>
                      </div>

                      <div class="col-md-5">
                        <div class="col-md-12">
                          <div class="input-group">
                            <input v-model="pesquisa" type="text" class="form-control" placeholder="Pesquisa..." v-on:keyup="ajustaPesquisa">
                            <!--<input v-model="pesquisa" type="text" class="form-control" placeholder="Pesquisa...">-->
                            <span class="input-group-btn">
                              <button :disabled="!tabelaSumarioExecutivo.filter" @click="tabelaSumarioExecutivo.filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-4">&nbsp;</div>

                    </div>
                  </div>
                </div>

                <!--Lista de Formulários -->
                <div class="row box-body">
                  <b-container fluid>
                    <b-table show-empty
                             stacked="md"
                             hover
                             :ref="'tabelaDetalhe'"
                             :bordered="tabelaSumarioExecutivo.bordered"
                             :items="sumarios"
                             :fields="camposSumarioExecutivo"
                             :filter="tabelaSumarioExecutivo.filter"
                             :filter-function="filtroPorItem"
                             @filtered="onFiltered"
                             :current-page="tabelaSumarioExecutivo.currentPage"
                             :per-page="tabelaSumarioExecutivo.perPage"
                             :sort-by.sync="tabelaSumarioExecutivo.sortBy"
                             :sort-desc.sync="tabelaSumarioExecutivo.sortDesc"
                             empty-filtered-text="Nada foi encontrado. Refaça sua pesquisa!"
                             empty-text="Nenhum registro encontrado">

                      <template slot="id" scope="row">
                        {{row.value}}
                      </template>

                      <template slot="sumario.acao" scope="row">
                        <span class="link_acesso" @click="copiaUrl(row)" :title="'<h5>Clique para copiar link para uso externo ao SGP</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                          {{row.value}}
                          <span v-if="_.has(row.item, 'link_copia')" :class="_.get(row.item, 'link_copia.classe')">{{_.get(row.item, 'link_copia.msg')}}</span>
                        </span>
                      </template>

                      <template slot="sumario.data" scope="row">
                        {{ moment(row.item.sumario.data).add(1, 'day').format('DD/MM/YYYY')}}
                        <br/>
                        {{ row.item.sumario.inicio }} até {{ row.item.sumario.termino }}
                      </template>

                      <template slot="sumario.local" scope="row">
                        {{row.item.sumario.local}}
                      </template>

                      <template slot="actions" scope="row">
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'edita-sumario-executivo', params: {id: row.item.id}})"><i class="fa fa-pencil" aria-label="false"></i> Editar</g-button-ujarak>
                        <g-button-ujarak color="success" size="button--size-ss" @click.native="$router.push({name: 'edita-sumario-executivo', params: {id: row.item.id, visualizacao: true}})"> <i class="fa fa-search" aria-label="false"></i> Visualizar</g-button-ujarak>
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="duplicarSumario(row.item.id)"><i class="fa fa-plus" aria-label="false"></i> Duplicar</g-button-ujarak>
                      </template>

                    </b-table>

                    <b-row>
                      <b-col md="6" class="my-1" right>
                        <b-pagination :total-rows="tabelaSumarioExecutivo.totalRows" :per-page="tabelaSumarioExecutivo.perPage" v-model="tabelaSumarioExecutivo.currentPage" class="my-3" />
                      </b-col>
                    </b-row>

                  </b-container>

                  <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
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
    name: 'ListaSumariosExecutivo',
    data () {
      return {
        moment: moment,
        loading: {
          tela: false,
          detalhes: false
        },
        numeroAtualizacao: 0,
        pesquisa: '',
        hoje: new Date(),
        camposSumarioExecutivo: [
          { key: 'id', label: 'ID', thStyle: 'width: 5%; text-align: center', sortable: true, 'class': 'text-center' },
          { key: 'sumario.acao', label: 'Nome', thStyle: 'width: 25%; text-align: left', sortable: true, 'class': 'word-wrap:break-word text-left' },
          { key: 'sumario.data', label: 'Data', thStyle: 'width: 10%; text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
          { key: 'sumario.local', label: 'Local', thStyle: 'width: 20%; text-align: left', sortable: true, 'class': 'word-wrap:break-word text-left' },
          { key: 'actions', label: 'Ações', thStyle: 'width: 20%; text-align: center;', sortable: false, 'class': 'text-center' }
        ],
        tabelaSumarioExecutivo: {
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'id',
          sortDesc: true,
          filter: null,
          bordered: true
        },
        tabelaDetalhamento: {
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'processo.id',
          sortDesc: true,
          filter: null,
          bordered: true
        },
        tipoFormulario: [{codigo: 'AVALIACAO_APROVACAO', descricao: 'Marco zero'}, {codigo: 'AVALIACAO_ENCERRAMENTO', descricao: 'Marco um'}, {codigo: 'AVALIACAO_GENERICO', descricao: 'Genérico'}, {codigo: 'AVALIACAO_PARTICIPANTE', descricao: 'Participante'}],
        detalhamentoFormulario: {}, // Cada key é o id do formulário no array de sumarios. A propriedade (id) é criado a medida que é carregado ao abrir um detalhe do b-table (mostrarDetalhes)
        projetoSelecionadoEnvioManual: {}, // Cada key é o id do formulário no array de sumarios. A propriedade (id) é criado a medida que é seleionado um projeto na lista de projeto disponíveis para vincular a um formulário
        sumarios: [],
        alertasFormulariosCadastrados: []
      }
    },
    created () {
      this.listaFormsAvaliacao()
    },
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ])
    },
    mounted: function () {
    },
    methods: {
      listaFormsAvaliacao () {
        this.loading.tela = true
        axiosLaravel.get('sumario_executivo/lista/').then((response) => {
          this.sumarios = response.data
          this.tabelaSumarioExecutivo.totalRows = this.sumarios.length
          this.$forceUpdate()
          this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      duplicarSumario (id) {
        this.loading.tela = true
        axiosLaravel.post('sumario_executivo/duplica/', {'id': id}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.sumarios.push(response.data.retorno)
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.tabelaSumarioExecutivo.totalRows = this.sumarios.length
          this.$forceUpdate()
          this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      filtroPorItem (row, filter) {
        let saida = true
        console.log('filtroPorItem row, filter', row, filter)
        if (filter !== 'retornar_todos_registros') { // Se receber a string para filtrar tudo, então retorna o filtro como '' e não acrescenta a pesquisa por termo
          let termos = _.split(_.toLower(filter), ' ')
          termos.forEach((termo) => {
            saida = saida && (_.toLower(row.id).indexOf(termo) !== -1 || _.toLower(row.sumario.acao).indexOf(termo) !== -1 || _.toLower(row.sumario.local).indexOf(termo) !== -1 || row.sumario.data.indexOf(termo) !== -1)
          })
        }
        return saida
      },
      onFiltered (filteredItems) {
        this.tabelaSumarioExecutivo.totalRows = filteredItems.length
        this.tabelaSumarioExecutivo.currentPage = 1
      },
      ajustaPesquisa () {
        // Para o b-table uma string vazia significa "não pesquise", então para efeito de forçar pesquisa deve sempre ter um valor quando for ''
        this.tabelaSumarioExecutivo.filter = (_.isNull(this.pesquisa) || this.pesquisa === '') ? 'retornar_todos_registros' : this.pesquisa
      },
      copiaUrl (row) {
        let link = row.item['link_acesso']
        let linkCompleto = location.protocol + '//' + location.host + '/se/' + link
        navigator.clipboard.writeText(linkCompleto)
          .then(() => {
            _.set(row, 'item.link_copia', {classe: 'label label-success', msg: 'Copiado!'})
            this.$forceUpdate()
            setTimeout(() => { _.unset(row, 'item.link_copia'); this.$forceUpdate() }, 2000)
          })
          .catch(err => {
            _.set(row, 'item.link_copia', {classe: 'label label-danger', msg: 'Erro: ' + err})
            this.$forceUpdate()
          })
      }
    }
  }
</script>

<style>
</style>
