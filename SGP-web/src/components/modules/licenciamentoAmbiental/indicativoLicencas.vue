<template>
    <!-- 66201 - Licenciamento Ambiental - Indicativo de Licenças - Fase CADASTRO) -->
    <div class="form-group box-body">
        <div class="column start-centered indicativo-container">
            <label class="control-label f-required label-head">As atividades propostas para o projeto são passíveis de licenciamento ambiental obrigatório?</label>
            <div class="row-flex" style="position: relative">
              <div v-show="loading.show" class="overlay" style="position: absolute; width:100%; height: 30px; background: rgba(255, 255, 255, 0.7); z-index: 1000">
                <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
             </div>
              <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                <input type="radio" value="Sim" v-model="indicativo"> Sim
                <div class="new-control-indicator"></div>
              </label> 
              <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                <input type="radio" value="Não"  v-model="indicativo"> Não
                <div class="new-control-indicator"></div>
              </label> 
          </div>
        </div>
    </div>
 </template>
   
 <script>
 import moment from 'moment'
 import { mapGetters } from 'vuex'
 export default {
   name: 'indicativoLicencas',
   components: {
   },
   data () {
     return {
       moment: moment,
       loading: {
         show: false
       },
       indicativo: ''
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
       this.consultaIndicativoLicenciamento()
     }
   },
   mounted: function () {
     this.consultaIndicativoLicenciamento()
   },
   methods: {
     consultaIndicativoLicenciamento () {
       this.loading.show = true
       axiosLaravel.get('/licenciamento/consultarIndicativoLicenciamento/' + this.idProposta).then((response) => {
         if (!_.isEmpty(response.data)) {
           this.indicativo = response.data.status
         }
         this.loading.show = false
         return true
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.$snotify.clear()
          this.$snotify.error(error)
          this.loading.show = false
          return false
        })
     },
     gravarIndicativoLicenciamento () {
       console.log('gravaIndicativoLicenciamento ')
       this.loading.show = true
       if (this.indicativo === '') {
         return false
       }
       let indicativo = {
         idProposta: this.idProposta,
         indicativo: this.indicativo
       }
       axiosLaravel.post('/licenciamento/gravarIndicativoLicenciamento', indicativo).then((response) => {
         this.$snotify.clear()
         this.$snotify.success(response.data)
         this.loading.show = false
         return true
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.$snotify.clear()
          this.$snotify.error(error)
          this.loading.show = false
          return false
        })
     }
   }
 }
 </script>
   
 <style scoped>
    .indicativo-container {
        width: 98%;
        padding: 20px;
        border: 1px solid #DDDDDD;
        margin-left: 20px;
    }
 </style>