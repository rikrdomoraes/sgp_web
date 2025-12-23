<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <section class="content-header">
      <h1>
        <span>Ratificações {{ehDoUsuario ? 'pendentes de aprovação' : ''}} </span>
        <g-button-ujarak color="primary" @click.native="$router.push({name: 'edita-ratificacao'})" v-if="!ehDoUsuario" size="button--size-ss">
          <i class="fa fa-plus-circle" aria-hidden="true"></i> Nova Ratificação
        </g-button-ujarak>

        <g-button-ujarak color="success" @click.native="$router.push({name: 'lista-ratificacao-pendentes'})" v-if="!ehDoUsuario" size="button--size-ss">
          Pendentes
        </g-button-ujarak>
      </h1>

      <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Remessa', href: '#'}, {text: 'Lista de Ratificações', active: true}]"/>
    </section>


    <section class="content">

      <div class="row" id="listaRatificacoes">
        <div class="col-md-12">

<!-- Lista de ratificações em execução ------------------------------------------------------------------------->
          <div class="box box-primary">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

            <div class="box-header">
              <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Em execução</h3>
            </div>

            <div class="box-body">

              <div class="row">
                <!--Botão de Nova Solicitação de Ratificação -->
                <div class="col-md-12">
                  <div class="col-md-4">&nbsp;</div>

                  <!--Campo de Filtro -->
                  <div class="col-md-4">
                    <div class="input-group">
                      <input v-model="table.filter" type="text" class="form-control" placeholder="Pesquisa...">
                      <span class="input-group-btn">
                        <button :disabled="!table.filter" @click="table.filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">&nbsp;</div>

                <div class="col-md-12">
                  <b-container fluid>
                    <b-table show-empty
                             stacked="md"
                             :bordered="table.bordered"
                             :items="listaRatificacoes"
                             :fields="table.fields"
                             :filter="table.filter"
                             :current-page="table.currentPage"
                             @filtered="filtrar"
                             :sort-by.sync="table.sortBy"
                             :sort-desc.sync="table.sortDesc"
                             empty-text="Nenhum registro encontrado">

                      <template slot="id_processo" scope="row">{{row.value}}</template>
                      <template slot="nome" scope="row">{{enumeradores[row.value]}}</template>
                      <template slot="data_solicitacao" scope="row">{{row.value | moment("DD/MM/YYYY HH:mm")}}</template>
                      <template slot="situacao" scope="row">{{enumeradores[row.value]}}</template>
                      <template slot="ultima_tarefa" scope="row">{{enumeradores[row.value]}}</template>

                      <template slot="resultado" scope="row">
                        <span v-if="ehDoUsuario">
                          <span v-if="_.includes(row.value, 'Sim')"><i class="fa fa-check text-green" aria-hidden="true"></i> Aprovado</span>
                          <span v-else-if="_.includes(row.value, 'Nao')"><i class="fa fa-times text-red" aria-hidden="true"></i>Não aprovado</span>
                          <span v-else class="text-blue">Pendente</span>
                        </span>
                        <span v-else>
                          <span v-if="row.item.situacao === 'EM_EXECUCAO'">
                            <span v-if="row.item.ultima_tarefa === 'CONCLUSAO'" style="color: green;">Aguarda conclusão<br/>{{row.value}} assinatura(s)</span>
                            <span v-else-if="row.item.ultima_tarefa === 'ASSINATURA_RATIFICACAO'" style="color: royalblue;">Aguarda assinatura<br/>{{row.value}} assinado(s)</span>
                            <span v-else>{{enumeradores[row.item.ultima_tarefa]}}</span>
                          </span>
                          <span v-else>&nbsp;</span>
                        </span>
                      </template>

                      <template slot="acoes" scope="row">


                        <span v-if="ehDoUsuario">
                          <!-- Abrir para assinar ---------------------------->
                          <g-button-ujarak color="primary" size="button--size-ss" v-if="row.item.situacao === 'EM_EXECUCAO'"
                                           @click.native="$router.push({name: 'edita-ratificacao', params: {id: row.item.id_processo, assinar: true}})">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Abrir
                          </g-button-ujarak>

                          <!-- Visualizar -------------------------------------->
                          <g-button-ujarak color="success" size="button--size-ss" v-if="!_.isNull(row.item.resultado)"
                                           @click.native="$router.push({name: 'edita-ratificacao', params: {id: row.item.id_processo, visualizacao: true, assinar: true}})">
                            <i class="fa fa-search" aria-hidden="true"></i> Visualizar
                          </g-button-ujarak>
                        </span>

                        <span v-else>
                          <!-- Editar -------------------------------------->
                          <g-button-ujarak color="primary" size="button--size-ss" v-if="row.item.situacao === 'EM_EXECUCAO'"
                                           @click.native="$router.push({name: 'edita-ratificacao', params: {id: row.item.id_processo}})">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar
                          </g-button-ujarak>

                          <!-- Cancelar -------------------------------------->
                          <g-button-ujarak color="error" size="button--size-ss" v-if="row.item.situacao === 'EM_EXECUCAO'"
                                           @click.native="cancelar(row.item.id_processo)">
                            <i class="fa fa-ban" aria-hidden="true"></i> Cancelar
                          </g-button-ujarak>

                          <!-- Visualizar -------------------------------------->
                          <g-button-ujarak color="success" size="button--size-ss"
                                           @click.native="$router.push({name: 'edita-ratificacao', params: {id: row.item.id_processo, visualizacao: true}})">
                            <i class="fa fa-search" aria-hidden="true"></i> Visualizar
                          </g-button-ujarak>
                        </span>


                      </template>

                    </b-table>

                  </b-container>

                </div>

              </div>

            </div>

          </div>




