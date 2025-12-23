<template>

  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Manuais e Modelos'"/>

    <section class="content-header">
      <h1><i class="fa fa-book" aria-hidden="true"></i> Manuais e Modelos</h1>
    </section>

    <section class="content">

      <div class="row">

        <div class="col-md-6">
          <documentos-por-tipo :tipo="45"></documentos-por-tipo>
        </div>

        <div class="col-md-6">
          <documentos-por-tipo :tipo="46"></documentos-por-tipo>
        </div>

      </div>

    </section>

  </div>

</template>

<script>
  import DocumentosPorTipo from './ged/documentosPorTipo'

  export default {
    components: {
      DocumentosPorTipo
    },
    name: 'Manuais',
    data () {
      return {
      }
    }
  }
</script>

<style scoped>
</style>
