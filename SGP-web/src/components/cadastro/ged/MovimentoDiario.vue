<template>
  <div class='content-wrapper'>

    <vue-headful :title="'SGP - Movimento Diário'"/>

    <div>
      <section class='content-header'>
        <h1 class="col-md-7">Movimento Diário</h1>

        <div class="col-md-5">
          <div class="col-md-8 pull-right">
            <div class="input-group">
              <input v-model="pesquisa" v-on:keyup.enter="pesquisar()" type="text" class="form-control" placeholder="Pesquisar em todas as pastas..." ref="caixaPesquisa" @focus="$event.target.select()"
                     :title="'<h5>Digite uma palavra e pressione Enter</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">

              <span class="input-group-btn" v-if="pesquisa.length > 0" :title="'<h5>Limpar essa pesquisa</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                <button @click="limparPesquisa()" type="button" class="btn" style="background: white; border-color: #d2d6de; border-width: 1px 0px;"><i class="fa fa-remove"></i></button>
              </span>


              <span class="input-group-btn">
                <button :disabled="!pesquisa" @click="pesquisar()" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
              </span>
            </div>
          </div>
        </div>


      </section>

      <section class='content ged'>

        <div class='row'>
          <div class='col-md-12'>
            <div class='box box-primary'>

              <div class='box-body'>
                <div class='col-md-4' id='pastas'>
                <!-- Seção de pastas -->

                  <div v-show="loading.pastas" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

                    <!--<div class='example-description'>-->
                      <!--<input type='text' placeholder='Pesquisar pasta...' v-model='filter' class='form-control filter-field'>-->
                    <!--</div>-->

                    <!--<tree v-model="pastaSelecionada" :data="arvore" :options="opts" :filter="filter" ref="tree" @node:selected="selecionaPasta" @node:text:changed="renomear">-->
                    <tree v-model="pastaSelecionada" :data="arvore" :options="opts" :filter="filter" ref="tree" @node:selected="selecionaPasta">

                      <div slot-scope='{ node }' class='node-container'>
                        <div class='node-text'>{{ node.text }}
                          <span class="edicao" v-show="_.isEmpty(_.find(usuarioLogado.permissoes, ['ds_nome', 'movimento-diario-somente-leitura']))">
                          <!--<span class="edicao">-->
                            <a href='#' @click.stop='renomearPasta(node)' v-if="node.data.renomear"><i class="fa fa-pencil"></i></a>
                            <a href='#' @click.stop='excluirPasta(node)' v-if="node.data.excluir"><i class="fa fa-trash"></i></a>
                            <a href='#' @click.stop='adicionarPasta(node)' v-if="node.data.criar"><i class="fa fa-plus"></i></a>
                          </span>
                        </div>

                      </div>
                    </tree>


                </div>