<!-- Lista de ratificações concluídas ou canceladas ------------------------------------------------------------->
          <div class="box box-primary" v-if="!ehDoUsuario">
            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

            <div class="box-header">
              <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Concluídas e Canceladas</h3>
            </div>

            <div class="box-body">

              <div class="row">
                <!--Botão de Nova Solicitação de Ratificação -->
                <div class="col-md-12">
                  <div class="col-md-4">&nbsp;</div>

                  <!--Campo de Filtro -->
                  <div class="col-md-4">
                    <div class="input-group">
                      <input v-model="table.filter" type="text" class="form-control" placeholder="Pesquisa...">
                      <span class="input-group-btn">
                        <button :disabled="!table.filter" @click="table.filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">&nbsp;</div>

                <div class="col-md-12">
                  <b-container fluid>
                    <b-table show-empty
                             stacked="md"
                             :bordered="table.bordered"
                             :items="listaRatificacoesConcluidas"
                             :fields="table.fields"
                             :filter="table.filter"
                             :current-page="table.currentPage"
                             @filtered="filtrar"
                             :sort-by.sync="table.sortBy"
                             :sort-desc.sync="table.sortDesc"
                             empty-text="Nenhum registro encontrado">

                      <template slot="id_processo" scope="row">{{row.value}}</template>
                      <template slot="data_solicitacao" scope="row">{{row.value | moment("DD/MM/YYYY HH:mm")}}</template>
                      <template slot="ultima_tarefa" scope="row">{{enumeradores[row.value]}}</template>
                      <template slot="situacao" scope="row">{{enumeradores[row.value]}}</template>
                      <template slot="nome" scope="row">{{enumeradores[row.value]}}</template>

                      <template slot="resultado" scope="row">
                        <span v-if="ehDoUsuario">
                          <span v-if="_.includes(row.value, 'Sim')"><i class="fa fa-check text-green" aria-hidden="true"></i> Aprovado</span>
                          <span v-else-if="_.includes(row.value, 'Nao')"><i class="fa fa-times text-red" aria-hidden="true"></i>Não aprovado</span>
                          <span v-else class="text-blue">Pendente</span>
                        </span>
                        <span v-else>
                          <span v-if="row.item.situacao === 'EM_EXECUCAO'">
                            <span v-if="row.item.ultima_tarefa === 'CONCLUSAO'" style="color: green;">Aguarda conclusão<br/>{{row.value}} assinatura(s)</span>
                            <span v-else-if="row.item.ultima_tarefa === 'ASSINATURA_RATIFICACAO'" style="color: royalblue;">Aguarda assinatura<br/>{{row.value}} assinado(s)</span>
                            <span v-else>{{enumeradores[row.item.ultima_tarefa]}}</span>
                          </span>
                          <span v-else>&nbsp;</span>
                        </span>
                      </template>

                      <template slot="acoes" scope="row">


                        <span v-if="ehDoUsuario">
                          <!-- Abrir para assinar ---------------------------->
                          <g-button-ujarak color="primary" size="button--size-ss" v-if="row.item.situacao === 'EM_EXECUCAO'"
                                           @click.native="$router.push({name: 'edita-ratificacao', params: {id: row.item.id_processo, assinar: true}})">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Abrir
                          </g-button-ujarak>

                          <!-- Visualizar -------------------------------------->
                          <g-button-ujarak color="success" size="button--size-ss" v-if="!_.isNull(row.item.resultado)"
                                           @click.native="$router.push({name: 'edita-ratificacao', params: {id: row.item.id_processo, visualizacao: true, assinar: true}})">
                            <i class="fa fa-search" aria-hidden="true"></i> Visualizar
                          </g-button-ujarak>
                        </span>

                        <span v-else>
                          <!-- Editar -------------------------------------->
                          <g-button-ujarak color="primary" size="button--size-ss" v-if="row.item.situacao === 'EM_EXECUCAO'"
                                           @click.native="$router.push({name: 'edita-ratificacao', params: {id: row.item.id_processo}})">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar
                          </g-button-ujarak>

                          <!-- Cancelar -------------------------------------->
                          <g-button-ujarak color="error" size="button--size-ss" v-if="row.item.situacao === 'EM_EXECUCAO'"
                                           @click.native="cancelar(row.item.id_processo)">
                            <i class="fa fa-ban" aria-hidden="true"></i> Cancelar
                          </g-button-ujarak>

                          <!-- Visualizar -------------------------------------->
                          <g-button-ujarak color="success" size="button--size-ss"
                                           @click.native="$router.push({name: 'edita-ratificacao', params: {id: row.item.id_processo, visualizacao: true}})">
                            <i class="fa fa-search" aria-hidden="true"></i> Visualizar
                          </g-button-ujarak>
                        </span>



                      </template>

                    </b-table>

                  </b-container>

                </div>

              </div>

            </div>

          </div>


        </div>

      </div>

    </section>

  </div>

