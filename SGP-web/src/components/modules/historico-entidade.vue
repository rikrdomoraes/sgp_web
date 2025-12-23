<template>
  <!-- states -->
  <div>
    <button @click="mostraHistorico = !mostraHistorico" uib-tooltip="Oculta ou Mostra o histórico de alterações da Entidade" type="button" class="btn btn-primary btn-flat"><i class="fa fa-eye" aria-hidden="true"></i> {{mostraHistorico ? 'Ocultar histórico' : 'Mostrar histórico'}}</button>
<br><br>
    <!-- grid -->
    <div class="box-body" v-show="mostraHistorico">
      <!-- /.row -->
      <div class="row">
        <div class="table-responsive">
          <b-container fluid>
            <!-- Main table element -->
            <b-table how-empty
                     stacked="md"
                     :bordered="table.bordered"
                     :items="table.items"
                     :hover="table.hover"
                     :fields="table.fields"
                     :filter="table.filter"
                     :current-page="table.currentPage"
                     :per-page="table.perPage"
                     :sort-by.sync="table.sortBy"
                     :sort-desc.sync="table.sortDesc"
                     empty-text="Nenhum registro encontrado"
            >
              <template slot="termino" scope="row">{{row.value | moment('L HH:mm:ss')}}</template>
              <template slot="actions" scope="row">
                <div>
                  <b-button type="button" :disabled="false" v-if="row.item.termino !== null" @click="showModal = true, testFunc(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-search" aria-hidden="true"></i></b-button>
                </div>
              </template>
            </b-table>
            <b-row>
              <b-col md="6" class="my-1" right>
                <b-pagination :total-rows="table.items.length" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
              </b-col>
            </b-row>
          </b-container>
          <div v-show="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
        <div id="app">
          <div v-if="showModal">
            <transition name="modal">
              <div class="modal-mask">
                <div class="modal-wrapper" @click="$emit(showModal=false)">
                  <div class="modal-dialog">
                    <div class="modal-content" @click.stop>
                      <div class="modal-header">
                        <button type="button" class="close" @click="showModal=false">
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title">Histórico</h4>
                      </div>
                      <div class="modal-body">
                        <div class="row">
                          <div class="col-md-12">
                            <!-- grid -->
                            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
                            <div class="box-header with-border">
                              <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Cadastro da Entidade</h3>
                            </div>
                            <!-- /.box-header -->
                            <div class="box-body" id="dadosCadastrais">
                              <div class="row">
                                <div class="col-md-12">
                                  <form name="frmCommonRegister" class="form-horizontal" novalidate>
                                    <div class="col-md-7 col-lg-6" id="cadastroJuri">
                                      <fieldset>
                                        <legend>Dados da entidade:</legend>

                                        <!-- company name -->
                                        <div class="form-group">
                                          <label for="nome" class="control-label col-md-4">Razão social:</label>
                                          <div class="col-md-8">
                                            <input v-model="snap.ds_nome" name="companyName" class="form-control" type="text" disabled="true">
                                          </div>
                                        </div>

                                        <!-- cnpj -->
                                        <div class="form-group">
                                          <label for="nome" class="control-label col-md-4">CNPJ:</label>
                                          <div class="col-md-6 col-lg-4">
                                            <the-mask v-model="snap.ds_cnpj" name="cnpj" class="form-control" type="text" disabled="true"
                                                       mask="##.###.###/####-##"></the-mask>
                                          </div>
                                        </div>

                                        <!-- cnpj expedition time -->
                                        <div class="form-group">
                                          <label for="dt_cnpj" class="control-label col-md-4">Expedição CNPJ:</label>
                                          <div class="col-md-6 col-lg-4">
                                            <div class="input-group">
                                              <datepicker name="cnpjExpeditionTime" v-model="this.snap.dt_data_expedicao_cnpj" :use-utc="true" input-class="form-control" :language="$datePickerPtBR" format="dd/MM/yyyy" disabled="true"></datepicker>
                                            </div>
                                          </div>
                                        </div>

                                        <!-- business name -->
                                        <div class="form-group">
                                          <label for="businessName" class="control-label col-md-4">Nome fantasia:</label>
                                          <div class="col-md-8">
                                            <input v-model="snap.ds_nome_fantasia" name="businessName" class="form-control" type="text" disabled="true">
                                          </div>
                                        </div>

                                        <!-- legal type -->
                                        <div class="form-group">
                                          <label for="legalType" class="control-label col-md-4">Natureza jurídica:</label>
                                          <div class="col-md-8">
                                            <multiselect v-model="snap.forma_juridica" :options="listaFormasJuridicas"
                                                         :multiple="false"
                                                         :disabled="true"
                                                         :close-on-select="true"
                                                         :clear-on-select="true"
                                                         :hide-selected="false"
                                                         :preserve-search="true"
                                                         placeholder="Selecione uma Natureza Jurídica"
                                                         track-by="codigo"
                                                         :custom-label="etiquetaListaFormaJuridica"
                                                         :preselect-first="false"
                                                         selectLabel=""
                                                         deselectLabel=""
                                                         selectedLabel="Selecionado"
                                                         name="forma_juridica"
                                                         v-validate="'required'">
                                            </multiselect>
                                          </div>
                                        </div>

                                         <!--activity -->
                                        <div v-show="false" class="form-group">
                                          <label for="activity" class="control-label col-md-4">Ramo atividade:</label>
                                          <div class="col-md-8">
                                            <multiselect v-model="snap.ramos_atividade" :options="listaRamosAtividade"
                                                         :multiple="true"
                                                         :close-on-select="false"
                                                         :clear-on-select="true"
                                                         :hide-selected="false"
                                                         :disabled="true"
                                                         :preserve-search="true"
                                                         placeholder="Selecione os Ramos de Atividade"
                                                         label="ds_codigo"
                                                         track-by="ds_codigo"
                                                         :custom-label="etiquetaListaRamosAtividade"
                                                         selectedLabel="Selecionado"
                                                         selectLabel="Aperte ENTER para selecionar"
                                                         deselectLabel="Aperte ENTER para remover"
                                                         name="ramos_atividade"
                                                         v-validate="'required'">
                                              <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.ds_codigo }}</span><span class="custom__remove" @click="props.remove(props)">❌</span></span></template>
                                            </multiselect>
                                          </div>
                                        </div>

                                        <!-- Doc. constituição -->
                                        <div class="form-group" >
                                          <label for="constitutionDocument" class="control-label col-md-4">Doc. constituição:</label>
                                          <div class="col-md-8">
                                            <multiselect v-model="snap.documento_constituicao" :options="listaDocConstituicao"
                                                         :multiple="false"
                                                         :close-on-select="true"
                                                         :searchable="false"
                                                         :disabled="true"
                                                         track-by="id"
                                                         label="ds_tipo"
                                                         placeholder="Selecione um Documento de constituição"
                                                         selectLabel=""
                                                         deselectLabel=""
                                                         selectedLabel="Selecionado"
                                                         name="listaDocConstituicao"
                                                         v-validate="'required'">
                                            </multiselect>
                                          </div>
                                        </div>

                                      </fieldset>
                                    </div>

                                    <div class="col-md-5 col-lg-6" id="contato">
                                      <fieldset >
                                        <legend>Contato:</legend>

                                        <!-- telefone -->
                                        <div class="form-group">
                                          <label for="phone" class="control-label col-md-4">Telefone:</label>
                                          <div class="col-md-8 col-lg-4">
                                            <input v-model="snap.contato.ds_telefone" v-mask="'(##) ####-#####'" :masked="masked" name="phone" class="form-control" type="text" disabled="true">
                                          </div>
                                        </div>

                                        <!-- celular -->
                                        <div class="form-group">
                                          <label for="mobile" class="control-label col-md-4">Celular:</label>
                                          <div class="col-md-8 col-lg-4">
                                            <input v-model="snap.contato.ds_celular" v-mask="'(##) #####-#####'" :masked="masked" name="mobile" class="form-control" type="text" disabled="true">
                                          </div>
                                        </div>

                                        <!-- email -->
                                        <div class="form-group">
                                          <label for="email" class="control-label col-md-4">E-Mail:</label>
                                          <div class="col-md-8">
                                            <input v-model="snap.ds_email" name="email" class="form-control" type="text" disabled="true">
                                          </div>
                                        </div>

                                        <!-- website -->
                                        <div class="form-group">
                                          <label for="email" class="control-label col-md-4">Site:</label>
                                          <div class="col-md-8">
                                            <input v-model="snap.ds_website" name="website" class="form-control" type="text" disabled="true">
                                          </div>
                                        </div>

                                      </fieldset>
                                    </div>

                                    <!-- Endereço -->
                                    <div class="col-md-12">
                                      <div class="box box-widget">
                                        <div class="box-header">
                                          <h3 class="box-title">Endereço:</h3>
                                        </div>
                                      </div>
                                      <endereco :entEnderecos="histEndereco" :disable="disable"></endereco>
                                    </div>

                                    <!-- chiefs -->
                                    <div class="col-md-12">
                                      <div class="box box-widget">
                                        <div class="box-header">
                                          <h3 class="box-title">Dirigentes:</h3>
                                        </div>
                                      </div>
                                      <dirigentes :entDirigentes="histDirigente" :disable="disable"></dirigentes>
                                    </div>

                                    <div class="col-md-12">
                                      <div class="box box-widget">
                                        <div class="box-header">
                                          <h3 class="box-title">Usuários:</h3>
                                        </div>
                                      </div>
                                      <usuarios :entUsuarios="histUsuario" :disable="disable"></usuarios>
                                    </div>

                                    <!--Documentos-->
                                    <div class="col-md-12">
                                      <div class="box box-widget">
                                        <div class="box-header">
                                          <h3 class="box-title">Documentos Upload</h3>
                                        </div>
                                      </div>
                                      <div class="col-md-12">
                                        <upload-documentos-php-novo :propDocumentos="histDocumento" :documentTypes="''" :disable="disable" :local-uso="'TODOS'"></upload-documentos-php-novo>
                                      </div>
                                    </div>

                                    <!-- approval history -->
                                    <!--<div class="col-md-12" v-if="!disable">-->
                                      <!--<div class="box box-widget">-->
                                        <!--<div class="box-header">-->
                                          <!--<h3 class="box-title">Histórico:</h3>-->
                                        <!--</div>-->
                                      <!--</div>-->
                                      <!--<historico-entidade :entHistorico="historico"></historico-entidade>-->
                                    <!--</div>-->
                                  </form>
                                </div>
                                <!-- /.col -->
                              </div>
                              <!-- /.row -->
                            </div>
                            <!-- /.box-body -->
                            <!-- /.box-footer -->
                              <div align="right">
                                <br>
                                <b-button type="button" :disabled="false" @click="showModal = false" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-close" aria-hidden="true"></i>  Fechar </b-button>
                              </div>
                          </div>
                          </div></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div v-show="false">
        <pre id="myDiv" ref="myDiv"></pre>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </div>
  </div>
