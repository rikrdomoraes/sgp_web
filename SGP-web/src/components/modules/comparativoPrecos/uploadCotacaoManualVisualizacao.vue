<template>

  <div>
    <!-- form de documentos-->
    <div v-if="!showGrid" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-16">
        <!-- Tipo de documento -->
        <div class="form-group required-field" :class="{ 'has-error' : errors.first('tipo de documento')}">
          <label for="tipo de documento" class="control-label col-md-4 col-lg-3">Tipo de documento:</label>
          <div class="col-md-16">
            <div class="col-md-6 col-lg-4" v-if="editando">
              <input type="text" class="form-control" disabled v-model="documento.tipo_documento.ds_tipo">          
            </div>
            <div class="col-md-6 col-lg-4" v-else>
              <select v-model="documento.tipo_documento" v-validate="'required'" name="tipo de documento"
                      id="tipo de documento" :disabled="desativado || editando"
                      class="form-control ng-pristine ng-untouched ng-valid ng-not-empty">
                <option :value="tipoDocumento" v-for="tipoDocumento in documentos" :key="documento.id">{{tipoDocumento.ds_tipo}}</option>
              </select>
            </div>
            <div class="col-sm-offset-2 fa-lg"
                 v-if="_.hasIn(mudancas, 'tipo_documento') && ocultaIcone === false && _.isEmpty(conteudoAnterior)">
              <span class="fa fa-warning" style="position:relative; top:8px; margin-left:2px; color: #048019;"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
              ></span>
            </div>
            <div class="col-sm-offset-2 fa-lg"
                 v-if="_.hasIn(conteudoAnterior, 'tipo_documento') && ocultaIcone === false">
              <span class="fa fa-warning" style="position:relative; top:8px; margin-left:2px; color: red;"
                    :title="'<h5>Conteúdo anterior: ' + conteudoAnterior.tipo_documento.ds_tipo + '</h5>'"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
              ></span>
            </div>
            <span v-if="errors.first('tipo de documento')" class="label label-danger"> {{ errors.first('tipo de documento') }}</span>
          </div>
        </div>
        <!-- file -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('arquivo')}">
          <label for="file" class="control-label col-md-4 col-lg-3">Arquivo:</label>
          <div class="col-md-16">
            <div class="col-md-6 col-lg-4">
              <div v-if="editando">
                <a @click="onDownload(documento)" href="javascript:void(0)" class="ng-binding"><i
                  class="fa fa-download" aria-hidden="true"></i> {{documento.ds_nome_arquivo}}</a>
              </div>
              <div v-else>
                <input type="file" name="arquivo" id="file" ref="file" :disabled="desativado" @change="handleFileUpload"
                       v-validate="{required: true, size: tamanhoPermitido, mimes: tiposPermitidos}"/>
              </div>              
            </div>
            <div class="col-md-2 fa-lg"
                 v-if="_.hasIn(mudancas, 'ds_nome_arquivo') && ocultaIcone === false && _.isEmpty(conteudoAnterior)">
              <span class="fa fa-warning" style="position:relative; top:6px; margin-left:-50px; color: #048019;"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
              ></span>
            </div>

            <div class="col-md-2 fa-lg" v-if="_.hasIn(conteudoAnterior, 'ds_nome_arquivo') && ocultaIcone === false">
              <span class="fa fa-warning" style="position:relative; top:6px; margin-left:-50px; color: red;"
                    :title="'<h5>Conteúdo anterior: ' + conteudoAnterior.ds_nome_arquivo + '</h5>'"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
              ></span>
            </div>

            <span v-if="errors.first('arquivo')" class="label label-danger"> {{ errors.first('arquivo') }}</span>
          </div>
        </div>
        <!---->
        <!-- expiration date -->
        <div class="form-group"
             :class="{ 'has-error' : errors.first('Vigencia')}"
             ng-class="{ 'has-error' : frmAddFile.$submitted && frmAddFile.expirationDate.$error.date || frmAddFile.expirationDate.$error.validateChange }">
          <!-- <label for="expirationDate" class="control-label col-md-4 col-lg-3">Vigência:</label> -->
          <div class="col-md-16">

            <div class="col-md-2 fa-lg"
                 v-if="_.hasIn(mudancas, 'dt_data_vigencia') && ocultaIcone === false && _.isEmpty(conteudoAnterior)">
                <span class="fa fa-warning" style="position:relative; top:8px; margin-left:-10px; color: #048019;"
                      v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                ></span>
            </div>

            <div class="col-md-2 fa-lg" v-if="_.hasIn(conteudoAnterior, 'dt_data_vigencia') && ocultaIcone === false">
                  <span class="fa fa-warning" style="position:relative; top:8px; margin-left:-10px; color: red;"
                        :title="'<h5>Conteúdo anterior: ' + conteudoAnterior.dt_data_vigencia + '</h5>'"
                        v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                  ></span>
            </div>
          </div>
        </div>

      </div>
    </div>


    <div v-if="showGrid">
      <input type="hidden" id="myField" name="myField" value=""/>
      <div class="row" v-if="!disable">

        <br>
        <div class="col-sm-12">
          <div v-if="mostraInclusao === true && mostraInclusao">
              <span class="fa fa-warning" style="position:relative; top:8px; margin-left:1px; color: #048019;"
                    :title="'<h5>Inclusões: ' + inclDocTexto + '</h5>'"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', placement : 'right', size: 'large', arrow : true }"
              ><label class="control-label" style="color: #000;">&nbsp Houve a inserção de novo(s) documento(s)</label>
                </span>
          </div>
          <div v-if="mostraExclusao === true && mostraExclusao">
              <span class="fa fa-warning" style="position:relative; top:8px; margin-left:1px; color: #808080;"
                    :title="'<h5>Exclusões: ' + excDocTexto + '</h5>'"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', placement : 'right', size: 'large', arrow : true }"
              ><label class="control-label" style="color: #000;">&nbsp Houve a exclusão de documento(s)</label>
              </span>
          </div>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
      <br>
      <div class="row">
        <div class="col-sm-12">
          <div class="table-responsive">
            <table class="table table-condensed table-bordered table-striped">
              <thead style="text-align: center;">
              <tr>
                <td>Tipo</td>
                <td>Arquivo</td>
                <td>Inclusão</td>
                <!-- <td>Vigência</td> -->
                <!-- <td v-if="!disable">Ações</td> -->
              </tr>
              </thead>
              <tbody>
              <!--Lista de documentos esperados -->
              <!--Só mostra os documentos que ainda não foram enviados-->
              <tr v-for="pendente in documentTypes" v-if="!existeDocumento(pendente)" style="text-align: center"
                  align="center">
                <td>{{pendente.ds_tipo}}</td>
                <td><span class="text-danger"><i class="fa fa-asterisk" aria-hidden="true"></i> Pendente</span></td>
                <td>-</td>
                <td>-</td>
                <td align="center">
                </td>
              </tr>
              <tr v-for="(documento, indexDocumento) in propDocumentos" :value="documento" :key="indexDocumento"
                  style="text-align: center">
                <td v-if="documento.tipo_documento">{{documento.tipo_documento.ds_tipo}}</td>
                <td v-else> </td>
                <td><a @click="onDownload(documento)" href="javascript:void(0)" class="ng-binding"><i
                  class="fa fa-download" aria-hidden="true"></i> {{documento.ds_nome_arquivo}}</a></td>
                <td>{{documento.dt_criado | moment('DD/MM/YYYY')}}</td>
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
  import {detailedDiff} from 'deep-object-diff'
  import download from 'downloadjs'

  export default {
    name: 'uploadCotacaoManual',
    data () {
      return {
        showGrid: true,
        tamanho: 0,
        contador: 0,
        tamanhoFormatado: 0,
        salvou: false,
        acmTamanho: 0,
        totalMb: 0,
        documentos: [], // todos os tipos de documentos cadastrado no banco de dados
        documento: {
          ds_nome_arquivo: '',
          ligacao_sub_type: ''
        }, // Objeto documento para upload no banco de dados
        documentoTabela: {},
        editando: false,
        mostraInclusao: false,
        mostraExclusao: false,
        mostraAlteracao: false,
        dt_data_vigencia: '',
        indiceAlt: -1,
        ocultaIcone: false,
        file: {}, // arquivo para upload no banco de dados
        tiposPermitidos: '',
        tamanhoPermitido: null,
        image: '',
        listaOrdenada: {},
        mudancas: [],
        conteudoAnterior: {},
        table: {
          items: this.propDocumentos,
          filter: null,
          hover: true,
          bordered: true,
          totalRows: 0,
          currentPage: 1,
          perPage: 100,
          sortBy: 'dt_criado',
          sortDesc: true,
          fields: [
            {
              key: 'tipo_documento.ds_tipo',
              label: 'Tipo',
              sortable: true,
              thStyle: 'text-align: center; width: 35%',
              class: 'text-center'
            },
            {
              key: 'ds_nome_arquivo',
              label: 'Arquivo',
              sortable: true,
              thStyle: 'text-align: center; width: 30%',
              class: 'text-center'
            },
            {key: 'dt_criado', label: 'Inclusão', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            // {
            //   key: 'dt_data_validade',
            //   label: 'Vigência',
            //   sortable: true,
            //   thStyle: 'text-align: center',
            //   class: 'text-center'
            // },
            {key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center'}
          ]
        }
      }
    },
    props: ['propDocumentos', 'documentTypes', 'documentosObrigatorios', 'disable', 'localUso', 'mudaDocumento', 'diferenca', 'analise', 'revisao', 'salvouOK', 'propsEtapa', 'faseProposta', 'editandoAlteracaoProjeto', 'editandoProrrogacao', 'maxFiles'],
    watch: {
      propDocumentos: function () {
        this.table.items = this.propDocumentos
        this.table.totalRows = this.table.items.length
        if (this.disable === 'disable') {
          this.desativado = this.disable
        }
      },
      diferenca: function () {
        this.diferencaDoc = this.diferenca
      },
      analise: function () {
        if (this.analise) {
          this.analiseDoc = this.analise.documentos
        }
      },
      dt_data_vigencia: function (val) {
        let newdate = moment(val, 'DD/MM/YYYY', true)
        if (newdate.isValid()) {
          this.documento.dt_data_vigencia = newdate.format('YYYY-MM-DD')
        }
      },
      revisao: function () {
        if (this.revisao) {
          this.revisaoDoc = this.revisao.documentos
        }
        this.mostraExclusao = false
        this.mostraInclusao = false
        if (this.analiseDoc && this.revisaoDoc) {
          if (this.analiseDoc.length > this.revisaoDoc.length) {
            this.mostraExclusao = true
            this.mostraInclusao = false
          } else {
            this.mostraExclusao = true
          }
          if (this.analiseDoc.length < this.revisaoDoc.length) {
            this.mostraInclusao = true
            this.mostraExclusao = false
          } else {
            this.mostraInclusao = false
          }
          if (this.analiseDoc.length === this.revisaoDoc.length) {
            this.mostraExclusao = false
          }
        }
        this.adicionados = detailedDiff(this.analise, this.revisao).added
        // this.excluidos = detailedDiff(this.analise, this.revisao).deleted
        this.excluidos = _.differenceBy(this.analise.documentos, this.revisao.documentos, 'tipo_documento.ds_tipo')
        this.atualizados = detailedDiff(this.analise.documentos, this.revisao.documentos).updated
        //
        if (this.adicionados) {
          if (this.adicionados.documentos) {
            this.inclDoc = this.adicionados.documentos
            this.inclDocTexto = _.map(this.inclDoc, 'tipo_documento.ds_tipo')
            this.naoExisteDoc = false
          } else {
            this.naoExisteDoc = true
          }
        }
        if (this.excluidos) {
          this.excDocTexto = _.map(this.excluidos, 'tipo_documento.ds_tipo')
        }
      },
      mudaDocumento: function () {
        this.mudancas = this.mudaDocumento.documentos
        if (this.mudancas) {
          if (_.findKey(this.mudancas, 'ds_nome_arquivo')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_nome_arquivo')
          }
          if (_.findKey(this.mudancas, 'ds_content_type')) {
            this.indiceAlt = _.findKey(this.mudancas, 'ds_content_type')
          }
          if (_.findKey(this.mudancas, 'fk_tipo_documento')) {
            this.indiceAlt = _.findKey(this.mudancas, 'fk_tipo_documento')
          }
          if (_.findKey(this.mudancas, 'dt_data_validade')) {
            this.indiceAlt = _.findKey(this.mudancas, 'dt_data_validade')
          }
          if (_.findKey(this.mudancas, 'tipo_documento')) {
            this.indiceAlt = _.findKey(this.mudancas, 'tipo_documento')
          }
          if (this.indiceAlt !== -1) {
            this.mostraAlteracao = true
            this.texto = this.diferencaDoc.documentos[this.indiceAlt]
          } else {
            this.mostraAlteracao = false
          }
        }
      },
      salvouOK: function () {
        this.salvou = this.salvouOK
        if (this.salvou === true) {
          this.totalMb = 0
          this.acmTamanho = 0
        }
      }
    },
    computed: {
      progress: function () {
        return (this.totalMb / 80 * 100).toFixed(2)
      },
      // 66888 - Desativar exclusão de anexo para Alterações no Projeto/Demais Ajustes
      PropEditandoAlteracaoProjeto () {
        if (this.editandoAlteracaoProjeto) {
          return this.editandoAlteracaoProjeto
        } else {
          return false // Valor padrão é um array vazio
        }
      },
      PropProrrogacaoEdit () {
        if (this.editandoProrrogacao) {
          return this.editandoProrrogacao
        } else {
          return false // Valor padrão é um array vazio
        }
      }
    },
    async created () {
      if (this.localUso === undefined) {
        this.localUso = 'TODOS'
      }
      if (this.localUso === 'TODOS') {
        if (_.isEmpty(this.$store.state.uploadDocumentos.documentos)) {
          await axiosLaravel.post('documentos/tipos/' + this.localUso).then((response) => {
            this.documentos = this.$store.state.uploadDocumentos.documentos = _.sortBy(response.data, [function (o) { return o.ds_tipo }])
            this.$forceUpdate()
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        } else {
          this.documentos = this.$store.state.uploadDocumentos.documentos
          this.$forceUpdate()
        }
      } else {
        await axiosLaravel.post('documentos/tipos/' + this.localUso).then((response) => {
          this.documentos = _.sortBy(response.data, [function (o) { return o.ds_tipo }])
          this.$forceUpdate()
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
      // this.ordenarLista()
    },
    methods: {
      novoDocumento () {
        if (this.maxFiles !== undefined) {
          if (this.propDocumentos.length === this.maxFiles) {
            this.$snotify.error('Número máximo de documentos por licença atingido, favor verificar.')
            this.onCancel()
            return
          }
        }
        this.ocultaIcone = true
        this.showGrid = !this.showGrid
        // this.documentos = {}
        this.documento.dt_data_vigencia = ''
      },
      existeDocumento (documento) {
        // Retorna se o tipo do documento passado já existe no array de documentos enviados
        if (!_.isEmpty(this.propDocumentos) && !_.isEmpty(this.propDocumentos) && this.propDocumentos !== []) {
          return this.propDocumentos.some((item) => {
            if (documento.id) {
              return documento.id === item.tipo_documento.id
            }
          })
        }
      },
      onDownload (documento) {
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
      adicionaDocumento () {
        let totalParc = 0
        let aux = (this.acmTamanho + this.tamanho) / Math.pow(1024, 2)
        let auxMb = aux.toFixed(2)
        if (auxMb > 80) {
          this.$snotify.error('O limite de envio é 80 MB por lote.\n' + 'Já utilizado: ' + this.totalMb + ' MB, e o arquivo possui: ' + this.tamanhoFormatado + ' MB ' + '\n. Favor salvar o formulário para poder incluir mais arquivos.')
          return
        } else {
          this.acmTamanho = this.acmTamanho + this.tamanho
          totalParc = this.acmTamanho / Math.pow(1024, 2)
          this.totalMb = totalParc.toFixed(2)
        }
        this.$validator.validateAll().then((result) => {
          if (result && this.$validator.errors.all().length === 0) {
            // this.uploadArquivo()
            this.documento.dt_criado = new Date()
            this.documento.ligacao_sub_type = this.propsEtapa
            if (this.editando === true) {
              for (let i in this.documento) this.documentoTabela[i] = this.documento[i]
              this.documentoTabela = Object.assign({}, this.documento)
            } else {
              this.propDocumentos.push(this.documento)
              this.contador += 1
            }
            this.onCancel()
            // this.$snotify.clear()
            // this.$snotify.success('Arquivo salvo com sucesso')
          }
        })
      },
      onFiltered (filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.table.totalRows = this.table.items.length
        this.currentPage = 1
      },
      onCancel () {
        this.documento = Object.assign({}, {})
        this.documento.documentType = Object.assign({}, {})
        this.documento.documentType.type = Object.assign({}, '')
        this.file = null
        this.showGrid = true
        this.editando = false
        this.editandoIndex = ''
        this.conteudoAnterior = Object.assign({}, '')
        if (this.contador === 0) {
          this.totalMb = 0
        }
        this.$forceUpdate()
      },
      deletaDocumento (indexDocumento) {
        let temp = 0
        if (this.propDocumentos[indexDocumento].file) {
          this.byteLength = parseInt((this.propDocumentos[indexDocumento].file).replace(/=/g, '').length * 0.75)
          temp = ((this.byteLength / Math.pow(1024, 2)).toFixed(2))
          this.totalMb = (this.totalMb - temp).toFixed(2)
          this.contador = this.contador - 1
          this.acmTamanho = this.acmTamanho - parseInt((this.propDocumentos[indexDocumento].file).replace(/=/g, '').length * 0.75)
        }
        this.propDocumentos.splice(indexDocumento, 1)
        this.$forceUpdate()
        // this.table.items.splice(indexDocumento.index, 1)
        // this.$forceUpdate()
      },
      onAddFile (pendente) {
        this.documentos = {}
        this.documentos[0] = Object.assign({}, pendente)
        this.documento.tipo_documento = Object.assign({}, pendente)
        this.documento.documentType = pendente
        this.showGrid = !this.showGrid
      },
      editaDocumento (documento, indexDocumento) {
        this.ocultaIcone = false
        this.documento = Object.assign({}, documento)
        this.showGrid = !this.showGrid
        this.documentoTabela = documento
        this.editando = true
        //
        this.editandoIndex = indexDocumento
        this.documento = Object.assign({}, documento)
        this.documentoTabela = documento
        if (this.documento.tipo_documento.pivot) {
          this.documentos.forEach((doc) => {
            if (doc.id === this.documento.tipo_documento.id) {
              this.documento.tipo_documento = Object.assign({}, doc)
            }
          })
        }
        this.mudancas = _.cloneDeep(this.mudaDocumento.documentos[indexDocumento])
        if (this.mudancas.dt_data_vigencia) {
          this.mudancas.dt_data_vigencia = moment(this.mudancas.dt_data_vigencia).format('DD/MM/YYYY')
        }
        //
        if (_.hasIn(this.atualizados, indexDocumento)) {
          this.conteudoAnterior = _.cloneDeep(this.atualizados[indexDocumento])
          if (this.conteudoAnterior.dt_data_vigencia) {
            this.conteudoAnterior.dt_data_vigencia = moment(this.conteudoAnterior.dt_data_vigencia).format('DD/MM/YYYY')
          }
        } else {
          this.conteudoAnterior = Object.assign({}, {})
        }
        //
        this.$forceUpdate()
      },
      uploadArquivo () {
        const data = new FormData()
        data.append('file', this.file)
        this.documento.pk = this.documento.id ? this.documento.id : 0
        this.documento.loaded = 'upload'
        this.documento.progress = 0
        this.documento.issueDate = moment().format('YYYY-MM-DD')
        data.append('document', JSON.stringify(this.documento))
        this.$snotify.info('Fazendo upload do arquivo ...', {timeout: 0})
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
          this.$snotify.success('Arquivo Adicionado com Sucesso!')
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      }
    }
  }
</script>

<style scoped>

</style>

