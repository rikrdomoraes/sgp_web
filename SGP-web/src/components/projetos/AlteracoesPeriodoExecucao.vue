<template>
<!-- 66888/68639 - Alteracao de periodo de execucao do projeto -->
    <div class="box-body" ref="form">
  
      <div v-show="loading" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
  
      <!--Form-->
      <div v-if="!showgrid" style="margin: 0px" class="form-horizontal row well well-sm no-shadow animated fadeInDownOutUp" name="frmAddAt">
        <div class="col-md-6">
          <div class="titulo-periodo">
            Justificativa (Será salvo em Alterações no Projeto)
          </div>
          <!--Data-->
          <div class="form-group required-field"
               :class="{ 'has-error' : errors.first('data')}">
            <label for="data" class="control-label col-md-2">Data:</label>
            <div class="col-md-4">
              <div v-if="alteracao.id">
                <datepicker ref="data" name="data" v-model="alteracao.dt_registro" input-class="form-control"
                            :language="$datePickerPtBR" maxlength="20"  placeholder="__ /__ /____" :highlighted="highlighted" disabled
                            format="dd/MM/yyyy" v-validate="'required'">
                </datepicker>
              </div>
              <div v-if="!alteracao.id">
                <datepicker ref="data" name="data" v-model="alteracao.dt_registro" input-class="form-control datepicker"
                            :language="$datePickerPtBR" maxlength="20"  placeholder="__ /__ /____" :highlighted="highlighted" disabled
                            format="dd/MM/yyyy" v-validate="'required'">
                </datepicker>
              </div>
              <span v-if="errors.first('data')" class="label label-danger"> {{ errors.first('data') }}</span>
            </div>
          </div>
          <!-- Tipo -->
          <div class="form-group required-field"
               :class="{ 'has-error' : errors.first('tipo')}">
            <label for="tipo" class="control-label col-md-2">Tipo:</label>
            <div class="col-md-8">
              <div>
                <multiselect v-model="alteracao.tipo" :options="tipos"
                             :multiple="false"
                             :close-on-select="true"
                             :clear-on-select="true"
                             :hide-selected="false"
                             :preserve-search="true"
                             placeholder="Selecione um Tipo de Alteração"
                             track-by="codigo"
                             :custom-label="etiquetaTipos"
                             @select="onSelect($event, alteracao.tipo)"
                             :preselect-first="false"
                             selectLabel=""
                             deselectLabel=""
                             selectedLabel="Selecionado"
                             name="tipo"
                             disabled
                             data-vv-as="Tipo de alteração"
                             >
                  <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
                </multiselect>
              </div>
              <span v-if="errors.first('tipo')" class="label label-danger"> {{ errors.first('tipo') }}</span>
            </div>
          </div>
          <!-- Detalhamento -->
          <div class="form-group required-field"
               :class="{ 'has-error' : errors.first('detalhamento')}">
            <label for="detalhamento" class="control-label col-md-2">Detalhe:</label>
            <div class="col-md-8">
              <div>
                <textarea v-model="detalhamentoAnt" :placeholder="place" name="detalhamento" class="form-control" type="text" maxlength="1000" cols="10" rows="8" v-validate="'required'">
                </textarea>
              </div>
              <span v-if="errors.first('detalhamento')" class="label label-danger"> {{ errors.first('detalhamento') }}</span>
            </div>
          </div>
          <!--Motivo-->
          <div class="form-group required-field"
               :class="{ 'has-error' : errors.first('motivo')}">
            <label for="motivo" class="control-label col-md-2">Motivo:</label>
            <div class="col-md-8">
              <multiselect v-model="alteracao.motivo" :options="motivos"
                           :multiple="false"
                           :close-on-select="true"
                           :clear-on-select="true"
                           :hide-selected="false"
                           :preserve-search="true"
                           placeholder="Selecione um Motivo"
                           track-by="codigo"
                           :custom-label="etiquetaMotivos"
                           :preselect-first="false"
                           selectLabel=""
                           deselectLabel=""
                           selectedLabel="Selecionado"
                           name="tipo"
                           data-vv-as="Motivo da alteração"
                           v-validate="'required'">
                <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
              </multiselect>
            </div>
            <span v-if="errors.first('motivo')" class="label label-danger"> {{ errors.first('motivo') }}</span>
          </div>
          <!-- Responsável -->
          <div class="form-group required-field"  v-if="alteracao.responsavel.ds_nome_usuario">
            <label for="responsavel" class="control-label col-md-2">Responsável:</label>
            <div class="col-md-8">
              <div>
                <input v-model="alteracao.responsavel.ds_nome_usuario" name="responsavel" class="form-control" type="text" maxlength="255" :disabled="true"/>
              </div>
            </div>
          </div>
          <!-- Anexos -->
          <div class="form-group" :class="{ 'has-error' : errors.first('anexo')}">
            <label for="responsavel" class="control-label col-md-2">Anexos: <span style="color: red">*</span></label>
            <div class="col-md-10">
              <div>
                Para realizar a alteração do prazo, os documentos <strong>obrigatórios</strong> devem ser anexados:
                <ol type="1">
                  <li>Súmula ou Nota Técnica.</li>
                  <li>Termo Aditivo assinado, quando o <strong>prazo de vigência</strong> for alterado.</li>
                </ol>

                <upload-documentos-php-novo :propDocumentos="alteracao.documentos" :documentTypes="''" :disable="''" :localUso="'ALTERACAO_PERIODO_EXECUCAO'" :salvouOK="salvouOK"></upload-documentos-php-novo>
              </div>
            </div>
            <span v-if="errors.first('anexo')" class="label label-danger"> {{ errors.first('anexo') }}</span>
          </div>
          <div><br><br></div>
          <!-- Botões -->
          <div class="form-group" style="margin-bottom:0">
            <div class="col-md-8 col-md-offset-2">
              <g-button-ujarak color="success" size="button--size-ss" @click.native="onAdd(frmAddAt)"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-ujarak >
                <g-button-ujarak color="warning" size="button--size-ss" @click.native="cancelar(editando)"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</g-button-ujarak >
            </div>
          </div>
        </div>
      </div>
    </div>
  
  
  </template>
  
  <script>
    import { mapGetters } from 'vuex'
    import UploadDocumentosPhpNovo from '../modules/uploadDocumentosPhpNovo'
    import moment from 'moment'
    export default {
      components: {
        UploadDocumentosPhpNovo
      },
      name: 'alteracoesPeriodoExecucao',
      data () {
        return {
          disabledDates: {
            customPredictor: function (date) {
              if (date.getDate() < new Date().getDate()) {
                return true
              }
            }
          },
          highlighted: {
            customPredictor: function (date) {
              let d1 = moment(date).format('YYYYMMDD')
              let d2 = moment(new Date()).format('YYYYMMDD')
              if (d1 === d2) {
                return true
              }
            }
          },
          loading: true,
          numero: null,
          projeto: [],
          contador: 0,
          objBackend: [],
          atProp: [],
          place: '',
          mostraOcor: false,
          editandoIndex: null,
          alteracao: {
            documentos: []
          },
          detalhamentoAnt: '',
          salvouOK: false,
          dadosTime: [],
          documento: [],
          showgrid: true,
          table: {
            items: [],
            bloqueioCampos: false,
            filter: null,
            hover: true,
            bordered: true,
            currentPage: 1,
            perPage: 10,
            sortBy: 'dt_registro',
            sortDesc: true,
            alteracaoTable: [],
            fields: [
              {
                key: 'id',
                label: 'id',
                sortable: true,
                thStyle: 'text-align: center; width: 50px',
                class: 'text-center'
              },
              {
                key: 'dt_registro',
                label: 'Data',
                sortable: true,
                thStyle: 'text-align: center; width: 7%',
                class: 'text-center'
              },
              {key: 'tipo', label: 'Tipo', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center'},
              {
                key: 'detalhamento',
                label: 'Detalhe',
                sortable: true,
                thStyle: 'text-align: left; width: 53%',
                class: 'text-left'
              },
              {
                key: 'motivo',
                label: 'Motivo',
                sortable: true,
                thStyle: 'text-align: center; width: 10%',
                class: 'text-center'
              },
              {
                key: 'responsavel.ds_nome_usuario',
                label: 'Responsavel',
                sortable: true,
                thStyle: 'text-align: center; width: 10%',
                class: 'text-center'
              },
              {
                key: 'documentos',
                label: 'Anexos',
                sortable: true,
                thStyle: 'text-align: center; width: 5%',
                class: 'text-center'
              },
              {key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 5%', class: 'text-center'}
            ]
          },
          documentosObrigatorios: ['Súmula ou Nota Técnica', 'Termo Aditivo Assinado'],
          vigenciaInicial: ''
        }
      },
      props: [
        'ParmProjetos',
        'ParmAlteracao',
        'filtro',
        'refreshTable',
        'cancelar',
        'editando',
        'permiteConcluir',
        'historicoAlteracaoPeriodo',
        'editandoBloco',
        'dataInicialAlteracao',
        'nr_periodos',
        'dt_data_final',
        'periodo_vigencia',
        'dt_data_vigencia'
      ],
      watch: {
        ParmProjetos: function () {
          this.projeto = this.ParmProjetos
        },
        filtro: function () {
          this.table.filter = this.filtro
          this.$nextTick(() => {
            this.$parent.$refs['alteracoes'].scrollIntoView()
          })
        }
      },
      computed: {
        // Busca dados do usuário que está logado
        ...mapGetters([
          'usuarioLogado'
        ])
      },
      mounted () {
      },
      created () {
        console.log('ALT DOCS', this.alteracao.documentos)
        this.vigenciaInicial = this.historicoAlteracaoPeriodo.periodo_vigencia
        console.log('VIGENCIA INICIAL', this.vigenciaInicial)
        this.numero = this.$route.params.numero
        if (this.numero) {
          this.projeto = this.ParmProjetos
          this.buscaAlteracaoProp()
          this.buscaTipos()
          this.alteracao.responsavel.ds_nome_usuario = this.usuarioLogado.userName
        }
      },
      methods: {
        buscaTipos () {
          axiosLaravel.get('tipo-registros/').then((response) => {
            let arr = response.data
            this.tipos = _.filter(arr, function (o) {
              if (o.grupo === 'ALTERACAO') return o
            })
            this.motivos = _.filter(arr, function (o) {
              if (o.grupo === 'ALTERACAO_MOTIVO') return o
            })
            this.loading = false
            this.onNew()
            this.showgrid = false
            console.log(this.tipos)
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        etiquetaTipos (option) {
          return `${option.descricao}`
        },
        etiquetaMotivos (option) {
          return `${option.descricao}`
        },
        onSelect (selectedOption, tipos) {
          this.place = 'Descreva de forma assertiva a justificativa para a alteração realizada.\n' +
            'Exemplos: \n' +
            '1. O excesso de chuvas prejudicou a realização das oficinas de campo. Desse modo o prazo de execução será prorrogado em 4 meses para conclusão das atividades.\n' +
            '2. Tendo em vista a economicidade observada durante a execução do projeto, que resultou em sobra de recursos, elevamos de 80 para 90 a quantidade de barraginhas a serem implementadas.'
        },
        linha (data) {
          let vm = this
          vm.eventData = data
          vm.$events.emit('linhaSelecionada', vm.eventData)
        },
        buscaAlteracaoProp () {
          this.loading = true
          axiosLaravel.get('/alteracao/' + this.numero).then((response) => {
            this.atProp = response.data
            this.table.items = this.atProp
            this.table.totalRows = this.table.items.length
            this.loading = false
            this.$refs.tabelaAlteracao.refresh()
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        onCancel () {
          this.alteracao = {}
          this.showgrid = true
          this.editandoIndex = null
          this.mostraOcor = false
          this.$nextTick(() => {
            this.$refs['form'].scrollIntoView()
          })
        },
        onNew () {
          console.log('HISTORICO ', this.historicoAlteracaoPeriodo, this.editandoBloco)
          this.alteracao.dt_registro = new Date()
          this.alteracao.documentos = []
          this.alteracao.documentos = []
          this.alteracao.responsavel = {}
          this.alteracao.responsavel.ds_nome_usuario = this.usuarioLogado.userName
          this.editandoIndex = null
          this.alteracao.detalhamento = ''
          this.detalhamentoAnt = ''
          this.alteracao.tipo = {
            'id': 14,
            'grupo': 'ALTERACAO',
            'codigo': 'PRORROGACAO_DE_PRAZO',
            'descricao': 'Prorrogação de prazo',
            'created_at': '2019-10-25T12:28:52.823000Z',
            'updated_at': '2019-10-25T12:28:52.823000Z',
            'deleted_at': null
          }
          this.onSelect()
        //   this.$emit('atualizarTimeline', new Date())
        //   this.$refs.tabelaAlteracao.refresh()
        //   this.$nextTick(() => {
        //     this.$parent.$refs['alteracoes'].scrollIntoView()
        //   })
        },
        onAdd () {
          let currentDate = new Date()
          let aux = this.usuarioLogado.userName
          let historico = 'Dados alterados de: <br> - Data Inicial: ' + moment(this.historicoAlteracaoPeriodo.dt_assinatura_convenio).format('DD/MM/YYYY') + ' - Data Final Execução: ' + this.historicoAlteracaoPeriodo.dt_data_final + '- Data Final Vigência: ' + moment(this.historicoAlteracaoPeriodo.dt_data_vigencia).format('DD/MM/YYYY') + '<br> - Número de Meses do Projeto: ' + this.historicoAlteracaoPeriodo.nr_periodos + '/ Número de Meses da Vigência: ' + this.historicoAlteracaoPeriodo.periodo_vigencia + '<br>'
          let novoValor = 'Para: <br> - Data Inicial: ' + moment(this.dataInicialAlteracao).format('DD/MM/YYYY') + '- Data Final Execução: ' + this.dt_data_final + '- Data Final Vigência: ' + moment(this.dt_data_vigencia).format('DD/MM/YYYY') + '<br> - Número de Meses do Projeto: ' + this.nr_periodos + '/ Número de Meses da Vigência: ' + this.periodo_vigencia + '<br>'
          let mensagemHistorico = historico + novoValor
          this.objBackend = []
          this.alteracao.responsavel.ds_nome_usuario = this.usuarioLogado.userName
          this.alteracao.fk_usuario_responsavel = this.usuarioLogado.id
          if (this.vigenciaInicial !== this.periodo_vigencia) {
            this.documentosObrigatorios = ['Súmula ou Nota Técnica', 'Termo Aditivo Assinado']
          } else {
            this.documentosObrigatorios = ['Súmula ou Nota Técnica']
          }
          if (!this.verificaTipoDocumentos()) {
            this.$snotify.error('Anexe os documentos obrigatórios antes de continuar.')
            return
          }
          if (this.alteracao.documentos.length <= 0) {
            this.$snotify.error('Anexe os documentos obrigatórios antes de continuar.')
            return
          }
          this.$validator.validateAll().then((result) => {
            if (result) {
              this.alteracao.detalhamento = this.alteracao.detalhamento + '- <b>' + this.detalhamentoAnt + '</b><br><i>' + mensagemHistorico + '</i><br><i>(' + aux + ', ' + moment(currentDate).format('DD/MM/YYYY') + ')' + '</i><br>'
              // Se estiver em forma de edição então adiciona na tabela
              if (this.editandoIndex !== null) {
                for (let i in this.alteracao) this.tabelaAlteracao[i] = this.alteracao[i]
              } else {
                this.table.items.push(this.alteracao)
              }
              this.objBackend.push(this.atProp)
              this.objBackend.fk_proposta = this.projeto.proposta.id
              this.contador = this.contador + 1
              this.onCancel()
              this.salvar()
            } else {
              this.$snotify.error('O formulário possui erros. Favor verificar!')
            }
          })
        },
        edita (row) {
          this.detalhamentoAnt = ''
          this.$nextTick(() => {
            this.$refs['form'].scrollIntoView()
          })
          this.editandoIndex = row.index
          this.alteracao = Object.assign({}, row.item)
          this.detalhamentoAnt = ''
          this.tabelaAlteracao = row.item
          this.showgrid = false
        },
        exclui (row) {
          this.table.items.splice(row.index, 1)
          // this.atProp.splice(row.index, 1)
          this.objBackend.push(this.table.items)
        },
        irMetas () {
          this.$nextTick(() => {
            this.$parent.$refs['metas'].scrollIntoView()
            if (_.has(this.$parent, 'mostrar')) this.$parent.mostrar.metas = true
          })
        },
        irAtividades () {
          this.$nextTick(() => {
            this.$parent.$refs['atividades'].scrollIntoView()
            if (_.has(this.$parent, 'mostrar')) this.$parent.mostrar.atividades = true
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
        async salvar () {
          // console.log('this.objBackend', this.objBackend)
          let arr = this.objBackend
          arr = _.map(arr, o => _.extend({fk_proposta: this.projeto.proposta.id}, o))
          this.$snotify.async('Salvando alteração do projeto. Por favor, aguarde...', {timeout: 0})
          await axiosLaravel.post('/alteracao/', arr).then((response) => {
            this.salvouOK = true
            this.buscaAlteracaoProp()
            this.$forceUpdate()
            this.$snotify.clear()
            this.$snotify.success('Alteração do projeto gravado com sucesso!')
            this.contador = 0
            // this.$emit('atualizarTimeline', new Date())
            this.refreshTable()
            this.permiteConcluir('periodo_projeto')
          })
            .catch((error) => {
              this.$snotify.clear()
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        atualizarAlteracoes () {
          this.refreshTable()
          // console.log(this.refreshTable)
          // this.$emit('refreshAlteracoes')
        },
        verificaTipoDocumentos () {
          // Verifica se todos os documentos obrigatórios estão anexados ou não
          const documentosObrigatoriosPresentes = this.documentosObrigatorios.every((tipoDocumento) => {
            return this.alteracao.documentos.some((documento) => documento.tipo_documento.ds_tipo === tipoDocumento)
          })
          console.log('DOCUMENTOS OBRIGATÓRIOS PRESENTES?', documentosObrigatoriosPresentes)
          return documentosObrigatoriosPresentes
        }
      }
    }
  </script>
  
  <style>
    #tabelaAlteracao td:nth-of-type(1), #tabelaAlteracao th:nth-of-type(1) {
      display: none;
    }

    .titulo-periodo {
      margin-top: 20px;
      margin-bottom: 20px;
      font-weight: 800;
    }
  
  </style>  