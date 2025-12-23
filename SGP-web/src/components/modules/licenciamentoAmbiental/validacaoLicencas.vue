<template>
    <!-- 66201 - Licenciamento Ambiental - Envio de Licenças (Visão Entidade) -->
   <div class="box-body w-100">
      <div v-show="loading.show" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
        <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
      </div>
      <div class="column all-centered table-container">
          <b-container fluid class="w-100" v-if="!visualizarLicenca && !validarLicenca && !editarLicenca">
                <legend style="background-color: #fcfcfc">
                  <i class="fa fa-paste" aria-hidden="true"></i> Validação de Licenças
                </legend>
                <div v-if="todasLicencas" class="row-flex all-start gap-10 w-100">

                  <div class="filtro-container w-80">
                    <label class="control-label">Selecione um projeto: </label>
                    <select name="Projeto"
                      v-model="filtroProjetoSelecionado"
                      class="form-control"
                      placeholder="Selecione"
                      aria-hidden="true"
                      @change="aplicarFiltros()"
                    >
                      <option value="" disabled>Projeto</option>
                      <option value="TODOS">Todos</option>
                      <option v-for="projeto in filtroProjetos" :value="projeto">{{projeto}}</option>
                    </select>
                  </div>
                  
                  <div class="filtro-container w-20">
                    <label class="control-label">Status: </label>
                    <select name="Projeto"
                      v-model="filtroStatusSelecionado"
                      class="form-control"
                      placeholder="Selecione"
                      aria-hidden="true"
                      @change="aplicarFiltros()"
                    >
                      <option value="" disabled>Status</option>
                      <option value="TODOS">Todos</option>
                      <option v-for="status in filtroStatus" :value="status">{{status}}</option>
                    </select>
                  </div>

                </div>
                <!-- Licenças Cadastradas -->
                <b-table show-empty
                        stacked="md"
                        striped
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
                  <template slot="actions" scope="row">
                    <div>
                      <b-button v-if="verificarStatusValidacao(row.item)" type="button" @click="abrirAnexoLicenca(row.item, row.index)" class="btn btn-success btn-sm btn-flat"
                              data-cy='edita-licenca-procedimento'><i class="fa fa-check-circle" aria-hidden="true"></i> Validar</b-button>
                      <b-button v-if="verificarStatusEdicao(row.item)" type="button" @click="editaLicenca(row.item, row.index)" class="btn btn-warning btn-sm btn-flat"
                                data-cy='exclui-licenca-procedimento'><i class="fa fa-pencil" aria-hidden="true"></i>  Editar</b-button>
                      <b-button type="button" @click="visualizaLicenca(row.item, row.index)" class="btn btn-primary btn-sm btn-flat"
                                data-cy='exclui-licenca-procedimento'><i class="fa fa-eye" aria-hidden="true"></i>  Visualizar</b-button>
                      <b-button type="button" v-confirm="{ok: retorno => preparaExclusao(row.item, row.index), cancel: doNothing,
                            message: 'Atenção, este procedimento não poderá ser desfeito. Confirma Exclusão?'}" class="btn btn-danger btn-sm btn-flat" v-if="usuarioLogado.userType === 'FUNDACAO' && !todasLicencas"
                            data-cy='exclui-licenca-procedimento'><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                      <!-- <b-button v-if="verificarStatusEdicao(row.item)" :title="'<h5>Enviar e-mail</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" @click="visualizaLicenca(row.item, row.index)" class="btn btn-danger btn-sm btn-flat"
                                data-cy='exclui-licenca-procedimento' uib-tooltip="Envia E-mail"><i class="fa fa-envelope" aria-hidden="true"></i></b-button> -->
                    </div>
                  </template>
                  <template  slot="prazo_apresentacao" scope="row">
                    {{ row.value == '' ? '-' : moment.utc(row.value).format('DD/MM/YYYY') }}
                  </template>
                  <template  slot="data_apresentacao" scope="row">
                    <div v-if="row.value == ''">
                      <b>Não Apresentado</b>
                    </div>
                    <div v-else>
                      {{ moment.utc(row.value).format('DD/MM/YYYY') }}
                    </div>
                  </template>
    
                  <template  slot="status" scope="row">
                    <span :class="statusClass(row.value)">
                      {{ row.value }}
                    </span>
                  </template>

                  <template  slot="tipo_licenca" scope="row">
                      {{ row.value.replace('_', ' ') }}
                  </template>
    
                </b-table>
                <div class="row-flex centered-end w-100 gap-10">
                  <div>
                    ({{ table.items.length }}) Licenças Encontradas
                  </div>
                  <g-button-ujarak v-if="todasLicencas" color="primary" @click.native="limparFiltros()"><i class="fa fa-repeat" aria-hidden="true"></i>
                  </g-button-ujarak>
                </div>

                <b-row>
                  <b-col md="12" class="my-1" right>
                    <b-pagination :total-rows="table.items.length" :per-page="table.perPage" v-model="table.currentPage" class="" />
                  </b-col>
                </b-row>
              </b-container>
        </div>
        <div v-if="validarLicenca || visualizarLicenca || editarLicenca" class="envio-container column start-centered">
          <legend>
              Validação de Licença
          </legend>
          <div class="row-flex centered-start gap-10 w-100">
            <div class="w-80">
                <label class="control-label">Nome do projeto:</label>
                <input type="text" class="form-control" placeholder="0000 Nome do Projeto" :value="licencaTemplate.projeto" disabled/>
            </div>
            <div class="w-20">
                <label class="control-label">Status:</label>
                <input type="text" class="form-control" placeholder="Status" v-model="licencaTemplate.status" disabled/>
            </div>
            <div class="w-20">
                <label class="control-label">Fase:</label>
                <input type="text" class="form-control" placeholder="Fase" v-model="licencaTemplate.fase_proposta" disabled/>
            </div>
          </div>

          <div class="row-flex centered-start gap-10 w-100">
            <div class="w-70">
                <label class="control-label">Tipo de Licença:</label>
                <input type="text" class="form-control" placeholder="Tipo de Licença" v-model="licencaTemplate.licenca" disabled/>
            </div>
            <div class="w-10">
                <label class="control-label">Data de Validade:</label>
                <datepicker name="dataInicial" v-model="licencaTemplate.validade" input-class="form-control datepicker"
                                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                   format="dd/MM/yyyy" v-validate="'required'" disabled>
                </datepicker>
           </div>
            <div class="w-20" v-if="!editarLicenca">
                <label class="control-label">Prazo de Apresentação:</label>
                <input type="text" class="form-control" placeholder="Prazo de Apresentação" v-model="licencaTemplate.prazo_apresentacao" disabled/>
            </div>
            <div class="w-20" v-if="editarLicenca">
                <label class="control-label">Prazo de Apresentação:</label>
                <datepicker name="dataInicial" v-model="licencaTemplate.prazo_apresentacao" input-class="form-control datepicker"
                                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                   format="dd/MM/yyyy" v-validate="'required'">
                </datepicker>
            </div>
            <div class="w-20">
                <label class="control-label">Apresentado em:</label>
                <input type="text" class="form-control" placeholder="Prazo de Apresentação" v-model="licencaTemplate.data_apresentacao" disabled/>
            </div>
          </div>

          <div class="w-100">
              <label class="control-label">Observação:</label>
              <input type="text" class="form-control" placeholder="Observações Adicionais" v-model="licencaTemplate.observacoes" disabled/>
          </div>

          <div class="column start-centered w-100">
            <label class="control-label f-required">Anexo:</label>
            <uploadLicencas 
              :propDocumentos="licencaTemplate.anexo" 
              class="w-100" 
              localUso="LICENCIAMENTO_AMBIENTAL"
              :maxFiles="1"
              :disable="true"
            ></uploadLicencas>
          </div>
  
          <b-container fluid class="w-100">
            <legend>
              Histórico
            </legend>
            <div v-show="loading.showTable" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
              <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
            </div>
            <!-- Histórico -->
            <b-table show-empty
                    stacked="md"
                    striped
                    :bordered="tableHistorico.bordered"
                    :items="tableHistorico.items"
                    :hover="tableHistorico.hover"
                    :fields="tableHistorico.fields"
                    :filter="tableHistorico.filter"
                    :current-page="tableHistorico.currentPage"
                    :per-page="tableHistorico.perPage"
                    :sort-by.sync="tableHistorico.sortBy"
                    :sort-desc.sync="tableHistorico.sortDesc"
                    empty-text="Nenhum registro encontrado"
            >
            <template  slot="created_at" scope="row">
              {{moment(row.value).format('DD/MM/YYYY HH:mm:ss')}}
            </template>
            </b-table>
          </b-container>

          <div class="w-100 column centered-start gap-10">
            <div v-if="validarLicenca" class="column start-centered w-100">
                <label class="control-label f-required">Decisão:</label>
                <span>
                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                    <input type="radio" v-model="licencaTemplate.decisao" value="Validado"> Validar
                    <div class="new-control-indicator"></div>
                  </label> 
                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                    <input type="radio" v-model="licencaTemplate.decisao" value="Devolvido para Ajustes"> Devolver para Ajustes
                    <div class="new-control-indicator"></div>
                  </label>
                </span>
            </div>

            <div class="w-100" v-if="validarLicenca || editarLicenca">
                <label class="control-label f-required">Justificativa:</label>
                <input type="text" class="form-control" placeholder="Justificativa da decisão aqui" v-model="licencaTemplate.justificativaDecisao"/>
            </div>

          </div>

          <div v-if="validarLicenca" class="row-flex centered-end w-100 gap-5">
              <g-button-ujarak color="warning" @click.native="toggleValidacao(false)"><i class="fa fa-close" aria-hidden="true"></i>
                Cancelar </g-button-ujarak>
              <g-button-ujarak color="success" @click.native="validaLicenca()"><i class="fa fa-save" aria-hidden="true"></i>
                Atualizar Status Licença </g-button-ujarak>
          </div>
          <div v-if="editarLicenca" class="row-flex centered-end w-100 gap-5">
              <g-button-ujarak color="warning" @click.native="toggleEdicao(false)"><i class="fa fa-close" aria-hidden="true"></i>
                Cancelar </g-button-ujarak>
              <g-button-ujarak color="success" @click.native="atualizaPrazoLicenca()"><i class="fa fa-save" aria-hidden="true"></i>
                Atualizar Prazo de Apresentação </g-button-ujarak>
          </div>
          <div v-if="visualizarLicenca" class="row-flex centered-end w-100 gap-5">
              <g-button-ujarak color="primary" @click.native="toggleVisualizacao(false)"><i class="fa fa-arrow-left" aria-hidden="true"></i>
                Voltar </g-button-ujarak>
          </div>
        </div>
   </div>
 </template>
   
 <script>
 import uploadLicencas from './uploadLicencas.vue'
 import moment from 'moment'
 import { mapGetters } from 'vuex'
 export default {
   name: 'validacaoLicencas',
   components: {
     uploadLicencas
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   data () {
     return {
       moment: moment,
       loading: {
         show: false,
         showTable: false
       },
       validarLicenca: false,
       visualizarLicenca: false,
       editarLicenca: false,
       filtroProjetos: [],
       filtroStatus: [],
       filtroProjetoSelecionado: 'TODOS',
       filtroStatusSelecionado: 'TODOS',
       licencas: [],
       licencasBackup: [],
       historico: [],
       licencaTemplate: {
         id: null,
         licenca: '',
         tipo_licenca: '',
         fase_proposta: '',
         periodo_apresentacao: '',
         prazo_apresentacao: '',
         validade: '',
         status: '',
         documento: null,
         anexo: [],
         observacoes: '',
         decisao: '',
         justificativaDecisao: '',
         responsavel: ''
       },
       indexEdit: '',
       table: {
         items: [],
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 20,
         fields: [
             { key: 'projeto', label: 'Projeto', sortable: true, thStyle: 'text-align: center; width: 20%', class: 'text-center' },
             { key: 'tipo_licenca', label: 'Tipo de licença', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'licenca', label: 'Licença', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'prazo_apresentacao', label: 'Prazo para apresentação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'data_apresentacao', label: 'Apresentada em', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'fase_proposta', label: 'Fase', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'status', label: 'Status', sortable: true, thStyle: 'text-align: center; width:13%', class: 'text-center' },
             { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
         ]
       },
       tableHistorico: {
         items: [],
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 100,
         fields: [
             { key: 'etapa', label: 'Etapa', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'usuario', label: 'Usuário', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'observacao', label: 'Observação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'created_at', label: 'Data/Hora', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
         ]
       }
     }
   },
   props: {
     tipoUsuario: String,
     idProposta: Number,
     nomeProjeto: String,
     numeroProjeto: String,
     todasLicencas: {type: Boolean, default: false}
   },
   watch: {
   },
   mounted: function () {
     this.consultaLicencasProposta()
   },
   methods: {
     toggleValidacao (valor) {
       this.validarLicenca = valor
     },
     toggleEdicao (valor) {
       this.editarLicenca = valor
     },
     toggleVisualizacao (valor) {
       this.visualizarLicenca = valor
     },
     consultaLicencasProposta () {
       this.loading.show = true
       let queryString = '/licenciamento/consultaLicencasProposta/' + this.idProposta
       if (this.todasLicencas === true) {
         queryString = '/licenciamento/consultaTodasLicencasProposta'
       }
       axiosLaravel.get(queryString).then((response) => {
         // console.log(response.data)
         // this.loading.show = false
         if (response.data.length > 0) {
           this.licencas = response.data
           this.licencas.forEach((licenca) => {
             if (licenca.tipo_licenca === 'INFORMATIVA') {
               licenca.data_apresentacao = moment.utc(licenca.created_at).format('YYYY-MM-DD')
             }
           })
           this.table.items = this.licencas
           this.licencasBackup = _.cloneDeep(this.licencas)
           if (this.todasLicencas) {
             this.initFiltros()
           }
           this.$forceUpdate()
           this.loading.show = false
         } else {
           this.loading.show = false
         }
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
        })
     },
     consultarHistoricoLicenca (licenca) {
       console.log('Consultando Historico', licenca.id, licenca.fk_proposta)
       this.tableHistorico.items = []
       this.loading.showTable = true
       let obj = {
         idProposta: licenca.fk_proposta,
         idLicenca: licenca.id
       }
       axiosLaravel.post('/licenciamento/consultarHistoricoLicenca/', obj).then((response) => {
         console.log(response.data)
         if (response.data.length > 0) {
           this.historico = response.data
           this.tableHistorico.items = this.historico
         }
         this.$forceUpdate()
         this.loading.showTable = false
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.showTable = false
        })
     },
     abrirAnexoLicenca (licenca) {
      // Preenche dados da Licença
       this.licencaTemplate = {
         projeto: licenca.projeto,
         id: licenca.id,
         licenca: licenca.licenca,
         tipo_licenca: licenca.tipo_licenca,
         fase_proposta: licenca.fase_proposta,
         periodo_apresentacao: licenca.periodo_apresentacao,
         data_apresentacao: _.isNull(licenca.data_apresentacao) ? '-' : moment.utc(licenca.data_apresentacao).format('DD/MM/YYYY'),
         prazo_apresentacao: _.isNull(licenca.prazo_apresentacao) ? '-' : moment.utc(licenca.prazo_apresentacao).format('DD/MM/YYYY'),
         validade: _.isNull(licenca.validade) ? '-' : moment.utc(licenca.validade).format('YYYY-MM-DD'),
         status: licenca.status,
         documento: licenca.documento,
         anexo: _.isNull(licenca.documento) ? [] : [licenca.anexo],
         observacoes: licenca.observacoes,
         decisao: '',
         justificativaDecisao: '',
         responsavel: this.usuarioLogado.ds_nome_usuario
       }
      // Ativa o modal
       this.consultarHistoricoLicenca(licenca)
       this.toggleValidacao(true)
     },
     visualizaLicenca (licenca, index) {
       this.indexEdit = index
       this.licencaTemplate = {
         projeto: licenca.projeto,
         id: licenca.id,
         licenca: licenca.licenca,
         tipo_licenca: licenca.tipo_licenca,
         fase_proposta: licenca.fase_proposta,
         periodo_apresentacao: licenca.periodo_apresentacao,
         data_apresentacao: _.isNull(licenca.data_apresentacao) ? '-' : moment.utc(licenca.data_apresentacao).format('DD/MM/YYYY'),
         prazo_apresentacao: _.isNull(licenca.prazo_apresentacao) ? '-' : moment.utc(licenca.prazo_apresentacao).format('DD/MM/YYYY'),
         validade: _.isNull(licenca.validade) ? '-' : moment.utc(licenca.validade).format('YYYY-MM-DD'),
         status: licenca.status,
         documento: licenca.documento,
         anexo: _.isNull(licenca.documento) ? [] : [licenca.anexo],
         observacoes: licenca.observacoes
       }
       this.consultarHistoricoLicenca(licenca)
       this.toggleVisualizacao(true)
     },
     editaLicenca (licenca, index) {
       this.indexEdit = index
       this.licencaTemplate = {
         projeto: licenca.projeto,
         id: licenca.id,
         licenca: licenca.licenca,
         tipo_licenca: licenca.tipo_licenca,
         fase_proposta: licenca.fase_proposta,
         periodo_apresentacao: licenca.periodo_apresentacao,
         data_apresentacao: _.isNull(licenca.data_apresentacao) ? '-' : moment.utc(licenca.data_apresentacao).format('DD/MM/YYYY'),
         prazo_apresentacao: _.isNull(licenca.prazo_apresentacao) ? '-' : moment.utc(licenca.prazo_apresentacao).format('YYYY-MM-DD'),
         validade: _.isNull(licenca.validade) ? '-' : moment.utc(licenca.validade).format('YYYY-MM-DD'),
         status: licenca.status,
         documento: licenca.documento,
         anexo: _.isNull(licenca.documento) ? [] : [licenca.anexo],
         observacoes: licenca.observacoes,
         justificativaDecisao: '',
         responsavel: this.usuarioLogado.ds_nome_usuario
       }
       this.consultarHistoricoLicenca(licenca)
       this.toggleEdicao(true)
     },
     validaLicenca () {
       console.log('Grava Licença')
       // Verifica se dados estão preenchidos
       if (this.verificaCamposObrigatorios() === false) {
         this.$snotify.error('Selecione a decisão e informe a justificativa antes de continuar.')
         return
       }
       this.$snotify.clear()
       this.$snotify.async('Gravando decisão...', {timeout: 0})
       this.loading.show = true
       // Atualiza status da Licença
       axiosLaravel.post('/licenciamento/atualizaDecisaoValidacao/', this.licencaTemplate).then((response) => {
         console.log(response.data)
         this.$snotify.clear()
         this.$snotify.success(response.data)
         this.loading.show = false
         this.toggleValidacao(false)
         this.consultaLicencasProposta()
       })
        .catch((error) => {
          this.$snotify.clear()
          this.$root.trataErro(error)
          this.loading.show = false
        })
     },
     atualizaPrazoLicenca () {
       console.log('Grava Licença')
       // Verifica se dados estão preenchidos
       if (this.verificaCamposObrigatoriosPrazo() === false) {
         this.$snotify.error('Informe novo prazo e justifique antes de continuar.')
         return
       }
       this.$snotify.clear()
       this.$snotify.async('Gravando novo Prazo da Licença...', {timeout: 0})
       this.loading.show = true
       // Atualiza status da Licença
       this.licencaTemplate.prazo_apresentacao = moment.utc(this.licencaTemplate.prazo_apresentacao).format('YYYY-MM-DD')
       axiosLaravel.post('/licenciamento/atualizaPrazoLicenca/', this.licencaTemplate).then((response) => {
         console.log(response.data)
         this.$snotify.clear()
         this.$snotify.success(response.data)
         this.loading.show = false
         this.toggleEdicao(false)
         this.consultaLicencasProposta()
       })
        .catch((error) => {
          this.$snotify.clear()
          this.$root.trataErro(error)
          this.loading.show = false
        })
     },
     verificaCamposObrigatorios () {
       if (this.licencaTemplate.decisao === '') {
         return false
       }
       if (this.licencaTemplate.justificativaDecisao === '') {
         return false
       }
       return true
     },
     verificaCamposObrigatoriosPrazo () {
       if (this.licencaTemplate.prazo_apresentacao === '') {
         return false
       }
       if (this.licencaTemplate.justificativaDecisao === '') {
         return false
       }
       return true
     },
     verificarStatusValidacao (licenca) {
       if (licenca.status === 'Pendente de Validação') {
         return true
       }
       return false
     },
     verificarStatusEdicao (licenca) {
       if (licenca.status === 'Aguardando Envio') {
         return true
       }
       return false
     },
     statusClass (status) {
       if (status === 'Pendente de Validação') {
         return 'tag-status pendente-validacao'
       }
       if (status === 'Aguardando Envio') {
         return 'tag-status pendente'
       }
       if (status === 'Devolvido para Ajustes') {
         return 'tag-status pendente'
       }
       if (status === 'Validado') {
         return 'tag-status validado'
       }
       if (status === 'Informado pela Analise') {
         return 'tag-status validado'
       }
       if (status === 'Informado pela FBB') {
         return 'tag-status estoque'
       }
       if (status === 'Informado pela Entidade') {
         return 'tag-status estoque'
       }
     },
     initFiltros () {
       // Pega valores de Projetos únicos do array de licenças
       this.filtroProjetos = _.uniq(_.map(this.licencas, 'projeto'))
       this.filtroStatus = _.uniq(_.map(this.licencas, 'status'))
     },
     limparFiltros () {
       this.filtroProjetoSelecionado = 'TODOS'
       this.filtroStatusSelecionado = 'TODOS'
       this.aplicarFiltros()
     },
     aplicarFiltros () {
       let licencaFiltro = _.cloneDeep(this.licencas)
       let filtro = ''
       if (this.filtroProjetoSelecionado === 'TODOS') {
         if (this.filtroStatusSelecionado === 'TODOS') {
           this.table.items = this.licencas
           return
         } else {
           console.log('licenca status only')
           filtro = _.filter(licencaFiltro, (licenca) => {
             return licenca.status === this.filtroStatusSelecionado
           })
         }
         this.$forceUpdate()
       } else {
         // Aplica filtro
         if (this.filtroStatusSelecionado === 'TODOS') {
           filtro = _.filter(licencaFiltro, (licenca) => {
             return licenca.projeto === this.filtroProjetoSelecionado
           })
         } else {
           filtro = _.filter(licencaFiltro, (licenca) => {
             return licenca.projeto === this.filtroProjetoSelecionado
           })
           filtro = _.filter(filtro, (licenca) => {
             return licenca.status === this.filtroStatusSelecionado
           })
         }
       }
       this.table.items = filtro
       this.$forceUpdate()
     },
     preparaExclusao (licenca, index) {
       // Verifica se existe licença gravada no banco de dados e exclui (soft delete)
       if (licenca.id !== null) {
         // Atualiza banco de dados e apaga da tabela
         this.excluiLicenca(licenca.id)
         this.table.items.splice(index, 1)
       }
     },
     excluiLicenca (id) {
       this.$snotify.clear()
       this.$snotify.async('Excluindo licença na base de dados...', {timeout: 0})
       let obj = {
         responsavel: this.usuarioLogado.ds_nome_usuario
       }
       axiosLaravel.post('/licenciamento/excluirLicenca/' + id, obj).then((response) => {
         this.$snotify.clear()
         this.$snotify.success(response.data)
         this.consultaLicencasProposta()
        //  this.loading.show = false
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.$snotify.clear()
          this.$snotify.error(error)
          this.loading.show = false
        })
     }
   }
 }
 </script>
   
 <style scoped>
   .envio-container {
      width: 100%;
      gap: 10px;
      background-color: #f5f5f5;
      box-sizing: border-box;
      padding: 50px;
    }
    .tag-status {
      width: 100%;
      font-weight: 600;
      border-radius: 5px;
      padding: 5px 15px;
      color: #fcf8f8;
    }
    .filtro-container {
      /* width: 100%; */
      margin-bottom: 10px;
    }
    .pendente {
      background-color: #C62828;
    }
    .pendente-validacao {
      background-color: #FF9900;
    }
    .validado {
      background-color: #2860F1;
    }
    .estoque {
      background-color: #1fa146;
    }
    .nao-apresentado {
      font-weight: 800;
    }
 </style>