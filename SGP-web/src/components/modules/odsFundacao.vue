<template>
    <!-- 69906 - Novos Municipios -->
    <div class="content-wrapper ods-main-container" v-if="usuarioLogado.userType === 'FUNDACAO'">
        <vue-headful :title="'SGP - Registro de ODS Fundação BB'"/>
        <section class="content-header">
          <h1>
            <span>Objetivos de Desenvolvimento Sustentável (ODS) - Favoritos Fundação BB</span>
          </h1>
          <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Cadastro', href: '#'}, {text: 'ODS', active: true}]"/>
        </section>

        <div class="ods-content">
            <odsCadastro />
        </div>


      <vue-snotify></vue-snotify>
    </div>
  </template>
    
  <script>
  import { mapGetters } from 'vuex'
  import odsCadastro from './odsCadastro.vue'
  export default {
    name: 'odsFundacao',
    components: {
      odsCadastro
    },
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
    },
    mounted: function () {
      console.log('ODS!')
    },
    methods: {
    }
  }
  </script>
    
  <style scoped>
  @keyframes fade {
    0% {
      opacity: 0;
      transform: translateX(-10px);
    }
  
    100% {
      opacity: 1;
      transform: translateX(0px);
    }
  }
  
    .ods-main-container {
        width: 100%;
        min-height: 910px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .ods-content {
        width: 87%;
        padding: 10px;
        margin-top: 120px;
    }

    @media (max-width:1440px){
      .ods-main-container {
        width: 94%;
      }
    }


</style>