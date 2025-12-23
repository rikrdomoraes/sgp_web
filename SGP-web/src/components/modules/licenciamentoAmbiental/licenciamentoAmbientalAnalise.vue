<template>
    <!-- 66201 - Licenciamento Ambiental -->
   <div class="box-body">
    <legend style="background-color: #fcfcfc" v-if="!telaProjeto">
        Cadastro de Licenças
    </legend>
    <div v-show="loading.show" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
        <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
    </div>
     <g-button-ujarak v-if="!editarLicencas" color="primary" @click.native="toggleEdicao(true)" class="botao-editar-publico"><i class="fa fa-pencil" aria-hidden="true"></i>
       Detalhar/Editar Cadastro de Licenças </g-button-ujarak>
       
       <g-button-ujarak v-if="editarLicencas" color="warning" @click.native="toggleEdicao(false)" class="botao-editar-publico"><i class="fa fa-close" aria-hidden="true"></i>
         Cancelar </g-button-ujarak>
       <cadastroLicencas v-if="editarLicencas" :idProposta="idProposta" :fecharAnalise="fecharLicencas"></cadastroLicencas>
       <b-container fluid class="w-100 table-container" v-if="!editarLicencas">
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

                <template  slot="actions" scope="row">
                  <b-button type="button" v-confirm="{ok: retorno => preparaExclusao(row.item, row.index), cancel: doNothing,
                            message: 'Atenção, este procedimento não poderá ser desfeito. Confirma Exclusão?'}" class="btn btn-danger btn-sm btn-flat" v-if="usuarioLogado.userType === 'FUNDACAO' && !todasLicencas"
                            data-cy='exclui-licenca-procedimento'><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                </template>

            </b-table>
            <div class="row-flex all-end w-100">
                ({{ table.items.length }}) Licenças Encontradas
            </div>
            <b-row>
                <b-col md="12" class="my-1" right>
                <b-pagination :total-rows="table.items.length" :per-page="table.perPage" v-model="table.currentPage" class="" />
                </b-col>
            </b-row>
        </b-container>
   </div>
 </template>
   
 <script>
 import cadastroLicencas from './cadastroLicencas.vue'
 import { mapGetters } from 'vuex'
 import moment from 'moment'
 export default {
   name: 'licenciamentoAmbientalAnalise',
   components: {
     cadastroLicencas
   },
   data () {
     return {
       moment: moment,
       loading: {
         show: false
       },
       editarLicencas: false,
       licencas: [],
       table: {
         items: [],
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 10,
         fields: [
             { key: 'tipo_licenca', label: 'Tipo de licença', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'licenca', label: 'Licença', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'prazo_apresentacao', label: 'Vigência', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'data_apresentacao', label: 'Data Apresentação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'fase_proposta', label: 'Fase', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'status', label: 'Status', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
         ]
       }
     }
   },
   props: {
     idProposta: Number
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   watch: {
     idProposta () {
       this.consultaLicencasProposta()
     }
   },
   mounted: function () {
     this.consultaLicencasProposta()
   },
   methods: {
     toggleEdicao (valor) {
       this.editarLicencas = valor
     },
     consultaLicencasProposta () {
       this.loading.show = true
       let queryString = '/licenciamento/consultaLicencasProposta/' + this.idProposta
       axiosLaravel.get(queryString).then((response) => {
         console.log('licença analise: ', response.data)
         if (response.data.length > 0) {
           this.licencas = response.data
           this.licencas.forEach((licenca) => {
             if (licenca.tipo_licenca === 'INFORMATIVA') {
               licenca.data_apresentacao = moment.utc(licenca.created_at).format('YYYY-MM-DD')
             }
           })
           this.table.items = this.licencas
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
     fecharLicencas () {
       this.toggleEdicao(false)
       this.consultaLicencasProposta()
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
     preparaExclusao (licenca, index) {
       // Verifica se existe licença gravada no banco de dados e exclui (soft delete)
       if (licenca.id !== null) {
         // Atualiza banco de dados e apaga da tabela
         this.excluiLicenca(licenca.id)
         this.table.items.splice(index, 1)
       }
     },
     excluiLicenca (id) {
       this.loading.show = true
       this.$snotify.clear()
       this.$snotify.async('Excluindo licença na base de dados...', {timeout: 0})
       let obj = {
         responsavel: this.usuarioLogado.ds_nome_usuario
       }
       axiosLaravel.post('/licenciamento/excluirLicenca/' + id, obj).then((response) => {
         this.$snotify.clear()
         this.$snotify.success(response.data)
         this.consultaLicencasProposta()
         this.loading.show = false
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
    .table-container {
        margin-top: 20px;
    }
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
    .estoque {
      background-color: #1fa146;
    }
    .nao-apresentado {
      font-weight: 800;
    }
 </style>
