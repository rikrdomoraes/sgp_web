<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <div class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <section class="content-header ng-scope">
        <h1>{{fase}} &nbsp;&nbsp;
          <span v-show="!loading" v-if="usuarioLogado.userType === 'FUNDACAO'">
              <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(219)" href="javascript:void(0)"
                               :title="'<h5>219 - Adiantamentos (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                <i class="fa fa-print" aria-hidden="true"></i> 219
              </g-button-ujarak>

              <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(222)" href="javascript:void(0)"
                               :title="'<h5>222 - Extrato de Projeto (PDF)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                <i class="fa fa-print" aria-hidden="true"></i> 222
              </g-button-ujarak>

              <g-button-ujarak color="primary" size="button--size-ss" @click.native="emitir(248)" href="javascript:void(0)"
                               :title="'<h5>248 - Monitoramento Administrativo</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                <i class="fa fa-print" aria-hidden="true"></i> 248
              </g-button-ujarak>
          </span>
          <i v-show="loading" class="fa fa-refresh fa-spin" style="font-size: 30px"></i>
        </h1>

        <b-breadcrumb :items="[{
        text: 'Inicial',
        href: '/'
        }, {
        text: 'Solicitações',
        href: '#'
        }, {
        text: 'Contrapartida',
        active: true
        }]"/>
      </section>

      <!-- main content -->
      <section class="content ng-scope">

        <div class="row">
          <div class="col-md-12 form-horizontal">
            <div class="ng-scope ng-isolate-scope">

              <div v-if="(historicoTarefasTela.length > 0 && historicoTarefasTela[1].observacao != null && historicoTarefasTela[1].observacao !== '')" class="alert alert-dismissible alert-info">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                <h4><i class="fa fa fa-info"></i>&nbsp&nbsp Atenção!</h4>
                <h5><span v-html=historicoTarefasTela[1].observacao></span></h5>
              </div>

              <div class="box box-primary" >
                <div class="box-header with-border">
                  <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Validação de Contrapartida - <i><font color="black" size="3">ID: {{validacao.id}} - Projeto: </font><font color="black" size="3">{{proposta.ds_codigo_projeto_erp}} - {{proposta.ds_nome}}</font></i></h3>
                </div>
                <div class="box-header with-border">
                  <div class="row" ng-if="$ctrl.approvalState != 'DEFAULT'">
                    <div class="col-sm-12" >
                      <form name="frmSearch" class="form-horizontal" novalidate>
                        <div class="form-group required" >
                          <div class="col-md-12">
                            <dl class="proposal-definition-list">
                              <dt>Objetivo Geral: </dt>
                              <dd>{{proposta.ds_objetivo_geral}}</dd>
                              <dt>Situação:</dt>
                              <dd><span>Em Execução</span></dd>
                            </dl>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="box-body" >
                  <div v-show="loadingShow" class="overlay"
                       style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <fieldset :disabled="fase === 'Autorização'">
                    <cronograma-solicitacao-contrapartida ref="childComponentA" :propsNota="nota" :propsProjeto="proposta.projeto" :propsEtapa="etapa"></cronograma-solicitacao-contrapartida>

                    <!--Documentos de solicitação de pagamento-->
                    <div class="col-md-12">
                      <div class="box-header with-border">
                        <h3 class="box-title">Documentos de solicitação de contrapartida</h3>
                      </div>
                      <upload-documentos-php :propDocumentos="nota.documentos" :documentTypes="''" :disable="''"></upload-documentos-php>
                    </div>
                  </fieldset>
                  <div class="col-md-12">
                    <div class="box box-widget">
                      <div class="box-header with-border">
                        <h3 class="box-title">Histórico de solicitação</h3>
                      </div>
                      <historico-solicitacao-pagamento v-if="historicoBack && !_.isNull(historicoBack) && !_.isEmpty(historicoBack)" :propsValidacao="validacao" :propsHistorico="historicoBack" :key="historicoBack"></historico-solicitacao-pagamento>
                    </div>
                    <div class="text-left box-header" v-if="dataProcesso < '10/12/2020'">
                      <a href="" v-if="esconderHistorico === false" @click.prevent="esconderHistorico = true"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar histórico antigo</a>
                      <a href="" v-if="esconderHistorico === true" @click.prevent="esconderHistorico = false"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar histórico antigo</a>
                    </div>
                    <div class="col-md-8" v-if="esconderHistorico === true && dataProcesso < '10/12/2020'">
                      <div class="box box-widget">
                        <div class="box-header with-border">
                          <h3 class="box-title">Histórico Antigo</h3>
                        </div>
                        <historico-antigo :propsValidacao="validacao" :propsHistorico="historicoTarefas" :key="historicoTarefas"></historico-antigo>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="box box-widget" >
                      <div class="box-header with-border" v-if="usuarioLogado.userType === 'FUNDACAO'">
                        <h3 class="box-title">Análise deste documento para Contrapartida</h3>
                      </div>
                      <div class="box-body">
                        <div class="col-md-12">

                          <!-- requestApprovalResult -->
                          <div class="form-group required full" :class="{ 'has-error' : errors.first('resultadoAprovacao')}" style="margin-right:0;margin-left:0"  v-if="usuarioLogado.userType === 'FUNDACAO'">
                            <label for="resultadoAprovacao" class="control-label">Decisão:</label>
                            <div v-if="etapa !== 'Revisão'">
                              <label class="radio-inline new-control new-control-radio">
                                <input  type="radio" name="resultadoAprovacao"
                                        v-model="aprovacao.resultadoAprovacao" value="Aprovado" required> Aprovar documento
                                <div class="new-control-indicator"></div>
                              </label>
                              <label class="radio-inline new-control new-control-radio">
                                <input type="radio" name="resultadoAprovacao"
                                       v-model="aprovacao.resultadoAprovacao" value="Revisão" required> Encaminhar para revisão
                                <div class="new-control-indicator"></div>
                              </label>
                              <label v-if="fase === 'Autorização'" class="radio-inline new-control new-control-radio">
                                <input @click="showJustify = 'Retonar Análise'" type="radio" name="resultadoAprovacao"
                                       v-model="aprovacao.resultadoAprovacao" value="Retornar Análise" required> Retornar para análise
                                <div class="new-control-indicator"></div>
                              </label>
                              <span v-if="errors.first('resultadoAprovacao')" class="label label-danger"> {{ errors.first('resultadoAprovacao') }}</span>
                            </div>
                          </div>

                          <!-- motivo de devolução Suporte 59885 lista especial para contrapartida-->
                          <div class="form-group required-field full" v-if="aprovacao.resultadoAprovacao === 'Revisão'"
                               :class="{ 'has-error' : errors.first('justificativa')}" style="margin-right:0;margin-left:0"">
                          <label for="motivo de devolucao" class="control-label">Motivo de devolução:</label>
                          <div>
                            <div>
                              <select v-model="motivoDevolucao" name="motivo de devolucao" class="form-control" v-validate="'required'">
                                <option value="">Limpar dados do motivo de devolução</option>
                                <option disabled>--------------------------------------------------------------------------</option>
                                <option value="Ausência de Relatório">Ausência de Relatório</option>
                                <option value="Ausência de documento - documento fiscal / holerite / ofício">Ausência de documento - documento fiscal / holerite / ofício</option>
                                <option value="Ausência de fotos/imagens comprobatórias">Ausência de fotos/imagens comprobatórias</option>
                                <option value="Ausência ou divergência de documentos de obra civil (termo de medição, contrato, ART ou RRT)">Ausência ou divergência de documentos de obra civil (termo de medição, contrato, ART ou RRT)</option>
                                <option value="Ausência ou divergência do número do acordo BNDES ">Ausência ou divergência do número do acordo BNDES</option>
                                <option value="Cadastro desatualizado ">Cadastro desatualizado</option>
                                <option value="Comprovante de pagamento ausente, divergente ou ilegível ">Comprovante de pagamento ausente, divergente ou ilegível</option>
                                <option value="Documento fiscal ilegível ou divergente">Documento fiscal ilegível ou divergente</option>
                                <option value="Existência de ocorrência impeditiva">Existência de ocorrência impeditiva</option>
                                <option value="Itens da nota fiscal divergentes do cronograma físico-financeiro">Itens da nota fiscal divergentes do cronograma físico-financeiro</option>
                                <option value="Pendência de prestação de contas">Pendência de prestação de contas</option>
                                <option value="Recolhimento de tributos ausente ou divergente">Recolhimento de tributos ausente ou divergente</option>
                                <option value="Outros">Outros</option>
                              </select>
                            </div>
                            <span v-if="errors.first('motivo de devolucao')" class="label label-danger"> {{ errors.first('motivo de devolucao') }}</span>
                          </div>
                          </div>

                          <!-- gloss -->
                          <div v-if="aprovacao.resultadoAprovacao === 'Aprovado'" class="form-group full" style="margin-right:0;margin-left:0" >
                            <label for="observação" class="control-label">Observação:</label>
                            <textarea name="observação" v-model="validacao.glosa" rows="3" class="form-control"></textarea>
                          </div>

                          <!-- justify -->
                          <div v-if="aprovacao.resultadoAprovacao === 'Revisão' || aprovacao.resultadoAprovacao === 'Retornar Análise'" class="form-group required-field full"
                               :class="{ 'has-error' : errors.first('justificativa')}" style="margin-right:0;margin-left:0" >
                            <label for="justificativa" class="control-label">Motivo para revisão:</label>
                            <textarea name="justificativa" v-model="validacao.glosa" rows="3" class="form-control"
                                      v-validate="'required'"></textarea>
                            <span v-if="errors.first('justificativa')"
                                  class="label label-danger"> {{ errors.first('justificativa') }}</span>
                          </div>
                          <div class="box-footer">
                            <g-button-moema v-if="aprovacao.resultadoAprovacao || etapa === 'Revisão'" color="success" size="button--size-ss" @click.native="onSave"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>
                            <g-button-moema color="warning" size="button--size-ss" @click.native="voltaPraSolicitacao"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
                          </div>
                        </div>
                      </div> <!-- ./box-body -->
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

