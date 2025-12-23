<template>
     <!-- 66201 - Licenciamento Ambiental -->
    <div class="box-body">
      <g-button-ujarak v-if="!editarLicencas && usuarioLogado.userType === 'FUNDACAO'" color="primary" @click.native="toggleEdicao(true)" class="botao-editar-publico"><i class="fa fa-pencil" aria-hidden="true"></i>
        Editar Cadastro de Licenças </g-button-ujarak>
        
        <g-button-ujarak v-if="editarLicencas" color="warning" @click.native="toggleEdicao(false)" class="botao-editar-publico"><i class="fa fa-close" aria-hidden="true"></i>
          Fechar Edição (Não esqueça de Salvar) </g-button-ujarak>
        <cadastroLicencas v-if="editarLicencas" :idProposta="idProposta"></cadastroLicencas>
        <envioLicencas v-if="!editarLicencas && usuarioLogado.userType === 'ENTIDADE'" :idProposta="idProposta"></envioLicencas>
        <validacaoLicencas v-if="!editarLicencas && usuarioLogado.userType === 'FUNDACAO'"  :idProposta="idProposta" :nomeProjeto="nomeProjeto" :numeroProjeto="numeroProjeto"></validacaoLicencas>
    </div>
  </template>
    
  <script>
  import cadastroLicencas from './cadastroLicencas.vue'
  import envioLicencas from './envioLicencas.vue'
  import validacaoLicencas from './validacaoLicencas.vue'
  import { mapGetters } from 'vuex'
  export default {
    name: 'licenciamentoAmbientalProjeto',
    components: {
      cadastroLicencas,
      envioLicencas,
      validacaoLicencas
    },
    data () {
      return {
        loading: {
          show: false
        },
        editarLicencas: false
      }
    },
    props: {
      tipoUsuario: String,
      idProposta: Number,
      numeroProjeto: String,
      nomeProjeto: String
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
    },
    mounted: function () {
    },
    methods: {
      toggleEdicao (valor) {
        this.editarLicencas = valor
      }
    }
  }
  </script>
    
  <style scoped>
  </style>