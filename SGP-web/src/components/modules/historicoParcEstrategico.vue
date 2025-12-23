<template>
  <!-- states -->
  <div>

    <!-- grid -->
    <div class="box-body">
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
              <template slot="eventDate" scope="row">{{row.value | moment("DD/MM/YYYY HH:mm:ss")}}</template>
              <template slot="actions" scope="row">
                <div>
                  <b-button type="button" :disabled="false" @click="showModal = true, testFunc(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-search" aria-hidden="true"></i></b-button>
                </div>
              </template>
            </b-table>
            <b-row>
              <b-col md="6" class="my-1" right>
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-3" />
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
                                <h3 class="box-title"><i class="fa fa-search" aria-hidden="true"></i> Cadastro de Parceiro Estratégico</h3>
                              </div>
                              <!-- /.box-header -->
                              <div class="box-body" id="dadosCadastrais">
                                <div class="row">
                                  <div class="col-md-12">
                                    <form name="frmCommonRegister" class="form-horizontal" novalidate>
                                      <div class="col-md-7 col-lg-6" id="cadastroJuri">
                                        <fieldset>
                                          <legend>Dados do parceiro estratégico:</legend>

                                          <!-- company name -->
                                          <div class="form-group">
                                            <label for="nome" class="control-label col-md-4">Razão social:</label>
                                            <div class="col-md-8">
                                              <input v-model="snap.snapshot.companyName" name="companyName" class="form-control" type="text" disabled="true">
                                            </div>
                                          </div>

                                          <!-- cnpj -->
                                          <div class="form-group">
                                            <label for="nome" class="control-label col-md-4">CNPJ:</label>
                                            <div class="col-md-6 col-lg-4">
                                              <the-mask v-model="snap.snapshot.cnpj" name="cnpj" class="form-control" type="text" disabled="true"
                                                        mask="##.###.###/####-##"></the-mask>
                                            </div>
                                          </div>

                                          <!-- cnpj expedition time -->
                                          <div class="form-group">
                                            <label for="dt_cnpj" class="control-label col-md-4">Expedição CNPJ:</label>
                                            <div class="col-md-6 col-lg-4">
                                              <div class="input-group">
                                                <datepicker name="cnpjExpeditionTime" v-model="this.snap.snapshot.cnpjExpeditionTime" :use-utc="true" input-class="form-control" :language="$datePickerPtBR" format="dd/MM/yyyy" disabled="true"></datepicker>
                                              </div>
                                            </div>
                                          </div>

                                          <!-- business name -->
                                          <div class="form-group">
                                            <label for="businessName" class="control-label col-md-4">Nome fantasia:</label>
                                            <div class="col-md-8">
                                              <input v-model="snap.snapshot.businessName" name="businessName" class="form-control" type="text" disabled="true">
                                            </div>
                                          </div>

                                          <!-- legal type -->
                                          <div class="form-group">
                                            <label for="legalType" class="control-label col-md-4">Natureza jurídica:</label>
                                            <div class="col-md-8">
                                              <select v-model="snap.snapshot.legalType" name="legalType" class="form-control" disabled="true">
                                                <option value="ASSOCIAÇÃO">Associação</option>
                                                <option value="COOPERATIVA">Cooperativa</option>
                                                <option value="EMPRESA_PUBLICA">Empresa pública</option>
                                                <option value="FUNDACAO">Fundação</option>
                                                <option value="ORGAO_PUBLICO_EXECUTIVO_ESTADUAL">Orgão público executivo estadual</option>
                                                <option value="ORGAO_PUBLICO_EXECUTIVO_MUNICIPAL">Orgão público executivo municipal</option>
                                                <option value="SEM_FINS_LUCRATIVOS">Sem fins lucrativos</option>
                                                <option value="SERVICO_SOCIAL_AUTONOMO">Serviço social autônomo</option>
                                                <option value="SOCIEDADE_LTDA">Sociedade ltda</option>
                                                <option value="SOCIEDADE_POR_ACOES">Sociedade por Ações</option>
                                              </select>
                                            </div>
                                          </div>

                                          <!-- activity -->
                                          <div class="form-group">
                                            <label for="activity" class="control-label col-md-4">Ramo atividade:</label>
                                            <div class="col-md-8">
                                              <input v-model="snap.snapshot.activity.description" class="form-control" name="activity" disabled="true">
                                            </div>
                                          </div>

                                          <!-- constitution document -->
                                          <div class="form-group" >
                                            <label for="constitutionDocument" class="control-label col-md-4">Doc. constituição:</label>
                                            <div class="col-md-8">
                                              <select v-model="snap.snapshot.constitutionDocument" name="constitutionDocument" class="form-control" disabled="true">
                                                <option value="ATA_CONSTITUICAO">Ata constituição</option>
                                                <option value="CONTRATO_SOCIAL">Contrato social</option>
                                                <option value="ESTATUTO">Estatuto</option>
                                                <option value="LEI_ORGANICA_MUNICIPAL">Lei orgânica municipal</option>
                                              </select>
                                            </div>
                                          </div>

                                        </fieldset>
                                      </div>

                                      <div class="col-md-5 col-lg-6" id="contato">
                                        <fieldset >
                                          <legend>Contato:</legend>

                                          <!-- phone -->
                                          <div class="form-group">
                                            <label for="phone" class="control-label col-md-4">Telefone:</label>
                                            <div class="col-md-8 col-lg-4">
                                              <input v-model="snap.snapshot.contacts.phone" v-mask="'(##) ####-#####'" :masked="masked" name="phone" class="form-control" type="text" disabled="true">
                                            </div>
                                          </div>

                                          <!-- mobile -->
                                          <div class="form-group">
                                            <label for="mobile" class="control-label col-md-4">Celular:</label>
                                            <div class="col-md-8 col-lg-4">
                                              <input v-model="snap.snapshot.contacts.mobile" v-mask="'(##) #####-#####'" :masked="masked" name="mobile" class="form-control" type="text" disabled="true">
                                            </div>
                                          </div>

                                          <!-- email -->
                                          <div class="form-group">
                                            <label for="email" class="control-label col-md-4">E-Mail:</label>
                                            <div class="col-md-8">
                                              <input v-model="snap.snapshot.contacts.email" name="email" class="form-control" type="text" disabled="true">
                                            </div>
                                          </div>

                                          <!--&lt;!&ndash; website &ndash;&gt;-->
                                          <!--<div class="form-group">-->
                                            <!--<label for="email" class="control-label col-md-4">Site:</label>-->
                                            <!--<div class="col-md-8">-->
                                              <!--<input v-model="snap.snapshot.website" name="website" class="form-control" type="text" disabled="true">-->
                                            <!--</div>-->
                                          <!--</div>-->

                                        </fieldset>
                                      </div>

                                      <!-- addresses -->
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

                                      <!--Documentos-->
                                      <div class="col-md-12">
                                        <div class="box box-widget">
                                          <div class="box-header">
                                            <h3 class="box-title">Documentos Upload</h3>
                                          </div>
                                        </div>
                                        <div class="col-md-12">
                                          <upload-documentos :propDocumentos="histDocumento" :documentTypes="snap.snapshot.documentTypes" :disable="disable"></upload-documentos>
                                        </div>
                                      </div>

                                      <!-- approval history -->
                                      <div class="col-md-12" v-if="!disable">
                                        <div class="box box-widget">
                                          <div class="box-header">
                                            <h3 class="box-title">Histórico:</h3>
                                          </div>
                                        </div>
                                        <historicoParcEstrategico :parcHistorico="historico"></historicoParcEstrategico>
                                      </div>
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
    import UploadDocumentos from './uploadDocumentos'

    export default {
      components: {
        Endereco,
        Dirigentes,
        UploadDocumentos,
        Usuarios
      },
      name: 'historicoParcEstrategico',
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
          snap: {},
          idEvento: null,
          disable: true,
          curIndex: 0,
          editandoIndex: null,
          table: {
            items: this.parcHistorico,
            filter: null,
            hover: true,
            bordered: true,
            currentPage: 1,
            perPage: 10,
            fields: [
              {key: 'eventDate', label: 'Data', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'result', label: 'Evento', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'phase', label: 'Fase', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'justify', label: 'Justificativa', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'usu', label: 'Usuário Responsável', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              { key: 'actions', label: 'Visualização', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
            ]
          }
        }
      },
      props: ['parcHistorico'],
      watch: {
        parcHistorico: function () {
          this.table.items = this.parcHistorico
        },
        'table.items': function () {
          this.$emit('historico', this.table.items)
        }
      },
      created () {
      },
      methods: {
        testFunc: function (row) {
          this.idEvento = null
          this.idEvento = row.item.id
          this.carregaEvento()
        },
        carregaEvento () {
          axios.get('/proxy/utility/events/' + this.idEvento).then((response) => {
            this.snap = response.data.value
            this.histEndereco = this.snap.snapshot.addresses
            this.histDirigente = this.snap.snapshot.chiefs
            this.histDocumento = this.snap.snapshot.documents
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
