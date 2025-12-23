<template>

  <div>
    <!-- form de documentos-->
    <div v-if="!showGrid" style="padding-left:0" class="column all-start well well-sm no-shadow">
      <div class="column all-start prest-upload">
        <!-- Tipo de documento -->
        <div class="required-field prest-upload-input row-flex centered-start" :class="{ 'has-error' : errors.first('tipo de documento')}">
          <label for="tipo de documento" class="f-required prest-upload-label">Tipo de documento:</label>
            <div>
              <select v-model="documento.tipo_documento" v-validate="'required'" name="tipo de documento" id="tipo de documento"
                      class="form-control ng-pristine ng-untouched ng-valid ng-not-empty">
                <option :value="documento" v-for="documento in documentos">{{documento.ds_tipo}}</option>
              </select>
            </div>
            <span v-if="errors.first('tipo de documento')" class="label label-danger"> {{ errors.first('tipo de documento') }}</span>
        </div>
        <!-- file -->
        <div class="required-field prest-upload-input row-flex centered-start"
             :class="{ 'has-error' : errors.first('arquivo')}">
              <label for="file" class="f-required prest-upload-label" >Arquivo:</label>
              <input type="file" name="arquivo" id="file" ref="file" @change="handleFileUpload" :accept="restricaoArquivo? '.pdf, application/pdf' : '*'" v-validate="{required: false, size: tamanhoPermitido, mimes: tiposPermitidos}"/>
              <div v-if="analise.hasOwnProperty('analise')"> <i :class="'fa' + (analise.analise.RESPOSTA === 'SIM' ? ' fa-check text-success' : ' fa-times text-danger')" aria-hidden="true"></i> {{ analise.analise.RESPOSTA == 'NÃO' ? 'Arquivo não classificado como documento fiscal' : 'Arquivo válido' }}</div> <div v-if="analisandoArquivo"> <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Analisando arquivo...</div>
            <span v-if="errors.first('arquivo')" class="label label-danger"> {{ errors.first('arquivo') }}</span>
        </div>
<!---->
        <!-- expiration date -->
        <div class="prest-upload-input row-flex centered-start" ng-class="{ 'has-error' : frmAddFile.$submitted && frmAddFile.expirationDate.$error.date || frmAddFile.expirationDate.$error.validateChange }">
          <label for="expirationDate" class="prest-upload-label">Vigência:</label>
            <div>
              <div ng-if="!$ctrl.flagNovoDocumento"  approval="$ctrl.approval" state="$ctrl.approvalStateForm">
                <datepicker  v-model="documento.expirationDate" input-class="form-control datepicker"
                             :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                             format="dd/MM/yyyy">
                </datepicker>
              </div>
          </div>
        </div>
        <div style="color: red;" v-if="restricaoArquivo">
          Formato: <b>PDF</b>
        </div>
        <div style="color: red;">
          Tamanho máximo: <b>4 MB</b> <i v-if="restricaoArquivo"> / 10 Mil Caracteres</i>
        </div>
        <div style="color: red;" v-if="restricaoArquivo">
          *Atenção: arquivos com resolução baixa podem <b>não ser reconhecidos pelo sistema</b>.
        </div>
        <div v-if="analise.analise" class="prest-analise-ia-container row-flex centered-start">
          <div v-if="analise.analise.RESPOSTA === 'NÃO'" class="prest-analise-ia-item row-flex centered-start">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Análise do arquivo: {{ analise.analise.DESCRITIVO }}
          </div>
        </div>
