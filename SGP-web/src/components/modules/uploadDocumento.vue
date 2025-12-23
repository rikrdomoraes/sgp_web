<template>

  <div>
    <!-- form de documentos-->
    <div style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-12">

        <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
          <i class="fa fa-refresh fa-spin"></i>
        </div>


        <!-- Vínculos Possíveis -->
        <div class="form-group">
          <label class="control-label col-md-3 col-lg-2">Adicionar documento em:</label>
          <div class="col-md-16">
            <div class="col-md-6 col-lg-4">

              <label class="new-control-radio" style="padding-top: 8px;">
                <input type="radio" name="vinculo" v-model="tipoVinculo" value="Projeto" class="ng-pristine ng-untouched ng-valid ng-not-empty" @change="vinculoSelecionado"> Projeto
                <span class="espacamento_botoes"></span>
                <input type="radio" name="vinculo" v-model="tipoVinculo" value="Entidade" class="ng-pristine ng-untouched ng-valid ng-not-empty" @change="vinculoSelecionado"> Entidade
                <!--<span class="espacamento_botoes"></span>-->
                <!--<input type="radio" name="vinculo" v-model="tipoVinculo" value="Relatório de Execução" class="ng-pristine ng-untouched ng-valid ng-not-empty" @change="vinculoSelecionado"> Relatório de Execução-->
              </label>

            </div>
          </div>
        </div>


        <!-- Lista de projetos -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('vinculo')}">
          <label for="vinculo" class="control-label col-md-3 col-lg-2">{{this.tipoVinculo === null ? 'Escolha acima onde adicionará o documento' : this.tipoVinculo}}:</label>
          <div class="col-md-16">
            <div class="col-md-6 col-lg-4">
              <select v-model="idVinculo" v-validate="'required'" name="vinculo" id="vinculo" class="form-control ng-pristine ng-untouched ng-valid ng-not-empty">
                <option v-if="tipoVinculo === 'Projeto'"  :value="item.id" v-for="item in listaVinculos">{{item.ds_codigo_projeto_erp}} - {{item.ds_nome}}</option>
                <option v-if="tipoVinculo === 'Entidade'" :value="item.id" v-for="item in listaVinculos">{{item.ds_nome}}</option>
              </select>
            </div>
            <span v-if="errors.first('vinculo')" class="label label-danger"> {{ errors.first('vinculo') }}</span>
          </div>
        </div>


        <!-- Tipo de documento -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('tipo de documento')}">
          <label for="tipo de documento" class="control-label col-md-3 col-lg-2">Tipo de documento:</label>
          <div class="col-md-16">
            <div class="col-md-6 col-lg-4">
              <select v-model="documento.tipo_documento" v-validate="'required'" name="tipo de documento" id="tipo de documento" class="form-control ng-pristine ng-untouched ng-valid ng-not-empty">
                <option :value="documento" v-for="documento in documentos">{{documento.ds_tipo}}</option>
              </select>
            </div>
            <span v-if="errors.first('tipo de documento')" class="label label-danger"> {{ errors.first('tipo de documento') }}</span>
          </div>
        </div>


        <!-- Arquivo -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('arquivo')}">
          <label for="file" class="control-label col-md-3 col-lg-2">Arquivo:</label>
          <div class="col-md-16">
            <div class="col-md-6 col-lg-3">
              <div>
                <input type="file" name="arquivo" id="file" ref="file" @change="handleFileUpload" v-validate="{required: true, size: tamanhoPermitido, mimes: tiposPermitidos}"/>
              </div>
            </div>

            <span v-if="errors.first('arquivo')" class="label label-danger"> {{ errors.first('arquivo') }}</span>
          </div>
        </div>


        <!-- Data de Vigência -->
        <div class="form-group" :class="{ 'has-error' : errors.first('Vigencia')}" ng-class="{ 'has-error' : frmAddFile.$submitted && frmAddFile.expirationDate.$error.date || frmAddFile.expirationDate.$error.validateChange }">
          <label for="expirationDate" class="control-label col-md-3 col-lg-2">Vigência:</label>
          <div class="col-md-16">
            <div class="col-md-6 col-lg-3">
              <input type="text" ref="Vigencia" name="Vigencia" v-model="dt_data_vigencia" class="form-control" v-mask="'##/##/####'" data-vv-as="Vigencia" :masked="masked" v-validate="'validdate'">
              <span v-if="errors.first('Vigencia')" class="label label-danger"> {{ errors.first('Vigencia') }}</span>
            </div>
          </div>
        </div>


        <!-- Botões -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-9 col-lg-10 col-md-offset-3 col-lg-offset-2">
            <button @click="adicionaDocumento" type="button" class="btn btn-confirm btn-flat" id="cmpt-upload-add"> <i class="fa fa-check" aria-hidden="true"></i> Ok </button>
            <button @click="onCancel" type="button" class="btn btn-back btn-flat" id="cmpt-upload-cancel"> <i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar </button>
          </div>
        </div>


      </div>
    </div>

  </div>