<!-------------------------------------------------------------------------------------------------------------------------------------------------------->

                <div class='col-md-8' id='conteudo'>
                <!-- Seção de arquivos -->

                  <div class="row">
                    <div class="col-md-12">

                      <!-- Barra da listagem de arquivos da pasta ------------------------------------------------------------------------->
                      <div>
                        <div v-show="loading.arquivos" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

                        <div class="box-header" v-show="!mostrarAdicionarDocumento">
                          <h3 class="box-title">

                            <span v-if="modo === 'pesquisa'">Resultado da pesquisa</span>
                            <span v-if="!_.isNull(pastaSelecionada) && modo === 'pasta'">
                              <i class="fa fa-folder-o"></i>  {{pastaSelecionada.data.text}}
                            </span>

                            <span class="contadorArqivos">
                              <span v-if="arquivos.length > 0">
                                {{arquivos.length}} {{arquivos.length === 1 ? 'arquivo' : 'arquivos'}}
                              </span>

                              <div class="espacamento_botoes"></div>

                              <span v-if="arquivosSelecionados.length > 0">
                                {{arquivosSelecionados.length}} {{arquivosSelecionados.length === 1 ? 'selecionado' : 'selecionados'}}
                              </span>
                            </span>

                            <div class="espacamento_botoes"></div>

                            <span v-if="arquivos.length > 0" class="indicadores-cb-inline" v-show="_.isEmpty(_.find(usuarioLogado.permissoes, ['ds_nome', 'movimento-diario-somente-leitura']))">
                              <i @click="selecionarTodosArquivos" :class="(arquivosSelecionados.length !== arquivos.length ? 'fa fa-square-o' : 'fa fa-check-square-o selecionado')" aria-hidden="true"></i>
                              <span :class="arquivosSelecionados.length !== arquivos.length ? '' : 'selecionado'" >Selecionar tudo</span>
                            </span>

                          </h3>

                          <span style="float: right" v-show="_.isEmpty(_.find(usuarioLogado.permissoes, ['ds_nome', 'movimento-diario-somente-leitura']))">
                            <span v-if="arquivosSelecionados.length > 0">
                              <g-button-ujarak color='error' size='button--size-ss' @click.native='excluirArquivos'><i class='fa fa-print'></i> Excluir</g-button-ujarak>
                            </span>

                            <div class="espacamento_botoes"></div>

                            <!-- Alterar para permitir só em pastas que permitem incluir arquivo -> criar tipo na tabela t_pasta-->
                            <span v-if="_.has(pastaSelecionada, 'data') && _.has(pastaSelecionada.data, 'adicionar') && pastaSelecionada.data.adicionar === 1 && modo === 'pasta'">
                              <g-button-ujarak color='primary' size='button--size-ss' @click.native='mostrarAdicionarDocumento = true'><i class='fa fa-plus'></i> Adicionar</g-button-ujarak>
                            </span>

                          </span>

                        </div>

                        <!-- Listagem (layout de tabela) de arquivos da pasta ------------------------------------------------------------------------->
                        <div v-show="!mostrarAdicionarDocumento" class="box-body">

                          <b-container fluid>
                            <b-table show-empty
                                     stacked="md"
                                     :items="arquivos"
                                     :hover="table.hover"
                                     :fields="table.fields"
                                     :current-page="table.currentPage"
                                     :per-page="table.perPage"
                                     :filter="filter"
                                     :sort-by.sync="table.sortBy"
                                     :sort-desc.sync="table.sortDesc"
                                     :empty-text="modo === 'pasta' ? 'Sem arquivo nesta pasta!' : 'A pesquisa não retornou arquivos'"
                                     table-layout: fixed
                                     @filtered="filtrarArquivos">

                              <!--<template slot="id" scope="row">-->
                                <!--<span class="indicadores">-->
                                  <!--<i @click="selecionarArquivo(row.item)" :class="(_.find(arquivosSelecionados, ['id', row.value]) ? 'fa fa-check-square-o' : 'fa fa-square-o') + ' selecao'" aria-hidden="true"></i>-->
                                <!--</span>-->
                                <!--<span class="text-muted" v-html="row.value"></span>-->
                              <!--</template>-->

                              <template slot="nome" scope="row">
                                <span class="indicadores" v-show="_.isEmpty(_.find(usuarioLogado.permissoes, ['ds_nome', 'movimento-diario-somente-leitura']))">
                                  <i @click="selecionarArquivo(row.item)" :class="(_.find(arquivosSelecionados, ['id', row.item.id]) ? 'fa fa-check-square-o' : 'fa fa-square-o') + ' selecao'" aria-hidden="true" style="margin-right: 20px"></i>
                                </span>
                                <a @click="downloadArquivo(row.item)" href="javascript:void(0)" class="ng-binding"><i class="fa fa-download" aria-hidden="true"></i> {{row.item.ds_nome_arquivo}}</a>
                                <span v-if="_.has(row.item, 'pasta') && modo === 'pesquisa'"><br/><i class="fa fa-folder-o"></i> {{row.item.pasta.nome}}</span>
                              </template>

                              <template slot="dt_criado" scope="row">{{row.value | moment("DD/MM/YYYY HH:mm:ss")}}</template>
                            </b-table>

                          </b-container>

                        </div>

                        <div v-show="mostrarAdicionarDocumento" class="form-horizontal">
                          <div class="box-body">
                            <upload-documento-movimento-diario :documentTypes="''" :pasta="pastaSelecionada" @mostrarQuadroAdicionaDocumento="mostrarAdicionarDocumento = $event" @atualizarPasta="selecionaPasta($event)"></upload-documento-movimento-diario>
                          </div>
                        </div>

                      </div>


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
  import { mapGetters } from 'vuex'
  import UploadDocumentoMovimentoDiario from '../../modules/uploadDocumentoMovimentoDiario'
  import LiquorTree from 'liquor-tree'

  export default {
    components: {
      UploadDocumentoMovimentoDiario,
      Tree: LiquorTree
    },
    name: 'MovimentoDiario',
    data () {
      return {
        loading: {
          tela: false,
          pastas: false,
          arquivos: false
        },
        // idPasta: null,
        pastaSelecionada: null,
        modo: 'pasta', // modo: 'pasta' para leyout e lista de conteudo de pasta e 'pesquisa' para layout e conteudo de resultado de pesquisa
        pesquisa: [],
        arquivos: [],
        arquivosSelecionados: [],
        mostrarAdicionarDocumento: false,
        hoje: new Date(),
        tipos_documentos: [],
      //
        filter: null,
        opts: {
          minFetchDelay: 1000,
          fetchData (node) {
            let pastas = axiosLaravel.get('pasta/' + node.id).then((response) => response.data)
            console.log('Pastas >>> ', pastas)
            return pastas
          },
          parentSelect: true,
          checkbox: false,
          multiple: false
        },
        table: {
          filter: null,
          hover: true,
          bordered: true,
          block: false,
          currentPage: 1,
          perPage: 2000,
          sortBy: 'dt_criado',
          sortDesc: true,
          fields: [
            // { key: 'id', label: 'Seleção', sortable: true, thStyle: 'text-align: center; width: 110px', class: 'text-center' },
            { key: 'nome', label: 'Arquivo', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
            { key: 'dt_criado', label: 'Data de Inclusão', sortable: true, thStyle: 'text-align: center; width: 250px', class: 'text-center' }
          ]
        },
        arvore: [{'id': 1, 'text': 'Movimento Diário', 'isBatch': true, 'selected': true}]
      }
    },
    created: function () {
      console.log('iniciando')
      // this.listaTipoDocumentos()
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
      limparPesquisa () {
        this.arquivos = []
        this.arquivosSelecionados = []
        this.pesquisa = ''
        this.modo = 'pasta'
        this.mostrarAdicionarDocumento = false
        if (!_.isNull(this.pastaSelecionada)) {
          this.selecionaPasta(this.pastaSelecionada)
        }
      },
      pesquisar () {
        if (this.pesquisa !== '') {
          this.loading.arquivos = true
          this.arquivos = []
          this.arquivosSelecionados = []
          this.mostrarAdicionarDocumento = false
          axiosLaravel.post('pasta/pesquisar/', {'tipo': 'arquivos', 'escopo': 'tudo', 'termo': this.pesquisa}).then((response) => {
            this.modo = 'pesquisa'
            console.log('Arquivos', response.data)
            this.arquivos = response.data
            this.$refs.caixaPesquisa.focus()
            this.loading.arquivos = false
          })
            .catch((error) => {
              this.loading.arquivos = false
              this.$root.trataErro(error)
            })
        }
      },
      filtrarArquivos (filteredItems) {
        this.table.totalRows = filteredItems.length
        this.table.currentPage = 1
      },
      selecionarTodosArquivos () {
        if (this.arquivosSelecionados.length === this.arquivos.length) {
          this.arquivosSelecionados = []
        } else {
          this.arquivosSelecionados = _.cloneDeep(this.arquivos)
        }
      },
      selecionarArquivo (arquivo) {
        if (_.find(this.arquivosSelecionados, ['id', arquivo.id])) {
          _.remove(this.arquivosSelecionados, function (i) {
            return i['id'] === arquivo.id
          })
        } else {
          this.arquivosSelecionados.push(arquivo)
        }
        this.$forceUpdate()
      },
      selecionaPasta (node) {
        this.mostrarAdicionarDocumento = false
        this.arquivos = []
        this.arquivosSelecionados = []
        this.pesquisa = ''
        this.modo = 'pasta'
        if (node.data.ler === 1) {
          this.loading.arquivos = true
          axiosLaravel.get('pasta/conteudo/' + node.id).then((response) => {
            console.log('Arquivos', response.data)
            this.arquivos = response.data
            this.arquivosSelecionados = []
            this.loading.arquivos = false
          })
            .catch((error) => {
              this.loading.arquivos = false
              this.$root.trataErro(error)
            })
        }
      },

      renomearPasta (node) {
        this.loading.pastas = true
        console.log('renomearPasta', node)
        this.$dialog.prompt('Deseja renomear a pasta <b>' + node.text + '</b> para:',
          {html: true, animation: 'fade', customClass: 'avisoInfo', promptHelp: 'Digite o novo nome da pasta (até 250 caracteres)'})
          .then(dialog => {
            axiosLaravel.post('pasta/renomear/', {'id': node.id, 'nome': dialog.data}).then((response) => {
              if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                _.set(node, 'text', dialog.data)
              }
              this.loading.pastas = false
              this.aviso(response.data)
            })
              .catch((error) => {
                this.loading.pastas = false
                this.$root.trataErro(error)
              })
          })
          .catch(() => {
            this.loading.pastas = false
            console.log('Cancelou renomeação da pasta')
          })
      },

      adicionarPasta (node) {
        this.loading.pastas = true
        console.log('adicionarPasta', node)
        this.$dialog.prompt('Deseja criar uma pasta nova dentro de <b>' + node.text + '</b> para:',
          {html: true, animation: 'fade', customClass: 'avisoInfo', promptHelp: 'Digite o nome da pasta nova (até 250 caracteres)'})
          .then(dialog => {
            axiosLaravel.post('pasta/criar/', {'id': node.id, 'nome': dialog.data}).then((response) => {
              if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                let novaPasta = node.append(dialog.data)
                _.set(novaPasta, 'id', response.data.retorno.id)
                _.set(novaPasta, 'data.criar', 1)
                _.set(novaPasta, 'data.excluir', 1)
                _.set(novaPasta, 'data.renomear', 1)
                _.set(novaPasta, 'data.adicionar', 1)
                _.set(novaPasta, 'data.ler', 1)
                _.set(node, 'states.expanded', 1)
              }
              this.loading.pastas = false
              this.aviso(response.data)
            })
              .catch((error) => {
                this.loading.pastas = false
                this.$root.trataErro(error)
              })
          })
          .catch(() => {
            this.loading.pastas = false
            console.log('Cancelou criação de nova pasta')
          })
      },

      excluirPasta (node) {
        this.loading.pastas = true
        console.log('adicionarPasta', node)
        this.$dialog.confirm('Deseja excluir a pasta <b>' + node.text + '</b>?',
          {html: true, animation: 'fade', customClass: 'avisoAlerta'})
          .then(dialog => {
            axiosLaravel.post('pasta/excluir/', {'id': node.id}).then((response) => {
              if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                node.remove()
              }
              this.loading.pastas = false
              this.aviso(response.data)
            })
              .catch((error) => {
                this.loading.pastas = false
                this.$root.trataErro(error)
              })
          })
          .catch(() => {
            this.loading.pastas = false
            console.log('Cancelou criação de nova pasta')
          })
      },

