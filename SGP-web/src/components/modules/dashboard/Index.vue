<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP'"/>

    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        Inicial
      </h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> Inicial</a></li>
      </ol>
    </section>

    <!-- Main content -->
    <section class="content">
      <div v-if="usuarioLogado.ds_tipo_usuario === 'ENTIDADE' && usuarioLogado.ds_cpf === null" class="column all-centered aviso-edital">
        <div>
          <i class="fa fa-warning"></i> <b>Atenção</b>: Esta conta permite apenas ver os projetos que já foram aprovados. Se você precisar fazer alterações ou enviar novas propostas, por favor, saia desta conta e entre novamente usando a conta do <b>Representante Legal</b> da sua organização.
        </div>
      </div>
      <div v-if="usuarioLogado.ds_tipo_usuario === 'ENTIDADE'">
        <avisosLicencas></avisosLicencas>
      </div>

      <span v-if="usuarioLogado.userType === 'ENTIDADE' && _.get(usuarioLogado, 'entidade.id', 0) !== 1439"> <!-- Usuários ligados a "entidade" FBB (1439) não tem acesso a esta opção (chamado 68455) -->
        <!--Pendencias Projeto -->
        <div class="row">
          <div class="col-md-12">
            <visualiza-pendencias-projeto></visualiza-pendencias-projeto>
          </div>
        </div>
      </span>

      <!-- Roteiro de contratação de projeto -->
      <div class="row">
        <div class="col-sm-12">
          <visualiza-roteiro v-if="usuarioLogado.userType === 'ENTIDADE'"></visualiza-roteiro>
        </div>
      </div>


      <div v-if="usuarioLogado.userType === 'ENTIDADE' && chamados && chamados.length > 0" class="alert alert-dismissible alert-warning">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
        <h4><i class="fa fa-warning"></i>&nbsp;&nbsp; Atenção: existe(m) chamado(s) que dependem de providências da sua instituição:</h4>
        <span v-for="chamado in chamados">
          Chamado número:
          <router-link target="_blank" :to="{name: 'cadastro-chamado-edita',  params: { id: chamado.id}}"> <b>{{chamado.id}}</b> </router-link>
          - {{chamado.status.status}}<br></span>


      </div>

      <div v-show="mensagens.length > 0" v-for="msg in mensagens" class="alert alert-link alert-dismissible alert-warning">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
        <h4><i class="fa fa fa-info"></i>&nbsp;&nbsp; Atenção!</h4>
        <span v-html="msg"></span>
      </div>
      <!-- 66.978 -->
      <div>
        <AvisoMudancas></AvisoMudancas>
      </div>  
      <div v-show="usuarioLogado.userType === 'ENTIDADE' && !_.isEmpty(projetos)" class="alert alert-link alert-dismissible" style="border: 1px solid #000000 !important; text-align: justify; text-justify: inter-word">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
        <h4><i class="fa fa-warning"></i> Atenção! Mudança de e-mail.</h4>
        <span>
          <p>Prezados parceiros,</p>
          <br>
          <p>Informamos que o e-mail para tratar de assuntos relacionados ao andamento do projeto mudou de
            implementação@fbb.org.br para: <strong>assessoramento@fbb.org.br</strong></p>
          <br>
          <p>Respeitosamente e sempre à sua disposição,</p>
          <br>
          <p>
            Fundação Banco do Brasil<br>
          </p>
        </span>
      </div>

      <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
        <i class="fa fa-refresh fa-spin"></i>
      </div>

      <!-- <div v-show="usuarioLogado.userType === 'ENTIDADE'"> -->
      <div>
        <Integridade></Integridade>
      </div>

    </section>

  </div>

  

</template>