</template>

<script>
  /* eslint-disable quotes,no-unused-vars */
  import { mapGetters } from 'vuex'

  export default {
    name: 'ListaRatificacao',
    data () {
      return {
        loading: {
          tela: false
        },
        listaRatificacoes: [],
        listaRatificacoesConcluidas: [],
        ehDoUsuario: false,
        filtro: [],
        table: {
          filter: null,
          bordered: true,
          currentPage: 1,
          perPage: 10000,
          sortBy: 'id_processo',
          sortDesc: true,
          emptyText: 'Não tem nenhum registro para mostrar',
          fields: [
            { key: 'id_processo', label: 'ID Processo', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
            { key: 'data_solicitacao', label: 'Criado em', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
            { key: 'ultima_tarefa', label: 'Etapa', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
            { key: 'situacao', label: 'Situação', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' },
            { key: 'nome', label: 'Assunto da Ratificação', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
            { key: 'resultado', label: 'Informação', sortable: false, thStyle: 'text-align: center; width: 20%', class: 'text-center' },
            { key: 'acoes', label: 'Ações', thStyle: 'text-align: center; width: 20%', class: 'text-center' }
          ]
        },
        enumeradores: {'RATIFICACAO_APLICACAO': 'Ratificação de Aplicação', 'RATIFICACAO_PAGAMENTO': 'Ratificação de Pagamento', 'FEITO': 'Feito', 'CANCELADO': 'Cancelado', 'EM_EXECUCAO': 'Em Execução', 'SOLICITACAO': 'Solicitação', 'ASSINATURA_RATIFICACAO': 'Assinatura Requisitada', 'CONCLUSAO': 'Conclusão'}
      }
    },
    computed: {
      sortOptions () {
        // Create an options list from our fields
        return this.fields
          .table.filter(f => f.sortable)
          .map(f => { return { text: f.label, value: f.key } })
      },
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created: function () {
      if (_.has(this.$route.params, 'filtro')) {
        console.log('filtro: ', this.filtro)
      }
      this.ehDoUsuario = _.includes(this.filtro, 'usuario')
      this.carregaPendentesDoUsuario()
      this.carregarListaRatificacoes()
      console.log('filtro: ', this.filtro)
    },
    mounted: function () {

    },
    methods: {
      cancelar (id) {
        this.loading.tela = true
        axiosLaravel.post('/ratificacao/cancelar', {'id': id}).then((response) => {
          this.aviso(response.data)
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let p = _.filter(this.listaRatificacoes, ['id_processo', id])[0]
            _.set(p, 'situacao', 'CANCELADO')
            this.$forceUpdate()
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      carregaPendentesDoUsuario () {
        console.log('carregaPendentesDoUsuario executou')
        axiosLaravel.get(`ratificacao/pendentes_do_usuario/`).then((response) => {
          console.log('Pendencias do Usuario: ', response.data)
        })
      },
      carregarListaRatificacoes () {
        this.loading.tela = true
        axiosLaravel.post('/ratificacao/lista', {'filtro': this.filtro}).then((response) => {
          console.log('carregarListaRatificacoes', response.data)
          if (response.data.codigo === 'OK') {
            this.listaRatificacoes = _.filter(response.data.retorno, function (i) { return i.situacao === 'EM_EXECUCAO' })
            this.listaRatificacoesConcluidas = _.filter(response.data.retorno, function (i) { return i.situacao !== 'EM_EXECUCAO' })
            this.$forceUpdate()
          }
          this.aviso(response.data)
          this.loading.tela = false
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      aviso (retorno) {
        if (_.has(retorno, 'codigo')) {
          if (retorno.codigo === 'ERRO') {
            let mensagem = (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) ? retorno.mensagem : 'Erro de processamento. Não sei o que houve'
            this.$snotify.clear()
            this.$snotify.error(mensagem)
          } else {
            if (retorno.codigo === 'OK') {
              if (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) {
                this.$snotify.success(retorno.mensagem, {timeout: 3000})
              }
            }
          }
        }
      },
      filtrar () {
        console.log('filtrar')
      }
    }
  }
</script>

<style scoped>
</style>
