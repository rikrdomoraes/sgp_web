<template>
    <!-- 66201 - Licenciamento Ambiental - Envio de Licenças (Visão Entidade) -->
   <div class="box-body w-100">
      <div v-show="loading.show" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
        <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
      </div>
      <b-container fluid class="w-100" v-if="!visualizarLicenca && !enviarLicenca">
            <legend style="background-color: #fcfcfc">
              <i class="fa fa-paper-plane" aria-hidden="true"></i> Envio de Licenças
            </legend>
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
                  <b-button type="button" :disabled="verificarStatusAnexo(row.item)" @click="abrirAnexoLicenca(row.item, row.index)" class="btn btn-success btn-sm btn-flat"
                          data-cy='edita-licenca-procedimento'><i class="fa fa-check-circle" aria-hidden="true"></i> Anexar</b-button>
                  <b-button type="button" @click="visualizaLicenca(row.item, row.index)" class="btn btn-primary btn-sm btn-flat"
                            data-cy='exclui-licenca-procedimento'><i class="fa fa-eye" aria-hidden="true"></i>  Visualizar</b-button>
                </div>
              </template>
              <template  slot="prazo_apresentacao" scope="row">
                {{ row.value == '' ? '-' : moment.utc(row.value).format('DD/MM/YYYY') }}
              </template>
              <template  slot="data_apresentacao" scope="row">
                <!-- {{ row.value == '' ? 'Não Apresentado' : moment.utc(row.value).format('DD/MM/YYYY') }} -->
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

            </b-table>
            <!-- <b-row v-if="table.items.length > table.perPage">
              <b-col md="12" class="my-1" right>
                <b-pagination :total-rows="table.items.length" :per-page="table.perPage" v-model="table.currentPage" class="" />
              </b-col>
            </b-row> -->
            <div class="row-flex all-end w-100">
              ({{ table.items.length }}) Licenças Encontradas
            </div>
          </b-container>
        <div v-if="enviarLicenca || visualizarLicenca" class="envio-container column start-centered">
          <legend>
              Envio de Licenças
          </legend>
          <div class="row-flex centered-start gap-10 w-100">
            <div class="w-80">
                <label class="control-label">Nome do projeto:</label>
                <input type="text" class="form-control" placeholder="0000 Nome do Projeto" :value="numeroProjeto + ' ' + nomeProjeto" disabled/>
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
                <label class="control-label f-required">Data de Validade:</label>
                <datepicker name="dataInicial" v-model="licencaTemplate.validade" input-class="form-control datepicker"
                                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                   format="dd/MM/yyyy" v-validate="'required'" :disabled="visualizarLicenca">
                </datepicker>
           </div>
            <div class="w-20">
                <label class="control-label">Prazo de Apresentação:</label>
                <input type="text" class="form-control" placeholder="Prazo de Apresentação" v-model="licencaTemplate.prazo_apresentacao" disabled/>
            </div>
            <div class="w-20">
                <label class="control-label">Apresentado em:</label>
                <input type="text" class="form-control" placeholder="Prazo de Apresentação" v-model="licencaTemplate.data_apresentacao" disabled/>
            </div>
          </div>

          <div class="w-100">
              <label class="control-label">Observação:</label>
              <input type="text" class="form-control" placeholder="Tipo de Licença" v-model="licencaTemplate.observacoes" disabled/>
          </div>
          <div class="column start-centered w-100">
            <label class="control-label f-required">Anexo:</label>
            <uploadLicencas 
              :propDocumentos="licencaTemplate.anexo" 
              class="w-100" 
              localUso="LICENCIAMENTO_AMBIENTAL"
              :maxFiles="1"
              :disable="visualizarLicenca"
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

          <div v-if="enviarLicenca" class="row-flex centered-end w-100 gap-5">
              <g-button-ujarak color="warning" @click.native="toggleEnvio(false)"><i class="fa fa-close" aria-hidden="true"></i>
                Cancelar </g-button-ujarak>
              <g-button-ujarak color="success" @click.native="gravaLicenca()"><i class="fa fa-save" aria-hidden="true"></i>
                Enviar Licença </g-button-ujarak>
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
   name: 'envioLicencas',
   components: {
     uploadLicencas
   },
   data () {
     return {
       moment: moment,
       loading: {
         show: false,
         showTable: false
       },
       enviarLicenca: false,
       visualizarLicenca: false,
       nomeProjeto: 'TESTE',
       numeroProjeto: '00000',
       licencas: [],
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
         observacoes: ''
       },
       indexEdit: '',
       table: {
         items: [],
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 100,
         fields: [
             { key: 'licenca', label: 'Licença', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'prazo_apresentacao', label: 'Prazo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'data_apresentacao', label: 'Data Apresentação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'fase_proposta', label: 'Fase', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'status', label: 'Status', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
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
     idProposta: Number
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   watch: {
   },
   mounted: function () {
     this.consultaLicencasProposta()
   },
   methods: {
     toggleEnvio (valor) {
       this.enviarLicenca = valor
     },
     toggleVisualizacao (valor) {
       this.visualizarLicenca = valor
     },
     consultaLicencasProposta () {
       console.log('Consulta licenças')
       this.loading.show = true
       axiosLaravel.get('/licenciamento/consultaLicencasProposta/' + this.idProposta).then((response) => {
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
           this.$forceUpdate()
           console.log(this.licencas)
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
     abrirAnexoLicenca (licenca, index) {
      // Preenche dados da Licença
       this.indexEdit = index
       this.licencaTemplate = {
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
      // Ativa o modal
       this.consultarHistoricoLicenca(licenca.id)
       this.toggleEnvio(true)
     },
     visualizaLicenca (licenca, index) {
       this.indexEdit = index
       this.licencaTemplate = {
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
       this.consultarHistoricoLicenca(licenca.id)
       this.toggleVisualizacao(true)
     },
     gravaLicenca () {
       console.log('Grava Licença')
       if (this.verificaCamposObrigatorios() === false) {
         this.$snotify.error('Anexe o documento e preencha a data de validade da licença antes de continuar.')
         return
       }
       this.$snotify.clear()
       this.$snotify.async('Enviando licença...', {timeout: 0})
       this.loading.show = true
       // Verifica se dados estão preenchidos
       // Envia documento e id para gravar na base
       // Atualiza status para 'Pendente de Validação'
       this.licencaTemplate.validade = moment.utc(this.licencaTemplate.validade).format('YYYY-MM-DD')
       this.licencaTemplate.responsavel = this.usuarioLogado.ds_nome_usuario
       axiosLaravel.post('/licenciamento/gravaLicencaEntidade/', this.licencaTemplate).then((response) => {
         console.log(response.data)
         this.$snotify.clear()
         this.$snotify.success(response.data)
         this.loading.show = false
         this.toggleEnvio(false)
         this.consultaLicencasProposta()
       })
        .catch((error) => {
          this.$snotify.clear()
          this.$root.trataErro(error)
          this.loading.show = false
        })
     },
     verificaCamposObrigatorios () {
       if (this.licencaTemplate.anexo.length === 0) {
         return false
       }
       if (this.licencaTemplate.validade === '' || _.isNull(this.licencaTemplate.validade) || this.licencaTemplate.validade === '-') {
         return false
       }
       return true
     },
     verificarStatusAnexo (licenca) {
       if (licenca.status === 'Informado pela Analise' || licenca.status === 'Pendente de Validação' || licenca.status === 'Validado') {
         return true
       }
       return false
     },
     consultarHistoricoLicenca (idLicenca) {
       console.log('Consultando Historico', idLicenca, this.idProposta)
       this.tableHistorico.items = []
       this.loading.showTable = true
       let obj = {
         idProposta: this.idProposta,
         idLicenca: idLicenca
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
    .pendente {
      background-color: #C62828;
    }
    .pendente-validacao {
      background-color: #FF9900;
    }
    .validado {
      background-color: #2860F1;
    }
    .nao-apresentado {
      font-weight: 800;
    }
 </style>