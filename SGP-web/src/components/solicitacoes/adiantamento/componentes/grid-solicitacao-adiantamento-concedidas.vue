<template>
  <div class="box box-widget" >
    <div class="box-header with-border">
      <h3 class="box-title">Adiantamentos Concedidos</h3>
    </div>
    <div class="box-body" >
      <div class="row" style="overflow:auto;">
        <div class="col-md-12 financial-physical-schedule">
          <table class="table table-condensed table-bordered">
            <thead>
            <tr>
              <th>ID</th>
              <th>Processo de solicitação em andamento</th>
              <th>Valor liberado</th>
              <th>Valor não solicitado</th>
              <th>Data limite para prestação de contas</th>
              <th>Data da última prestação de contas</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in adiantamentos_concedidos">
              <td>{{item.id}}</td>
              <td>{{item.projectName}} - {{item.createDate | moment('L')}}</td>
              <td>{{item.totalValue | real}}</td>
              <td>{{item.totalValueBalance | real}}</td>
              <td>{{dataLimite}}</td>
              <td>{{item.accountabilityDate | moment('L')}}</td>
            </tr>
            </tbody>
          </table>



        </div>
      </div>



    </div> <!-- ./box-body -->
  </div> <!-- ./box -->

</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import moment from 'moment'
  export default {
    name: 'grid-solicitacao-adiantamento-concecida',
    data () {
      return {
      }
    },
    props: ['propsProjeto'],
    computed: {
      // Calcula a data limite da prestação de contas
      dataLimite () {
        this.$forceUpdate()
        return moment(this.propsProjeto.createDate).add(90, 'days').format('DD/MM/YYYY')
      },
      adiantamentos_concedidos () {
        return this.propsProjeto.adiantamentos_concedidos
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
