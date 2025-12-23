  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
  <template>
    <div class="box-body prest-upload-container">
        <div v-if="loading" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i></div>
        <div class="row-flex centered-between">
            <h4 class="prest-box-title row-flex centered-start">Histórico<i class="fa fa-clock-o" aria-hidden="true" ></i></h4>
            <!-- Função de mostrar historico com caret down e up-->
            <div class="row-flex centered-start">
                <b-button v-b-toggle.historico class="btn btn-default" @click="toggleHistorico(!mostrarHistorico)">
                    <i :class="mostrarHistorico ? 'fa fa-caret-up' : 'fa fa-caret-down'"></i>
                    Mostrar
                </b-button>
            </div>
        </div>

        <div class="column all-start prest-complementar-container" v-if="mostrarHistorico">
            <!-- <h4 class="prest-box-title row-flex centered-start">Documentos Cadastrados <i class="fa fa-sticky-note" aria-hidden="true" ></i></h4> -->
              <b-container fluid class="prest-table">
                <b-table show-empty
                          stacked="md"
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
                          <template slot="created_at" scope="row">
                            <span>{{ moment(row.value).format('DD/MM/YYYY HH:mm') }}</span>
                          </template>
                </b-table>
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
    name: 'PrestacaoHistorico',
    data () {
      return {
        loading: false,
        moment: moment,
        mostrarHistorico: false,
        historico: [],
        table: {
          items: [],
          currentPage: 0,
          perPage: 10,
          totalRows: 0,
          sortBy: 'id',
          sortDesc: true,
          filter: null,
          emptyText: 'Não tem nenhum registro para mostrar',
          fields: [
              { key: 'created_at', label: 'Data', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
              { key: 'evento', label: 'Evento', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
              { key: 'usuario', label: 'Responsável', sortable: true, thStyle: 'text-align: left', class: 'text-left' }
          ]
        }
      }
    },
    props: {
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
      // this.buscarHistorico()
    },
    methods: {
      toggleHistorico (valor) {
        this.mostrarHistorico = valor
        if (this.mostrarHistorico) {
          this.buscarHistorico()
        }
      },
      async buscarHistorico () {
        console.log('buscando historico')
        this.loading = true
        this.historico = []
        await axiosLaravel.get('/prestacaoSimplificada/getHistorico/' + this.$route.params.id)
          .then((response) => {
            this.historico = response.data
            this.table.items = this.historico
          })
          .catch((error) => {
            console.log(error)
          })
        this.loading = false
      }
    }
  }
</script>

<style src="../../../../static/css/prestacaoContasNovo.css">
</style>
