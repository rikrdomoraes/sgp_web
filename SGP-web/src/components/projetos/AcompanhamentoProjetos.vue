<template>
  <div class="box-body">

    <div v-show="loading" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
    <div v-if="!loading" v-show="showgrid">

      <div class="row">
        <div class="col-md-12">
          <div class="col-sm-4">
            <button @click="irMetas" :title="'<h5>Ir para Metas</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" class="btn btn-primary btn-flat"><i class="" aria-hidden="true"></i> <span style="font-family:Arial; font-size: small"> Metas</span></button>
            <button @click="irAtividades" :title="'<h5>Ir para Atividades</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" class="btn btn-primary btn-flat"><i class="" aria-hidden="true"></i> <span style="font-family:Arial; font-size: small"> Atividades</span></button>
            <button @click="$router.push({name: 'visualiza-relatorio-execucao', params: { id: projeto.proposta.projeto.id }})" :title="'<h5>Ir para Relatórios de Execução deste projeto</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" class="btn btn-primary btn-flat"><i class="fa fa-calendar-check-o" aria-hidden="true"></i> <span style="font-family:Arial; font-size: small"> Relatórios</span></button>
          </div>
          <div class="col-sm-4">
            <input v-model="table.filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
          </div>
          <!-- 69223 - Alteração da posição dos botões SALVAR e NOVO REGISTRO -->
          <div align="right" class="col-sm-4">
            <button :disabled="contador === 0" @click="salvar" :title="'<h5>Salvar</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" class="btn btn-success btn-flat"><i class="fa fa-floppy-o" aria-hidden="true"></i> <span style="font-family:Arial; font-size: small"> Salvar</span></button>
            <button @click="showgrid = !showgrid" @click.stop="onNew" :title="'<h5>Novo registro</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" class="btn btn-success btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> <span style="font-family:Arial; font-size: small"> Novo registro</span></button>
          </div>
        </div>
      </div>
      <br>
      <!--tabela-->
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <b-container fluid>
              <!-- Main table element -->
              <b-table
                id="tabelaAcompanhamento"
                ref="tabelaAcompanhamento"
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
                @row-clicked="linha"
                empty-text="Nenhum registro encontrado"
              >
                <template slot="actions" scope="row">
                  <div>
                    <div>
                      <button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</button>
                    </div>
                  </div>
                </template>
                <template slot="tipo" scope="row">
                  <span>{{row.value.descricao}}
                    <p v-if="row.item.situacao_descricao" class="situacao_ocorrencia_sapiens">{{row.item.situacao_descricao}}</p>
                  </span>
                </template>
                <template slot="status" scope="row">
                  <span v-if="row.item.tipo.codigo === 'OCORRENCIA_IMPEDITIVA'">{{row.item.tipo_ocorrencia.descricao}}</span>
                  <span v-else>{{row.value.descricao}}</span>
                </template>
                <template slot="responsavel.ds_nome_usuario" scope="row">
                  <span>{{row.value}}</span>
                </template>
                <template slot="documentos" scope="row">
                  <i v-if="row.item.documentos.length > 0" class="glyphicon glyphicon-duplicate"
                     :title="'<h5>Existe(m) ' + '<b>' + row.item.documentos.length + '</b>' +' documento(s) em anexo. Clique em editar para visualizar o(s) documento(s).</h5>'"
                     v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                     aria-en="true" style="font-size: large;">
                  </i>
                </template>
                <template slot="detalhamento" scope="row">
                  <span v-html="row.value"></span>
                </template>
                <template slot="dt_registro" scope="row">
                  </span>{{row.value | moment("L")}}</template>
                <template slot="prazo" scope="row">{{row.value | moment("L")}}</template>
              </b-table>
              <b-row>
                <b-col md="6" class="my-1" right>
                  <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
                </b-col>
              </b-row>
            </b-container>
          </div>
        </div>
      </div>
    </div>

    <!--Form-->
    <div v-if="!showgrid" style="margin: 0px" ref="form" class="form-horizontal row well well-sm no-shadow animated fadeInDownOutUp" name="frmAddAc">
      <div class="col-md-6">

        <!--Data-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('data')}">
          <label for="data" class="control-label col-md-2">Data:</label>
          <div class="col-md-4">
            <div v-if="acompanhamento.id">
              <datepicker ref="data" name="data" v-model="acompanhamento.dt_registro" input-class="form-control"
                          :language="$datePickerPtBR" maxlength="20"  placeholder="__ /__ /____" :disabled="acompanhamento.id"
                          format="dd/MM/yyyy" v-validate="'required'">
              </datepicker>
            </div>
            <div v-if="!acompanhamento.id">
              <datepicker ref="data" name="data" v-model="acompanhamento.dt_registro" input-class="form-control"
                          :language="$datePickerPtBR" maxlength="20"  placeholder="__ /__ /____" :disabled="true" :highlighted="highlighted"
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
              <multiselect v-model="acompanhamento.tipo" :options="tipos"
                           :multiple="false"
                           :close-on-select="true"
                           :clear-on-select="true"
                           :hide-selected="false"
                           :preserve-search="true"
                           placeholder="Selecione um Tipo de Acompanhamento"
                           track-by="codigo"
                           :custom-label="etiquetaTipos"
                           @select="onSelect($event, acompanhamento.tipo)"
                           :preselect-first="false"
                           selectLabel=""
                           deselectLabel=""
                           selectedLabel="Selecionado"
                           name="tipo"
                           data-vv-as=""
                           :disabled="acompanhamento.id"
                           v-validate="'required'">
                <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
              </multiselect>
              <span class="situacao_ocorrencia_sapiens" v-if="acompanhamento.situacao_descricao">{{acompanhamento.situacao_descricao}} no Sapiens</span>
            </div>
            <span v-if="errors.first('tipo')" class="label label-danger"> {{ errors.first('tipo') }}</span>
          </div>
        </div>
        <!--Tipo Ocorrência-->
        <div class="form-group required-field" v-if="mostraOcor === true">
          <label for="tipoOcor" class="control-label col-md-2">Status:</label>
          <div class="col-md-8">
            <div>
              <multiselect v-model="acompanhamento.tipo_ocorrencia" :options="tipoOcorrencia"
                           :multiple="false"
                           :close-on-select="true"
                           :clear-on-select="true"
                           :hide-selected="false"
                           :preserve-search="true"
                           placeholder="Selecione um Tipo de Ocorrência"
                           track-by="codigo"
                           :custom-label="etiquetaTipoOcor"
                           :preselect-first="false"
                           selectLabel=""
                           deselectLabel=""
                           selectedLabel="Selecionado"
                           name="tipoOcor">
                <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
              </multiselect>
            </div>
          </div>
        </div>
        <!--Ocorrência Impeditiva-->
        <div class="form-group required-field" v-if="mostraOcor === true && tp === 'OCORRENCIA_IMPEDITIVA'">
          <label for="tipoOcor" class="control-label col-md-2">Lista de Ocorrência:</label>
          <div class="col-md-8"  :class="{ 'has-error' : errors.first('tipoOcor')}">
            <div>
              <multiselect v-model="acompanhamento.ocorrencia_sapiens" :options="ocorrenciasImpeditiva"
                           :multiple="false"
                           :close-on-select="true"
                           :clear-on-select="true"
                           :hide-selected="false"
                           :preserve-search="true"
                           placeholder="Selecione uma Ocorrência"
                           track-by="codigo"
                           :custom-label="etiquetaOcorrencia"
                           :preselect-first="false"
                           selectLabel=""
                           deselectLabel=""
                           :disabled="acompanhamento.id"
                           selectedLabel="Selecionado"
                           v-validate="'required'"
                           data-vv-as="ocorrência"
                           name="tipoOcor">
                <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
              </multiselect>
            </div>
            <span v-if="errors.first('tipoOcor')" class="label label-danger"> {{ errors.first('tipoOcor') }}</span>
          </div>
        </div>
        <!--Ocorrência Informativa-->
        <div class="form-group required-field" v-if="mostraOcor === true && tp === 'INFORMACAO'">
          <label for="tipoOcor" class="control-label col-md-2">Lista de Ocorrência:</label>
          <div class="col-md-8" :class="{ 'has-error' : errors.first('tipoOcor')}">
            <div>
              <multiselect v-model="acompanhamento.ocorrencia_sapiens" :options="ocorrenciasInformativa"
                           :multiple="false"
                           :close-on-select="true"
                           :clear-on-select="true"
                           :hide-selected="false"
                           :preserve-search="true"
                           placeholder="Selecione uma Ocorrência"
                           track-by="codigo"
                           :custom-label="etiquetaOcorrencia"
                           :preselect-first="false"
                           selectLabel=""
                           deselectLabel=""
                           data-vv-as="ocorrência"
                           selectedLabel="Selecionado"
                           v-validate="'required'"
                           name="tipoOcor">
                <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
              </multiselect>
            </div>
            <span v-if="errors.first('tipoOcor')" class="label label-danger"> {{ errors.first('tipoOcor') }}</span>
          </div>
        </div>
        <!-- Detalhamento Ant -->
        <div class="form-group">
          <label for="detalhamentoBloq" class="control-label col-md-2">Histórico Detalhe:</label>
          <div class="col-md-8">
            <div>
              <font v-html="acompanhamento.detalhamento"></font>
            </div>
          </div>
        </div>
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('detalhamento')}">
          <label for="detalhamento" class="control-label col-md-2">Detalhe:</label>
          <div class="col-md-8">
            <div>
              <textarea v-model="detalhamentoAnt" :placeholder="place" name="detalhamento" class="form-control" type="text" maxlength="250" cols="10" rows="6" v-validate="'required'">
              </textarea>
            </div>
            <span v-if="errors.first('detalhamento')" class="label label-danger"> {{ errors.first('detalhamento') }}</span>
          </div>
        </div>
        <!--Status-->
        <div class="form-group required-field" v-if="mostraStatus === true"
             :class="{ 'has-error' : errors.first('status')}">
          <label for="status" class="control-label col-md-2">Status:</label>
          <div class="col-md-8">
            <multiselect v-model="acompanhamento.status" :options="statusAcompanhamento"
                         :multiple="false"
                         :close-on-select="true"
                         :clear-on-select="true"
                         :hide-selected="false"
                         :preserve-search="true"
                         placeholder="Selecione um Status"
                         track-by="codigo"
                         :custom-label="etiquetaTipoOcor"
                         :preselect-first="false"
                         selectLabel=""
                         deselectLabel=""
                         selectedLabel="Selecionado"
                         v-validate="'required'"
                         name="status">
              <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
            </multiselect>
          </div>
          <span v-if="errors.first('status')" class="label label-danger"> {{ errors.first('status') }}</span>
        </div>
        <!--Prazo-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('prazo')}">
          <label for="prazo" class="control-label col-md-2">Prazo:</label>
          <div class="col-md-4">
            <div>
              <datepicker ref="prazo" name="prazo" v-model="acompanhamento.prazo" input-class="form-control datepicker"
                          :language="$datePickerPtBR" maxlength="20" placeholder="__ /__ /____" @input="verificaData" :disabled-dates="disabledDates" :highlighted="highlighted"
                          format="dd/MM/yyyy" v-validate="'required'">
              </datepicker>
            </div>
            <span v-if="errors.first('prazo')" class="label label-danger"> {{ errors.first('prazo') }}</span>
          </div>
        </div>
        <!-- Responsável -->
        <div class="form-group required-field" v-if="acompanhamento.responsavel.ds_nome_usuario">
          <label class="control-label col-md-2">Responsável:</label>
          <div class="col-md-8">
            <div>
              <input v-model="acompanhamento.responsavel.ds_nome_usuario" name="responsavel" class="form-control" type="text" maxlength="255" :disabled="true"/>
            </div>
          </div>
        </div>
        <!-- Anexos -->
        <div class="form-group">
          <label class="control-label col-md-2">Anexos:</label>
          <div class="col-md-10">
            <div>
              <upload-documentos-php-novo :propDocumentos="acompanhamento.documentos" :documentTypes="''" :disable="''" :localUso="'TODOS'" :salvouOK="salvouOK"></upload-documentos-php-novo>
            </div>
          </div>
        </div>
        <div><br><br></div>
        <!-- Botões -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-8 col-md-offset-2">
            <g-button-ujarak color="success" size="button--size-ss" @click.native="onAdd(frmAddAc)"><i class="fa fa-check" aria-hidden="true"></i> Ok</g-button-ujarak >
            <g-button-ujarak color="warning" size="button--size-ss" @click.native="onCancel(frmAddAc)"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</g-button-ujarak>
          </div>
        </div>

      </div>
    </div>
  </div>