</template>

<script>
  import CronogramaSolicitacaoContrapartida from '../modulos/cronograma-solicitacao-contrapartida'
  import UploadDocumentosPhp from '../../modules/uploadDocumentosPhp'
  import HistoricoSolicitacaoPagamento from '../../solicitacoes/modulos/historicoSolicitacaoPagamento'
  import HistoricoAntigo from '../../solicitacoes/modulos/historicoAntigo'
  import {mapGetters} from 'vuex'
  import moment from 'moment'
  export default {
    components: {
      UploadDocumentosPhp,
      HistoricoSolicitacaoPagamento,
      CronogramaSolicitacaoContrapartida,
      HistoricoAntigo
    },
    name: 'form-solicitacao-contrapartida',
    data () {
      return {
        // Array que guarda as fases de analise e Autorização de pagamentos
        loading: false,
        loadingShow: false,
        analiseAutorizacao: ['ANALYSIS', 'MONITORING'],
        checkedNames: [],
        validacao: {
          tarefas: []
        },
        nota: {
          opcoes: ''
        },
        item: {},
        relat: {
          id: 13,
          createdAt: null,
          code: 'FJCF248.GER',
          codeNames: 'ENumPrj;ECodFor',
          fieldNames: 'Projeto;Beneficiário/Fornecedor',
          title: '248 - Monitoramento Administrativo'
        },
        data_edicao: '',
        historicoAnt: [],
        esconderHistorico: false,
        etapa: 'Análise',
        force: 0,
        historicoTarefas: [],
        historicoTarefasTela: [],
        historicoBack: [],
        proposta: {},
        motivoDevolucao: '',
        aprovacao: {}
      }
    },
    computed: {
      mostraParaValidacaoPagamento () {
        return _.includes(this.analiseAutorizacao, this.validacao)
      },
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    props: ['propsNota', 'propsValidacao', 'propsHistorico'],
    watch: {
      propsNota () {
        this.nota = _.cloneDeep(this.propsNota)
        this.proposta = this.nota.itens_liberados[0].itens_orcamentos[0].proposta
        this.numeroProjeto = this.proposta.ds_codigo_projeto_erp
      },
      propsValidacao () {
        this.validacao = _.cloneDeep(this.propsValidacao)
        this.dataProcesso = moment(this.validacao.inicio).format('DD/MM/YYYY')
        this.validacao.nome = 'CONTRAPARTIDA'
        this.fase = this.validacao.tarefas[0].nome
        this.etapa = this.validacao.tarefas[0].nome
        if (this.validacao.documentosLiberacao && this.validacao.documentosLiberacao[0].length === 0) {
          this.etapa = 'Solicitação'
        }
        if (this.validacao.tarefas[0].nome === 'Autorização') {
          this.etapa = this.validacao.tarefas[0].nome
        }
      },
      propsHistorico () {
        this.historicoTarefas = _.cloneDeep(this.propsHistorico)
        this.historicoTarefasTela = _.cloneDeep(this.propsHistorico)
        let array = this.historicoTarefas.filter((item) => {
          return item.tipo === 'Usuário' && !_.isNull(item.termino)
        })
        this.historicoTarefas = _.cloneDeep(array)
        for (let i = 0; i < this.historicoTarefas.length; i++) {
          if (this.historicoTarefas.usuario !== null) {
            this.usuario = this.historicoTarefas.usuario
          }
        }
        let arrayAnt = this.historicoTarefas.filter((item) => {
          return item.tipo === 'Usuário' && !_.isNull(item.termino)
        })
        this.historicoAnt = arrayAnt
      }
    },
    created () {
      this.loadingShow = true
    },
    mounted () {
      this.data_edicao = moment().format('YYYY-MM-DD HH:mm:ss')
      this.loadingShow = true
      this.$snotify.clear()
      this.force = 0
      this.buscaHistorico(this.$route.params.id)
      this.nota = _.cloneDeep(this.propsNota[0])
      this.validacao = _.cloneDeep(this.propsValidacao)
      let array = this.historicoTarefas.filter((item) => {
        return item.tipo === 'Usuário' && !_.isNull(item.termino)
      })
      this.historicoTarefas = _.cloneDeep(array)
      for (let i = 0; i < this.historicoTarefas.length; i++) {
        if (this.historicoTarefas.usuario !== null) {
          this.usuario = this.historicoTarefas.usuario
        }
      }
      this.numeroProjeto = this.proposta.ds_codigo_projeto_erp
      this.force = 1
      this.loadingShow = false
      this.$forceUpdate()
    },
    methods: {
      onSave () {
        this.incluiMotivo()
        this.validacao.processo.nome = 'CONTRAPARTIDA'
        this.$validator.validateAll().then(result => {
          if (result) {
            this.aprovacao.nota = this.nota
            this.nota.resultadoAprovacao = this.aprovacao.resultadoAprovacao
            if (this.validacao.tarefas[0].nome === 'Solicitação') {
              this.validacao.proximaEtapa = 'Análise'
            }
            if (this.validacao.tarefas[0].nome === 'Análise') {
              if (this.nota.resultadoAprovacao === 'Aprovado') {
                this.validacao.proximaEtapa = 'Conclusão'
              }
              if (this.nota.resultadoAprovacao === 'Revisão') {
                this.validacao.tarefas[0].observacao = this.aprovacao.justificativa
                this.validacao.proximaEtapa = 'Revisão'
              }
              if (this.nota.resultadoAprovacao === 'Retornar Análise') {
                this.validacao.proximaEtapa = 'Análise'
              }
            }
            if (this.validacao.tarefas[0].nome === 'Revisão') {
              this.validacao.proximaEtapa = 'Análise'
            }
            // Se a nota já foi validada e só esta sendo feito a edição então remove do array e coloca novamente
            _.remove(this.validacao.receiptApprovals, item => {
              return item.receipt.id === this.nota.id
            })
            // Adiciona a nota no array de notas para aprovação
            if (this.aprovacao.nota.receiptItems) {
              var x = 0
              var j = 0
              for (x = 0; x < this.aprovacao.nota.itens_liberados.length; x++) {
                for (j = 0; j < this.aprovacao.nota.receiptItems.length; j++) {
                  if (this.aprovacao.nota.itens_liberados[x].itens_orcamentos[0].fk_itens === this.aprovacao.nota.receiptItems[j].Item) {
                    this.aprovacao.nota.itens_liberados[x].quantidade = this.aprovacao.nota.receiptItems[j].quantityRequest
                    this.aprovacao.nota.itens_liberados[x].valor = this.aprovacao.nota.receiptItems[j].valueRequest
                  }
                }
              }
            }
            this.validacao.documentos_liberacao = this.nota
            if (this.validacao.documentos_liberacao.receiptItems) {
              this.validacao.documentos_liberacao.itens = this.validacao.documentos_liberacao.receiptItems
            }
            this.validacao.proxima_etapa = this.validacao.proximaEtapa
            this.validacao.tarefas[0].data_edicao = this.data_edicao
            this.enviaBackEnd()
          } else {
            this.$snotify.error('existem campos com erro favor verificar')
          }
        })
      },
      enviaBackEnd () {
        this.validacao.processo.nome = 'CONTRAPARTIDA'
        this.$snotify.clear()
        this.$snotify.async('Validando Solicitação de Contrapartida. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.put('processos/tarefas/atualiza/', this.validacao).then((response) => {
          this.$snotify.clear()
          if (_.hasIn(response, 'error')) {
            this.$snotify.clear()
            this.$snotify.error(response.data.value.error[0], '', 10000)
          } else {
            this.gravaHistorico(response.data)
            this.$snotify.clear()
            this.$snotify.success('Validação de Contrapartida gravada com sucesso!')
            setTimeout(() => { this.$router.go(-1) }, 2000)
          }
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      voltaPraSolicitacao () {
        this.$router.go(-1)
      },
      onLoad () {
        this.$snotify.clear()
        this.$snotify.async('Gerando relatório. Por favor, aguarde...', {timeout: 0})
        axios.put('proxy/utility/erp-report/emit-report', {erpReport: this.relat, params: this.temp}).then((response) => {
          this.onDownload(response)
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      emitir (relatorio) {
        this.loading = true
        let parametros = '<ECodEmp=1><ENumPrj=' + this.proposta.ds_codigo_projeto_erp + '>'
        if (relatorio === 222 || relatorio === 219) {
          parametros += ',<ESitPrj=ULT>'
        } else if (relatorio === 248) {
          parametros += ',<ECodFor=>'
        }
        if (relatorio === 222) {
          parametros += ',<EMosDes=S>'
        }
        this.$snotify.clear()
        console.log('parametros', parametros)
        this.$snotify.async('Gerando relatório ' + relatorio + '. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': 'FJCF' + relatorio + '.GER'}, params: parametros}).then((response) => {
          this.onDownload(response, relatorio, this)
        })
          .catch((error) => {
            this.$snotify.clear()
            this.loading = false
            this.$root.trataErro(error)
          })
      },
      onDownload (response, relatorio, vm) {
        let item = response.data.arquivo
        const contentType = 'application/pdf'
        const b64Data = response.data.arquivo
        let file = this.b64toBlob(b64Data, contentType)
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        if (!ie) {
          let blob = file
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'Relatório ' + relatorio + ' » ' + vm.proposta.ds_codigo_projeto_erp + ' - ' + vm.proposta.ds_nome
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          let blob = file
          let link = document.createElement('blob')
          link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
          link.download = 'Relatório ' + relatorio + ' » ' + vm.proposta.ds_codigo_projeto_erp + ' - ' + vm.proposta.ds_nome
          link.click()
        }
        this.$snotify.clear()
        this.$snotify.success('Relatório gerado com sucesso!')
        this.loading = false
      },
      b64toBlob (b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data)
        const byteArrays = []
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize)
          const byteNumbers = new Array(slice.length)
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          byteArrays.push(byteArray)
        }
        const blob = new Blob(byteArrays, {type: contentType})
        return blob
      },
      buscaHistorico (request) {
        console.log('caiu aqui historicoBack', request)
        axiosLaravel.post('historico-tarefas/lista', {'parametro': request}).then((response) => {
          this.historicoBack = response.data
          console.log('response historicoBack', response.data)
        })
      },
      gravaHistorico (parm) {
        axiosLaravel.post('historico-tarefas/', parm).then((response) => {
          console.log(response.data)
        })
      },
      incluiMotivo () {
        if (this.aprovacao.resultadoAprovacao === 'Revisão') {
          this.validacao.glosa = '#' + this.motivoDevolucao + '# ' + this.validacao.glosa
        }
      }
    }
  }
</script>

<style scoped>

</style>
