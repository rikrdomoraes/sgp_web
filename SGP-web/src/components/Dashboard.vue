<template>
  <div>
    <app-header></app-header>

    <!-- Left side column. contains the sidebar -->
    <app-sidebar></app-sidebar>

    <!-- Content Wrapper. Contains page content -->
    <router-view :key="$route.fullPath"></router-view>
    <!-- /.content-wrapper -->

    <app-footer></app-footer>

    <control-sidebar></control-sidebar>
  </div>
</template>

<script>
  import Sidebar from './partials/Sidebar.vue'
  import Header from './partials/Header.vue'
  import Footer from './partials/Footer.vue'
  import ControlSidebar from './partials/ControlSidebar.vue'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Dashboard',
    components: {
      'app-sidebar': Sidebar,
      'app-header': Header,
      'app-footer': Footer,
      'control-sidebar': ControlSidebar
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created () {
      if (this.usuarioLogado.entidade) {
        if (this.usuarioLogado.entidade.registerPhase === 'CREDENCIAMENTO' && this.usuarioLogado.entidade.status === 'INCOMPLETO' && this.usuarioLogado.userType === 'ENTIDADE') {
          this.carregaTela()
        }
      } else {
        this.verificaUOR()
      }
    },
    methods: {
      carregaTela () {
        this.$router.push('/cadastro/entidades/edita/' + this.usuarioLogado.entidade.id)
        this.$forceUpdate()
      },
      verificaUOR () {
        axiosLaravel.post('chamado/verificaUOR/').then((response) => {
          console.log('RLMB response.data', response.data)
          this.usuarioLogado.uor = parseInt(response.data[0])
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.show = false
          })
      }
    }
  }
</script>

<style>
  body {
    font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
    font-size: 14px !important;
    font-weight: 400;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
