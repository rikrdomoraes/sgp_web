<template>
    <!-- 66201 - Licenciamento Ambiental - Aviso de Licenças próximo ao vencimento (Visão Entidade) -->
   <div class="column start-centered box-body w-100">
        <div v-if="consultando">
            Consultando pendências de Licenciamento ambiental ...
        </div>
        <div class="column all-centered w-100 gap-10 licenciamento-container-aviso" v-if="licencasProximasPrazo.length > 0 || licencasPrazoEnvio.length > 0" >
            <div class="row start-centered w-100">
                <i class="fa fa-warning"></i> Licenciamento Ambiental - Avisos!
            </div>
            <div v-if="licencasProximasPrazo.length > 0" class="column start-centered w-100 proximas-container">
                <div> <i class="fa fa-pencil"></i> Licenças Próximas ao Prazo de Envio (Clique para enviar a Licença)</div>
                <a v-for="licenca in licencasProximasPrazo" class="row-flex start-centered gap-5" :href="'/projetos/projeto/' + licenca.ds_codigo_projeto_erp" target="_blank">
                    <div>
                        {{ licenca.ds_codigo_projeto_erp }}
                    </div>
                    <div>
                        {{ licenca.ds_nome }}
                    </div>
                    <div>
                        {{ licenca.licenca }}
                    </div>
                    <div>
                        {{ moment(licenca.prazo_apresentacao).format('DD/MM/YYYY') }}
                    </div>
                </a>
            </div>
            <div v-if="licencasPrazoEnvio.length > 0" class="column start-centered w-100 vencidas-container">
                <div> <i class="fa fa-exclamation-circle"></i> Licenças Não Apresentadas no Prazo de Envio (Clique para enviar a Licença)</div>
                <a v-for="licenca in licencasPrazoEnvio" class="row-flex start-centered gap-5" :href="'/projetos/projeto/' + licenca.ds_codigo_projeto_erp" target="_blank">
                    <div>
                        {{ licenca.ds_codigo_projeto_erp }}
                    </div>
                    <div>
                        {{ licenca.ds_nome }}
                    </div>
                    <div>
                        {{ licenca.licenca }}
                    </div>
                    <div>
                        {{ moment(licenca.prazo_apresentacao).format('DD/MM/YYYY') }}
                    </div>
                </a>
            </div>
        </div>
   </div>
 </template>
   
 <script>
 import moment from 'moment'
 import { mapGetters } from 'vuex'
 export default {
   name: 'avisoLicencas',
   components: {
   },
   data () {
     return {
       moment: moment,
       licencasPrazoEnvio: [],
       licencasProximasPrazo: [],
       consultando: false
     }
   },
   props: {
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   watch: {
   },
   mounted: function () {
     this.consultaLicencasVencidas()
     this.consultaLicencasComPrazoProximo()
   },
   methods: {
     async consultaLicencasVencidas () {
       this.consultando = true
       console.log('consultaLicencasVencidas')
       let obj = {
         idEntidade: this.usuarioLogado.fk_entidade
       }
       await axiosLaravel.post('/licenciamento/consultarLicencasVencidas/', obj).then((response) => {
         console.log(response.data)
         this.licencasPrazoEnvio = response.data
         this.consultando = false
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.consultando = false
        })
     },
     async consultaLicencasComPrazoProximo () {
       this.consultando = true
       console.log('consultarLicencasComPrazoProximo')
       let obj = {
         idEntidade: this.usuarioLogado.fk_entidade
       }
       await axiosLaravel.post('/licenciamento/consultarLicencasComPrazoProximo/', obj).then((response) => {
         console.log(response.data)
         this.licencasProximasPrazo = response.data
         this.consultando = false
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.consultando = false
        })
     }
   }
 }
 </script>
   
 <style scoped>
    .licenciamento-container-aviso {
        padding: 10px;
        border: 1px solid #CBCFD4;
        border-radius: 5px;
    }
    .proximas-container {
        padding: 10px;
        border: 1px solid #CBCFD4;
        background-color: #FFEC86;
        border-radius: 5px;
    }
    .vencidas-container {
        padding: 10px;
        border: 1px solid #CBCFD4;
        background-color: #ffaeae;
        border-radius: 5px;
    }
 </style>