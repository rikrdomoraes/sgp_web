import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import Manuais from './components/cadastro/Manuais.vue'
import Preferencias from './components/Preferencias.vue'
import DashboardIndex from './components/modules/dashboard/Index.vue'
import NotFound from './components/modules/dashboard/404.vue'
import WidgetsIndex from './components/modules/widgets/Index.vue'
import UIButtons from './components/modules/ui/Buttons.vue'
import UIGeneral from './components/modules/ui/General.vue'
import UIIcons from './components/modules/ui/Icons.vue'
import UIModals from './components/modules/ui/Modals.vue'
import UISliders from './components/modules/ui/Sliders.vue'
import UITimeline from './components/modules/ui/Timeline.vue'
import ListaUsuarios from './components/cadastro/usuario/ListaUsuarios_old'
import Usuarios from './components/cadastro/usuario/ListaUsuarios'
import EditaUsuario from './components/cadastro/usuario/EditaUsuario_old'
import AlteraUsuario from './components/cadastro/usuario/EditaUsuario'
import ListaPerfis from './components/cadastro/perfis/listaPerfis'
import ListaEntidades from './components/cadastro/entidade/listaEntidades'
import EditaPerfis from './components/cadastro/perfis/EditarPerfil'
import ListaPermissoes from './components/cadastro/permissoes/ListaPermissoes'
import ListaAcoes from './components/cadastro/acoes/ListaAcoes'
import ListaEditais from './components/cadastro/editais/ListaEditais'
import EditaEditais from './components/cadastro/editais/EditarEdital'
import ListaChamado from './components/cadastro/chamado/ListaChamado'
import EditaChamado from './components/cadastro/chamado/EditarChamado'
import AbrirChamado from './components/cadastro/chamado/AbrirChamado'
import RelatorioChamado from './components/cadastro/chamado/RelatorioChamado'
import ListaAssunto from './components/cadastro/assunto/ListaAssunto'
import EditaAssunto from './components/cadastro/assunto/EditarAssunto'
import ListaMotivos from './components/cadastro/motivoDevolucao/ListaMotivos'
import EditaMotivos from './components/cadastro/motivoDevolucao/EditarMotivos'
import ListaFav from './components/cadastro/fav/ListaFav'
import ListaFep from './components/cadastro/fep/ListaFep'
import ListaSimplificado from './components/cadastro/simplificado/ListaSimplificado'
import EditarSimplificado from './components/cadastro/simplificado/EditarSimplificado'
import ListaTipoDocumentos from './components/cadastro/documentos/ListaTipoDocumentos'
import ListaGed from './components/cadastro/ged/ListaGed'
import CadastroFormulario from './components/cadastro/avaliacao/CadastroFormulario'
import EditaFormulario from './components/cadastro/avaliacao/EditaFormulario'
import PreencheFormulario from './components/cadastro/avaliacao/PreencheFormulario'
import MovimentoDiario from './components/cadastro/ged/MovimentoDiario'
import ListaRatificacao from './components/cadastro/ratificacoes/ListaRatificacao'
import ListaRatificacaoPendentes from './components/cadastro/ratificacoes/ListaRatificacaoPendentes'
import EditaRatificacao from './components/cadastro/ratificacoes/EditaRatificacao'
import RelatorioAnalise from './components/modules/relatorioAnalise'
import VisualizaRelatorioAnalise from './components/modules/visualizaRelatorioAnalise'
import RelatorioRating from './components/modules/relatorioRating'
import RelatorioFep from './components/modules/relatorioFep'
import relatorioFepAberto from './components/modules/relatorioFepAberto'
import Editafav from './components/cadastro/fav/EditaFav'
import Novafav from './components/cadastro/fav/NovaFav'
import Editafep from './components/cadastro/fep/EditaFep'
import EditaTipoDocumentos from './components/cadastro/documentos/EditarDocumentos'
import ListaPropostas from './components/proposta/ListaProposta'
import EditaProposta from './components/proposta/EditaProposta'
import PlanoTrabalho from './components/proposta/PlanoTrabalho'
import ImprimirProposta from './components/proposta/ImprimirProposta'
import ImprimirPropostaEdital from './components/proposta/ImprimirPropostaEdital'
import ListaSolicitacao from './components/solicitacoes/ListaSolicitacao'
import LogEmails from './components/configuracoes/LogEmails'
import ConfGerais from './components/configuracoes/ConfGerais'
import CadastroRel from './components/relatorioserp/CadastroRel'
import EditaCadastroRel from './components/relatorioserp/EditaCadastroRel'
import ListaProjetos from './components/projetos/ListaProjetos'
import VisualizaProjeto from './components/projetos/VisualizaProjeto'
import Projeto from './components/projetos/Projeto'
import Timeline from './components/projetos/Timeline'
import GestaoAtividades from './components/projetos/GestaoAtividades'
import PendenciasProjeto from './components/projetos/PendenciasProjeto'
import Roteiro from './components/modules/dashboard/Roteiro'
import Atividades from './components/projetos/Atividades'
import EditaEntidades from './components/cadastro/entidade/EditaEntidades'
import VisualizaEntidades from './components/cadastro/entidade/VisualizaEntidades'
import CredenciamentoEntidade from './components/cadastro/entidade/CredenciamentoEntidade'
import EntidadeSimplificado from './components/cadastro/entidade/EntidadeSimplificado'
import EntidadeProposta from './components/cadastro/entidade/EntidadeProposta'
import EntidadePropostaEdital from './components/cadastro/entidade/EntidadePropostaEdital'
import ListaParcEstrategico from './components/cadastro/parceiroEstrategico/ListaParcEstrategico'
import ImpressaoRel from './components/relatorios/ImpressaoRel'
import relatorioBi from './components/relatorios/relatorioBi'
import GeracaoRemessa from './components/remessas/GeracaoRemessa'
import TratamentoRetorno from './components/remessas/TratamentoRetorno'
import LiberacaoProposta from './components/proposta/Liberacao'
import PropostaSimplificada from './components/proposta/Simplificada'
import ListaValidacaoProposta from './components/validação/ListaValidacaoProposta'
import PrimeiraAprovacao from './components/validação/proposta/PrimeiraAprovacao'
import aceite from './components/validação/proposta/aceite'
import analiseGeral from './components/validação/proposta/analiseGeral'
import preparacaoDocumento from './components/validação/proposta/mainPreparacaoDocumento'
import formalizacao from './components/validação/proposta/mainFormalizacao'
import aprovacaoProjeto from './components/validação/proposta/mainAprovacaoProjeto'
import deferimento from './components/validação/proposta/mainDeferimento'
import ListaValidacaoEntidade from './components/validação/entidades/ListaValidacaoEntidade'
import ValidaEntidades from './components/validação/entidades/ValidaEntidades'
import ValidaParceiro from './components/validação/parceiroEstrategico/ValidaParceiro'
import DetalheValidaEntidade from './components/validação/entidades/DetalheValidaEntidade'
import ValidaInicial from './components/validação/validacaoInicial/ValidaInicial'
import ListaValidacaoInicial from './components/validação/validacaoInicial/ListaValidacaoInicial'
import ListaValidacaoParcEst from './components/validação/parceiroEstrategico/ListaValidacaoParcEst'
import ListaValidacaoSolicitacoes from './components/validação/solicitacoes/ListaValidacaoSolicitacoes'
import solicitacaoPagamento from './components/solicitacoes/pagamento/EditaPagamento'
import solicitacaoAdiantamento from './components/solicitacoes/adiantamento/EditaAdiantamento'
import solicitacaoAlteracoesProjeto from './components/solicitacoes/alteracoesProjeto/EditaProjeto'
import sumulaAlteracoesProjeto from './components/solicitacoes/alteracoesProjeto/Sumula'
import aditivoAlteracoesProjeto from './components/solicitacoes/alteracoesProjeto/Aditivo'
import planoTrabalhoAlteracoesProjeto from './components/solicitacoes/alteracoesProjeto/PlanoTrabalho'
import EsqueciMinhaSenha from './components/EsqueciMinhaSenha'
import AutoCredenciamento from './components/AutoCredenciamento'
import ListaValidacaoRelExec from './components/validação/relatorioDeExecucao/ListaValidacaoRelExec'
import EmiteRelatorioERP from './components/relatorioserp/EmiteRelatorioERP'
import EditaParcEstrategico from './components/cadastro/parceiroEstrategico/EditaParcEstrategico'
import ListaRelExec from './components/projetos/ListaRelExec'
import EditaRelExec from './components/projetos/EditaRelExec'
// import NovoParcEstrategico from './components/cadastro/parceiroEstrategico/NovoParcEstrategico'
import validacaoAdiantamento from './components/validação/solicitacoes/adiantamento/validacaoAdiantamentoAnalise'
import validacaoDevolucaoAdiantamento from './components/validação/solicitacoes/devolucaoAdiantamento/validacaoDevolucaoAdiantamentoAnalise'
import AlterarSenha from './components/AlterarSenha'
import ListaSumarioExecutivo from './components/cadastro/sumarioExecutivo/ListaSumarioExecutivo'
import EditaSumarioExecutivo from './components/cadastro/sumarioExecutivo/EditaSumarioExecutivo'
import ListaArticulacoes from './components/cadastro/articulacao/ListaArticulacoes'
import EditaArticulacao from './components/cadastro/articulacao/EditaArticulacao'
import ListaOcorrencias from './components/cadastro/ocorrencias/ListaOcorrencias'
// Demanda 65971 inclusão da Emissão de Documentos pré-preenchidos
import EmissadoDocumentos from './components/projetos/EmissaoDocumentos'
import ListaRemessaBNDES from './components/remessas/ListaRemessaBNDES'
import ProjetosUsuario from './components/cadastro/usuario/ProjetosUsuario'
import GerenciamentoLogs from './components/GerenciamentoLogs'
import odsFundacao from './components/modules/odsFundacao'
import cotacaoExcecoes from './components/modules/cotacaoExcecoes.vue'
import listaValidacaoLicencas from './components/modules/licenciamentoAmbiental/listaValidacaoLicencas.vue'
import ListaSolicitacaoPrestacaoContasSimplificado from './components/modules/prestacaoContasSimplificado/ListaSolicitacaoPrestacaoContasSimplificado.vue'
import ListaValidacaoPrestacaoContasSimplificado from './components/modules/prestacaoContasSimplificado/ListaValidacaoPrestacaoCOntasSimplificado.vue'
import PrestacaoSimplificadaGED from './components/modules/prestacaoContasSimplificado/PrestacaoSimplificadaGED.vue'
import downloadArquivoPrestacao from './components/modules/prestacaoContasSimplificado/downloadArquivoPrestacao.vue'
import GerenciadorEdicaoLog from './components/proposta/GerenciadorEdicaoLog.vue'
import ListaValidacaoSolicitacoesFinanceiras from './components/validação/solicitacoes/ListaValidacaoSolicitacoesFinanceiras.vue'
import GerenciadorPropostaSimplificada from './components/proposta/GerenciadorPropostaSimplificada.vue'