</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import moment from 'moment'
  import { mapGetters } from 'vuex'

  export default {
    name: 'upload-documento',
    data () {
      return {
        documentos: [], // todos os tipos de documentos cadastrado no banco de dados
        tipoVinculo: null,
        idVinculo: null,
        listaVinculos: null,
        loading: {
          show: false
        },
        documento: {
          ds_nome_arquivo: ''
        }, // Objeto documento para upload no banco de dados
        dt_data_vigencia: '',
        file: {}, // arquivo para upload no banco de dados
        tiposPermitidos: '',
        tamanhoPermitido: null,
        image: '',
        localUso: 'TODOS'
      }
    },
    props: ['documentTypes', 'documentosObrigatorios', 'disable', 'listaProjetos', 'listaEntidades'],
    watch: {
      dt_data_vigencia: function (val) {
        let newdate = moment(val, 'DD/MM/YYYY', true)
        if (newdate.isValid()) {
          this.documento.dt_data_vigencia = newdate.format('YYYY-MM-DD')
        }
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created () {
      this.carregaListaTiposDocumentos()
      this.listaVinculos = this.listaProjetos
    },
    methods: {
      carregaListaTiposDocumentos () {
        if (this.localUso === undefined) {
          this.localUso = 'TODOS'
        }
        axiosLaravel.post('documentos/tipos/' + this.localUso).then((response) => {
          this.documentos = _.sortBy(response.data, 'ds_tipo')
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        // se os tipos permitidos e tamanho estiverem vazio busca no banco de dados e guarda no vuex
        if (_.isNull(this.$store.state.uploadDocumentos.tiposPermitidos) || _.isNull(this.$store.state.uploadDocumentos.tamanhoPermitido)) {
          axiosLaravel.get('configuracoes/').then((response) => {
            this.tiposPermitidos = this.$store.state.uploadDocumentos.tiposPermitidos = response.data.documento.tipo_arquivos.map((item) => item.ds_mime_type).join('|')
            this.tamanhoPermitido = this.$store.state.uploadDocumentos.tamanhoPermitido = response.data.documento.dc_tamanho_arquivo * 1024 // Tamanho tem que ser em kb, por isso é multiplicado somente uma vez por 1024
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        } else {
          this.tiposPermitidos = this.$store.state.uploadDocumentos.tiposPermitidos
          this.tamanhoPermitido = this.$store.state.uploadDocumentos.tamanhoPermitido
        }
      },
      vinculoSelecionado (radio) {
        this.idVinculo = null
        this.listaVinculos = (this.tipoVinculo === 'Projeto') ? this.listaProjetos : _.sortBy(this.listaEntidades, 'ds_nome')
        this.localUso = (this.tipoVinculo === 'Projeto') ? 'TODOS' : 'CADASTRO_ENTIDADE'
        this.carregaListaTiposDocumentos()
      },
      handleFileUpload (e) {
        let files = e.target.files || e.dataTransfer.files
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
      adicionaDocumento () {
        this.$validator.validateAll().then((result) => {
          if (result && this.$validator.errors.all().length === 0) {
            this.documento.dt_criado = new Date()
            this.uploadArquivo()
            // this.$emit('mostrarQuadroAdicionaDocumento', false)
          }
        })
      },
      onCancel () {
        this.limparCampos('todos')
        this.$emit('mostrarQuadroAdicionaDocumento', false)
      },
      limparCampos (abrangencia) {
        if (abrangencia === 'todos') {
          this.idVinculo = ''
          this.documento.tipo_documento = null
          // this.errors.items = []
          this.errors.clear()
        }
        $('#file').val('')
        this.documento.dt_data_vigencia = ''
        this.dt_data_vigencia = ''
      },
      uploadArquivo () {
        const data = new FormData()
        data.append('file', this.file)
        this.documento.pk = this.documento.id ? this.documento.id : 0
        this.documento.tipo_vinculo = this.tipoVinculo
        this.documento.id_vinculo = this.idVinculo
        this.documento.loaded = 'upload_direto'
        this.documento.progress = 0
        this.documento.usuario = this.usuarioLogado
        this.documento.issueDate = moment().format('YYYY-MM-DD')
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
          // this.documento = response.data.value
          this.limparCampos()
          this.loading.show = false
          this.$snotify.clear()
          this.$snotify.success('Arquivo incluído!')
        }).catch((error) => {
          console.log('error', error)
          this.loading.show = false
          this.$snotify.clear()
          this.$root.trataErro(error)
        })
      }
    }
  }
</script>

<style scoped>

</style>
