<template>
  <div>

  <!-- LISTA de documento anexados -------------------------------------------------------->
    <div class="form-group" v-if="layout === 'LISTA'">
      <div class="">

        <div class="box-body" v-if="!ehVisualizacao">
          <button @click="novoDocumento" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo documento</button>
        </div>

        <div class="box-body">
          <div class="">
            <table class="table table-condensed table-bordered table-striped" >
              <thead style="text-align: center;">
              <tr>
                <td>Tipo</td>
                <td>Arquivo</td>
                <td>Inclusão</td>
                <td>Vigência</td>
                <td v-if="!ehVisualizacao">Ações</td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(documento, indexDocumento) in propDocumentos" v-if="_.get(documento, 'mostrar', true)" style="text-align: center">
                <td>
                  {{documento.tipo_documento.ds_tipo}}
                  <span v-if="_.has(documento, 'ds_tipo_usuario') && usuarioLogado.userType === 'FUNDACAO'" style="color: var(--cor-destaque); font-size: 10px; margin-left: 15px;"
                        :title="'<h5>' + documento.ds_nome_usuario + '</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large'}">
                  {{documento.ds_tipo_usuario}}
                  </span>
                </td>
                <td><a @click="onDownload(documento)" href="javascript:void(0)" class="ng-binding"><i class="fa fa-download" aria-hidden="true"></i> {{documento.ds_nome_arquivo}}</a></td>
                <td>{{documento.dt_criado | moment('DD/MM/YYYY')}}</td>
                <td>
                  {{documento.dt_data_validade |moment('DD/MM/YYYY')}}
                  <span v-if="idsVerificaVencimento && !_.isNull(idsVerificaVencimento) && (idsVerificaVencimento.length === 0 || _.includes(idsVerificaVencimento, _.get(documento, 'tipo_documento.id', 0)))">
                    <span class="label label-danger" v-if="!_.isEmpty(documento.dt_data_validade) && ((new Date(documento.dt_data_validade) - new Date()) / 86400000) < -1">vencido</span>
                    <span class="label label-warning" v-else-if="!_.isEmpty(documento.dt_data_validade) && ((new Date(documento.dt_data_validade) - new Date()) / 86400000) < 0">vencendo</span>
                  </span>
                </td>
                <td v-if="!ehVisualizacao">
                  <button v-if="!ehVisualizacao" type="button" v-confirm="{ok: retorno => deletaDocumento(indexDocumento, documento), cancel: doNothing,
                             message: `Deseja <b>excluir</b> o documento ${documento.ds_nome_arquivo}? Essa ação é irreversível.`}" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>


  <!-- NOVO documento -------------------------------------------------------->
    <div class="form-group well" v-if="_.includes(['EDICAO'], layout)">
      <div class="">
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('uploadArquivo')}">
          <label for="file" class="control-label col-md-3 col-lg-2" >Arquivo:</label>
          <div class="col-md-6 col-lg-4">
            <div>
              <input type="file" name="uploadArquivo" id="file" ref="file" @change="handleFileUpload" v-validate="{required: true, size: tamanhoPermitido, mimes: tiposPermitidos}"/>
            </div>
            <span v-if="errors.first('uploadArquivo')" class="label label-danger"> Selecione um arquivo</span>
          </div>
        </div>

        <div class="form-group">
          <div class="required-field" :class="{ 'has-error' : errors.first('uploadTipoDocumento')}">
            <label for="uploadTipoDocumento" class="control-label col-md-2">Tipo de documento:</label>
            <div v-if="loading.usosDocumento" class="col-md-4 etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando tipos de documentos disponíveis ...</div>
            <div v-else class="col-md-4">
              <div>
                <select v-model="documento.tipo_documento" v-validate="'required'" name="uploadTipoDocumento" id="uploadTipoDocumento" class="form-control" @change="$forceUpdate()">
                  <option :value="documento" v-for="documento in documentos">{{documento.ds_tipo}}</option>
                </select>
              </div>
              <span v-if="errors.first('uploadTipoDocumento')" class="label label-danger"> Deve classificar o documento em um dos tipos da lista</span>
            </div>
          </div>

          <div :class="_.includes(idsVigenciaObrigatoria, _.get(documento, 'tipo_documento.id', 0)) ? ('required-field ' + (errors.first('uploadDataVigencia') ? 'has-error' : '')) : ''">
            <label class="control-label col-md-2">Vigência:</label>
            <div class="col-md-2">
              <div class="input-group">
                <datepicker  v-model="documento.dt_data_validade" input-class="form-control datepicker" id="uploadDataVigencia" name="uploadDataVigencia"
                             :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" @change="$forceUpdate()"
                             format="dd/MM/yyyy" v-validate="_.includes(idsVigenciaObrigatoria, _.get(documento, 'tipo_documento.id', 0)) ? 'required' : ''">
                </datepicker>
                <span class="input-group-btn" v-if="_.has(documento, 'dt_data_validade')" :title="'<h5>Limpar essa data</h5>'" v-tippy="{inertia:true, arrow:true, placement:'right', animation:'perspective', distance:'1', size:'large'}">
                  <button type="button" @click="_.unset(documento, 'dt_data_validade'); $forceUpdate()" class="btn" style="background: white; border-color: rgb(210, 214, 222); border-width: 1px 0px;"><i class="fa fa-remove"></i></button>
                </span>
              </div>
              <span v-if="errors.first('uploadDataVigencia')" class="label label-danger"> Para este tipo de documento é obrigatório informar a data que expira sua validade</span>
            </div>
          </div>
        </div>
        
      </div>

      <div class="form-group">
        <div class="col-md-10 col-md-offset-2">
          <button @click="adicionaDocumento" type="button" class="btn btn-confirm btn-flat"
                  v-if="!ehVisualizacao && _.has(documento, 'tipo_documento') && _.has(documento, 'file') &&
                  !_.find(errors.items, function(e) { return _.includes(['uploadArquivo', 'uploadDataVigencia', 'uploadTipoDocumento'], e.field) }) &&
                  (!_.includes(idsVigenciaObrigatoria, _.get(documento, 'tipo_documento.id', 0)) || (_.has(documento, 'dt_data_validade') && _.includes(idsVigenciaObrigatoria, _.get(documento, 'tipo_documento.id', 0))))">
            <i class="fa fa-check" aria-hidden="true"></i> Ok
          </button>
          <button @click.once="cancela" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
        </div>
      </div>

    </div>

    <div v-show="loading.adicionando || loading.alterando || loading.excluindo" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

  </div>

