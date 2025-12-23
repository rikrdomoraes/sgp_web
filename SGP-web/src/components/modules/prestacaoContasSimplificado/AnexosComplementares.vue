  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
  <template>
    <div class="box-body prest-upload-container">
      <div v-if="loading" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i></div>
      <div class="row-flex start-between">
        <h4 class="prest-box-title row-flex centered-start">Documentos Complementares <i class="fa fa-paperclip" aria-hidden="true" ></i></h4>
        <!-- Botao pra baixar todos os arquivos -->
        <g-button-ujarak v-if="usuarioLogado.userType == 'FUNDACAO'" color="primary" size="button--size-ss" @click.native="onDownloadZIPComplementar()" :title="'<h5> Baixar Todos os Anexos Complementares </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"><i class="fa fa-cloud-download" aria-hidden="true"></i> </g-button-ujarak>
      </div>

        <b-button class="btn btn-primary" v-if="!editando" @click="toggleCadastro(true)"><i class="fa fa-plus-circle"></i> Novo Registro</b-button>
        <div class="column all-start prest-complementar-container" v-if="!editando">
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
                          <template slot="actions" scope="row">
                            <div class="row-flex all-centered prest-button-row">
                              <g-button-ujarak  color="primary" size="button--size-ss" @click.native="downloadAnexo(row.item.documento)" :title="'<h5> Baixar Documento </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"><i class="fa fa-download" aria-hidden="true"></i> </g-button-ujarak>
                              <g-button-ujarak  color="error" size="button--size-ss" @click.native="apagarAnexoComplementar(row.item.id)" title="'<h5> Excluir Documento </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"> <i class="fa fa-trash-o" aria-hidden="true"></i> </g-button-ujarak>
                            </div>
                          </template>
                          <template slot="documento.ds_nome_arquivo" scope="row">
                            <a href="#" @click.prevent="downloadAnexo(row.item.documento)">{{ row.item.documento.ds_nome_arquivo }}</a>
                          </template>
                          <template slot="documento.dt_criado" scope="row">
                            <span>{{ row.item.documento.dt_criado | moment("L") }}</span>
                          </template>
                </b-table>
            </b-container>
        </div>
        <div class="column start-centered prest-complementar-upload-container" v-if="editando">
          <h4> <i class="fa fa-sticky-note" aria-hidden="true"></i> Cadastrando novo Registro</h4>
          <div class="column all-start prest-complementar-upload-form">
            <label for="observacao" class="f-required">Observação:</label>
            <input type="text" class="form-control" id="observacao" placeholder="Motivo da inclusão do documento complementar" v-model="observacoes" maxlength="255">
          </div>
            <div class="prest-table">
                <uploadDocumentosPhpPrestacao :propDocumentos="anexo" :documentTypes="''" :local-uso="'SOLICITACAO_PAGAMENTO'" :disableAdd="anexo.length > 0" :restricaoArquivo="false"></uploadDocumentosPhpPrestacao>
            </div>
            <!-- Botoes de Salvar e Cancelar -->
            <div class="form-group col-md-12">
                <b-button class="btn btn-primary" @click="salvarAnexo()"><i class="fa fa-save"></i> Salvar</b-button>
                <b-button class="btn btn-danger" @click="editando = false"><i class="fa fa-times"></i> Cancelar</b-button>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import uploadDocumentosPhpPrestacao from './uploadDocumentosPhpPrestacao.vue'
  export default {
    components: {
      uploadDocumentosPhpPrestacao
    },
    name: 'AnexosComplementares',
    data () {
      return {
        loading: false,
        layoutExtrato: 'classico',
        editando: false,
        anexo: [],
        todosOsAnexos: [],
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
              { key: 'documento.tipo_documento.ds_tipo', label: 'Tipo Documento', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'documento.ds_nome_arquivo', label: 'Nome Arquivo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'documento.dt_criado', label: 'Data inclusão', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'observacoes', label: 'Observação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
          ]
        }
      }
    },
    props: {
      dadosComplementares: Object
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
      this.todosOsAnexos = _.cloneDeep(this.anexosComplementares)
      this.table.items = this.todosOsAnexos
      this.getDocumentosComplementares()
    },
    methods: {
      toggleCadastro (valor) {
        this.editando = valor
        if (this.editando) {
          // Limpa campos
          this.anexo = []
          this.observacoes = ''
        }
      },
      async salvarAnexo () {
        // Verifica os campos
        if (!this.validarCampos()) {
          return
        }
        let usuario = this.usuarioLogado.userType === 'FUNDACAO' ? this.usuarioLogado.ds_nome_usuario + ' (' + this.usuarioLogado.ds_login + ')' : this.usuarioLogado.ds_nome_usuario
        // Salva o Anexo na base de dados
        let obj = {
          observacoes: this.observacoes,
          anexo: this.anexo,
          idProposta: this.$route.params.id,
          usuario: usuario
        }
        this.loading = true
        this.$snotify.async('Gravando Documento Complementar. Por favor, aguarde...', {timeout: 0})
        await axiosLaravel.post('/prestacaoSimplificada/gravaAnexosComplementares', obj).then((response) => {
          if (response.data.codigo === 'OK') {
            this.$snotify.clear()
            this.$snotify.success('Anexo salvo com sucesso')
            this.editando = false
            // this.todosOsAnexos.push(obj)
            // this.table.items = this.todosOsAnexos
            this.loading = false
            this.$forceUpdate()
            this.getDocumentosComplementares()
          } else {
            this.$snotify.error('Erro ao salvar anexo')
          }
        }).catch((error) => {
          console.log(error)
          this.loading = false
          this.$snotify.clear()
          this.$snotify.error('Erro ao salvar anexo')
        })
        // Atualiza table.items
      },
      async getDocumentosComplementares () {
        // Pesquisa os documentos complementares na base de dados
        this.loading = true
        await axiosLaravel.get('/prestacaoSimplificada/getAnexoComplementar/' + this.$route.params.id).then((response) => {
          this.todosOsAnexos = response.data
          this.table.items = this.todosOsAnexos
          this.loading = false
        }).catch((error) => {
          console.log(error)
          this.loading = false
          this.$snotify.error('Erro ao buscar documentos complementares')
        })
      },
      validarCampos () {
        // Verifica se observação está preenchida e anexo vazio, informa usuário com snotify e retorna false
        if (this.observacoes === '') {
          this.$snotify.error('Campo Observação é obrigatório')
          return false
        }
        if (this.anexo.length === 0) {
          this.$snotify.error('Campo Anexo é obrigatório')
          return false
        }
        return true
      },
      downloadAnexo (documento) {
        console.log('Baixando anexo: ' + documento.id)
        this.$snotify.async('Baixando anexo: ' + documento.ds_nome_arquivo, {timeout: 0})
        axiosLaravel.get('documentos/download/' + documento.id, {responseType: 'arraybuffer'}).then((response) => {
          let ie = !!window.MSInputMethodContext && !!document.documentMode
          if (!ie) {
            let blob = new Blob([response.data], { type: documento.ds_content_type })
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = documento.ds_nome_arquivo
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            var bytes = new Uint8Array(resultByte)
            let blob = new Blob([bytes], { type: documento.ds_content_type })
            let link = document.createElement('blob')
            link.href = window.navigator.msSaveOrOpenBlob(blob, documento.ds_nome_arquivo)
            link.download = documento.ds_nome_arquivo
            link.click()
          }
          this.$snotify.clear()
        })
          .catch((error) => {
            console.log(error)
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      async apagarAnexoComplementar (id) {
        this.$snotify.async('Excluindo anexo: ' + id, {timeout: 0})
        let usuario = this.usuarioLogado.userType === 'FUNDACAO' ? this.usuarioLogado.ds_nome_usuario + ' (' + this.usuarioLogado.ds_login + ')' : this.usuarioLogado.ds_nome_usuario
        let obj = {
          id: id,
          idProposta: this.$route.params.id,
          usuario: usuario
        }
        await axiosLaravel.post('/prestacaoSimplificada/apagarAnexoComplementar', obj).then((response) => {
          if (response.data.codigo === 'OK') {
            this.$snotify.clear()
            this.$snotify.success('Anexo excluído com sucesso')
            this.getDocumentosComplementares()
          } else {
            this.$snotify.error('Erro ao excluir anexo')
          }
        }).catch((error) => {
          console.log(error)
          this.$snotify.clear()
          this.$snotify.error('Erro ao excluir anexo')
        })
      },
      // Baixa todos os arquivos complementares
      onDownloadZIPComplementar () {
        this.$forceUpdate()
        this.$snotify.async('Baixando arquivos. Por favor, aguarde...', {timeout: 0})
        axiosLaravel({
          url: 'prestacaoSimplificada/downloadArquivosComplementares/' + this.$route.params.id,
          method: 'GET',
          responseType: 'blob'
        }).then((response) => {
          const blob = new Blob([response.data], { type: 'application/zip' })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.setAttribute('download', moment().format('DDMMYYYYhhmmss') + '-' + 'prestacao-simplificada-documentos-complementares-' + this.dadosComplementares.numeroProjeto + '.zip')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.$snotify.clear()
        })
          .catch((error) => {
            console.log(error)
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      }
    }
  }
</script>

<style src="../../../../static/css/prestacaoContasNovo.css">
</style>
