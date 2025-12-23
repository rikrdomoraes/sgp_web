<template>

  <div class="box box-primary">

    <div class="box-body">
      <div class="row collapse in" aria-expanded="true" aria-hidden="false" style="width: inherit; height: auto;">
      </div>
      <br>
      <div class="row">
        <div class="col-sm-12">

          <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; width: 95%; height: 100%; display: block;">
            <i class="fa fa-refresh fa-spin"></i>
          </div>

          <div class="box-header" v-show="mostrarInclusao">
            <div class="form-horizontal box-body well well-sm">
              <!-- Arquivo -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('arquivo')}">
                <label for="file" class="control-label col-md-3">Arquivo:</label>
                <div class="col-md-9">
                  <div class="col-md-12">
                    <div>
                      <input type="file" id="file" ref="file" name="arquivo" @change="handleFileUpload" v-validate="{required: true}"/>
                    </div>
                  </div>
                  <span v-if="errors.first('arquivo')" class="label label-danger"> {{ errors.first('arquivo') }}</span>
                </div>
              </div>

              <!-- Nome do Documento -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('descricao')}">
                <label class="control-label col-md-3">Nome do {{tipoDocumento}}:</label>
                <div class="col-md-9">
                  <div class="col-md-12">
                    <div>
                      <input type="text" v-model="descricao" name="descricao" class="form-control" v-validate="{required: true}">
                    </div>
                  </div>
                  <span v-if="errors.first('descricao')" class="label label-danger"> {{ errors.first('descricao') }}</span>
                </div>
              </div>

              <!-- Botões -->
              <div class="form-group" style="margin-bottom:0">
                <div class="col-md-12 col-md-offset-2">
                  <button @click="adicionaDocumento" type="button" class="btn btn-confirm btn-flat"><i
                    class="fa fa-check" aria-hidden="true"></i> Ok
                  </button>
                  <button @click="cancelar" type="button" class="btn btn-back btn-flat"><i
                    class="fa fa-times-circle" aria-hidden="true"></i> Cancelar
                  </button>
                  <span class="text-red">Após clicar no OK, esse {{tipoDocumento}} estará público para download</span>
                </div>
              </div>
            </div>
          </div>

          <div class="row box-header" v-show="!mostrarInclusao">
            <div class="col-md-12">
              <div class="col-md-4">
                <g-button-ujarak color="dark-primary" @click.native="mostrarInclusao = true"
                                 v-if="usuarioLogado.userType === 'FUNDACAO'" size="button--size-ss"
                                 data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i
                  class="fa fa-plus-circle" aria-hidden="true"></i> Novo {{tipoDocumento}}
                </g-button-ujarak>
              </div>
              <div class="col-md-6 col-md-offset-1">
                <input v-model="tabela.filter" type="text" class="form-control"
                       :placeholder="'Pesquise ' + tipoDocumento + '...'">
              </div>
            </div>
          </div>

          <div class="table-responsive" v-show="!mostrarInclusao">

            <b-container fluid>
              <b-table how-empty
                       stacked="md"
                       :bordered="tabela.bordered"
                       :items="tabela.items"
                       :hover="tabela.hover"
                       :fields="tabela.fields"
                       :filter="tabela.filter"
                       :current-page="tabela.currentPage"
                       :per-page="tabela.perPage"
                       :sort-by.sync="tabela.sortBy"
                       :sort-desc.sync="tabela.sortDesc"
                       empty-text="Nenhum registro encontrado"
              >

                <template slot="link" scope="row"><a @click="onDownload(row.item)" href="javascript:void(0)"><i
                  class="fa fa-download" aria-hidden="true"></i> {{row.item.descricao}}</a></template>
                <template slot="data" scope="row">{{row.item.dt_data_emissao | moment("L")}}</template>

                <template slot="actions" scope="row" v-if="usuarioLogado.userType === 'FUNDACAO'">
                  <!--<b-button type="button" @click.stop="editarDocumento(row.item)"  class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>-->
                  <b-button type="button" @click.stop="excluirDocumento(row.item)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i>Excluir</b-button>
                </template>

              </b-table>
            </b-container>
          </div>

        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import moment from 'moment'

  export default {
    name: 'documentos-por-tipo',
    data () {
      return {
        loading: {
          show: false
        },
        tamanho: 0,
        contador: 0,
        tamanhoFormatado: 0,
        salvou: false,
        acmTamanho: 0,
        totalMb: 0,
        mostrarInclusao: false,
        documento: {},
        tipoDocumento: '',
        descricao: '',
        tabela: {
          items: [],
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 500,
          fields: [
            {key: 'link', label: 'Documento', sortable: true, thStyle: 'text-align: center; width: 75%', class: 'text-left'},
            {key: 'data', label: 'Publicação', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center'},
            {key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 15%', class: 'text-center'}
          ]
        }
      }
    },
    props: ['tipo'],
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ])
    },
    mounted () {
    },
    created () {
      if (this.usuarioLogado.userType !== 'FUNDACAO') {
        this.tabela.fields = _.filter(this.tabela.fields, function (o) {
          return o.key !== 'actions'
        })
      }
      this.descricaoTipo()
      this.listarDocumentos()
    },
    methods: {
      descricaoTipo () {
        axiosLaravel.post('documentos/tipos/TODOS').then((response) => {
          console.log('tipos/TODOS', response)
          this.tipoDocumento = _.find(response.data, ['id', this.tipo])['ds_tipo']
          console.log('this.tipoDocumento', this.tipoDocumento)
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      listarDocumentos () {
        this.loading.show = true
        console.log('this.tipo', this.tipo)
        axiosLaravel.post('documentos/tipo', {'tipo': this.tipo}).then((response) => {
          console.log('arquivos', response.data)
          this.tabela.items = response.data
          this.loading.show = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.show = false
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      handleFileUpload (e) {
        let files = e.target.files || e.dataTransfer.files
        this.tamanho = e.target.files[0].size
        this.tamanhoFormatado = (this.tamanho / Math.pow(1024, 2)).toFixed(2)
        // Transforma o arquivo em base64 para passar no json
        this.carregaArquivo(files[0])
        // Pega o nome do arquivo
        this.documento.ds_nome_arquivo = files[0].name
        // Pega o tipo do arquivo
        this.documento.ds_content_type = files[0].type
      },
      carregaArquivo (file) {
        let reader = new FileReader()
        let vm = this
        reader.onload = (e) => {
          vm.documento.file = e.target.result
        }
        reader.readAsDataURL(file)
      },
      excluirDocumento (documento) {
        this.loading.show = true
        documento.dt_inativado = moment().format('YYYY-MM-DD HH:mm:ss')
        documento.id_usuario = this.usuarioLogado.id
        axiosLaravel.put('documentos/excluir', documento).then((response) => {
          console.log('response', response)
          this.loading.show = false
          this.listarDocumentos(this.tipo)
        })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      adicionaDocumento () {
        this.$validator.validateAll().then((result) => {
          if (result && this.$validator.errors.all().length === 0) {
            const data = new FormData()
            data.append('file', this.file)
            this.documento.dt_criado = new Date()
            this.documento.dt_atualizado = new Date()
            this.documento.descricao = this.descricao
            this.documento.loaded = 'upload_por_tipo'
            this.documento.tipo = this.tipo
            this.documento.usuario = this.usuarioLogado
            this.documento.ligacao_type = null
            data.append('document', JSON.stringify(this.documento))
            this.$snotify.clear()
            this.$snotify.info('Adicionando arquivo...', {timeout: 0})
            this.loading.show = true
            axiosLaravel.post('documentos/upload', data, {
              headers: {
                'Content-Type': undefined,
                'Accept': 'application/json'
              },
              transformRequest: [function (data, headers) {
                // Do whatever you want to transform the data
                return data
              }]
            }).then((response) => {
              // this.limparCampos()
              this.loading.show = false
              this.$snotify.clear()
              this.$snotify.success('Arquivo incluído!')
              this.cancelar()
              this.listarDocumentos()
            }).catch((error) => {
              console.log('error', error)
              this.loading.show = false
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
          }
        })
      },
      cancelar () {
        this.$refs.file.value = null
        this.descricao = ''
        this.errors.items = []
        this.mostrarInclusao = false
      },
      uploadArquivo () {
      },
      onDownload (documento) {
        console.log('novo documento')
        if (documento.file) {
          download(documento.file, documento.ds_nome_arquivo, documento.ds_content_type)
        } else {
          axiosLaravel.get('documentos/download/' + documento.id, {responseType: 'arraybuffer'}).then((response) => {
            let ie = !!window.MSInputMethodContext && !!document.documentMode
            if (!ie) {
              let blob = new Blob([response.data], {type: documento.ds_content_type})
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = documento.ds_nome_arquivo
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } else {
              var bytes = new Uint8Array(resultByte)
              let blob = new Blob([bytes], {type: documento.ds_content_type})
              let link = document.createElement('blob')
              link.href = window.navigator.msSaveOrOpenBlob(blob, documento.ds_nome_arquivo)
              link.download = documento.ds_nome_arquivo
              link.click()
            }
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      }
    }
  }
</script>

<style scoped>
</style>
