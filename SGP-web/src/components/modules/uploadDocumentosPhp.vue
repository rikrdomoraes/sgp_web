<template>

  <div>
    <!-- form de documentos-->
    <div v-if="!showGrid" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-12">
        <!-- Tipo de documento -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('tipo de documento')}">
          <label for="tipo de documento" class="control-label col-md-3 col-lg-2">Tipo de documento:</label>
          <div class="col-md-6 col-lg-4">
            <div>
              <select v-model="documento.tipo_documento" v-validate="'required'" name="tipo de documento" id="tipo de documento"
                      class="form-control ng-pristine ng-untouched ng-valid ng-not-empty">
                <option :value="documento" v-for="documento in documentos">{{documento.ds_tipo}}</option>
              </select>
            </div>
            <span v-if="errors.first('tipo de documento')" class="label label-danger"> {{ errors.first('tipo de documento') }}</span>
          </div>
        </div>
        <!-- file -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('arquivo')}">
          <label for="file" class="control-label col-md-3 col-lg-2" >Arquivo:</label>
          <div class="col-md-6 col-lg-4">
            <div>
              <input type="file" name="arquivo" id="file" ref="file" @change="handleFileUpload" v-validate="{required: true, size: tamanhoPermitido, mimes: tiposPermitidos}"/>
            </div>
            <span v-if="errors.first('arquivo')" class="label label-danger"> {{ errors.first('arquivo') }}</span>
          </div>
        </div>
<!---->
        <!-- expiration date -->
        <div class="form-group" ng-class="{ 'has-error' : frmAddFile.$submitted && frmAddFile.expirationDate.$error.date || frmAddFile.expirationDate.$error.validateChange }">
          <label for="expirationDate" class="control-label col-md-3 col-lg-2">Vigência:</label>
          <div class="col-md-3">
            <div class="input-group">
              <div ng-if="!$ctrl.flagNovoDocumento"  approval="$ctrl.approval" state="$ctrl.approvalStateForm">
                <datepicker  v-model="documento.expirationDate" input-class="form-control datepicker"
                             :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                             format="dd/MM/yyyy">
                </datepicker>
              </div>
            </div>
          </div>
        </div>
<!---->
        <!-- buttons -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-9 col-lg-10 col-md-offset-3 col-lg-offset-2">
            <button @click="adicionaDocumento" type="button"
                    class="btn btn-primary btn-flat" id="cmpt-upload-add">
              <i class="fa fa-check" aria-hidden="true"></i> Ok
            </button>
            <button @click="onCancel" type="button"
                    class="btn btn-default btn-flat" id="cmpt-upload-cancel">
              <i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- grid de documentos-->
    <div v-if="showGrid">
      <input type="hidden" id="myField" name="myField" value="" />
      <div class="row" v-if="!disable">
        <div class="col-sm-12">
          <button @click="novoDocumento" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo documento</button>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
      <br>
      <div class="row">
        <div class="col-sm-12">
          <div class="table-responsive">
            <table class="table table-condensed table-bordered table-striped" >
              <thead style="text-align: center;">
              <tr>
                <td>Tipo</td>
                <td>Arquivo</td>
                <td>Inclusão</td>
                <td>Vigência</td>
                <td v-if="!disable">Ações</td>
              </tr>
              </thead>
              <tbody>
              <!--Lista de documentos esperados -->
              <!--Só mostra os documentos que ainda não foram enviados-->
              <tr v-for="pendente in documentTypes" v-if="!existeDocumento(pendente)"  style="text-align: center" align="center">
                <td>{{pendente.type}}</td>
                <td><span class="text-danger"><i class="fa fa-asterisk" aria-hidden="true"></i> Pendente</span></td>
                <td>-</td>
                <td>-</td>
                <td align="center"><button type="button" style="max-width: 135px; text-align:center;" @click="onAddFile(pendente)" class="btn btn-primary btn-sm btn-flat btn-block" v-if="!disable"><i class="fa fa-plus-circle" aria-hidden="true"></i> Adicionar arquivo</button></td>
              </tr>
              <tr v-for="(documento, indexDocumento) in propDocumentos"  style="text-align: center">
                <td>{{documento.tipo_documento.ds_tipo}}</td>
                <td><a @click="onDownload(documento)" href="javascript:void(0)" class="ng-binding"><i class="fa fa-download" aria-hidden="true"></i> {{documento.ds_nome_arquivo}}</a></td>
                <td>{{documento.dt_criado | moment('DD/MM/YYYY')}}</td>
                <td>{{documento.dt_data_validade |moment('DD/MM/YYYY')}}</td>
                <td v-if="!disable">
                  <button v-if="!disable" type="button" @click="editaDocumento(documento)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</button>
                  <button v-if="!disable" type="button" @click="deletaDocumento(indexDocumento)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </div>



  </div>