</template>

<script>
  import { mapGetters } from 'vuex'
  import { Carousel, Slide } from 'vue-carousel'
  import UploadDocumentosPhpNovo from '../modules/uploadDocumentosPhpNovo'
  import moment from 'moment'

  export default {
    components: {
      Carousel,
      Slide,
      UploadDocumentosPhpNovo
    },
    name: 'acompanhamentoProjetos',
    data () {
      return {
        disabledDates: {
          customPredictor: function (date) {
            if (moment(date).format('YYYYMMDD') < moment(new Date()).format('YYYYMMDD')) {
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
        numero: null,
        projeto: [],
        contador: 0,
        atualizar: 0,
        temp: [],
        loading: true,
        eventData: {
        },
        ocorrenciasImpeditiva: [],
        ocorrenciasInformativa: [],
        salvouOK: false,
        libera: false,
        renderComponent: true,
        arr: [],
        place: '',
        colorFadeStyle: {color: '#c1c1c1'},
        detalhamentoAnt: '',
        objBackend: [],
        acProp: [],
        mostraOcor: false,
        mostraStatus: false,
        editandoIndex: null,
        acompanhamento: {
          detalhamento: '',
          documentos: [],
          dt_registro: null,
          ocorrencia_sapiens: null,
          responsavel: null,
          tipo: null,
          tipo_ocorrencia: null
        },
        steps: this.temp,
        dadosTime: [],
        documento: [],
        showgrid: true,
        timeline_description: '',
        table: {
          items: [],
          bloqueioCampos: false,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          sortBy: 'dt_registro',
          sortDesc: true,
          perPage: 10,
          acompanhamentoTable: [],
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
              thStyle: 'text-align: left; width: 46%',
              class: 'text-left'
            },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              thStyle: 'text-align: center; width: 10%',
              class: 'text-center'
            },
            {
              key: 'prazo',
              label: 'Prazo',
              sortable: true,
              thStyle: 'text-align: center; width: 7%',
              class: 'text-center'
            },
            {
              key: 'responsavel.ds_nome_usuario',
              label: 'Responsável',
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
        }
      }
    },
    props: ['ParmProjetos', 'ParmAcompanhamento', 'filtro'],
    watch: {
      ParmProjetos: function () {
        this.projeto = this.ParmProjetos
      },
      filtro: function () {
        this.table.filter = this.filtro
        this.$nextTick(() => {
          this.$parent.$refs['acompanhamento'].scrollIntoView()
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
      this.numero = this.$route.params.numero
      if (this.numero) {
        this.projeto = this.ParmProjetos
        this.buscaAcompanhamentoProp()
        this.buscaTipos()
        this.buscaOcorrencias()
      }
    },
    methods: {
      forceRerender () {
        this.renderComponent = false
        this.$nextTick(() => {
          this.renderComponent = true
          this.atualizar += 1
          this.$forceUpdate()
        })
      },
      linha (data) {
        let vm = this
        vm.eventData = data
        vm.$events.emit('linhaSelecionada', vm.eventData)
      },
      buscaTipos () {
        axiosLaravel.get('tipo-registros/').then((response) => {
          let arr = response.data
          this.tipos = _.filter(arr, function (o) {
            if (o.grupo === 'ACOMPANHAMENTO') return o
          })
          this.tipoOcorrencia = _.filter(arr, function (o) {
            if (o.grupo === 'TIPO_OCORRENCIA_ACOMPANHAMENTO') return o
          })
          this.statusAcompanhamento = _.filter(arr, function (o) {
            if (o.grupo === 'STATUS_ACOMPANHAMENTO') return o
          })
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      buscaOcorrencias () {
        console.log('buscaOcorrencias')
        axiosLaravel.get('tipo-ocorrencia/').then((response) => {
          let arrOcr = response.data
          console.log('arrOcr', arrOcr)
          this.ocorrenciasImpeditiva = _.filter(arrOcr, function (o) {
            if (o.tipo_ocorrencia === 3 || o.tipo_ocorrencia === 4) return o
          })
          console.log('this.ocorrenciasImpeditiva', this.ocorrenciasImpeditiva)
          this.ocorrenciasInformativa = _.filter(arrOcr, function (o) {
            if (o.tipo_ocorrencia === 1 || o.tipo_ocorrencia === 2) return o
          })
          console.log('this.ocorrenciasInformativa', this.ocorrenciasInformativa)
          this.ocorrenciasImpeditiva = _.sortBy(this.ocorrenciasImpeditiva, 'codigo')
          this.ocorrenciasInformativa = _.sortBy(this.ocorrenciasInformativa, 'codigo')
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      onSelect (selectedOption, tipos) {
        if (selectedOption.codigo === 'OCORRENCIA_IMPEDITIVA' || selectedOption.codigo === 'INFORMACAO') {
          this.mostraOcor = true
          this.tp = selectedOption.codigo
        } else {
          this.tp = selectedOption.codigo
          this.mostraOcor = false
        }
        if (selectedOption.codigo === 'INFORMACAO' || selectedOption.codigo === 'CONTATO' || selectedOption.codigo === 'OCORRENCIA_IMPEDITIVA') {
          this.mostraStatus = false
        } else {
          this.mostraStatus = true
          delete this.acompanhamento.tipo_ocorrencia
          delete this.acompanhamento.ocorrencia_sapiens
        }
        // Define placeholders
        if (selectedOption.codigo === 'INFORMACAO') {
          this.place = 'Não utilizar para registrar envio de e-mail ou contatos com o parceiro.\n' +
            'Registro de matérias publicadas sobre o projeto, mídias, imagens, denúncias recebidas, etc., informar o nome do veículo e meio de comunicação.'
        }
        if (selectedOption.codigo === 'CONTATO') {
          this.place = 'Não utilizar para registrar envio de e-mail ou demandas.\n' +
            'Informe o nome da pessoa e o resumo das tratativas efetuadas (dúvidas SGP, dúvidas quanto à execução do projeto, sistema, preenchimento de relatórios, informações sobre a execução do projeto etc.)'
        }
        if (selectedOption.codigo === 'DEMANDA_FBB') {
          this.place = 'Informe objetivamente qual foi a solicitação e o nome da pessoa com quem o contato foi efetuado.\n' +
            'Exemplos: envio de notificação extrajudicial, informações adicionais aos relatórios de execução, envio de documentos para atualização cadastral, etc.'
        }
        if (selectedOption.codigo === 'DEMANDA_PARCEIRO') {
          this.place = 'Registre objetivamente as demandas recebidas.\n' +
            'Exemplos: Solicitação de remanejamento, pedido de prorrogação de prazo, alteração de metas, substituição de contrapartida, envio de artes para aprovação, etc.'
        }
      },
      etiquetaTipos (option) {
        return `${option.descricao}`
      },
      etiquetaTipoOcor (option) {
        return `${option.descricao}`
      },
      etiquetaOcorrencia (option) {
        return `${option.codigo + ' - ' + option.descricao}`
      },
      verificaData () {
        let dtPrazoAux = moment(this.acompanhamento.prazo).format('YYYY/MM/DD')
        let dtRegAux = moment(this.acompanhamento.dt_registro).format('YYYY/MM/DD')
        let dtPrazo = dtPrazoAux.replace('/', '').replace('/', '')
        let dtReg = dtRegAux.replace('/', '').replace('/', '')
        if (dtPrazo < dtReg) {
          this.$snotify.error('O prazo não pode ser menor que a data de registro. Favor verificar!')
          this.acompanhamento.prazo = ''
          return
        }
      },
      onCancel () {
        this.acompanhamento = {}
        this.showgrid = true
        this.editandoIndex = null
        this.mostraOcor = false
      },
      onNew () {
        this.acompanhamento = {}
        this.acompanhamento.documentos = []
        this.acompanhamento.responsavel = {}
        this.acompanhamento.responsavel.ds_nome_usuario = this.usuarioLogado.userName
        this.editandoIndex = null
        this.acompanhamento.detalhamento = ''
        this.detalhamentoAnt = ''
        this.acompanhamento.dt_registro = moment(this.acompanhamento.prazo).format('YYYY/MM/DD')
        this.$emit('atualizarTimeline', this.i++)
        this.$refs.tabelaAcompanhamento.refresh()
        this.$nextTick(() => {
          this.$parent.$refs['acompanhamento'].scrollIntoView()
        })
      },
      onAdd () {
        let currentDate = new Date()
        this.objBackend = []
        let aux = this.usuarioLogado.userName
        this.acompanhamento.responsavel.ds_nome_usuario = this.usuarioLogado.userName
        this.acompanhamento.fk_usuario_responsavel = this.usuarioLogado.id
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.acompanhamento.detalhamento = this.acompanhamento.detalhamento + '- <b>' + this.detalhamentoAnt + '</b> <br><i>(' + aux + ', ' + moment(currentDate).format('DD/MM/YYYY') + ')' + '</i><br>'
            // Se estiver em forma de edição então adiciona na tabela
            if (this.editandoIndex !== null) {
              for (let i in this.acompanhamento) this.tabelaAcompanhamento[i] = this.acompanhamento[i]
            } else {
              this.table.items.push(this.acompanhamento)
            }
            let array = []
            array = _.sortBy(this.temp, 'dt_registro')
            this.temp = _.cloneDeep(array)
            this.forceRerender()
            this.$forceUpdate()
            this.objBackend.push(this.acProp)
            this.libera = false
            this.contador = this.contador + 1
            this.onCancel()
          } else {
            this.$snotify.error('O formulário possui erros. Favor verificar!')
          }
        })
      },
      edita (row) {
        this.detalhamentoAnt = ''
        this.editandoIndex = row.index
        this.acompanhamento = Object.assign({}, row.item)
        this.detalhamentoAnt = ''
        this.tabelaAcompanhamento = row.item
        if (row.item.tipo.codigo === 'OCORRENCIA_IMPEDITIVA') {
          this.mostraOcor = true
          this.tp = row.item.tipo.codigo
        }
        if (row.item.tipo.codigo === 'INFORMACAO') {
          this.mostraOcor = true
          this.tp = row.item.tipo.codigo
        }
        if (row.item.tipo.codigo === 'INFORMACAO' || row.item.tipo.codigo === 'CONTATO' || row.item.tipo.codigo === 'OCORRENCIA_IMPEDITIVA') {
          this.mostraStatus = false
        } else {
          this.mostraStatus = true
        }
        this.showgrid = false
      },
      exclui (row) {
        this.table.items.splice(row.index, 1)
        this.acProp.splice(row.index, 1)
        this.objBackend.push(this.acProp)
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
      buscaAcompanhamentoProp () {
        axiosLaravel.get('/acompanhamento/' + this.numero).then((response) => {
          this.acProp = response.data
          this.table.items = this.acProp
          this.table.totalRows = this.table.items.length
          this.loading = false
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
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
      salvar () {
        this.libera = false
        let arr = this.objBackend
        arr = _.map(arr, o => _.extend({fk_proposta: this.projeto.proposta.id}, o))
        this.$snotify.async('Salvando acompanhamento do projeto. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('/acompanhamento/', arr).then((response) => {
          this.salvouOK = true
          this.buscaAcompanhamentoProp()
          this.$forceUpdate()
          this.$snotify.clear()
          this.$snotify.success('Acompanhamento do projeto gravado com sucesso!')
          this.libera = true
          this.contador = 0
          this.$emit('atualizarTimeline', new Date())
        })
          .catch((error) => {
            this.$snotify.clear()
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      refresh () {
        location.reload(true)
      }
    }
  }
</script>

<style>
  #tabelaAcompanhamento td:nth-of-type(1), #tabelaAcompanhamento th:nth-of-type(1) {
    display: none;
  }
  .situacao_ocorrencia_sapiens {
    color: #2E7D32;
    font-style: italic;
    font-size: small;
  }
</style>
