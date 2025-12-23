<template>
  <div class="content-wrapper">

    <vue-headful :title="'SGP - GED'"/>

    <div ng-view="" class="fade-transition" style="">
      <section class="content-header">
        <h1>GED</h1>
        <b-breadcrumb :items="breadcrumb"/>
      </section>

      <section class="content ged">

        <div class="row">
          <div class="col-md-12">
            <div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Consulta de Documentos</h3>
              </div>

              <div class="box-body">
                <div class="col-md-11">
                  <div class="form-horizontal">
                    <g-button-ujarak color="primary" size="button--size-ss" type="button" @click.native="mostrarAdicionarDocumento = !mostrarAdicionarDocumento" v-if="usuarioLogado.userType === 'FUNDACAO'" :disabled="botaoAdicionarDocumento"><i class="fa fa-plus-circle" aria-hidden="true"></i> Adicionar documento </g-button-ujarak>
                    <upload-documento v-show="mostrarAdicionarDocumento" v-if="usuarioLogado.userType === 'FUNDACAO'" :documentTypes="''" :lista-projetos="projetos" :lista-entidades="entidades" @mostrarQuadroAdicionaDocumento="mostrarAdicionarDocumento = $event"></upload-documento>
                  </div>
                </div>
                <div class="col-md-1 legenda"
                     :title="'<table class=\'legenda_tabela\'>' +
                                    '<tr><td class=\'DEF\'><i class=\'fa fa-folder\'></i></td><td>Não contratado (ANA, DEF)</td></tr>' +
                                    '<tr><td class=\'APR\'><i class=\'fa fa-folder\'></i></td><td>Aprovado e regular (APR)</td></tr>' +
                                    '<tr><td class=\'SO3\'><i class=\'fa fa-folder\'></i></td><td>Aprovado e irregular (SO3, SO4, DLG, SPS etc)</td></tr>' +
                                    '<tr><td class=\'ENC\'><i class=\'fa fa-folder\'></i></td><td>Encerrado ou quase (ETO, ENC)</td></tr>' +
                                    '<tr><td style=\'color: #777\'><i class=\'fa fa-folder\'></i></td><td>Cancelado ou situação não definida</td></tr>' +
                                    '<tr><td class=\'text-bold\'>!</td><td>Informação não foi encontrada</td></tr>' +
                                 '</table>' +
                                 '<br/><br/>' +
                                 '<table class=\'legenda_tabela\'>' +
                                    '<tr><td>Liberação de recursos</td><td>Id ... Situação ... Valor total</td></tr>' +
                                    '<tr><td>Proposta</td><td>Início do projeto ... Duração dele</td></tr>' +
                                    '<tr><td>Dirigentes</td><td>Cargo ... Nome ... Mandato ... Situação</td></tr>' +
                                    '<tr><td>Entidade</td><td>CNPJ ... Razão Social</td></tr>' +
                                    '<tr><td>Relatório de Execução</td><td>Número ref. ... Situação ... apresentação ... aprovação</td></tr>' +
                                 '</table>' +
                                 '<br/><br/>' +
                                 '<table class=\'legenda_tabela\'>' +
                                    '<tr><td class=\'text-bold\'>Situação</td><td>&nbsp;</td></tr>' +
                                    '<tr><td class=\'text-bold text-right\'>  FEITO</td><td>Ação que foi concluída</td></tr>' +
                                    '<tr><td class=\'text-bold text-right\'>  EM_EXECUCAO</td><td>Ação que está em andamento</td></tr>' +
                                    '<tr><td class=\'text-bold text-right\'>  CANCELADO</td><td>Ação excluída/não processada</td></tr>' +
                                 '</table>' +
                                 '<br/><br/>' +
                                 '<table class=\'legenda_tabela\'>' +
                                    '<tr><td class=\'text-gray\'><i class=\'fa fa-refresh\'></i></td><td>Indica que pode clicar oara atualizar a pasta</td></tr>' +
                                    '<tr><td style=\'color: steelblue\'><i class=\'fa fa-download\'></i></td><td>Indica que pode fazer download do arquivo</td></tr>' +
                                    '<tr><td style=\'background:#b41904;\'>&nbsp;</td><td>Indica que a data de validade expirou</td></tr>' +
                                  '</table>'"
                     v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', interactive: true, theme: 'light', position: 'top'}">Legenda</div>
              </div>

              <div class="box-body" >
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>

                <div class="sidebar">

                  <div class="arvore_projetos">

                    <li class="treeview" data-widget="tree" >
                      <a href="#">
                        <i class="fa fa-folder-o"></i>
                        <span>Projetos</span>
                      </a>
                      <ul v-if="!_.isNil(projetos) && projetos.length > 0" class="treeview-menu">
                        <li v-for="projeto in projetos" @click="carregarPastas(projeto.id)" class="treeview projeto" data-widget="tree">

                          <a href="#">
                            <i :class="'fa fa-folder ' + projeto.situacao" :title="'<h5>' + projeto.situacao + '</h5>'"
                               v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', interactive: true, theme: 'dark', position: 'top'}"></i>
                            <span>{{projeto.ds_codigo_projeto_erp + ' - ' + projeto.ds_nome}}</span>
                          </a>

                          <ul v-if="!_.isNil(projeto.pastas) && projeto.pastas.length > 0" class="treeview-menu" style="display: none">
                            <li v-for="pasta in projeto.pastas" @click="carregarArquivos(pasta.id, projeto.id, false)" class="treeview pasta" data-widget="tree">
                              <a href="#" title="<h5>Clique para descobrir/buscar arquivos</h5>" v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', interactive: true, theme: 'dark', position: 'top'}">
                                <i :class="'fa ' + pasta.icone"></i>
                                <span>
                                  {{pasta.nome}}
                                  <span class="contador">
                                    {{(_.isNil(pasta.arquivos) ? '' : (pasta.arquivos.length > 0 ? pasta.arquivos.length + ' arquivo' + (pasta.arquivos.length > 1 ? 's' : '') : 'nenhum arquivo'))}}
                                    <i v-if="!_.isNil(pasta.arquivos)" class="fa fa-refresh" @click="carregarArquivos(pasta.id, projeto.id, true)"></i>
                                  </span>
                                </span>
                              </a>

                              <ul v-if="!_.isNil(pasta.arquivos) && pasta.arquivos.length > 0" class="treeview-menu">
                                <li v-for="agrupado in _.values(_.groupBy(pasta.arquivos, 'grupo'))" class="treeview pasta" data-widget="tree">
                                  <a href="#">
                                    <span>{{agrupado[0].grupo}}
                                      <span class="contador">
                                      {{(_.isNil(agrupado) ? '' : (agrupado.length > 0 ? agrupado.length + ' arquivo' + (agrupado.length > 1 ? 's' : '') : 'nenhum arquivo'))}}
                                      <i v-if="!_.isNil(agrupado)" class="fa fa-external-link" @click="irPara(agrupado[0].link)"></i>
                                      </span>
                                    </span>
                                  </a>
                                  <ul class="treeview-menu" :style="'display: ' + (_.values(_.groupBy(pasta.arquivos, 'grupo')).length === 1 ? 'block' : 'none')">
                                    <table class="arquivos">
                                      <tbody>
                                        <tr v-for="arquivo in _.sortBy(agrupado, 'ds_tipo')">
                                          <td :style="arquivo.ds_tipo.length > 57 ? 'width: 540px' : ''">{{arquivo.ds_tipo}}</td>
                                          <td><a @click="onDownload(arquivo)" href="javascript:void(0)" class="ng-binding"><i class="fa fa-download" aria-hidden="true"></i> {{arquivo.ds_nome_arquivo}}</a></td>
                                          <td class="data_incluido" :title="_.isNil(arquivo.incluido) ? '' : '<h6>Data de inclusão</h6>'" v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', interactive: true, theme: 'dark', position: 'top'}">{{arquivo.incluido}}</td>
                                          <td :class="'data_validade ' + (dataExpirada(arquivo.validade) ? 'data_expirada' : '')" :title="_.isNil(arquivo.validade) ? '' : '<h6>Data de validade</h6>'" v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', interactive: true, theme: 'dark', position: 'top'}">{{arquivo.validade}}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </ul>
                                </li>
                              </ul>

                            </li>


                          </ul>

                        </li>

                      </ul>

                    </li>

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
  import UploadDocumento from '../../modules/uploadDocumento'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      UploadDocumento
    },
    name: 'ListaGed',
    data () {
      return {
        listaDocumentos: 'CADASTRO_DIRIGENTE',
        mostrarAdicionarDocumento: false,
        botaoAdicionarDocumento: true,
        data: [],
        loading: {
          show: false
        },
        hoje: new Date(),
        items: [],
        perfis: {},
        documentos: {},
        documento: {},
        filtros: {
          beginAdded: null,
          beginAddedDate: null,
          documentType: null,
          endAddedDate: null,
          entity: null,
          fileName: null,
          project: null
        },
        fields: [
          {key: 'dt_criado', label: 'Data de Inclusão', sortable: true, thStyle: 'width: 10%; text-align: center', class: 'text-center'},
          {key: 'entidade', label: 'Entidade', sortable: true, thStyle: 'width: 10%; text-align: left', class: 'text-left'},
          {key: 'proposta', label: 'Projeto', sortable: true, thStyle: 'width: 40%; text-align: left', class: 'text-left'},
          {key: 'ds_tipo', label: 'Tipo de Documento', sortable: true, thStyle: 'width: 10%; text-align: center', class: 'text-center'},
          {key: 'origem', label: 'Origem', sortable: true, thStyle: 'width: 10%; text-align: center', class: 'text-center'},
          {key: 'ds_nome_arquivo', label: 'Arquivo', sortable: true, thStyle: 'width: 20%; text-align: left', class: 'text-left'}
        ],
        table: {
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'dt_criado',
          sortDesc: true,
          filter: null,
          emptyText: 'Não há registros a serem mostrados'
        },
        store: this.$store,
        breadcrumb: [{
          text: 'Inicial',
          href: '/'
        }, {
          text: 'Cadastro',
          href: '#'
        }, {
          text: 'GED',
          active: true
        }],
        projetos: [],
        pastas: [],
        arquivos: [],
        entidades: [],
        tipos_documentos: [],
        projetosSelecionados: [],
        entidadesSelecionados: [],
        tiposDocumentosSelecionados: [],
        processosSelecionados: [],
        validadeInicio: '2018-03-01',
        validadeTermino: '2019-01-01'
      }
    },
    created: function () {
      this.listaProjetos()
      this.listaEntidades()
      this.listaTipoDocumentos()
    },
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ])
    },
    mounted: function () {
    },
    methods: {
      carregarPastas (id) {
        let i = _.findIndex(this.projetos, ['id', id])
        if (!_.has(this.projetos[i], 'pastas')) {
          let p = {'pastas': [{id: 'ADIANTAMENTO', nome: 'Adiantamento', icone: 'fa-file-text-o'}, {id: 'PAGAMENTO', nome: 'Pagamento', icone: 'fa-file-text-o'}, {id: 'CONTRAPARTIDA', nome: 'Contrapartida', icone: 'fa-file-text-o'}, {id: 'PRESTACAO_DE_CONTAS', nome: 'Prestação de Contas', icone: 'fa-file-text-o'}, {id: 'PROPOSTA', nome: 'Documentos da Proposta', icone: 'fa-file-text-o'}, {id: 'DOCUMENTO_DIRIGENTE', nome: 'Documentos de dirigentes', icone: 'fa-file-text-o'}, {id: 'ENTIDADE', nome: 'Documentos da entidade', icone: 'fa-file-text-o'}, {id: 'RELATORIO_DE_EXECUCAO', nome: 'Relatório de Execução', icone: 'fa-file-text-o'}]}
          _.assign(this.projetos[i], p)
          this.$forceUpdate()
        }
      },
      irPara (link) {
        window.open(this.urlLaravel + link, '_blank')
      },
      carregarArquivos (pasta, id, atualizar) {
        let idxProjeto = _.findIndex(this.projetos, ['id', id])
        let projeto = this.projetos[idxProjeto]
        let vm = this
        let idxPasta = _.findIndex(projeto.pastas, ['id', pasta])
        if (atualizar || !_.has(this.projetos[idxProjeto]['pastas'][idxPasta], 'arquivos')) {
          this.loading.show = true
          this.$snotify.clear()
          this.$snotify.success('Procurando...', {timeout: 7000})
          axiosLaravel.post('documentos/pasta', {'processo': pasta, 'id': id}).then((response) => {
            if (_.includes(['ADIANTAMENTO', 'PAGAMENTO', 'CONTRAPARTIDA', 'PRESTACAO_DE_CONTAS'], pasta)) {
              _.forEach(['ADIANTAMENTO', 'PAGAMENTO', 'CONTRAPARTIDA', 'PRESTACAO_DE_CONTAS'], function (p) {
                let idx = _.findIndex(projeto.pastas, ['id', p])
                let arquivos = _.filter(response.data, ['processo', p])
                _.assign(vm.projetos[idxProjeto]['pastas'][idx], {'arquivos': arquivos})
              })
            } else {
              _.assign(vm.projetos[idxProjeto]['pastas'][idxPasta], {'arquivos': response.data})
            }
            this.$forceUpdate()
            this.$snotify.clear()
            this.loading.show = false
          })
            .catch((error) => {
              this.$snotify.clear()
              this.loading.show = false
              if (error) {
                this.$root.trataErro(error)
              }
            })
        }
      },
      projeto (option) {
        return `${option.ds_codigo_projeto_erp + ' - ' + option.ds_nome}`
      },
      entidade (option) {
        return `${option.ds_nome_fantasia + ' - ' + option.ds_nome}`
      },
      listaProjetos () {
        this.loading.show = true
        axiosLaravel.get('projetos').then((response) => {
          this.projetos = _.sortBy(response.data, 'ds_codigo_projeto_erp')
          this.projetos = _.filter(this.projetos, function (p) { return p.ds_codigo_projeto_erp !== '' && p.ds_codigo_projeto_erp !== null })
          //
          this.projetos.forEach((projeto) => {
            let p = {'pastas': [{id: 'ADIANTAMENTO', nome: 'Adiantamento', icone: 'fa-file-text-o'}, {id: 'PAGAMENTO', nome: 'Pagamento', icone: 'fa-file-text-o'}, {id: 'CONTRAPARTIDA', nome: 'Contrapartida', icone: 'fa-file-text-o'}, {id: 'PRESTACAO_DE_CONTAS', nome: 'Prestação de Contas', icone: 'fa-file-text-o'}, {id: 'PROPOSTA', nome: 'Documentos da Proposta', icone: 'fa-file-text-o'}, {id: 'DOCUMENTO_DIRIGENTE', nome: 'Documentos de dirigentes', icone: 'fa-file-text-o'}, {id: 'ENTIDADE', nome: 'Documentos da entidade', icone: 'fa-file-text-o'}, {id: 'RELATORIO_DE_EXECUCAO', nome: 'Relatório de Execução', icone: 'fa-file-text-o'}]}
            _.assign(projeto, p)
          })
          //
          this.loading.show = false
          this.projetos = _.filter(this.projetos, function (p) { return p.ds_codigo_projeto_erp !== '' && p.ds_codigo_projeto_erp !== null })
          this.loading.show = false
        })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
      },
      listaEntidades () {
        axiosLaravel.get('entidades?lista=todos').then((response) => {
          this.entidades = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      listaTipoDocumentos () {
        axios.get('proxy/document/documents/type').then((response) => {
          this.tipos_documentos = _.sortBy(response.data.value, 'type')
        })
          .catch((error) => {
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      dataExpirada (validade) {
        let data = new Date()
        if (!_.isNull(validade)) {
          data = new Date(validade.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'))
        }
        return this.hoje > data
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
      }
    }
  }
</script>

<style>
  .ged .legenda {
    float: right;
    color: steelblue;
    font-weight: bold;
    cursor: default;
  }

  .arvore_projetos {
    height: 500px;
    width: 100%;
    overflow-y: scroll;
    font-family: Monospace;
  }

  .arvore_projetos ul, .arvore_projetos li {
    list-style: none;
  }

  .arvore_projetos .arquivos {
    margin-bottom: 20px;
  }

  .ged .data_expirada {
    background: #b41904;
    color: white !important;
    border-bottom: 1px solid #e2ebf7;
  }

  .arvore_projetos .arquivos tbody tr:hover {
    background: #eaf3ff;
  }

  .arvore_projetos .arquivos td:not(.data_validade):not(.data_incluido) {
    padding: 2px 50px 2px 0px;
  }

  .arvore_projetos .arquivos .data_incluido {
    width: 100px;
    text-align: center;
    color: #003200;
  }

  .arvore_projetos .arquivos .data_validade {
    width: 100px;
    text-align: center;
    color: #320000;
  }

  .arvore_projetos .arquivos th {
    color: silver;
    font-weight: normal;
    font-size: small;
  }

  li.projeto.active {
    background: #e2ebf7;
  }

  .arvore_projetos .arquivos a {
    color: #337ab7 !important;
    text-decoration: none;
  }

  .arvore_projetos .pasta .contador {
    color: firebrick;
    font-style: italic;
    font-weight: bold;
  }

  .arvore_projetos .pasta .contador .fa-external-link {
    display: none !important;
  }
  .arvore_projetos .pasta .contador .fa-refresh, .arvore_projetos .pasta .contador .fa-external-link {
    color: lightsteelblue;
    padding-left: 10px;
  }
  .arvore_projetos .pasta .contador i.fa-refresh:hover, .arvore_projetos .pasta .contador i.fa-external-link:hover {
    color: lightseagreen;
  }

  .arvore_projetos li.projeto:not(.active):hover {
    background: #e2ebf7;
  }

  .ANA, .DEF {
    color: lightsteelblue;
  }

  .APR {
    color: green;
  }

  .ENC, .ETO {
    color: steelblue;
  }

  .SO3, .SO4, .SPS, .SUS, .SAF, .JUD, .DLG {
    color: firebrick;
  }
<style>
  .arvore_projetos {
    height: 500px;
    width: 100%;
    overflow-y: scroll;
  }

  .arvore_projetos ul, .arvore_projetos li {
    list-style: none;
  }

  .arvore_projetos .arquivos {
    width: 90%;
    margin: 0 0 20px 0;
  }

  .arvore_projetos .arquivos tbody tr:hover {
    background: #eaf3ff;
  }

  .arvore_projetos .arquivos td {
    padding: 5px 0;
  }

  .arvore_projetos .arquivos th {
    color: silver;
    font-weight: normal;
    font-size: small;
  }

  li.projeto.active {
    background: #e2ebf7;
  }

  .arvore_projetos .arquivos a {
    color: #337ab7 !important;
    text-decoration: none;
  }

  .arvore_projetos .pasta .contador {
    color: firebrick;
    font-style: italic;
    font-weight: bold;
  }

  .arvore_projetos .pasta .contador .fa-refresh {
    color: lightsteelblue;
    padding-left: 10px;
  }
  .arvore_projetos .pasta .contador i.fa-refresh:hover {
    color: lightseagreen;
  }

  .arvore_projetos li.projeto:not(.active):hover {
    background: #e2ebf7;
  }

  .ANA, .DEF {
    color: lightsteelblue;
  }

  .APR {
    color: green;
  }

  .ENC, .ETO {
    color: steelblue;
  }

  .SO3, .SO4, .SPS, .SUS, .SAF, .JUD, .DLG {
    color: firebrick;
  }

  .ged .legenda {
    float: right;
    color: #4682b4;
    font-weight: 700;
    cursor: default;
  }
</style>