// prefix para criar uma rota nested
const withPrefix = (prefix, routes) =>
  routes.map((route) => {
    route.path = prefix + route.path
    return route
  })
// Routes
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: (to, from, next) => {
      document.body.className = 'login-page'
      next()
    }
  }, {
    path: '/esqueci-minha-senha',
    name: 'recupera-senha',
    component: EsqueciMinhaSenha,
    beforeEnter: (to, from, next) => {
      document.body.className = 'login-page'
      next()
    }
  },
  {
    path: '/altera-senha',
    name: 'altera-senha',
    component: AlterarSenha,
    beforeEnter: (to, from, next) => {
      document.body.className = 'login-page'
      next()
    }
  },
  {
    path: '/autocredenciamento',
    name: 'auto-credenciamento',
    component: AutoCredenciamento,
    meta: { requiresAuth: false },
    beforeEnter: (to, from, next) => {
      next()
    }
  },
  {
    path: '/analiselog',
    name: 'gerenciamento-log',
    component: GerenciamentoLogs,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      next()
    }
  },
  {
    path: '/form/:id?',
    name: 'preenche-formulario-externo',
    component: PreencheFormulario,
    meta: { requiresAuth: false },
    beforeEnter: (to, from, next) => {
      next()
    }
  },
  {
    path: '/se/:id?',
    name: 'visualiza-sumario-executivo-externo',
    component: EditaSumarioExecutivo,
    meta: { requiresAuth: false },
    beforeEnter: (to, from, next) => {
      next()
    }
  },
  {
    path: '/proposta/visualiza/:id?/edital',
    name: 'proposta-edital-externo',
    component: ImprimirPropostaEdital,
    meta: { requiresAuth: false },
    beforeEnter: (to, from, next) => {
      next()
    }
  },
  {
    path: '/',
    component: Dashboard,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      document.body.className += ' skin-fbb sidebar-mini'
      // document.body.className += ' skin-blue sidebar-mini'
      next()
    },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      }, {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardIndex
      }, {
        path: '/widgets',
        name: 'widgets',
        component: WidgetsIndex
      },
      {
        path: 'baixarArquivoPrestacao/:id?',
        name: 'baixar-arquivo-prestacao',
        component: downloadArquivoPrestacao
      },
      {
        path: '/log-edicao-proposta',
        name: 'log-edicao-proposta',
        component: GerenciadorEdicaoLog
      },
      ...withPrefix('/formulario', [
        {
          path: '/edita',
          name: 'edita-formulario',
          component: EditaFormulario
        },
        {
          path: '/cadastro',
          name: 'cadastro-formulario',
          component: CadastroFormulario
        },
        {
          path: '/:id?',
          name: 'preenche-formulario',
          component: PreencheFormulario
        }
      ]),
      ...withPrefix('/sumario_executivo', [
        {
          path: '/lista',
          name: 'lista-sumario-executivo',
          component: ListaSumarioExecutivo
        },
        {
          path: '/:id?',
          name: 'edita-sumario-executivo',
          component: EditaSumarioExecutivo
        }
      ]),
      ...withPrefix('/articulacao', [
        {
          path: '/lista',
          name: 'lista-articulacoes',
          component: ListaArticulacoes
        },
        {
          path: '/:id?',
          name: 'edita-articulacao',
          component: EditaArticulacao
        }
      ]),
      ...withPrefix('/ocorrencias', [
        {
          path: '/lista',
          name: 'lista-ocorrencias',
          component: ListaOcorrencias
        }
      ]),
      ...withPrefix('/ods', [
        {
          path: '/lista',
          name: 'lista-ods-fundacao',
          component: odsFundacao
        }
      ]),
      ...withPrefix('/propostas-simplificadas', [
        {
          path: '/lista',
          name: 'propostas-simplificadas',
          component: GerenciadorPropostaSimplificada
        }
      ]),
      ...withPrefix('/cotacao', [
        {
          path: '/lista',
          name: 'lista-cotacao-automatica-excecoes',
          component: cotacaoExcecoes
        }
      ]),
      {
        path: '/ui/buttons',
        name: 'ui-buttons',
        component: UIButtons
      }, ...withPrefix('/cadastro', [ {
        path: '/usuarios/lista',
        name: 'cadastro-usuarios-lista',
        component: ListaUsuarios
      },
      {
        path: '/usuarios/cadastro',
        name: 'cadastro-usuarios',
        component: Usuarios
      },
      {
        path: '/usuarios/altera/:id',
        name: 'cadastro-usuarios-altera',
        component: AlteraUsuario
      },
      {
        path: '/usuarios/edita/:id',
        name: 'cadastro-usuarios-edita',
        component: EditaUsuario
      },
      {
        path: '/usuarios/projetos',
        name: 'projetos-usuarios',
        component: ProjetosUsuario
      },
      {
        path: '/perfis/lista',
        name: 'cadastro-perfis-lista',
        component: ListaPerfis
      },
      {
        path: '/perfis/edita/:id',
        name: 'cadastro-perfis-edita',
        component: EditaPerfis
      },
      {
        path: '/permissoes/lista',
        name: 'cadastro-permissoes-lista',
        component: ListaPermissoes
      },
      {
        path: '/acoes/lista',
        name: 'cadastro-acoes-lista',
        component: ListaAcoes
      },
      {
        path: '/editais/lista',
        name: 'cadastro-editais-lista',
        component: ListaEditais
      },
      {
        path: '/editais/edita/:number?',
        name: 'cadastro-editais-edita',
        component: EditaEditais
      },
      {
        path: '/chamado/lista',
        name: 'cadastro-chamado-lista',
        component: ListaChamado
      },
      {
        path: '/chamado/criar',
        name: 'abrir-chamado',
        component: AbrirChamado
      },
      {
        path: '/chamado/edita/:id?',
        name: 'cadastro-chamado-edita',
        component: EditaChamado
      },
      {
        path: '/chamado/relatorio',
        name: 'relatorio-chamado',
        component: RelatorioChamado
      },
      {
        path: '/assunto/lista',
        name: 'cadastro-assunto-lista',
        component: ListaAssunto
      },
      {
        path: '/assunto/edita/:number?',
        name: 'cadastro-assunto-edita',
        component: EditaAssunto
      },
      {
        path: '/motivos/lista',
        name: 'cadastro-motivos-lista',
        component: ListaMotivos
      },
      {
        path: '/motivos/edita/:number?',
        name: 'cadastro-motivos-edita',
        component: EditaMotivos
      },
      {
        path: '/simplificado/lista',
        name: 'cadastro-simplificado-lista',
        component: ListaSimplificado
      },
      {
        path: '/simplificado/edita/:id?',
        name: 'cadastro-simplificado-edita',
        component: EditarSimplificado
      },
      {
        path: '/documentos/lista',
        name: 'cadastro-documentos-lista',
        component: ListaTipoDocumentos
      },
      {
        path: '/entidades/lista',
        name: 'cadastro-entidade-lista',
        component: ListaEntidades
      },
      {
        path: '/entidades/edita/:id?',
        name: 'cadastro-entidade-edita',
        component: EditaEntidades
      },
      {
        path: '/entidades/visualiza/:id?',
        name: 'cadastro-entidade-visualiza',
        component: VisualizaEntidades
      },
      {
        path: '/entidades/credenciamento',
        name: 'entidade-credenciamento',
        component: CredenciamentoEntidade
      },
      {
        path: '/entidades/simplificado',
        name: 'entidade-simplificado',
        component: EntidadeSimplificado
      },
      {
        path: '/entidades/entidadeProposta',
        name: 'entidade-proposta',
        component: EntidadeProposta
      },
      {
        path: '/entidades/entidadePropostaEdital',
        name: 'entidade-proposta-edital',
        component: EntidadePropostaEdital
      },
      {
        path: '/parceiros-estrategicos/lista',
        name: 'cadastro-parceiro-estrategico-lista',
        component: ListaParcEstrategico
      },
      {
        path: '/parceiros-estrategicos/edita/:id?',
        name: 'cadastro-parceiro-estrategico-edita',
        component: EditaParcEstrategico
      },
      {
        path: '/parceiros-estrategicos/novo',
        name: 'cadastro-parceiro-estrategico-novo',
        component: EditaParcEstrategico
      },
      {
        path: '/ged',
        name: 'cadastro-ged',
        component: ListaGed
      },
      {
        path: '/movimento-diario',
        name: 'movimento-diario',
        component: MovimentoDiario
      },
      {
        path: '/ratificacao/lista',
        name: 'lista-ratificacao',
        component: ListaRatificacao
      },
      {
        path: '/ratificacao/lista-pendentes',
        name: 'lista-ratificacao-pendentes',
        component: ListaRatificacaoPendentes
      },
      {
        path: '/ratificacao/',
        name: 'edita-ratificacao',
        component: EditaRatificacao
      },
      {
        path: '/ratificacao/:id?',
        name: 'edita-ratificacao',
        component: EditaRatificacao
      },
      {
        path: '/manuais',
        name: 'manuais',
        component: Manuais
      },
      {
        path: '/fav',
        name: 'cadastro-fav-lista',
        component: ListaFav
      },
      {
        path: '/fav/edita',
        name: 'cadastro-fav-edita',
        component: Editafav
      },
      {
        path: '/fav/nova',
        name: 'cadastro-fav-nova',
        component: Novafav
      },
      {
        path: '/fep',
        name: 'cadastro-fep-lista',
        component: ListaFep
      },
      {
        path: '/fep/edita',
        name: 'cadastro-fep-edita',
        component: Editafep
      },
      {
        path: '/fep/manual',
        name: 'relatorio-fep-aberto',
        component: relatorioFepAberto
      },
      {
        path: '/fep/manual-edita:id?',
        name: 'relatorio-fep-aberto-edita',
        component: relatorioFepAberto
      },
      {
        path: '/documentos/edita/:id?',
        name: 'cadastro-documentos-edita',
        component: EditaTipoDocumentos
      }
      ]), ...withPrefix('/proposta', [{
        path: '/lista',
        name: 'proposta-lista',
        component: ListaPropostas
      },
      {
        path: '/edita/:id?',
        name: 'proposta-edita',
        component: EditaProposta
      },
      {
        path: '/relatorio-analise/:id?',
        props: true,
        name: 'relatorio-analise',
        meta: { title: 'Relatório da Análise' },
        component: RelatorioAnalise
      },
      {
        // Demanda 66677 - Correção na chamada da função de cálculo de risco
        path: '/visualiza-relatorio-analise/:id?/:projeto?',
        props: true,
        name: 'visualiza-relatorio-analise',
        meta: { title: 'Visualizar Relatório da Análise' },
        component: VisualizaRelatorioAnalise
      },
      {
        path: '/relatorio-rating/:id?',
        props: true,
        name: 'relatorio-rating',
        meta: { title: 'Rating da Entidade' },
        component: RelatorioRating
      },
      {
        path: '/relatorio-fep/:id?',
        props: () => ({ propsRel: {} }),
        name: 'relatorio-fep',
        meta: { title: 'FEP' },
        component: RelatorioFep
      },
      {
        path: '/visualiza/:id?',
        name: 'proposta-visualiza',
        component: EditaProposta
      },
      {
        path: '/imprimir/:id?',
        name: 'imprimir-proposta',
        component: ImprimirProposta
      },
      {
        path: '/plano-trabalho/:id?',
        name: 'plano-trabalho',
        component: PlanoTrabalho
      },
      {
        path: '/liberacao/:id?',
        name: 'proposta-liberacao',
        component: LiberacaoProposta
      },
      {
        path: '/simplificada/:id?',
        name: 'proposta-simplificada',
        component: PropostaSimplificada
      }
      ]), ...withPrefix('/validacao', [{
        path: '/proposta/lista/:fase?',
        name: 'validacao-proposta-lista',
        component: ListaValidacaoProposta
      },
      {
        path: '/proposta/primeira-validacao/:id?',
        name: 'proposta-primeira-validacao',
        component: PrimeiraAprovacao
      },
      {
        path: '/proposta/analise/:id?',
        name: 'validacao-proposta-analise',
        component: analiseGeral
      },
      {
        path: '/proposta/deferimento/:id?',
        name: 'validacao-proposta-deferimento',
        component: deferimento
      },
      {
        path: '/proposta/aceite/:id?',
        name: 'validacao-proposta-aceite',
        component: aceite
      },
      {
        path: '/proposta/preparaco-documento/:id?',
        name: 'validacao-proposta-preparacao-documento',
        component: preparacaoDocumento
      },
      {
        path: '/proposta/formalizacao/:id?',
        name: 'validacao-proposta-formalizacao',
        component: formalizacao
      },
      {
        path: '/proposta/aprovacao/:id?',
        name: 'validacao-proposta-aprovacao',
        component: aprovacaoProjeto
      },
      // {
      //   path: '/pagamento/:id?',
      //   name: 'validacao-solicitacao-pagamento',
      //   component: validacaoPagamento
      // },
      {
        path: '/adiantamento/analise/:id?',
        name: 'validacao-adiantamento-analise',
        component: validacaoAdiantamento
      },
      {
        path: '/adiantamento/autorizacao/:id?',
        name: 'validacao-adiantamento-autorizacao',
        component: validacaoAdiantamento
      },
      {
        path: '/adiantamento/analise_financeira/:id?',
        name: 'validacao-adiantamento-analisefinanceira',
        component: validacaoAdiantamento
      },
      {
        path: '/adiantamento/revisao/:id?',
        name: 'validacao-adiantamento-revisao',
        component: validacaoAdiantamento
      },
      {
        path: '/devolucao_adiantamento/analise/:id?',
        name: 'validacao-devolucao-adiantamento-analise',
        component: validacaoDevolucaoAdiantamento
      },
      {
        path: '/devolucao_adiantamento/analise_financeira/:id?',
        name: 'validacao-devolucao-adiantamento-analisefinanceira',
        component: validacaoDevolucaoAdiantamento
      },
      {
        path: '/devolucao_adiantamento/revisao/:id?',
        name: 'validacao-devolucao-adiantamento-revisao',
        component: validacaoDevolucaoAdiantamento
      },
      // {
      //   path: '/contrapartida/:id?',
      //   name: 'validacao-solicitacao-contrapartida',
      //   component: validacaoContraPartida
      // },
      // {
      //   path: '/prestacao/:id?',
      //   name: 'validacao-solicitacao-prestacao',
      //   component: validacaoPrestacao
      // },
      {
        path: '/entidade/validacao/:id?',
        name: 'validacao-entidades',
        component: ValidaEntidades
      },
      {
        path: '/parceiros-estrategicos/validacao/:id?',
        name: 'validacao-parceiro',
        component: ValidaParceiro
      },
      {
        path: '/entidade/validacao/detalhe/:id?',
        name: 'detalhe-validacao-entidades',
        component: DetalheValidaEntidade
      },
      {
        path: '/entidade/validacao/:id?',
        name: 'validacao-inicial',
        component: ValidaInicial
      },
      {
        path: '/entidade/lista/:fase?',
        name: 'validacao-entidade-lista',
        component: ListaValidacaoEntidade
      },
      {
        path: '/validacaoInicial/lista/:fase?',
        name: 'validacao-inicial-lista',
        component: ListaValidacaoInicial
      },
      {
        path: '/validacao-parceiro-estrategico/lista/:fase?',
        name: 'validacao-parc-est-lista',
        component: ListaValidacaoParcEst
      },
      {
        path: '/validacao-solicitacoes/lista/:fase?',
        name: 'validacao-solicitacoes-lista',
        component: ListaValidacaoSolicitacoes
      },
      {
        path: '/validacao-solicitacoes-financeiras/lista/:fase?',
        name: 'validacao-solicitacoes-financeiras-lista',
        component: ListaValidacaoSolicitacoesFinanceiras
      },
      {
        path: '/validacao-licencas',
        name: 'validacao-licencas',
        component: listaValidacaoLicencas
      },
      {
        path: '/validacao-prestacao-contas-simplificada',
        name: 'validacao-prestacao-contas-simplificada',
        component: ListaValidacaoPrestacaoContasSimplificado
      },
      {
        path: '/validacao-relatorio-execucao/lista/:fase?',
        name: 'validacao-relatorio-execucao',
        component: ListaValidacaoRelExec
      }
      ]), ...withPrefix('/solicitacao', [{
        path: '/lista',
        name: 'solicitacao-lista',
        component: ListaSolicitacao
      },
      {
        path: '/prestacao-contas-simplificada',
        name: 'prestacao-contas-simplificada',
        component: ListaSolicitacaoPrestacaoContasSimplificado
      },
      {
        path: '/prestacao-contas-simplificada-ged/:id?',
        name: 'prestacao-contas-simplificada-ged',
        component: PrestacaoSimplificadaGED
      },
      {
        path: 'ui/general',
        name: 'ui-general',
        component: UIGeneral
      },
// Início de todas as solicitações (pagamento, contrapartida, prestação, adiantamento etc com e sem ID ficam aqui -----------------
      {
        path: '/pagamento/',
        name: 'solicitacao-pagamento',
        component: solicitacaoPagamento
      },
      {
        path: '/contrapartida/',
        name: 'solicitacao-contrapartida',
        component: solicitacaoPagamento
      },
      {
        path: '/prestacaocontas/',
        name: 'solicitacao-prestacaocontas',
        component: solicitacaoPagamento
      },
      {
        path: '/ressarcimento/',
        name: 'solicitacao-ressarcimento',
        component: solicitacaoPagamento
      },
      {
        path: '/alteracoesprojeto/',
        name: 'solicitacao-alteracoes-projeto',
        component: solicitacaoAlteracoesProjeto
      },
      {
        path: '/alteracoesprojeto/:id?',
        name: 'solicitacao-alteracoes-projeto',
        component: solicitacaoAlteracoesProjeto
      },
      {
        path: '/alteracoesprojeto/visualizacao/:id?',
        name: 'solicitacao-alteracoes-projeto-visualizacao',
        component: solicitacaoAlteracoesProjeto
      },
      {
        path: '/alteracoesprojeto/sumula/',
        name: 'solicitacao-alteracoes-projeto-sumula',
        component: sumulaAlteracoesProjeto
      },
      {
        path: '/alteracoesprojeto/sumula/:id?',
        name: 'solicitacao-alteracoes-projeto-sumula',
        component: sumulaAlteracoesProjeto
      },
      {
        path: '/alteracoesprojeto/aditivo/',
        name: 'solicitacao-alteracoes-projeto-aditivo',
        component: aditivoAlteracoesProjeto
      },
      {
        path: '/alteracoesprojeto/aditivo/:id?',
        name: 'solicitacao-alteracoes-projeto-aditivo',
        component: aditivoAlteracoesProjeto
      },
      {
        path: '/alteracoesprojeto/plano-trabalho/',
        name: 'solicitacao-alteracoes-projeto-plano-trabalho',
        component: planoTrabalhoAlteracoesProjeto
      },
      {
        path: '/alteracoesprojeto/plano-trabalho/:id?',
        name: 'solicitacao-alteracoes-projeto-plano-trabalho',
        component: planoTrabalhoAlteracoesProjeto
      },
      {
        path: '/pagamento/:id?',
        name: 'solicitacao-pagamento',
        component: solicitacaoPagamento
      },
      {
        path: '/contrapartida/:id?',
        name: 'solicitacao-contrapartida',
        component: solicitacaoPagamento
      },
      {
        path: '/prestacaocontas/:id?',
        name: 'solicitacao-prestacaocontas',
        component: solicitacaoPagamento
      },
      {
        path: '/ressarcimento/:id?',
        name: 'solicitacao-ressarcimento',
        component: solicitacaoPagamento
      },
      {
        path: '/adiantamento/',
        name: 'solicitacao-adiantamento',
        component: solicitacaoAdiantamento
      },
      {
        path: '/adiantamento/:id?',
        name: 'solicitacao-adiantamento',
        component: solicitacaoAdiantamento
      },
      {
        path: '/devolucao_adiantamento/',
        name: 'solicitacao-devolucao-adiantamento',
        component: solicitacaoAdiantamento
      },
      {
        path: '/devolucao_adiantamento/:id?',
        name: 'solicitacao-devolucao-adiantamento',
        component: solicitacaoAdiantamento
      }
// Término de bloco de solicitações ------------------------------------------------------------------------------
      ]), ...withPrefix('/projetos', [{
        path: '/lista',
        name: 'lista-projetos',
        component: ListaProjetos
      },
      {
        path: '/ger_atividades/:numeroProjeto?',
        name: 'visualiza-gestao-atividades',
        component: GestaoAtividades
      },
      {
        path: '/pendencias_projeto/:numeroProjeto?',
        name: 'visualiza-pendencias-projeto',
        component: PendenciasProjeto
      },
      {
        path: '/visualizar/:id?',
        name: 'visualiza-projeto',
        component: VisualizaProjeto
      },
      {
        path: '/projeto/:numero?',
        name: 'projeto',
        component: Projeto
      },
      {
        path: '/relatorio-execucao/:id?',
        name: 'visualiza-relatorio-execucao',
        component: ListaRelExec
      },
      {
        path: '/timeline/:id?',
        name: 'visualiza-timeline',
        component: Timeline
      },
      {
        path: '/roteiro/:id?',
        name: 'visualiza-roteiro',
        component: Roteiro
      },
      {
        path: '/atividade/gantt/:id?',
        name: 'visualiza-gantt',
        component: Atividades
      },
      {
        path: '/relatorio-execucao/',
        name: 'edita-relatorio-execucao',
        component: EditaRelExec
      },
      // Demanda 65971 inclusão da Emissão de Documentos pré-preenchidos
      {
        path: '/emissao-documentos/:numero?',
        name: 'emissao-documentos',
        component: EmissadoDocumentos
      }
      ]), {
        path: 'ui/general',
        name: 'ui-general',
        component: UIGeneral
      }, ...withPrefix('/relatorios', [{
        path: '/impressao',
        name: 'impressao-relatorio',
        component: ImpressaoRel
      },
      {
        path: '/relatorioBi',
        name: 'relatorioBi',
        component: relatorioBi
      },
      {
        path: '/remessas',
        name: 'geracao-remessa',
        component: GeracaoRemessa
      },
      {
        path: '/remessas/lista-bndes',
        name: 'lista-remessa-bndes',
        component: ListaRemessaBNDES
      },
      {
        path: '/retorno',
        name: 'tratamento-retorno',
        component: TratamentoRetorno
      }
      ]),
      {
        path: '/ui/icons',
        name: 'ui-icons',
        component: UIIcons
      }, ...withPrefix('/relatorios-erp', [{
        path: '/cadastro',
        name: 'cadastro-relatorio',
        component: CadastroRel
      },
      {
        path: '/cadastro/edita',
        name: 'edita-relatorio',
        component: EditaCadastroRel
      },
      {
        path: '/relatoriosERP/emissao',
        name: 'emite-relatorio',
        component: EmiteRelatorioERP
      }
      ]), {
        path: '/ui/modals',
        name: 'ui-modals',
        component: UIModals
      }, {
        path: '/ui/sliders',
        name: 'ui-sliders',
        component: UISliders
      }, {
        path: '/ui/timeline',
        name: 'ui-timeline',
        component: UITimeline
      }, ...withPrefix('/configuracoes', [{
        path: '/emails',
        name: 'logs-email',
        component: LogEmails
      },
      {
        path: '/gerais',
        name: 'conf-gerais',
        component: ConfGerais
      },
      {
        path: '/gerais',
        name: 'preferencias',
        component: Preferencias
      }
      ]),
      {
        path: '*',
        name: '404',
        component: NotFound
      }
    ]
  }
]

export default routes
