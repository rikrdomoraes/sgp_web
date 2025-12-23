  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
  <template>
    <div class="prest-log-email-container" @click.stop>
        <div v-if="loading" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i></div>
        <div class="row-flex centered-between">
            <h4 class="prest-box-title row-flex centered-start">Log de e-mails<i class="fa fa-clock-o" aria-hidden="true" ></i></h4>
        </div>

        <div class="column all-start prest-complementar-container">
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
        <div class="row-flex all-centered prest-fechar-email-button" @click="fecharEmails">
            Fechar <i class="fa fa-times" aria-hidden="true"></i>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  export default {
    components: {
    },
    name: 'PrestacaoSimplificadaEmails',
    data () {
      return {
        loading: false,
        moment: moment,
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
              { key: 'numero_projeto', label: 'Projeto', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
              { key: 'nome_projeto', label: 'Nome', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
              { key: 'nome_entidade', label: 'Entidade', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
              { key: 'email_enviado', label: 'e-mail', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
              { key: 'destinatario', label: 'Destinatário', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
              { key: 'created_at', label: 'Data Envio', sortable: true, thStyle: 'text-align: left', class: 'text-left' }
          ]
        }
      }
    },
    props: {
      toggleEmails: Function
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
      this.buscarEmails()
    },
    methods: {
      fecharEmails () {
        this.toggleEmails(false)
      },
      async buscarEmails () {
        this.loading = true
        await axiosLaravel.get('/prestacaoSimplificada/getEmails')
          .then((response) => {
            console.log('response', response)
            this.table.items = response.data
            this.table.totalRows = response.data.length
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
