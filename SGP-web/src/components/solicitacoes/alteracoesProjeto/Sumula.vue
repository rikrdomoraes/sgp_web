<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="loading.tela ? 'Carregando súmula' : 'Súmula ' + (!_.isNull(this.$route.params.id) ? this.$route.params.id : '')"/>

    <section class="content-header">
      <h1>
        <span class="col-md-5">{{ loading.tela ? 'Carregando súmula...' : 'Súmula ' + (!_.isNull(this.$route.params.id) ? 'ID ' + this.$route.params.id : '') }}</span>

        <span v-if="!loading.tela || ehVisualizacao" class="col-md-7 bloco_botoes">
          <g-button-moema color="warning" @click.native="imprimir" type="button"><i class="fa fa-print" aria-hidden="true"></i> Imprimir</g-button-moema>
        </span>
      </h1>
    </section>

    <section class="content">
      <sumula :idProcesso="this.$route.params.id"></sumula>
    </section>

  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import Sumula from '../../modules/sumula'

  export default {
    components: {
      Sumula
    },
    name: 'solicitacao-alteracoes-projeto-sumula',
    data () {
      return {
        id: null,
        etapa: 'Solicitação',
        loading: {
          tela: false
        },
        ehVisualizacao: false
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
    },
    mounted () {
    },
    created () {
      console.clear()
    },
    methods: {
      imprimir () {
        window.print()
      }
    }
  }
</script>

<style scoped>
  .bloco_botoes {
    display: flex;
  }
  .bloco_botoes span {
    margin: 0px 5px;
  }
</style>
