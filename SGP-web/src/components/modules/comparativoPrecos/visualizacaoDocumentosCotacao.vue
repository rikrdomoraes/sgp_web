<template>
    
    <div class="column centered-start cotacao-manual-main-container">

        <div class="column start-centered cotacao-manual-anexo-container">
              <label class="control-label">Anexos da Cotação:</label>
              <uploadCotacaoManualVisualizacao v-if="!carregandoAnexos" 
                :propDocumentos="anexos"
                class="w-100" 
                localUso="COTACAO_MANUAL"
                :maxFiles="3"
                :disable="this.visualizacao"
              ></uploadCotacaoManualVisualizacao>
              <div v-else>
                <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
                Carregando Anexos...
              </div>
        </div>

    </div>
 </template>
   
 <script>
 import { mapGetters } from 'vuex'
 import moment from 'moment'
 import uploadCotacaoManualVisualizacao from './uploadCotacaoManualVisualizacao.vue'
 export default {
   name: 'cotacaoItens',
   components: {
     uploadCotacaoManualVisualizacao
   },
   data () {
     return {
       moment: moment,
       carregandoAnexos: false,
       loading: {
         show: false
       },
       anexos: [],
       idArquivosParaProcurar: []
     }
   },
   props: {
     proposta: Object
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   watch: {
   },
   mounted: function () {
     this.initVisualizacao()
   },
   methods: {
     initVisualizacao () {
       let anexosProcurar = []
       this.proposta.atividades.forEach((atividade) => {
         atividade.itens_orcamentos.forEach((item) => {
           if (item.hasOwnProperty('itemCotacaoManual')) {
             item.itemCotacaoManual.forEach((cotacao) => {
               cotacao.forEach((itemCotacao) => {
                 anexosProcurar.push(itemCotacao.id)
               })
             })
           }
         })
       })
       this.idArquivosParaProcurar = anexosProcurar
       this.buscaAnexos()
     },
     async buscaAnexos () {
       this.carregandoAnexos = true
       let obj = {
         ids: this.idArquivosParaProcurar
       }
       await axiosLaravel.post('cotacao/getTodosAnexosCotacaoManual/', obj).then((response) => {
         this.anexos = response.data
         this.carregandoAnexos = false
       })
         .catch((error) => {
           console.log('error', error)
           this.carregandoAnexos = false
         })
     }
   }
 }
 </script>

 <style scoped>

    .cotacao-manual-main-container {
        width: 100%;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 600px;
        padding: 20px;
        background-color: #fdfdfd;
        border-radius: 10px;
        gap: 10px;
        box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
        animation: fade 0.3s ease;
    }

    .cotacao-header-container {
      width: 100%;
      height: 50px;
      border-radius: 5px;
      padding: 20px;
      background-color: #1565C0;
      gap: 5px;
      color: #FFFFFF;
      font-size: 1.5rem;
      margin-bottom: 20px;
      margin-top: 20px;
    }

    .cotacao-input-container {
        width: 100%;
        gap: 5px;
        margin-bottom: 10px;
    }

    .justificativa-input {
        min-height: 50px;
    }

    .cotacao-manual-anexo-container {
        width: 100%;
        padding: 30px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    }


    @keyframes fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
    }

 </style>