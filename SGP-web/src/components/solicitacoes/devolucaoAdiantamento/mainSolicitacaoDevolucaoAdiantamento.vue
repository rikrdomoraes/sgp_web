<template>
  <div>
    <div class="content-wrapper " style="min-height: 870px;">

      <div class="fade-transition ng-scope " style=""><!-- content header (page header) -->
        <section class="content-header ng-scope">
          <h1>Solicitação</h1>
          <b-breadcrumb :items="[{
                text: 'Inicial',
                href: '/'
                }, {
                text: 'Validação',
                href: '#'
                }, {
                text: 'Pagamento',
                active: true
                }]"/>
        </section>
        <!-- main content -->
        <section class="content ng-scope">

          <!--lista projetos-->
          <div class="row">
            <div class="col-md-12 form-horizontal">
              <div class="ng-scope ng-isolate-scope">
                <div class="box box-primary">
                  <div class="box-header with-border">
                    <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Solicitação de Devolução de Adiantamento
                    </h3>
                  </div>
                  <div class="box-body">
                    <!--Loading da tela-->
                    <div v-show="loadingShow" class="overlay"
                         style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                      <i class="fa fa-refresh fa-spin"></i>
                    </div>
                    <!--Se for solicitacao de um novo adiantamento mostra o campo de seleção de projeto-->
                    <div class="row" v-if="tipoTransacao === 'SOLICITACAO'">
                      <div class="col-sm-6" >
                        <div class="form-group required" >
                          <label for="projeto" class="control-label col-xs-4 col-sm-3 col-lg-2"><span class="pull-left">Projeto:</span></label>
                          <div class="col-sm-12">
                            <select :disabled="editaForm"
                                    name="projeto"
                                    v-model="projeto"
                                    class="form-control"
                                    aria-hidden="true"
                                    @change="changeProjeto(projeto)" v-validate="'required'">
                              <option v-for="projeto in projetos" :value="projeto">{{projeto.Projeto}}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--Campos do formulário para solicitação de adiantamento-->
                    <fieldset>
                      <grid-solicitacao-adiantamento-concecida v-if="editaForm && !_.isEmpty(projeto.adiantamentos_concedidos[0])" :props-projeto="projeto"></grid-solicitacao-adiantamento-concecida>
                      <cronograma-solicitacao-devolucao-adiantamento v-if="editaForm && !restricao" :props-projeto="projeto" @parcelaAdicionada="projeto.parcelas = $event"></cronograma-solicitacao-devolucao-adiantamento>
                      <!--Documentos de solicitação de pagamento-->
                      <div v-if="editaForm && !restricao && !naoPodePedir" class="col-md-12">
                        <div class="box-header with-border">
                          <h3 class="box-title">Documentos de solicitação de adiantamento</h3>
                        </div>
                        <upload-documentos-php :propDocumentos="anexosAdiantamento" :documentTypes="''" :disable="''"></upload-documentos-php>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="editaForm" class="box-footer">
              <button @click="concluir" type="button" :disabled="restricao || naoPodePedir" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</button>
              <!--<button type="button" :disabled="restricao"  class="btn btn-default btn-flat"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</button>-->
              <!--<button ng-click="onReturn(cmptRegReqAdvForm)" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</button>-->
              <button @click="$router.go(-1)" type="button" class="btn btn-default btn-flat"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</button>

            </div>

          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import UploadDocumentosPhp from '../../modules/uploadDocumentosPhp'
  import CronogramaSolicitacaoDevolucaoAdiantamento from './componentes/cronograma-solicitacao-devolucao-adiantamento'
  import GridSolicitacaoAdiantamentoConcecida from '../adiantamento/componentes/grid-solicitacao-adiantamento-concedidas'
  export default {
    name: 'mainSolicitacaoAdiantamento',
    components: {GridSolicitacaoAdiantamentoConcecida, CronogramaSolicitacaoDevolucaoAdiantamento, UploadDocumentosPhp},
    data () {
      return {
        tipoTransacao: '',
        show: {
          info: false,
          message: ''},
        entidade: {
          dirigentes: []
        },
        projeto: {
          Id_projeto: null,
          Numero_projeto: null,
          Projeto: null,
          fk_entidade: null,
          Status_ERP: null,
          adiantamentos_concedidos: {},
          parcelas: {}
        },
        editaForm: false,
        restricao: true,
        solicitacao: {
          projeto: {},
          processo: {},
          tarefa: {},
          documentosLiberacao: []
        },
        processo: {
          nome: 'DEVOLUCAO_DE_ADIANTAMENTO',
          situacao: 'EM_EXECUCAO'
        },
        tarefa: {
          'nome': 'SOLICITACAO',
          'tipo': 'USUARIO',
          'situacao': 'PADRAO',
          'proximaEtapa': 'Análise'
        },
        documentosLiberacao: [],
        anexosAdiantamento: [],
        data_edicao: '',
        anexos: []
      }
    },
    created () {
      // Seta como default a transação com solicitação
      this.tipoTransacao = 'SOLICITACAO'
      this.data_edicao = moment().format('YYYY-MM-DD HH:mm:ss')
      // Busca os projetos que podem ser pedidos adiantamentos
      this.buscaProjetos()
    },
    methods: {
      buscaProjetos () {
        this.loadingShow = true // bloquea a tela enquanto busca os dados
        axiosLaravel.post('processos/projetos', {'processo': 'DEVOLUCAO_DE_ADIANTAMENTO'}).then((response) => {
          this.projetos = response.data
          this.$forceUpdate() // força o update da tela para não ter problema
          this.loadingShow = false // desbloquea a tela
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      validaDirigentes: function (entidade) {
        this.entidade.dirigentes.forEach((dirigente) => {
          if (dirigente.bt_ativo && moment(new Date()).isSameOrAfter(moment(dirigente.dt_inicio_mandato), 'day') &&
            moment(new Date()).isSameOrBefore(moment(dirigente.dt_fim_mandato), 'day')) {
            return false
          }
        })
        return true
      },
      verificacoes: async function () {
        if (this.usuarioLogado.userType !== 'ENTIDADE') { // SE usuário logado for da entidade faz algumas verificações a mais
          if (this.entidade.bt_ativo === 0) {
            this.show.info = true
            this.show.message = 'A solicitação de adiantamento para este projeto está bloqueada devido à Entidade estar inativa.'
            this.restricao = true
          } else if (!this.validaDirigentes(this.entidade.dirigentes)) {
            this.show.info = true
            this.show.message = 'Não há um representante legal com mandato vigente, ou não há dirigentes ativos nesta entidade.'
            this.restricao = true
          }
        }
        // Busca recursos do projeto
        await axiosLaravel.get('processos/adiantamento/recursos/' + this.projeto.Id_proposta, {entityId: null}).then((response) => {
          // Adiciona os adiantamento concedidos no projeto
          this.projeto.adiantamentos_concedidos = response.data.adiantamentos_concedidos.row
          this.projeto.parcelas = response.data.parcels.row
          // Se NÃO tem restrição mostra o formulário
          if (!this.restricao) {
            this.editaForm = true
          }
          this.loadingShow = false
          this.editaForm = true

          // Força a atualização do Vuejs
          this.$forceUpdate()
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      changeProjeto: async function (projeto) {
        this.projeto = projeto
        // Zera os bloqueios
        this.restricao = false
        this.blockStatusERP = false
        this.show.info = false
        this.show.message = ''
        // Cria GraphQl
        var graphql = { query: `
                        query {
                       entidade(id: ${projeto.fk_entidade}){
                        ds_nome
                        bt_ativo
                        dirigentes{
                          dt_fim_mandato
                          dt_inicio_mandato
                          bt_ativo
                        }
                      }
                    }
                `}
        // Busca dados da entidade
        this.loadingShow = true // bloquea a tela enquanto busca os dados
        await axiosLaravel.post('graphql', graphql).then((response) => {
          // Move os dados para entidade
          this.entidade = response.data.data.entidade
          // Faz as verificações iniciais
          this.verificacoes()

          this.$forceUpdate() // força atualização do vuejs
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      verificaSeProjetoEsta180DiasAtrasado () {
        if (this.projeto.adiantamentos_concedidos.some(function (item) { return item.atraso180dias })) {
          this.show.message = 'Os recursos da solicitação de adiantamento estão bloqueados devido à existência de prestações de contas em aberto em período superior ao previsto em convênio.'
          this.show.info = true
          this.restricao = true
        }
      },
      verificaSeProjetoEsta90DiasAtrasado () {
        if (this.projeto.adiantamentos_concedidos.some(function (item) { return item.atraso90dias })) {
          this.show.message = 'Os recursos da solicitação de adiantamento estão bloqueados devido à existência de prestações de contas em aberto em período superior ao previsto em convênio.'
          this.show.info = true
          this.restricao = true
        }
      },
      concluir () {
        // Validação das parcelas
        if (!this.validaParcelas()) {
          this.$snotify.error('Valores das parcelas precisa ser maior que 0')
          return
        }
        // Validação dos documentos
        if (!this.validaDocumentos()) {
          this.$snotify.error('Falta anexar documento(s) de solicitação de adiantamento')
          return
        }
        // mover os dados para os objetos corretos
        this.preparaObjeto()
        // enviar para o backend
        this.$snotify.info('Gravando Devolução de Adiantamento')
        axiosLaravel.post('processos/grava/adiantamento', this.solicitacao).then((response) => {
          // Retira o info da tela
          this.$snotify.clear()
          this.gravaHistorico(response.data)
          // volta do backend e retorna para tela anterior
          this.$snotify.success('Devolução de adiantamento cadastrado com sucesso')
          setTimeout(() => { this.$router.go(-1) }, 2000)
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      validaParcelas () {
        return this.projeto.parcelas.some((parcela) => {
          return parcela.valor > 0
        })
      },
      validaDocumentos () {
        return this.anexosAdiantamento.length > 0
      },
      gravaHistorico (parm) {
        axiosLaravel.post('historico-tarefas/', parm).then((response) => {
          console.log(response.data)
        })
      },
      preparaObjeto () {
        this.solicitacao = {
          projeto: {},
          processo: {},
          tarefa: {},
          documentosLiberacao: []
        }
        this.solicitacao.processo = this.processo
        this.solicitacao.tarefa = this.tarefa
        this.solicitacao.tarefa.data_edicao = this.data_edicao
        this.solicitacao.tarefa.inicio = this.data_edicao
        this.solicitacao.projeto = _.omit(this.projeto, ['adiantamentos_concedidos', 'parcelas'])
        let itens = []
        let item = {}
        this.projeto.parcelas.forEach((parcela) => {
          item.valor = parcela.valor
          item.id = parcela.id_parcela_adiantamento
          item.recurso = parcela.resourceSource
          item.parcela = parcela.parcel
          itens.push(item)
        })
        let documento = {}
        documento.itens = itens
        documento.anexos = this.anexos
        documento.anexosAdiantamento = this.anexosAdiantamento
        this.solicitacao.documentosLiberacao.push(documento)
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
