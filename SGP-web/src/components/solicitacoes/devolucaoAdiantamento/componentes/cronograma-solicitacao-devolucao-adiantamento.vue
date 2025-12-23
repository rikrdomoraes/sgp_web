<template>
  <div class="box box-widget" >
    <div class="box-header with-border">
      <h3 class="box-title">Valor da Devolução</h3>
    </div>
    <div class="box-body" >
      <div class="row" style="overflow:auto;">
        <div class="col-md-12 financial-physical-schedule">
          <table align="center" class="table table-condensed table-bordered">
            <thead>
            <tr>
              <th>Recurso</th>
              <th>Fase</th>
              <th>Valor total pendente</th>
              <th>Valor a devolver</th>
              <th>Saldo restante</th>
              <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in adiantamentosConcecidos" disabled="true">
              <td>{{item.recurso}}</td>
              <td>{{item.recurso ==='FUNDACAO' ? 1 : 5}}</td>
              <td>{{item.pendente_comprovacao | real}}</td>
              <td v-if="item.editando === false || !item.editando">{{item.valor ? item.valor : 0 | real}}</td>
              <td v-if="item.editando === true" class="text-center">
                <money v-model="item.valor"
                       name="valor"
                       :class="{ 'has-error' : errors.first('valor')}"
                       class="form-control text-right"
                       type="text"
                       v-validate="'required'"
                       ></money>
              <td>{{(item.disponivel - item.comprovado - item.devolvido) - (item.valor ? item.valor : 0) | real}}</td>
              <td class="text-center">
                <i class="fa fa-edit" style="margin-left:5px" v-on:click="editItem(item)"
                   v-if="!item.editando"></i>
                <i class="fa fa-check" style="color: green; margin-left:5px" v-on:click="editItem(item)"
                   v-if="item.editando"></i>
                <i class="fa fa-times" style="color: red;margin-left:5px" v-on:click="cancelaEdicao(item)"
                   v-if="item.editando"></i>
              </td>
            </tr>
            </tbody>
            <tfoot style="font-weight: bold;">
            <tr >
              <td colspan="4" style="border-right: none;">Total valor solicitado:	</td>
              <td colspan="4" class="text-right" style="border-left: none;">{{valorTotalSolicitacao | real}}</td>
            </tr>
            <tr >
              <td colspan="4" style="border-right: none;">Valor disponível para solicitação nesta parcela:	</td>
              <td colspan="4" class="text-right" style="border-left: none;">{{valorTotalDisponivel - valorTotalSolicitacao | real}}</td>
            </tr>
            <tr >
              <td colspan="4" style="border-right: none;">Valor total liberado para solicitação:	</td>
              <td colspan="4" class="text-right" style="border-left: none;">{{valorTotalDisponivel | real}}</td>
            </tr>
            </tfoot>
          </table>



        </div>
      </div>



    </div> <!-- ./box-body -->
    <vue-snotify></vue-snotify>
  </div> <!-- ./box -->

</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import moment from 'moment'
  export default {
    name: 'cronograma-solicitacao-devolucao-adiantamento',
    data () {
      return {
        adiantamentosConcecidos: this.propsProjeto.adiantamentos_concedidos,
        valorGuarda: 0,
        valorTotalSolicitacao: 0
      }
    },
    props: ['propsProjeto'],
    mounted () {
      this.adiantamentosConcecidos.forEach((parcela) => {
        if (parcela.totalValueRequested > 0) {
          parcela.valor = parcela.totalValueRequested
        }
      })
      this.$forceUpdate()
    },
    computed: {
      // Calcula o valor disponível para adiantamento
      valorTotalDisponivel () {
        if (this.adiantamentosConcecidos) {
          return this.adiantamentosConcecidos.reduce((total, item) => total + (item.disponivel - item.comprovado - item.devolvido), 0)
        }
        return 0
      }
    },
    methods: {
      calculaValorTotalSolicitado () {
        let total = 0
        if (this.adiantamentosConcecidos) {
          this.adiantamentosConcecidos.forEach((item) => {
            if (!_.isUndefined(item.valor)) {
              total = total + item.valor
            } else {
              item.valor = 0
            }
          })
        }
        this.valorTotalSolicitacao = total
      },
      editItem (item) {
        // Verifica se o item é maio que o permitido
        if (Math.round(item.valor + 'e+2') + 'e-2' > Math.round((item.disponivel - item.comprovado - item.devolvido) + 'e+2') - 'e-2') {
          // Se o campo valor esta visível na tela
          if (this.$validator.fields.find({ name: 'valor' })) {
            // Dispara mensagem de erro
            this.$snotify.error('valor pedido maior que permitido')
          }
          return
        } else {
          // Copia o valor que esta editando para se ele cancelar a edição não faz nada
          this.valorGuarda = _.clone(item.valor)
        }
        // Seta a variavel para o oposto
        item.editando = !item.editando
        // Recalcula o valor
        this.calculaValorTotalSolicitado()
        // Força a atualização da árvore
        this.$forceUpdate()
        this.$emit('parcelaAdicionada', this.adiantamentosConcecidos)
      },
      cancelaEdicao (item) {
        // Como esta cancelando a edição devolve o valor
        item.valor = _.clone(this.valorGuarda)
        // Seta a variavel para o oposto
        item.editando = !item.editando
        // Força a atualização da árvore
        this.$forceUpdate()
      }
    }
  }
</script>

<style scoped>

</style>
