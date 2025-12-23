<template>
  <div>
    <div class="content-wrapper " style="min-height: 793px;">

      <div><!-- content header (page header) -->
        <section class="content-header">
          <h1>Análise &nbsp;&nbsp;
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
             <g-button-ujarak color="primary" size="button--size-ss" @click.native="onDownloadZIP()"
                              :title="'<h5>Faz o download de todos os arquivos da solicitação (zip)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}"
                              v-if="usuarioLogado.userType !== 'ENTIDADE' && etapa !== 'Solicitação'">
                            <i class="fa fa-download" aria-hidden="true">&nbsp;Baixar arquivos</i>
          </g-button-ujarak>
          </span>
            <i v-show="loading" class="fa fa-refresh fa-spin" style="font-size: 30px"></i>
          </h1>
          <b-breadcrumb :items="[{
                text: 'Inicial',
                href: '/'
                }, {
                text: 'Validação',
                href: '#'
                }, {
                text: 'Devolução de Adiantamento',
                active: true
                }]"/>
        </section>
        <!-- main content -->
        <section class="content">

          <!--lista notas-->
          <form @submit.prevent="concluir">

            <div class="row">
              <div class="col-md-12 form-horizontal">
                <div>

                <span v-if="!_.isEmpty(chamado) && usuarioLogado.userType === 'FUNDACAO'" style="color: red; font-size: medium">* Atenção: O processo que será analisado possui chamado vinculado - <b>
                     <span v-for="(c, index) in chamado">
                    <router-link target="_blank" :to="{name: 'cadastro-chamado-edita',  params: { id: c.id}}"> {{c.id}} <span v-if="chamado.length > 1 && index === 0">, &nbsp;</span></router-link>
                </span>
              </b><br><br></span>

                  <!--<span v-if="chamado && chamado.id" style="color: red; font-size: medium">* Atenção: O processo que será analisado possui chamado aberto - <b><router-link target="_blank" :to="{name: 'cadastro-chamado-edita',  params: { id: chamado.id}}"> {{chamado.id}}</router-link></b><br><br></span>-->

                  <div v-if="(historicoTarefasTela.length > 0 && historicoTarefasTela[1].observacao != null && historicoTarefasTela[1].observacao !== '')" class="alert alert-dismissible alert-info">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
                    <h4><i class="fa fa fa-info"></i>&nbsp&nbsp Atenção!</h4>
                    <h5><span v-html=historicoTarefasTela[1].observacao></span></h5>
                  </div>

                  <div class="box box-primary">
                    <div class="box-header with-border">
                      <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Validação de Devolução de Adiantamento - <i><font color="black" size="3">ID: {{form.id}} - Projeto: </font><font color="black" size="3">{{proposta.ds_codigo_projeto_erp}} - {{proposta.ds_nome}}</font></i></h3>
                    </div>
                    <div class="box-body">
                      <!--Dados do projeto inicio-->
                      <div class="row">
                        <div class="col-sm-12">

                          <div class="form-group required" >
                            <div class="col-md-5">
                              <dl class="proposal-definition-list">
                                <dt>Objetivo Geral: </dt>
                                <dd>{{proposta.ds_objetivo_geral}}</dd>
                                <dt>Situação:</dt>
                                <dd><span>Em Execução</span></dd>
                              </dl>
                            </div>
                          </div>

                        </div>
                      </div>
                      <!--Dados do projeto fim-->
                      <!--Loading da tela-->
                      <div v-show="loadingShow" class="overlay"
                           style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                        <i class="fa fa-refresh fa-spin"></i>
                      </div>
                      <!--Campos do formulário para solicitação de adiantamento-->
                      <fieldset>
                        <grid-solicitacao-adiantamento-concecida v-if="editaForm && !_.isEmpty(projeto.adiantamentos_concedidos[0])" :props-projeto="projeto"></grid-solicitacao-adiantamento-concecida>
                        <cronograma-solicitacao-devolucao-adiantamento-validacao v-if="form.documentos_liberacao.length" :props-adiantamentos-concedidos="adiantamentosConcecidos" :props-fase="form.tarefas[0].nome" :props-enable="form.tarefas[0].nome === 'Análise' || form.tarefas[0].nome === 'Revisão'" :props-itens="form.documentos_liberacao[0].itens_liberados" @parcelaAdicionada="form.documentos_liberacao[0].itens_liberados = $event"></cronograma-solicitacao-devolucao-adiantamento-validacao>
                        <!--Documentos de solicitação de adiantamento-->
                        <div class="col-md-12">
                          <div class="box-header with-border">
                            <h3 class="box-title">Documentos de solicitação de pagamento</h3>
                          </div>
                          <upload-documentos-php v-if="form.documentos_liberacao.length" :propDocumentos="form.documentos_liberacao[0].documentos_adiantamento" :documentTypes="''" :disable="form.tarefas[0].nome === 'Autorização'"></upload-documentos-php>
                        </div>

                        <div class="col-md-12">
                          <div class="box box-widget">
                            <div class="box-header with-border">
                              <h3 class="box-title">Histórico de solicitação</h3>
                            </div>
                            <historico-solicitacao-pagamento v-if="historicoBack && !_.isNull(historicoBack) && !_.isEmpty(historicoBack)" :propsValidacao="form" :propsHistorico="historicoBack" :key="historicoBack"></historico-solicitacao-pagamento>
                          </div>
                          <div class="text-left box-header" v-if="!historicoBack">
                            <a href="" v-if="esconderHistorico === false" @click.prevent="esconderHistorico = true"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar histórico antigo</a>
                            <a href="" v-if="esconderHistorico === true" @click.prevent="esconderHistorico = false"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar histórico antigo</a>
                          </div>
                          <div class="col-md-8" v-if="esconderHistorico === true && !historicoBack">
                            <div class="box box-widget">
                              <div class="box-header with-border">
                                <h3 class="box-title">Histórico Antigo</h3>
                              </div>
                              <historico-solicitacao-pagamento v-if="!_.isUndefined(historicoAnt)" :propsValidacao="form" :propsHistorico="historicoAnt"></historico-solicitacao-pagamento>
                            </div>
                          </div>
                        </div>

                        <!--                      Opções de aprovação-->
                        <div class="col-md-12" >
                          <div class="box box-widget" >
                            <div class="box-header with-border">
                              <h3 class="box-title">Aprovação da solicitação de adiantamento</h3>
                            </div>
                            <div class="box-body">
                              <div class="row" >

                                <div class="form-group required-field full" style="margin-right:0;margin-left:0"
                                     :class="{ 'has-error' : errors.first('resultadoAprovacao')}">
                                  <label class="control-label">Aprovar solicitação?</label>
                                  <div>
                                    <!-- Análise e Aprovação da Solicitação de Adiantamento -->
                                    <label v-if="form.tarefas[0].nome === 'Análise'" class="radio-inline new-control new-control-radio ng-binding">
                                      <input type="radio" name="resultadoAprovacao" v-model="tarefa.proximaEtapa" value="Análise Financeira" class="ng-not-empty ng-dirty ng-valid-parse ng-valid ng-valid-required ng-touched"
                                             v-validate="'required'"> Aprovar solicitação devolução de adiantamento
                                      <div class="new-control-indicator"></div>
                                    </label>
                                    <!-- Análise e Aprovação da Solicitação de Adiantamento -->
                                    <label v-else-if="form.tarefas[0].nome === 'Análise Financeira'" class="radio-inline new-control new-control-radio ng-binding">
                                      <input type="radio" name="resultadoAprovacao" v-model="tarefa.proximaEtapa" value="Conclusão" class="ng-not-empty ng-dirty ng-valid-parse ng-valid ng-valid-required ng-touched"
                                             v-validate="'required'"> Aprovar solicitação devolução de adiantamento
                                      <div class="new-control-indicator"></div>
                                    </label>

                                    <!-- Encaminhar para revisão pela entidade -->
                                    <label v-if="form.tarefas[0].nome === 'Análise' || form.tarefas[0].nome === 'Autorização' || form.tarefas[0].nome === 'Análise Financeira'" class="radio-inline new-control new-control-radio ng-scope">
                                      <input type="radio" name="resultadoAprovacao" v-model="tarefa.proximaEtapa" value="Revisão" class="ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required"
                                             v-validate="'required'"> Encaminhar para revisão da entidade
                                      <div class="new-control-indicator"></div>
                                    </label>
                                    <!-- Voltar para analise da Solicitação de Adiantamento -->
                                    <label v-if="form.tarefas[0].nome === 'Autorização' || form.tarefas[0].nome === 'Análise Financeira' || form.tarefas[0].nome === 'Revisão'" class="radio-inline new-control new-control-radio ng-scope">
                                      <input type="radio" name="resultadoAprovacao" v-model="tarefa.proximaEtapa" value="Análise" class="ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required"
                                             v-validate="'required'"> Retornar para análise
                                      <div class="new-control-indicator"></div>
                                    </label>
                                    <!--Cancela solicitação de adiantamento-->
                                    <label class="radio-inline new-control new-control-radio ng-scope">
                                      <input type="radio" name="resultadoAprovacao" v-model="tarefa.proximaEtapa" value="Cancelar" class="ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required"
                                             v-validate="'required'"> Cancelar Solicitação
                                      <div class="new-control-indicator"></div>
                                    </label>
                                  </div>
                                </div>

                                <!-- motivo de devolução Suporte 59885 -->
                                <div class="form-group required-field full" v-if="tarefa.proximaEtapa === 'Revisão'"
                                     :class="{ 'has-error' : errors.first('justificativa')}" style="margin-right:0;margin-left:0">
                                <label for="motivo de devolucao" class="control-label">Motivo de devolução:</label>
                                <div>
                                  <div>
                                    <multiselect v-model="motivoDevolucao"
                                                 :options="motivosDevolucao"
                                                 :multiple="false"
                                                 :close-on-select="true"
                                                 placeholder="Selecione um motivo de Devolução para a entidade"
                                                 :custom-label="motivoDevolucaoDescricao"
                                                 track-by="codigo"
                                                 selectedLabel="Selecionado"
                                                 selectLabel="Aperte ENTER para selecionar"
                                                 deselectLabel="Aperte ENTER para remover"
                                                 name="motivo de devolucao"
                                                 data-vv-as="motivo de devolucao"
                                                 :option-height="30"
                                                 :disabled="ehVisualizacao"
                                                 v-validate="'required'">
                                    </multiselect>
                                  </div>
                                  <span v-if="errors.first('motivo de devolucao')" class="label label-danger"> {{ errors.first('motivo de devolucao') }}</span>
                                </div>
                              </div>

                                <div v-if="tarefa.proximaEtapa !== ''"
                                     class="form-group required-field full" style="margin-right: 0px; margin-left: 0px;" :class="{ 'has-error' : errors.first('observacao')}">
                                  <label v-if="tarefa.proximaEtapa === 'Revisão'" for="observacao" class="control-label">Motivo para revisão:</label>
                                  <label v-if="tarefa.proximaEtapa === 'Cancelar'" for="observacao" class="control-label">Motivo para cancelamento:</label>
                                  <textarea v-if="tarefa.proximaEtapa === 'Revisão' || tarefa.proximaEtapa === 'Cancelar'" name="observacao" id="observacao" v-model="tarefa.observacao" rows="3"
                                            class="form-control ng-pristine ng-untouched ng-empty ng-invalid ng-invalid-required"
                                            v-validate="'required'">
                                </textarea>

                                  <!-- Observação opcional da aprovação -->
                                  <div v-if="_.includes(['Análise Financeira', 'Conclusão', 'Análise'], tarefa.proximaEtapa) && usuarioLogado.userType === 'FUNDACAO'" class="col-md-12">
                                    <label for="observacao" class="">Observação:</label>
                                    <textarea name="observacao_decisao" id="observacao_decisao" v-model="tarefa.observacao" rows="3" class="form-control"></textarea>
                                  </div>

                                  <span v-if="errors.first('observacao')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
                                </div>
                              </div>
                            </div> <!-- ./box-body -->
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
              <div class="box-footer">
                <button type="submit" :disabled="restricao || tarefa.proximaEtapa === '' || form.busy" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</button>
                <button @click="$router.go(-1)" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</button>

              </div>

            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import UploadDocumentosPhp from '../../../modules/uploadDocumentosPhp'
  import CronogramaSolicitacaoDevolucaoAdiantamentoValidacao from './componentes/cronograma-solicitacao-devolucao-adiantamento-validacao'
  import HistoricoSolicitacaoPagamento from '../../../solicitacoes/modulos/historicoSolicitacaoPagamento'
  import HistoricoAntigo from '../../../solicitacoes/modulos/historicoAntigo'
  import GridSolicitacaoAdiantamentoConcecida
    from '../../../solicitacoes/adiantamento/componentes/grid-solicitacao-adiantamento-concedidas'
  export default {
    name: 'validacaoDevolucaoAdiantamentoAnalise',
    components: {
      GridSolicitacaoAdiantamentoConcecida,
      CronogramaSolicitacaoDevolucaoAdiantamentoValidacao,
      HistoricoSolicitacaoPagamento,
      HistoricoAntigo,
      UploadDocumentosPhp},
    data () {
      return {
        loading: false,
        tipoTransacao: '',
        show: {
          info: false,
          message: ''},
        entidade: {
          dirigentes: []
        },
        chamado: [],
        historicoTarefasTela: [],
        resultadoAprovacao: '',
        esconderHistorico: false,
        historicoBack: [],
        historicoAnt: [],
        data_edicao: '',
        restricao: false,
        adiantamentosConcecidos: {},
        form: new Form({
          processo: {
            nome: 'DEVOLUCAO_DE_ADIANTAMENTO',
            situacao: 'EM_EXECUCAO'
          },
          tarefas: [
            {'nome': ''}
          ],
          documentos_liberacao: []
        }),
        processo: {
          nome: 'DEVOLUCAO_DE_ADIANTAMENTO',
          situacao: 'EM_EXECUCAO'
        },
        tarefa: {
          'nome': 'ANALISE',
          'tipo': 'USUARIO',
          'situacao': 'PADRAO',
          'proximaEtapa': ''
        },
        proposta: {
          ds_codigo_projeto_erp: '',
          projeto: {}
        },
        item: {},
        motivoDevolucao: null,
        motivosDevolucao: []
      }
    },
    mounted () {
      if (this.$route.params.id) {
        this.verificaChamado()
      }
      this.buscaMotivosDevolucao()
    },
    created () {
      // Seta como default a transação com solicitação
      this.tipoTransacao = 'ANALISE'
      this.data_edicao = moment().format('YYYY-MM-DD HH:mm:ss')
      //
      this.buscaProcesso()
    },
    methods: {
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
      buscaProcesso () {
        this.buscaHistorico(this.$route.params.id)
        this.loadingShow = true // bloquea a tela enquanto busca os dados
        axiosLaravel.get('processos/' + this.$route.params.id).then((response) => {
          this.form = response.data
          this.dataProcesso = moment(this.form.inicio).format('DD/MM/YYYY')
          this.historicoTarefasTela = _.cloneDeep(this.form.tarefas)
          // Pega dados do projeto
          this.proposta = this.form.documentos_liberacao[0].itens_liberados[0].parcelas_adiantamentos[0].proposta
          // console.log('buscaProcesso - this.proposta', this.proposta)
          // this.buscaAdiantamentosConcedidos(this.proposta.projeto)
          let arrayTemp = this.form.tarefas
          let array = arrayTemp.filter((item) => {
            return item.tipo === 'Usuário' && !_.isNull(item.termino)
          })
          this.historicoAnt = _.cloneDeep(array)
          this.buscaAdiantamentosConcedidos(this.proposta)
          this.$forceUpdate() // força o update da tela para não ter problema
          this.loadingShow = false // desbloquea a tela
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      async concluir  () {
        this.incluiMotivo()
        if (this.tarefa.proximaEtapa === 'Conclusão') {
          if (await this.$root.verificaFormulario(this)) {
            var menssagem = ''
            this.$validator.errors.items.forEach((item) => {
              menssagem = menssagem + '\n' + item.msg
            })
            if (menssagem === '') {
              this.$snotify.error('Formulário possui erro favor verificar')
            } else {
              this.$snotify.error(menssagem)
            }
            return
          }
        }
        // Validação das parcelas
        if (!this.validaItens()) {
          this.$snotify.error('Valores das parcelas precisa ser maior que 0')
          return
        }
        // Validação dos documentos
        if (!this.validaDocumentos()) {
          this.$snotify.error('Faltam documentos à serem adicionados')
          return
        }
        // mover os dados para os objetos corretos
        this.preparaObjeto()
        this.$validator.validateAll().then((result) => {
          if (!result) {
            this.$snotify.error('Formulario possui erros favor verificar')
          } else {
            this.enviaBackEnd()
          }
        })
      },
      enviaBackEnd () {
        // Mostra notificacao na tela
        this.$snotify.info('Atualizando Validação', {timeout: 0})
        // enviar para o backend
        axiosLaravel.put('processos/adiantamento/atualiza', this.form).then((response) => {
          // Retira a notificação da tela
          this.gravaHistorico(response.data)
          this.$snotify.clear()
          // volta do backend e retorna para tela anterior
          this.$snotify.success('Adiantamento validado com sucesso')
          setTimeout(() => { this.$router.go(-1) }, 2000)
        })
          .catch((error) => {
            this.$snotify.clear()
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      validaItens () {
        return this.form.documentos_liberacao[0].itens_liberados.some((item) => {
          return item.valor > 0
        })
      },
      validaDocumentos () {
        return this.form.documentos_liberacao[0].documentos_adiantamento.length > 0
      },
      preparaObjeto () {
        this.form.processo = this.processo
        this.form.tarefa = this.tarefa
        this.form.projeto = this.projeto
        this.tarefa.proxima_etapa = this.tarefa.proximaEtapa
        this.tarefa.data_edicao = this.data_edicao
        this.form.tarefas[0].proxima_etapa = this.tarefa.proximaEtapa
        this.form.tarefas[0].data_edicao = this.data_edicao
      },
      buscaAdiantamentosConcedidos (proposta) {
        console.log('buscaAdiantamentosConcedidos')
        console.log('proposta', proposta)
        axiosLaravel.get('processos/adiantamento/recursos/' + proposta.id, {entityId: null}).then((response) => {
          // Adiciona os adiantamento concedidos no projeto
          this.adiantamentosConcecidos = response.data.adiantamentos_concedidos.row
          // Força a atualização do Vuejs
          this.$forceUpdate()
        })
          .catch((error) => {
            console.log('error', error)
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
      incluiMotivo () {
        // Monta objeto para incluir gravação do motivo da devolução na tabela t_parametros_documentos
        if (this.tarefa.proximaEtapa === 'Revisão') {
          console.log('caiu aqui')
          this.form.documentos_liberacao[0].parametros_documento = []
          // this.tarefa.observacao = '#' + this.motivoDevolucao + '# ' + this.tarefa.observacao
          this.tarefa.observacao = this.tarefa.observacao
          _.set(this.motivoDevolucao, 'fk_usuario', this.usuarioLogado.id)
          this.form.documentos_liberacao[0].parametros_documento.push({ 'parametro': 'MOTIVO_DEVOLUCAO', 'valor': JSON.stringify(this.motivoDevolucao) })
          console.log('this.form>>>>', this.form)
        }
      },
      verificaChamado () {
        axiosLaravel.post('chamado/chamadoProcesso/', {'parametro': this.$route.params.id}).then((response) => {
          console.log('response.data RLMB', response.data)
          this.chamado = response.data
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      onDownloadZIP () {
        this.$forceUpdate()
        this.$snotify.async('Baixando arquivos. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.get('processos/documentos/download/' + this.$route.params.id).then((response) => {
          let link = document.createElement('a')
          link.href = response.data
          link.download = 'Arquivo não localizado'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.$snotify.clear()
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      motivoDevolucaoDescricao (option) {
        return `${option.descricao}`
      },
      buscaMotivosDevolucao () {
        axiosLaravel.post('motivos/ativos').then((response) => {
          this.motivosDevolucao = response.data
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    }
  }
</script>

<style scoped>

</style>
