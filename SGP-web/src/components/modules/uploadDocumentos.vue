<template>

  <div>
    <!-- form de documentos-->
    <div v-if="!showGrid" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-12">
        <!-- Tipo d edocumento -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('tipo de documento')}">
          <label for="tipo de documento" class="control-label col-md-3 col-lg-2">Tipo de documento:</label>
          <div class="col-md-6 col-lg-4">
            <div ng-if="!$ctrl.flagNovoDocumento" approval="$ctrl.approval" state="$ctrl.approvalStateForm">
              <select v-model="documento.documentType" name="tipo de documento" id="tipo de documento"
                      class="form-control ng-pristine ng-untouched ng-valid ng-not-empty" v-validate="'required'">
                <option :value="documento" v-for="documento in documentos">{{documento.type}}</option>
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
        <!-- expiration date -->
        <div class="form-group" ng-class="{ 'has-error' : frmAddFile.$submitted && frmAddFile.expirationDate.$error.date || frmAddFile.expirationDate.$error.validateChange }">
          <label for="expirationDate" class="control-label col-md-3 col-lg-2">Vigência:</label>
          <div class="col-md-3">
            <div class="input-group">
              <div ng-if="!$ctrl.flagNovoDocumento"  approval="$ctrl.approval" state="$ctrl.approvalStateForm">
                <datepicker name="expirationDate" v-model="documento.expirationDate" input-class="form-control datepicker"
                            :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                            format="dd/MM/yyyy">
                </datepicker>
              </div>
            </div>
          </div>
        </div>
        <!-- buttons -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-9 col-lg-10 col-md-offset-3 col-lg-offset-2">
            <button @click="onAdd" type="button"
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


    <!-- grid -->
    <div v-if="showGrid">
      <input type="hidden" id="myField" name="myField" value="" />
      <div class="row" v-if="!disable">
        <div class="col-sm-12">
          <button @click="onNew" uib-tooltip="Adiciona um documento" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo documento</button>
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
                <td>Ações</td>
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
                <td v-if="_.has(documento.documentType, 'type')">{{documento.documentType.type}}</td>
                <td v-else="!_.has(documento.documentType, 'type')"></td>
                <td><a @click="onDownload(documento)" href="javascript:void(0)" class="ng-binding"><i class="fa fa-download" aria-hidden="true"> {{documento.fileName}}</i></a></td>
                <td>{{documento.createdAt | moment('DD/MM/YYYY')}}</td>
                <td>{{documento.expirationDate | moment('DD/MM/YYYY')}}</td>
                <td>
                  <button v-if="!disable" type="button" @click="onEdit(documento)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</button>
                  <button v-if="!disable" type="button" @click="onDelete(indexDocumento)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</button>
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
    name: 'upload-documentos',
    data () {
      return {
        showGrid: true,
        documentos: [], // todos os tipos de documentos cadastrado no banco de dados
        documento: {}, // Objeto documento para upload no banco de dados
        documentoTabela: {},
        editando: false,
        file: {}, // arquivo para upload no banco de dados
        tiposPermitidos: '',
        tamanhoPermitido: null
      }
    },
    props: ['propDocumentos', 'documentTypes', 'documentosObrigatorios', 'disable'],
    created () {
      if (_.isEmpty(this.$store.state.uploadDocumentos.documentos)) {
        axiosLaravel.post('documentos/tipos/' + this.localUso).then((response) => {
          this.documentos = this.$store.state.uploadDocumentos.documentos = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      } else {
        this.documentos = this.$store.state.uploadDocumentos.documentos
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
      onNew () {
        this.showGrid = !this.showGrid
        this.documento = {}
      },
      existeDocumento (documento) {
        // console.log('rlmb', documento)
        // Retorna se o tipo do documento passado já existe no array de documentos enviados
        return this.propDocumentos.some((item) => {
          return documento.type === item.documentType.type
        })
      },
      onDownload (documento) {
        axios.get('proxy/document/documents/' + documento.id + '/download', {responseType: 'arraybuffer'}).then((response) => {
          let ie = !!window.MSInputMethodContext && !!document.documentMode
          if (!ie) {
            let blob = new Blob([response.data], { type: documento.contentType })
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = documento.fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            let blob = new Blob([response.data], { type: documento.contentType })
            let link = document.createElement('blob')
            link.href = window.navigator.msSaveOrOpenBlob(blob, documento.fileName)
            link.download = documento.fileName
            link.click()
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      handleFileUpload () {
        this.file = this.$refs.file.files[0]
      },
      onAdd () {
        this.$validator.validateAll().then((result) => {
          if (result && this.$validator.errors.all().length === 0) {
            this.uploadArquivo()
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
      onDelete (indexDocumento) {
        this.propDocumentos.splice(indexDocumento, 1)
        this.$forceUpdate()
      },
      onAddFile (pendente) {
        this.documento.documentType = pendente
        this.showGrid = !this.showGrid
      },
      onEdit (documento) {
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
        axios.post('proxy/document/documents', data, {
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
