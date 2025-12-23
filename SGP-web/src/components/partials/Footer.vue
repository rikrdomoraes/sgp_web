<template>
  <footer class="main-footer">
    <div class="pull-right hidden-xs">
      <b>Versão</b> 3.1.3
    </div>
    <strong>Copyright &copy; {{(new Date()).getFullYear()}} - <a href="http://www.fbb.org.br">Fundação Banco do Brasil</a>.</strong>
  </footer>
</template>

<script>
// eslint-disable-next-line no-unused-vars
  import moment from 'moment'
  export default {
    name: 'DashboardFooter'
  }
</script>

<style>
  @media print {
    footer.main-footer {
      display: none !important;
    }
  }
</style>