</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  export default {
    name: 'upload-documentos-online',
    data () {
      return {
        layout: 'LISTA',
        numeroAtualizacao: 0,
        documentos: [], // todos os tipos de documentos cadastrado no banco de dados
        tiposPermitidos: '',
        tamanhoPermitido: null,
        idsVigenciaObrigatoria: [],
        idsVerificaVencimento: null,
        loading: {
          adicionando: false,
          alterando: false,
          excluindo: false,
          usosDocumento: false
        },
        usosDocumento: 'TODOS',
        //
        documento: {
          ds_nome_arquivo: ''
        }, // Objeto documento para upload no banco de dados
        editando: false,
        file: {} // arquivo para upload no banco de dados
      }
    },
    props: [
      'propDocumentos', 'documentTypes', 'layoutInicial', 'idProcesso', 'ehVisualizacao', 'localUso', 'secaoOrigem', 'processo_ratificacao',
      'vigenciaObrigatoria', // (opcional) Lista com os ids dos tipos de documento que neste contexto devem ter data vigência informada. Não informar, ou informar array vazio ou null então nenhnum é obrigatório. Exs.: [8]  OU  [7, 8, 43]  OU  null  OU  []
      'docsInformaVencimento' // (opcional) Lista com os ids dos tipos de documento que serão sinalizados como estando vencido ou vencendo. Não informar ou null, então nenum será sinalizado, se informar array vazio, então todos os tipos serão verificados ou então lista o que deseja verificar. Exs.: [8]  OU  [7, 8, 43]  OU  null  OU  []
    ],
    created () {
      this.layout = this.layoutInicial || 'LISTA'
      //
      if (!_.isEmpty(this.vigenciaObrigatoria)) {
        this.idsVigenciaObrigatoria = this.vigenciaObrigatoria
      }
      this.idsVerificaVencimento = this.docsInformaVencimento || null
      this.usosDocumento = this.localUso || 'TODOS'
      this.carregaTiposDocumento()
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
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
      localUso: function () {
        this.carregaTiposDocumento()
      },
      vigenciaObrigatoria: function () {
        if (!_.isEmpty(this.vigenciaObrigatoria)) {
          this.idsVigenciaObrigatoria = this.vigenciaObrigatoria
        }
      },
      docsInformaVencimento: function () {
        this.idsVerificaVencimento = this.docsInformaVencimento || null
        this.$forceUpdate()
      }
    },
    methods: {
      carregaTiposDocumento () {
        this.loading.usosDocumento = true
        axiosLaravel.post('documentos/tipos/' + this.localUso).then((response) => {
          this.documentos = this.$store.state.uploadDocumentos.documentos = _.sortBy(response.data, [function (o) { return o.ds_tipo }])
          this.loading.usosDocumento = false
        })
          .catch((error) => {
            this.loading.usosDocumento = false
            this.$root.trataErro(error)
          })
      },
      novoDocumento () {
        this.layout = 'EDICAO'
        this.$emit('layoutAtual', this.layout)
        this.documento = {}
      },
      cancela () {
        this.documento = Object.assign({}, {})
        this.documento.documentType = Object.assign({}, {})
        this.documento.documentType.type = Object.assign({}, '')
        this.file = null
        this.layout = 'LISTA'
        this.$emit('layoutAtual', this.layout)
        this.editando = false
        this.$forceUpdate()
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
        this.$snotify.clear()
        if (!_.isNull(this.idProcesso)) {
          this.loading.adicionando = true
          this.$snotify.info('Anexando arquivo', {timeout: 0})
          this.$emit('acaoProcessamento', this.numeroAtualizacao++)
          this.documento.pk = this.documento.id ? this.documento.id : 0
          this.documento.usuario = this.usuarioLogado
          this.documento.issueDate = moment().format('YYYY-MM-DD')
          const data = new FormData()
          data.append('file', this.file)
          data.append('id_processo', this.idProcesso)
          data.append('local_inclusao', this.secaoOrigem)
          data.append('document', JSON.stringify(this.documento))
          axiosLaravel.post('articulacao/adicionar/arquivo/', data, {
            headers: {'Content-Type': undefined, 'Accept': 'application/json'},
            transformRequest: [function (data, headers) { return data }]
          }).then((response) => {
            this.$snotify.clear()
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              this.$snotify.success('Arquivo anexado', {timeout: 2000})
              this.$emit('arquivoAnexado', response.data.retorno)
              this.cancela()
              this.$emit('acaoSalvar', this.numeroAtualizacao++)
            } else {
              this.$snotify.error(response.data.mensagem)
            }
            this.$emit('acaoAguardando', this.numeroAtualizacao++)
            this.loading.adicionando = false
          }).catch((error) => {
            this.loading.adicionando = false
            this.$emit('acaoAguardando', this.numeroAtualizacao++)
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
        } else {
          this.$dialog.alert('Não pode adicionar anexos antes de salvar/criar esta solicitação', {html: true, animation: 'fade', customClass: 'avisoAlerta'})
        }
      },
      deletaDocumento (indexDocumento, documento) {
        this.$snotify.clear()
        if (!_.isNull(this.idProcesso)) {
          this.loading.excluindo = true
          this.$snotify.success('Arquivo excluido', {timeout: 2000})
          this.$emit('acaoProcessamento', this.numeroAtualizacao++)
          axiosLaravel.post('articulacao/excluir/arquivo/', {'id_processo': this.idProcesso, 'id_documento': documento.id, 'local_inclusao': this.secaoOrigem}).then((response) => {
            this.$snotify.clear()
            if (_.has(response.data, 'codigo')) {
              if (response.data.codigo === 'OK') {
                this.$snotify.success('Arquivo excluido')
                this.propDocumentos.splice(indexDocumento, 1)
                this.$emit('arquivoExcluido', response.data.retorno)
                this.$emit('acaoOk', this.numeroAtualizacao++)
                this.$emit('acaoSalvar', this.numeroAtualizacao++)
              } else if (response.data.codigo === 'DOCUMENTO_NAO_LOCALIZADO') {
                this.propDocumentos.splice(indexDocumento, 1)
                this.$emit('arquivoExcluido', response.data.retorno)
                this.$emit('acaoOk', this.numeroAtualizacao++)
              } else {
                this.$snotify.error(response.data.mensagem)
              }
            }
            this.$forceUpdate()
            this.$emit('acaoAguardando', this.numeroAtualizacao++)
            this.loading.excluindo = false
          }).catch((error) => {
            this.loading.excluindo = false
            this.$emit('acaoAguardando', this.numeroAtualizacao++)
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
        } else {
          this.$dialog.alert('Não pode adicionar anexos antes de Criar este parceiro no SGP', {html: true, animation: 'fade', customClass: 'avisoAlerta'})
        }
      }
    }
  }
</script>

<style scoped>

</style>
