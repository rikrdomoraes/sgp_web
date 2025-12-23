  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
<template>
    <div class="content-wrapper column centered-start" style="min-height: 870px;" v-if="usuarioLogado.userType == 'FUNDACAO'">
        <div class="column centered-start gerenciador-log-container">
            <div class="column all-start log-title-container">
                <h3 class="log-title row-flex centered-start">
                  <i class="fa fa-pencil" aria-hidden="true"></i>
                      Logs de Edição de Proposta
              </h3>
              <div>
                  <i class="fa fa-clock-o" aria-hidden="true"></i> Última atualização: {{ ultimaAtualizacao }}
              </div>
            </div>
            <b-container fluid class="table-log-container">
                <b-table show-empty
                            stacked="md"
                            :key="tableDataKey"
                            striped
                            :bordered="table.bordered"
                            :items="table.items"
                            :fields="table.fields"
                            :current-page="table.currentPage"
                            :per-page="table.perPage"
                            :filter="table.filter"
                            empty-text="Nenhum registro encontrado"
                            :sort-by.sync="table.sortBy"
                            :sort-desc.sync="table.sortDesc">
                            <template slot="actions" scope="row">
                                <g-button-ujarak  color="primary" size="button--size-ss" @click.native="encerraSessao(row.item)" :title="'<h5> Encerra Sessão de Edição. </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"><i class="fa fa-close" aria-hidden="true"></i> </g-button-ujarak>
                            </template>
                            <template slot="ultimo_ping" scope="row">{{row.value}}</template>
                </b-table>
                <div class="row-flex all-end prest-total-documentos">
                    <div>
                        Total de Registros: <b>{{ table.items.length }}</b>
                    </div>
                </div>
                <b-row>
                    <b-col md="8" class="my-1" right>
                        <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
                    </b-col>
                </b-row>
                </b-container>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  export default {
    components: {
    },
    name: 'GerenciadorEdicaoProposta',
    data () {
      return {
        loading: false,
        moment: moment,
        intervalPing: null,
        ultimaAtualizacao: '',
        table: {
          items: [],
          currentPage: 1,
          perPage: 55,
          totalRows: 0,
          sortBy: 'id',
          sortDesc: true,
          filter: null,
          emptyText: 'Não tem nenhum registro para mostrar',
          fields: [
              { key: 'proposta_id', label: 'Proposta', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'ds_fase', label: 'Fase Proposta', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'user_id', label: 'ID Usuário', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'user_name', label: 'Usuário', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'ultimo_ping', label: 'Ping', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'edicao_ativa', label: 'Ativo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
          ]
        }
      }
    },
    props: ['numeroProposta'],
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
      this.iniciarPing()
    },
    beforeDestroy: function () {
      if (this.intervalPing) {
        clearInterval(this.intervalPing)
      }
    },
    methods: {
      iniciarPing () {
        if (this.intervalPing) {
          clearInterval(this.intervalPing)
        }
        this.consultaLog()
        this.intervalPing = setInterval(() => {
          this.consultaLog()
        }, 60000)
      },
      async consultaLog () {
        console.log('consultando log de sessoes ativas')
        await axiosLaravel.get('/gerenciadorEdicao/getLogs')
          .then((response) => {
            console.log(response.data)
            this.table.items = response.data
            this.table.totalRows = response.data.length
            this.ultimaAtualizacao = moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
            this.$forceUpdate()
          })
          .catch((error) => {
            console.log(error)
          })
      },
      async encerraSessao (item) {
        console.log('Encerrando a sessao...', item)
        let propostaId = item.proposta_id
        this.$dialog.confirm('Deseja realmente encerrar essa sessão? Essa ação, caso mais de um usuário estiver com a proposta aberta, <b>poderá</b> acarretar em dados sobreescritos. Continuar?', {
          title: 'Encerrar sessão de edição',
          type: 'warning',
          confirmButtonText: 'Sim, encerrar sessão!',
          cancelButtonText: 'Cancelar'
        }).then(() => {
          axiosLaravel.post('/gerenciadorEdicao/encerraSessao/' + propostaId)
          .then((response) => {
            this.$snotify.success(response.data.resultado)
            this.table.items = []
            this.consultaLog()
          })
          .catch((error) => {
            console.log(error)
          })
        }).catch(() => {
          console.log('Exclusão cancelada')
        })
      }
    }
  }
</script>

<style>
    .gerenciador-log-container {
        width: 90%;
        min-height: 1000px;
        margin-top: 100px;
        margin-bottom: 100px;
        box-sizing: border-box;
        padding: 30px;
        border-radius: 10px;
        background-color: #FFFFFF;
    }
    .table-log-container {
        width: 80%;
    }
    .edicao-permitida {
      background-color: rgb(21, 136, 243);
      color: #FFFFFF;
    }

    .edicao-nao-permitida {
      background-color: rgb(206, 89, 34);
      color: #FFFFFF;
    }

    .botao-flutuante {
      cursor: pointer;
      position: fixed;
      top: 100px;
      right: 2%;
      width: 30px;
      height: 30px;
      border-radius: 20px;
      background-color: rgb(21, 136, 243);
      box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
      border: 2px solid #FFFFFF;
      color: #FFFFFF;
      z-index: 9999;
    }

    .log-title {
        width: 100%;
        font-size: 2rem;
        height: 25px;
        border-left: 5px solid #1565C0;
        padding-left: 10px;
        gap: 10px;
    }
    .log-title-container {
        width: 80%;
        margin-bottom: 30px;
    }
</style>