<!---->
        <!-- buttons -->
        <div class="row-flex centered-start prest-upload-button-container" style="margin-bottom:0">
            <button v-if="!restricaoArquivo" @click="adicionaDocumento" type="button"
                    class="btn btn-primary btn-flat" id="cmpt-upload-add">
              <i class="fa fa-check" aria-hidden="true"></i> Ok
            </button>
            <div v-if="restricaoArquivo && !analisandoArquivo && analise.hasOwnProperty('analise') && analise.analise.RESPOSTA === 'SIM'">
              <button @click="adicionaDocumento" type="button"
                      class="btn btn-primary btn-flat" id="cmpt-upload-add">
                <i class="fa fa-check" aria-hidden="true"></i> Ok
              </button>
            </div>
            <button @click="onCancel" type="button"
                    class="btn btn-default btn-flat" id="cmpt-upload-cancel">
              <i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar
            </button>
        </div>
      </div>
    </div>


    <!-- grid de documentos-->
    <div v-if="showGrid">
      <input type="hidden" id="myField" name="myField" value="" />
      <div class="row" v-if="!disableAdd">
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
                <!-- <td>Vigência</td> -->
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
                <!-- <td>{{documento.dt_data_validade |moment('DD/MM/YYYY')}}</td> -->
                <td v-if="!disable">
                  <!-- <button v-if="!disable" type="button" @click="editaDocumento(documento)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</button> -->
                  <button v-if="!disable" type="button" @click="deletaDocumento(indexDocumento, documento)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</button>
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
    name: 'upload-documentos-php-prestacao',
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
        tamanhoPermitido: 10 * 1024, // Tamanho máximo do arquivo em bytes (10 MB)
        image: '',
        arquivoAnalise: {},
        analise: {},
        textoOCR: {},
        analisandoArquivo: false
      }
    },
    props: ['propDocumentos', 'documentTypes', 'documentosObrigatorios', 'disable', 'localUso', 'desvinculaAnexo', 'disableAdd', 'restricaoArquivo'],
    created () {
      this.analise = {}
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
      // // se os tipos permitidos e tamanho estiverem vazio busca no banco de dados e guarda no vuex
      // if (_.isNull(this.$store.state.uploadDocumentos.tiposPermitidos) || _.isNull(this.$store.state.uploadDocumentos.tamanhoPermitido)) {
      //   axiosLaravel.get('configuracoes/').then((response) => {
      //     // this.tiposPermitidos = this.$store.state.uploadDocumentos.tiposPermitidos = response.data.documento.tipo_arquivos.map((item) => item.ds_mime_type).join('|')
      //     this.tamanhoPermitido = this.$store.state.uploadDocumentos.tamanhoPermitido = response.data.documento.dc_tamanho_arquivo * 1024 // Tamanho tem que ser em kb, por isso é multiplicado somente uma vez por 1024
      //   })
      //     .catch((error) => {
      //       this.$root.trataErro(error)
      //     })
      // } else {
      //   // this.tiposPermitidos = this.$store.state.uploadDocumentos.tiposPermitidos
      //   this.tamanhoPermitido = this.$store.state.uploadDocumentos.tamanhoPermitido
      // }
    },
    methods: {
      novoDocumento () {
        this.showGrid = !this.showGrid
        this.documento = {}
        this.analise = {}
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
      async handleFileUpload (e) {
        console.log('handleFileUpload', e)
        let files = e.target.files || e.dataTransfer.files
        this.arquivoAnalise = {}
        // Se tiver restrição de arquivo, faz a analise com o Genera AI
        if (this.restricaoArquivo) {
          this.arquivoAnalise = files[0]
          // this.extraiTextoArquivo()
          // await this.extraiTextoSemIA()
          await this.OCRLocal()
        }
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
      deletaDocumento (indexDocumento, documento) {
        // PS: Tem que fazer isso senão o this não funciona (tsc)
        let vm = this
        this.$dialog.confirm('Confirma a exclusão do anexo? Essa ação <b>não</b> pode ser desfeita.', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'})
                        .then(function (dialog) {
                          vm.propDocumentos.splice(indexDocumento, 1)
                          console.log('documento', documento)
                          if (documento.id) {
                            console.log('desvinculaAnexo', documento.id)
                            vm.desvinculaAnexo(documento.id)
                          }
                          vm.$forceUpdate()
                        }).catch(function () {
                          console.log('cancelado')
                        })
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
      async extraiTextoArquivo () {
        console.log('extraiTextoArquivoEAnaliseGeneraAI')
        this.analisandoArquivo = true
        this.analise = {}
        let formData = new FormData()
        formData.append('arquivo', this.arquivoAnalise)
        this.$snotify.info('Analisando arquivo', {timeout: 0})
        await axiosLaravel.post('http://localhost/api/extrairTexto', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        }).then((response) => {
          console.log('extraiTextoArquivo response', response.data)
          this.analise = response.data
          this.$snotify.clear()
          this.$snotify.success('Análise concluída. Continue com o cadastro do documento.', {timeout: 5000})
          this.analisandoArquivo = false
        })
          .catch((error) => {
            this.analisandoArquivo = false
            console.log('error', error)
            this.$snotify.clear()
            this.$snotify.error('Erro ao analisar o arquivo. Tente novamente mais tarde.', {timeout: 5000})
          })
      },
      async extraiTextoSemIA () {
        console.log('extraiTexto')
        this.analisandoArquivo = true
        this.analise = {}
        let formData = new FormData()
        formData.append('arquivo', this.arquivoAnalise)
        this.$snotify.info('Analisando arquivo', {timeout: 0})
        await axiosLaravel.post('https://iae.fbb.org.br/api/OCR', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        }).then((response) => {
          console.log('extraiTextoArquivo response', response.data)
          // this.analise = response.data
          // verifica se texto está vazio
          if (!response.data.texto || response.data.texto.trim() === '') {
            this.$snotify.clear()
            this.$snotify.success('Análise concluída. Continue com o cadastro do documento.', {timeout: 5000})
            this.analise.analise = { RESPOSTA: 'NÃO', DESCRITIVO: 'Documento inválido.' }
            this.analisandoArquivo = false
            return
          }
          this.analisarComIA(response.data.texto)
        })
          .catch((error) => {
            this.analisandoArquivo = false
            console.log('error', error)
            this.$snotify.clear()
            this.$snotify.error('Erro ao analisar o arquivo. Tente novamente mais tarde.', {timeout: 5000})
          })
      },
      async OCRLocal () {
        console.log('OCRLocal')
        this.analisandoArquivo = true
        this.analise = {}
        let formData = new FormData()
        formData.append('arquivo', this.arquivoAnalise)
        this.$snotify.info('Analisando arquivo', {timeout: 0})
        // Chama o serviço de OCR do iaê pelo Laravel do SGP (pra funcionar em produção)
        await axiosLaravel.post('/prestacaoSimplificada/chamarServiceOCR', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        }).then((response) => {
          console.log('extraiTextoArquivo response', response.data)
          // this.analise = response.data
          // verifica se texto está vazio
          if (!response.data.resultado.texto || response.data.resultado.texto.trim() === '') {
            this.$snotify.clear()
            this.$snotify.success('Análise concluída. Continue com o cadastro do documento.', {timeout: 5000})
            this.analise.analise = { RESPOSTA: 'NÃO', DESCRITIVO: 'Documento inválido.' }
            this.analisandoArquivo = false
            return
          } else {
            this.$snotify.clear()
            this.$snotify.success('Análise concluída. Continue com o cadastro do documento.', {timeout: 5000})
            this.analisandoArquivo = false
            this.$forceUpdate()
            this.analise = response.data.resultado
          }
          console.log('Análise da IA:', this.analise)
        })
          .catch((error) => {
            this.analisandoArquivo = false
            console.log('error', error)
            this.$snotify.clear()
            this.$snotify.error('Erro ao analisar o arquivo. Tente novamente mais tarde.', {timeout: 5000})
          })
      },
      async analisarComIA (input) {
        // Crie o prompt a partir desse: $prompt = "Analise o texto a seguir que foi extraído de um OCR e responda com um JSON, contendo RESPOSTA: SIM ou NÃO, DESCRITIVO: Em 5 palavras, o que pode ser o documento enviado: o texto é um documento fiscal?\n\nTexto:\n$texto";
        let prompt = `Analise o texto a seguir que foi extraído de um OCR e responda com um JSON, contendo RESPOSTA: SIM ou NÃO, DESCRITIVO: Em 5 palavras, o que pode ser o documento enviado: o texto é um documento fiscal?\n\nTexto:\n${input}`
        console.log('Pesquisando IA com o prompt:', prompt)
        this.analisandoArquivo = true
        let data = {
          input: prompt,
          intents: [{}],
          entities: [{}]
        }
        try {
          const response = await axiosLaravel.post('http://acs-assist-fbb-chatbot.nia.servicos.bb.com.br/assistente/', data)
          // Verifica se a resposta que veio é um JSON parseavel
          let resposta = response.data.data.context.messages[1].content
          resposta = resposta.replace(/```json|```/g, '').trim() // Remove as marcações de código JSON
          try {
            this.analise.analise = JSON.parse(resposta)
          } catch (e) {
            console.error('Erro ao parsear resposta da IA:', e)
            this.analise.analise = { RESPOSTA: 'NÃO', DESCRITIVO: 'Análise não concluída por erro de sistema.' }
          }
          console.log(resposta)
          console.log('Análise da IA:', this.analise)
          this.$snotify.clear()
          this.$snotify.success('Análise concluída. Continue com o cadastro do documento.', {timeout: 5000})
          this.analisandoArquivo = false
          this.$forceUpdate()
        } catch (error) {
          this.analisandoArquivo = false
          console.error('Erro ao pesquisar IA:', error)
          this.$root.trataErro(error)
        }
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

<style src="../../../../static/css/prestacaoContasNovo.css">
</style>