<script>
  /* eslint-disable no-unused-vars */
  // import moment from 'moment'

  import { mapGetters } from 'vuex'
  import VisualizaRoteiro from './Roteiro'
  import VisualizaPendenciasProjeto from '../../projetos/PendenciasProjeto'
  import Integridade from './Integridade.vue'
  import AvisoMudancas from './AvisoMudancas.vue'
  import avisosLicencas from '../licenciamentoAmbiental/avisosLicencas.vue'

  let items = []

  export default {
    components: {
      VisualizaPendenciasProjeto,
      VisualizaRoteiro,
      Integridade,
      AvisoMudancas,
      avisosLicencas
    },
    name: 'DashboardIndex',
    data () {
      return {
        data: [],
        loading: {
          show: false
        },
        usuariosLogados: [],
        propostas: [],
        projetos: [],
        idEntidade: null,
        items: [],
        chamados: [],
        // somenteUm: 0,
        mensagens: [],
        relatorios: {
          alerta: {
            row: []
          }
        },
        itemsProjetos: [],
        perfis: {},
        filtros: {
          createdAt: null
        },
        projetoEntidade: null,
        filtrosProjetos: {
          createdAt: null
        },
        fields: [
          { key: 'dt_criado', label: 'Data de inclusão', sortable: true, 'class': 'text-center' },
          { key: 'NomeEntidade', label: 'Entidade', sortable: true, 'class': 'text-center' },
          { key: 'ds_nome', label: 'Proposta', sortable: true, 'class': 'word-wrap:break-word text-center' },
          { key: 'ds_fase', label: 'Fase', sortable: true, 'class': 'text-center' },
          { key: 'ds_numero_simplificado', label: 'Tipo', 'class': 'text-center' },
          { key: 'actions', label: 'Ações', thStyle: 'width: 14%' }
        ],
        fieldsProjetos: [
          // { key: 'dataCriacao', label: 'Data de inclusão', thStyle: 'width: 10%; text-align: center', sortable: true, 'class': 'text-center' },
          { key: 'ds_codigo_projeto_erp', label: 'Nº Projeto', thStyle: 'width: 6%; text-align: center', sortable: true, 'class': 'text-center' },
          { key: 'ds_nome', label: 'Projeto', thStyle: 'width: 30%; text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
          // { key: 'ds_risco_calculado', label: 'Risco Calculado', thStyle: 'width: 5%; text-align: center', sortable: true, 'class': 'text-center' },
          // { key: 'monitoramento', label: 'Monitoramento', thStyle: 'width: 10%; text-align: center', 'class': 'text-center' },
          // { key: 'assessoramento', label: 'Assessoramento', thStyle: 'width: 10%; text-align: center', 'class': 'text-center' },
          // { key: 'competencias', label: 'Competência e alçada decisória do C.E', thStyle: 'width: 10%; text-align: center', 'class': 'text-center' },
          { key: 'actions', label: 'Acessar:', thStyle: 'width: 8%; text-align: center', 'class': 'text-center' }
        ],
        table: {
          currentPage: 1,
          perPage: 10,
          totalRows: items.length,
          sortBy: 'dt_criado',
          sortDesc: true,
          filter: null,
          bordered: true
        },
        tableProjetos: {
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'dataCriacao',
          sortDesc: true,
          filter: null,
          bordered: true
        },
        store: this.$store
      }
    },
    watch: {
      idEntidade () {
        if (this.usuarioLogado.userType === 'ENTIDADE' && !_.isNull(this.idEntidade)) {
          this.buscaRelatoriosMensagem()
        }
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    mounted: function () {
      if (typeof Storage !== 'undefined') {
        this.propostas = _.get(JSON.parse(window.localStorage.getItem('propostas')), 'lista', [])
        this.projetos = _.get(JSON.parse(window.localStorage.getItem('projetos')), 'lista', [])
      }
    },
    created: function () {
      if (this.usuarioLogado.ds_tipo_usuario === 'FUNDACAO') {
        // Verificar se há demanda para este usuario
        axiosLaravel.post('/ratificacao/ha_tarefa', {'processo': 'RATIFICACAO_PAGAMENTO', 'tarefa': 'ASSINATURA_RATIFICACAO', 'situacao': 'EM_EXECUCAO'}).then((response) => {
          if (response.data.retorno > 0) {
            this.$router.push({name: 'lista-ratificacao-pendentes'})
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      } else {
        this.idEntidade = _.has(this.usuarioLogado.entidade, 'id') ? this.usuarioLogado.entidade.id : (!_.isNull(this.usuarioLogado.fk_entidade) ? this.usuarioLogado.fk_entidade : null)
        this.buscaChamados()
      }
    },
    filters: {
      simplificado: function (value) {
        if (value === 'null') return 'Prospecção Direta'
        return value
      }
    },
    methods: {
      // assinaUsuariosLogados () {
      //   window.Echo.join('usuarios-logados')
      //     .here((users) => {
      //       this.usuariosLogados = users
      //       this.$forceUpdate()
      //     })
      //     .joining((user) => {
      //       this.usuariosLogados.push(user)
      //     })
      //     .leaving((user) => {
      //       this.usuariosLogados.splice(this.usuariosLogados.findIndex(logado => logado.id === user.id), 1)
      //     })
      // },
      buscaRelatoriosMensagem () {
        axiosLaravel.get('/relatorio_execucao/busca_relatorios_mensagem/' + this.idEntidade).then((response) => {
          this.relatorios = response.data
          if (_.has(this.relatorios, 'alerta') && _.has(this.relatorios.alerta, 'row') && (_.has(this.relatorios.alerta.row, 'mensagem') || this.relatorios.alerta.row.length > 0)) {
            this.mensagens = _.isArray(this.relatorios.alerta.row) ? _.map(this.relatorios.alerta.row, 'mensagem') : [this.relatorios.alerta.row.mensagem]
          }
          this.$forceUpdate()
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
            this.$snotify.clear()
          })
        // this.result = Array.isArray(this.mensagens)
        // if (this.result === true) {
        //   (Object.assign({}, this.mensagens))
        // }
      },
      buscaChamados () {
        this.loading.show = true
        axiosLaravel.get('chamado/').then((response) => {
          // Limitar acesso a projetos
          let listaProjetos = response.data
          let acessosProjetos = _.get(this.usuarioLogado, 'configuracoes.acesso_projetos')
          if (acessosProjetos) {
            acessosProjetos.forEach((projeto) => {
              if (_.find(projeto.acesso, ['codigo', 'SEM_ACESSO'])) {
                _.remove(listaProjetos, ['projeto', projeto.numero])
              }
            })
          }
          let array = listaProjetos.filter((item) => {
            return item.status_id !== 5
          })
          this.chamados = array
          this.$forceUpdate()
          this.loading.show = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      },
      onVisualizate (row) {
      },
      authorizeEditProposal (row) {
        return row.item.ds_fase === 'CADASTRO' && this.$root.authorize('proposta-cadastro-completo')
      },
      isEditable (row) {
        return true
      },
      accessValidProposal () {
        let boolean = false
        if (this.$root.authorize('proposta-visualizar') || this.$root.authorize('proposta-visualizar-por-mim') || this.$root.authorize('minha-proposta-visualizar')) {
          if (this.$root.authorize('dashboard-propostas')) {
            boolean = true
          }
        }
        return boolean
      }
    }
  }
</script>

<style scoped>
  .aviso-edital {
    padding: 20px;
    border: 1px solid #BABFC4;
    border-radius: 10px;
    width: 100%;
    background-color: #FCFC30;
    font-size: 1.5rem;
    color: #002D4B;
  }
</style>
