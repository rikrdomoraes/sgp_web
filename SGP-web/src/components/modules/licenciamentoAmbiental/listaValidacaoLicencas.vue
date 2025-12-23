<template>
    <!-- 66201 - Licenciamento Ambiental -->
   <div class="content-wrapper container-licencas" style="min-height: 870px;">
    <div class="column all-centered container-validacao box-body">
        <validacaoLicencas :idProposta="null" :nomeProjeto="null" :numeroProjeto="null" :todasLicencas="true"></validacaoLicencas>
    </div>
   </div>
 </template>
   
 <script>
 import validacaoLicencas from './validacaoLicencas.vue'
 import { mapGetters } from 'vuex'
 export default {
   name: 'licenciamentoAmbientalProjeto',
   components: {
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
 .container-licencas {
    padding: 50px 0px;
    background-color: #F5F5F5;
 }

 .container-validacao {
    width: 100%;
    /* padding: 20px; */
    background-color: #FFFFFF;
 }
 </style>