//
// -----------------------------------------------------------------------------------------------
//
      excluirArquivos () {
        this.loading.arquivos = true
        console.log('excluirArquivos')
        this.$dialog.confirm('Deseja excluir este(s) <b>' + this.arquivosSelecionados.length + '</b> arquivo(s)?', {html: true, animation: 'fade', customClass: 'avisoAlerta'})
          .then(dialog => {
            axiosLaravel.post('pasta/excluir/arquivos/', {'arquivos': this.arquivosSelecionados}).then((response) => {
              if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                if (this.modo === 'pesquisa') {
                  this.pesquisar()
                } else if (this.modo === 'pasta' && !_.isNull(this.pastaSelecionada)) {
                  this.selecionaPasta(this.pastaSelecionada)
                }
                // let arquivosExcluidos = response.data.retorno
                // if (arquivosExcluidos.length < this.arquivosSelecionados.length) {
                //   this.aviso({'codigo': 'ERRO', 'mensagem': (this.arquivosSelecionados.length - arquivosExcluidos.length) + ' arquivo(s) não excluído(s)'})
                // }
                // let excluidosId = _.map(response.data.retorno, 'id')
                // _.remove(this.arquivos, function (arquivo) { return _.includes(excluidosId, arquivo.id) })
                // _.remove(this.arquivosSelecionados, function (arquivo) { return _.includes(excluidosId, arquivo.id) })
                // this.$forceUpdate()
              }
              this.aviso(response.data)
              this.loading.arquivos = false
            })
              .catch((error) => {
                this.loading.arquivos = false
                this.$root.trataErro(error)
              })
          })
          .catch(() => {
            this.loading.arquivos = false
            console.log('Cancelou exclusão de arquivos')
          })
      },