</template>
<script>
    import Endereco from './endereco'
    import Dirigentes from './dirigentes'
    import Usuarios from './usuarios'
    import UploadDocumentosPhpNovo from './uploadDocumentosPhpNovo'
    export default {
      components: {
        Endereco,
        Dirigentes,
        UploadDocumentosPhpNovo,
        Usuarios
      },
      name: 'historicoEntidade',
      data () {
        return {
          showgrid: true,
          showModal: false,
          confirmed: true,
          state: 'GRID',
          historico: {},
          histEndereco: {},
          histDirigente: {},
          histUsuario: {},
          histDocumento: {},
          listaFormasJuridicas: [],
          listaRamosAtividade: [],
          snap: {
            contato: []
          },
          idEvento: null,
          disable: true,
          curIndex: 0,
          mostraHistorico: false,
          editandoIndex: null,
          table: {
            items: this.entHistorico,
            filter: null,
            hover: true,
            bordered: true,
            currentPage: 1,
            perPage: 10,
            // sortBy: 'inicio',
            // sortDesc: true,
            fields: [
              {key: 'nome', label: 'Tarefa', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'inicio', label: 'Início da tarefa', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'termino', label: 'Conclusão da tarefa', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'observacao', label: 'Justificativa', sortable: true, thStyle: 'text-align: center; width: 20%', class: 'text-center'},
              {key: 'usuario.ds_nome_usuario', label: 'Usuário que executou a tarefa', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              { key: 'actions', label: 'Visualização', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
            ]
          },
          historicoTarefas: null
        }
      },
      props: ['entHistorico'],
      watch: {
        entHistorico: function () {
          let hist = []
          // Unir os Processos e Tarefas em lista única
          for (let i = 0; i < this.entHistorico.length; i++) {
            for (let j = 0; j < this.entHistorico[i].length; j++) {
              this.table.items.push(this.entHistorico[i][j])
            }
          }
          // Ordernar pela data de término
          this.table.items = _.sortBy(this.table.items, 'termino').reverse()
          // Renomear a coluna de tarefas
          for (let k = 0; k < this.table.items.length; k++) {
            let item = this.table.items[k]
            if (item.tipo === 'USUARIO') {
              if (item.nome === 'SOLICITACAO') {
                this.table.items[k].nome = (k >= this.table.items.length - 1) ? 'Cadastramento' : 'Alteração Cadastral'
              } else if (item.nome === 'REVISAO') {
                this.table.items[k].nome = 'Revisão'
              } else {
                this.table.items[k].nome = (item.termino === null) ? 'Analisando' : 'Analisado'
              }
              hist.push(this.table.items[k])
            }
          }
          this.table.items = hist
        },
        'table.items': function () {
          this.$emit('historico_itens', this.table.items)
        }
      },
      async created () {
        this.carregaListaFormasJuridicas()
        // Busca ramo ativiades
        await this.$root.buscaRamoAtividades(this.$store)
        // Seta variaveis com que esta gravado no store
        this.listaRamosAtividade = this.$store.state.ramoAtividades
        this.carregaListaDocumentosConstituicao()
      },
      methods: {
        etiquetaListaFormaJuridica (option) {
          return `${option.codigo + ' / ' + option.descricao}`
        },
        etiquetaListaRamosAtividade (option) {
          return `${option.ds_codigo + '    ' + option.ds_descricao}`
        },
        async carregaListaFormasJuridicas () {
          // Busca ramo atividades
          await this.$root.buscaFormasJuridicas(this.$store)
          // Seta variaveis com que esta gravado no store
          this.listaFormasJuridicas = this.$store.state.formasJuridicas
        },
        carregaListaDocumentosConstituicao () {
          //
          this.listaDocConstituicao = [{id: 'ATA_CONSTITUICAO', ds_tipo: 'Ata constituição'}, {id: 'CONTRATO_SOCIAL', ds_tipo: 'Contrato social'}, {id: 'ESTATUTO', ds_tipo: 'Estatuto'}, {id: 'LEI_ORGANICA_MUNICIPAL', ds_tipo: 'Lei orgânica municipal'}]
          //
          // axiosLaravel.post('documentos/tipos/ENTIDADE_DOC_CONSTITUICAO').then((response) => {
          //   this.listaDocConstituicao = response.data
          //   // this.entidade.ds_documento_constituicao = this.listaDocConstituicao.filter((item) => {
          //   //   return item.id.toString() === this.entidade.ds_documento_constituicao
          //   // })
          // })
          //   .catch((error) => {
          //     this.$root.trataErro(error)
          //   })
        },
        testFunc: function (row) {
          this.idEvento = null
          this.idEvento = row.item.id
          this.carregaEvento()
        },
        carregaEvento () {
          axiosLaravel.get('processos/tarefas/buscahistorico/' + this.idEvento).then((response) => {
            this.snap = response.data
            this.histEndereco = this.snap.endereco
            this.histDirigente = this.snap.dirigentes
            this.histDocumento = this.snap.documentos
            this.histUsuario = this.snap.usuarios
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      }
    }
</script>

<style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9999;
    overflow-y: scroll;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
  }
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  .modal-dialog {
    width: 70%;
}
</style>