</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import moment from 'moment'
  export default {
    name: 'upload-documentos-php',
    data () {
      return {
        showGrid: true,
        documentos: [], // todos os tipos de documentos cadastrado no banco de dados
        documento: {
          ds_nome_arquivo: ''
        }, // Objeto documento para upload no banco de dados
        documentoTabela: {},
        editando: false,
        file: {}, // arquivo para upload no banco de dados
        tiposPermitidos: '',
        tamanhoPermitido: null,
        image: '',
        localUso: 'TODOS'
      }
    },
    props: ['propDocumentos', 'documentTypes', 'documentosObrigatorios', 'disable', 'localUso'],
    created () {
      if (_.isUndefined(this.localUso)) {
        this.localUso = 'TODOS'
      }
      if (this.localUso === 'TODOS') {
        if (_.isEmpty(this.$store.state.uploadDocumentos.documentos)) {
          axiosLaravel.post('documentos/tipos/' + this.localUso).then((response) => {
            this.documentos = this.$store.state.uploadDocumentos.documentos = _.sortBy(response.data, [function (o) { return o.ds_tipo }])
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        } else {
          this.documentos = this.$store.state.uploadDocumentos.documentos
        }
      } else {
        axiosLaravel.post('documentos/tipos/' + this.localUso).then((response) => {
          this.documentos = _.sortBy(response.data, [function (o) { return o.ds_tipo }])
          console.log('this.documentos', this.documentos)
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      }
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
    methods: {
      novoDocumento () {
        this.showGrid = !this.showGrid
        this.documento = {}
      },
      existeDocumento (documento) {
        // Retorna se o tipo do documento passado já existe no array de documentos enviados
        return this.propDocumentos.some((item) => {
          if (documento.tipo_documento) {
            return documento.tipo_documento.ds_tipo === item.tipo_documento.ds_tipo
          }
        })
      },
      onDownload (documento) {
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
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
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
            // this.uploadArquivo()
            this.documento.dt_criado = new Date()
            if (this.editando === true) {
              for (let i in this.documento) this.documentoTabela[i] = this.documento[i]
              this.documentoTabela = Object.assign({}, this.documento)
            } else {
              this.propDocumentos.push(this.documento)
            }
            this.onCancel()
            // this.$snotify.clear()
            // this.$snotify.success('Arquivo salvo com sucesso')
          }
        })
      },
      onCancel () {
        this.documento = Object.assign({}, {})
        this.documento.documentType = Object.assign({}, {})
        this.documento.documentType.type = Object.assign({}, '')
        this.file = null
        this.showGrid = true
        this.editando = false
        this.$forceUpdate()
      },
      deletaDocumento (indexDocumento) {
        this.propDocumentos.splice(indexDocumento, 1)
        this.$forceUpdate()
      },
      onAddFile (pendente) {
        this.documento.documentType = pendente
        this.showGrid = !this.showGrid
      },
      editaDocumento (documento) {
        this.documento = Object.assign({}, documento)
        this.showGrid = !this.showGrid
        this.documentoTabela = documento
        this.editando = true
      },
      uploadArquivo () {
        const data = new FormData()
        data.append('file', this.file)
        this.documento.pk = this.documento.id ? this.documento.id : 0
        this.documento.loaded = 'upload'
        this.documento.progress = 0
        this.documento.issueDate = moment().format('YYYY-MM-DD')
        data.append('document', JSON.stringify(this.documento))
        this.$snotify.info('Subindo arquivo', {timeout: 0})
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
          this.documento = response.data.value
          if (this.editando === true) {
            for (let i in this.documento) this.documentoTabela[i] = this.documento[i]
            this.documentoTabela = Object.assign({}, this.documento)
          } else {
            this.propDocumentos.push(this.documento)
          }
          this.onCancel()
          this.$snotify.clear()
          this.$snotify.success('Arquivo salvo com sucesso')
        })
          .catch((error) => {
            console.log('error', error)
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      }
    }
  }
</script>

<style scoped>

</style>