//
// -----------------------------------------------------------------------------------------------
//

      aviso (retorno) {
        console.log('aviso (retorno)', retorno)
        if (_.has(retorno, 'codigo')) {
          if (retorno.codigo !== 'OK') {
            let mensagem = (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) ? retorno.mensagem : 'Erro de processamento. Não sei o que houve'
            this.$snotify.clear()
            this.$snotify.error(mensagem)
          } else {
            if (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) {
              this.$snotify.success(retorno.mensagem, {timeout: 3000})
            }
          }
        }
      },
      downloadArquivo (documento) {
        if (documento.file) {
          download(documento.file, documento.ds_nome_arquivo, documento.ds_content_type)
        } else {
          axiosLaravel.get('pasta/download/arquivo/' + documento.id, {responseType: 'arraybuffer'}).then((response) => {
            let tamanhoRetorno = 0
            let ie = !!window.MSInputMethodContext && !!document.documentMode
            if (!ie) {
              let blob = new Blob([response.data], {type: documento.ds_content_type})
              tamanhoRetorno = blob.size
              if (tamanhoRetorno > 150) {
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = documento.ds_nome_arquivo
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
            } else {
              var bytes = new Uint8Array(resultByte)
              let blob = new Blob([bytes], {type: documento.ds_content_type})
              tamanhoRetorno = blob.size
              if (tamanhoRetorno > 150) {
                let link = document.createElement('blob')
                link.href = window.navigator.msSaveOrOpenBlob(blob, documento.ds_nome_arquivo)
                link.download = documento.ds_nome_arquivo
                link.click()
              }
            }
            this.aviso(tamanhoRetorno > 150 ? {'codigo': 'OK', 'mensagem': 'Baixando arquivo'} : {'codigo': 'ERRO', 'mensagem': 'Erro ao baixar o arquivo'})
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
  #pastas .edicao a {
    color: var(--cor-fraca);
    margin: 0px 10px;
  }
  #pastas .edicao a:hover {
    color: var(--cor-destaque);
  }
  #conteudo {
    height: 650px;
  }
  .contadorArqivos {
    color: var(--cor-fraca);
    margin: 0px 20px;
  }

/***********************************************************************************/
  .tree {
    height: 650px;
    overflow: auto;
  }

  .filter-field {
    display: block;
    width: 100%;
    padding: 3px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>
