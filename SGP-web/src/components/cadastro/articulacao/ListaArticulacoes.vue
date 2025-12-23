<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Articulações'"/>

    <div>
      <section class="content-header">
        <h1>Parcerias Estratégicas</h1>
        <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Cadastro', href: '#'}, {text: 'Parcerias Estratégicas', active: true}]"/>
      </section>

      <section class="content">

        <div class="row" id="listaArticulacoes">

          <div class="col-md-12">

            <div class="box box-primary">

              <div class="box-header with-border">
                <h3 class="box-title">
                  <i class="fa fa-pencil" aria-hidden="true"></i> Lista de Instituições <span v-if="!loading.tela" class="info_discreto">{{tabelaArticulacao.totalRows}} localizado(s)</span>
                </h3>
              </div>

              <div class="box-body" >
                <div class="row">
                  <div class="box-body">
                    <div class="form-horizontal">

                      <div class="col-md-3">
                        <g-button-ujarak color="primary" size="button--size-ss" type="button" @click.native="$router.push({name: 'edita-articulacao', params: {id: null}})"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova Instituição </g-button-ujarak>
                      </div>

                      <div class="col-md-5">
                        <div class="col-md-12">
                          <div class="input-group">
                            <input v-model="pesquisa" type="text" class="form-control" placeholder="Pesquisa..." v-on:keyup="ajustaPesquisa">
                            <span class="input-group-btn">
                              <button :disabled="!tabelaArticulacao.filter" @click="tabelaArticulacao.filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-4 text-right">
                        <g-button-ujarak color="success" size="button--size-ss" type="button" @click.native="exportarExcel()"><i class="fa fa-download" aria-hidden="true"></i> Exportar Excel </g-button-ujarak>
                      </div>

                    </div>
                  </div>
                </div>

                <!--Lista de Articulações -->
                <div class="row box-body">
                  <b-container fluid>
                    <b-table show-empty
                             stacked="md"
                             hover
                             :bordered="tabelaArticulacao.bordered"
                             :items="articulacoes"
                             :fields="camposArticulacao"
                             :filter="tabelaArticulacao.filter"
                             :filter-function="filtroPorItem"
                             @filtered="onFiltered"
                             :current-page="tabelaArticulacao.currentPage"
                             :per-page="tabelaArticulacao.perPage"
                             :sort-by.sync="tabelaArticulacao.sortBy"
                             :sort-desc.sync="tabelaArticulacao.sortDesc"
                             empty-filtered-text="Nada foi encontrado. Refaça sua pesquisa!"
                             empty-text="Nenhum registro encontrado">

                      <template slot="id" scope="row">
                        {{row.value}}
                      </template>

                      <template slot="nome" scope="row">
                          {{row.item.dados.nome}}
                      </template>

                      <template slot="alertas" scope="row">
                        <div v-if="row.value.instrumetosVencer.length === 0 && row.value.instrumentosVencidos.length === 0" class="text-muted">Sem alertas</div>
                        <div v-else>
                          <div v-if="row.value.instrumetosVencer.length > 0" class="label label-warning"
                                :title="'<h5>Vecimentos em (dias):<li>' + _.join(_.sortBy(_.map(row.value.instrumetosVencer, 'dias')), '<li>') + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                            {{row.value.instrumetosVencer.length}} à vencer
                          </div>
                          <span>&nbsp;</span>
                          <div v-if="row.value.instrumentosVencidos.length > 0" class="label label-danger"
                                :title="'<h5>Vecidos a (dias):<li>' + _.join(_.sortBy(_.map(row.value.instrumentosVencidos, 'dias')), '<li>') + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                            {{row.value.instrumentosVencidos.length}} vencido {{row.value.instrumentosVencidos.length > 1 ? 's' : ''}}
                          </div>
                        </div>
                      </template>

                      <template slot="actions" scope="row">
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'edita-articulacao', params: {id: row.item.id}})"><i class="fa fa-pencil" aria-label="false"></i> Editar</g-button-ujarak>
                        <g-button-ujarak color="success" size="button--size-ss" @click.native="$router.push({name: 'edita-articulacao', params: {id: row.item.id, visualizacao: true}})"> <i class="fa fa-search" aria-label="false"></i> Visualizar</g-button-ujarak>
                      </template>

                    </b-table>

                    <b-row>
                      <b-col md="6" class="my-1" right>
                        <b-pagination :total-rows="tabelaArticulacao.totalRows" :per-page="tabelaArticulacao.perPage" v-model="tabelaArticulacao.currentPage" class="my-3" />
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
  import * as XLSX from 'xlsx'
  import moment from 'moment'

  export default {
    name: 'ListaArticulacoes',
    data () {
      return {
        loading: {
          tela: false,
          detalhes: false
        },
        numeroAtualizacao: 0,
        pesquisa: '',
        hoje: new Date(),
        situacoesParceria: [{'codigo': 'INSTRUMENTO_ELABORACAO', 'descricao': 'Instrumentos jurídicos em elaboração'}, {'codigo': 'EM_ANALISE', 'descricao': 'Projetos em análise na FBB'}, {'codigo': 'EM_ARTICULACAO', 'descricao': 'Projeto em articulação'}, {'codigo': 'AGUARDA_ENVIO_PROJETO', 'descricao': 'Aguardando envio de projetos'}, {'codigo': 'AGUARDA_MANIFESTACAO_BB', 'descricao': 'Aguardando manifestação do BB'}, {'codigo': 'PORTIFOLIO_ENVIADO_FBB', 'descricao': 'Portfólio de projetos enviado à FBB'}, {'codigo': 'AGUARDA_DEFINICAO_PARCERIA', 'descricao': 'Reuniões em andamento para definição sobre a parceria'}, {'codigo': 'REUNIAO_AGENDA', 'descricao': 'Reuniões agendadas'}, {'codigo': 'AGUARDA_AGENDA_REUNIAO', 'descricao': 'Aguardando agendamento de reunião pelo BB'}, {'codigo': 'ATIVA', 'descricao': 'Ativo'}, {'codigo': 'EM_ENCERRAMENTO', 'descricao': 'Em Encerramento'}, {'codigo': 'ENCERRADA', 'descricao': 'Encerrado'}],
        camposArticulacao: [
          { key: 'id', label: 'ID', thStyle: 'width: 5%; text-align: center', sortable: true, 'class': 'text-center' },
          { key: 'nome', label: 'Nome', thStyle: 'text-align: left', sortable: true, 'class': 'word-wrap:break-word text-left' },
          { key: 'alertas', label: 'Alertas', thStyle: 'width: 20%; text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
          { key: 'actions', label: 'Ações', thStyle: 'width: 20%; text-align: center;', sortable: false, 'class': 'text-center' }
        ],
        tabelaArticulacao: {
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'alertas',
          sortDesc: true,
          filter: null,
          bordered: true
        },
        articulacoes: []
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
        axiosLaravel.get('articulacao/lista/completo').then((response) => {
          this.articulacoes = response.data
          this.verificarAlertas()
          this.tabelaArticulacao.totalRows = this.articulacoes.length
          this.$forceUpdate()
          this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      verificarAlertas () {
        this.articulacoes.forEach((articulacao) => {
          let id = articulacao.id
          let parceiro = articulacao.dados
          let instrumetosVencer = []
          let instrumetosVencidos = []
          parceiro.parcerias.forEach((parceria) => {
            parceria.instrumentos.forEach((instrumento) => {
              let diasTerminoVigencia = moment(instrumento.dataVigencia).diff(moment(), 'days', true)
              let diasAposVigencia = moment().diff(moment(instrumento.dataVigencia), 'days', true)
              if (parceria.situacao !== 'ENCERRADA') { // as verificações de prazo de instrumento só se aplicam para parcerias não encerradas
                if (!_.isNull(instrumento.dataVigencia) && diasTerminoVigencia > 0 && diasTerminoVigencia < 60) {
                  instrumetosVencer.push({'instrumento': instrumento, 'dias': Math.trunc(diasTerminoVigencia)})
                }
                if (!_.isNull(instrumento.dataVigencia) && diasAposVigencia > 0) {
                  instrumetosVencidos.push({'instrumento': instrumento, 'dias': Math.trunc(diasAposVigencia)})
                }
              }
            })
          })
          articulacao.alertas = {'id': id, 'instrumetosVencer': instrumetosVencer, 'instrumentosVencidos': instrumetosVencidos}
        })
      },
      filtroPorItem (row, filter) {
        let saida = true
        console.log('filtroPorItem row, filter', row, filter)
        if (filter !== 'retornar_todos_registros') { // Se receber a string para filtrar tudo, então retorna o filtro como '' e não acrescenta a pesquisa por termo
          let termos = _.split(_.toLower(filter), ' ')
          termos.forEach((termo) => {
            saida = saida && (_.toLower(row.id).indexOf(termo) !== -1 || _.toLower(row.articulacao.acao).indexOf(termo) !== -1 || _.toLower(row.articulacao.local).indexOf(termo) !== -1 || row.articulacao.data.indexOf(termo) !== -1)
          })
        }
        return saida
      },
      onFiltered (filteredItems) {
        this.tabelaArticulacao.totalRows = filteredItems.length
        this.tabelaArticulacao.currentPage = 1
      },
      ajustaPesquisa () {
        // Para o b-table uma string vazia significa "não pesquise", então para efeito de forçar pesquisa deve sempre ter um valor quando for ''
        this.tabelaArticulacao.filter = (_.isNull(this.pesquisa) || this.pesquisa === '') ? 'retornar_todos_registros' : this.pesquisa
      },
      exportarExcel () {
        this.loading.tela = true
        //
        let vm = this
        let planilhaPrincipal = []
        let contatos = []
        let abrangencias = []
        let historicos = []
        let parcerias = []
        let parceriaInstrumentos = []
        let parceriaHistoricos = []
        let parceriaProjetos = []
        //
        axiosLaravel.post('articulacao/excel/', {'lista': null}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let articulacoes = response.data.retorno.articulacoes
            let autenticacao = response.data.retorno.autenticacao
            let idParceria = 0
            //
            articulacoes.forEach((articulacao) => {
              let parceiro = articulacao.dados
              let parceiroTemp = {}
              _.set(parceiroTemp, 'ID', articulacao.id)
              _.forEach(parceiro, function (valor, dado) {
                if (_.isArray(valor)) { // Se for array no primeiro nível do objeto
                  (_.get(parceiro, dados, [])).forEach((registro) => { _.set(registro, 'ID', articulacao.id) })
                } else {
                  vm.tratamento(parceiroTemp, dado, valor) // Faz um tratamento para converter um valor objeto em um array com propriedades concatenadas
                }
              })
              planilhaPrincipal.push(parceiroTemp)
              //
              parceiro.contatos.forEach((contato) => {
                let contatoTemp = {'ID': articulacao.id}
                _.forEach(contato, function (v, d) { vm.tratamento(contatoTemp, d, v) })
                contatos.push(contatoTemp)
              })
              parceiro.abrangencias.forEach((abrangencia) => {
                let abrangenciaTemp = {'ID': articulacao.id}
                _.forEach(abrangencia, function (v, d) { vm.tratamento(abrangenciaTemp, d, v) })
                abrangencias.push(abrangenciaTemp)
              })
              parceiro.historicos.forEach((historico) => {
                let historicoTemp = {'ID': articulacao.id}
                _.forEach(historico, function (v, d) { vm.tratamento(historicoTemp, d, v) })
                _.unset(historicoTemp, 'usuario_id')
                historicos.push(historicoTemp)
              })
              parceiro.parcerias.forEach((parceria) => {
                let parceriaTemp = {'ID': articulacao.id}
                _.forEach(parceria, function (v, d) { vm.tratamento(parceriaTemp, d, v) })
                _.unset(parceriaTemp, 'idx')
                _.set(parceriaTemp, 'ID_Parceria', idParceria)
                parcerias.push(parceriaTemp)
                //
                parceria.instrumentos.forEach((instrumento) => {
                  let instrumentoTemp = {'ID_Parceria': idParceria}
                  _.forEach(instrumento, function (v, d) { vm.tratamento(instrumentoTemp, d, v) })
                  _.unset(instrumentoTemp, 'idx')
                  // _.set(instrumentoTemp, 'dataAssinatura', moment(instrumentoTemp.dataAssinatura).format('DD-MM-YYYY'))
                  parceriaInstrumentos.push(instrumentoTemp)
                })
                //
                parceria.historicos.forEach((historico) => {
                  let historicoTemp = {'ID_Parceria': idParceria}
                  _.forEach(historico, function (v, d) { vm.tratamento(historicoTemp, d, v) })
                  _.unset(historicoTemp, 'idx')
                  parceriaHistoricos.push(historicoTemp)
                })
                //
                parceria.projetos.forEach((projeto) => {
                  let projetoTemp = {'ID_Parceria': idParceria}
                  _.forEach(projeto, function (v, d) { vm.tratamento(projetoTemp, d, v) })
                  _.unset(projetoTemp, 'idx')
                  parceriaProjetos.push(projetoTemp)
                })
                idParceria++
              })
            })
            let principal = XLSX.utils.json_to_sheet(planilhaPrincipal)
            //
            let wb = XLSX.utils.book_new() // Cria a pasta de trabalho (conjunto de planilhas) no Excel
            XLSX.utils.book_append_sheet(wb, principal, 'Instituicao Parceira') // A primeira planilha será a que contém os dados do parceiro
            //
            // Demais guias
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(contatos), 'Contatos do parceiro')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(abrangencias), 'Abrangencia do parceiro')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(historicos), 'Historico do parceiro')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(parcerias), 'Parcerias')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(parceriaInstrumentos), 'Parceria - Instrumentos')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(parceriaHistoricos), 'Parceria - Historico')
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(parceriaProjetos), 'Parceria - Projetos')
            //
            // Gerando dados para registro de download (extração de informação do SGP)
            let dados = [
              {'Registro': 'IDs das Articulações', 'Informação': _.join(_.map(articulacoes, 'id'), ', ')},
              {'Registro': 'Quem gerou a planilha', 'Informação': autenticacao.usuario},
              {'Registro': 'Quando foi gerada', 'Informação': autenticacao.dataHora},
              {'Registro': 'Autenticação', 'Informação': autenticacao.numero}
            ]
            let extracao = XLSX.utils.json_to_sheet(dados)
            XLSX.utils.book_append_sheet(wb, extracao, 'Extração') // Esta planilha conterá os dados de quem e quando foi feita a extração destas informações do SGP para Excel
            //
            XLSX.writeFile(wb, 'articulacoes.xlsx') // Cria o arquivo com a pasta de trabalho do Excel e faz download
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      tratamento (objeto, propriedade, valor) {
        if (_.isNull(valor)) { // Se valor for null
          _.set(objeto, propriedade, '')
        } else if (!_.isObjectLike(valor)) { // Se for valor primitivo no primeiro nível do objeto
          _.set(objeto, propriedade, ('' + valor).replace(/(<([^>]+)>)/ig, ''))
        } else if (_.isPlainObject(valor)) { // Se for objeto (não array) no primeiro nível do objeto
          _.forEach(valor, function (v, d) {
            _.set(objeto, propriedade + '_' + d, ('' + v).replace(/(<([^>]+)>)/ig, ''))
          })
        }
      }
    }
  }
</script>

<style>
</style>
