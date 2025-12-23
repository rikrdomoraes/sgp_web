<template>
  <div class="box box-widget" >
    <div class="box-header with-border">
      <h3 class="box-title">Parcelas Adiantáveis</h3>
    </div>
    <div class="box-body" >
      <div class="row" style="overflow:auto;">
        <div class="col-md-12 financial-physical-schedule">
          <fieldset>
          <table align="center" class="table table-condensed table-bordered">
            <thead>
            <tr>
              <th>Parcela</th>
              <th>Recurso</th>
              <th>Fase</th>
              <th>Valor total por fase</th>
              <th>Valor a solicitar por fase</th>
              <th>Saldo restante por fase</th>
              <th v-if="propsFase === 'Análise Financeira'">Número título</th>
              <th v-if="propsFase === 'Análise Financeira'">Conta Financeira</th>
              <th v-if="propsFase !== 'Análise Financeira'">Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in itens" disabled="true">
              <td>{{item.parcelas_adiantamentos[0].parcela}}</td>
              <td>{{item.parcelas_adiantamentos[0].origem === 1 ? 'FUNDACAO' : 'PARCEIRO ESTRATEGICO' }}</td>
              <td>{{item.parcelas_adiantamentos[0].origem}}</td>
              <td>{{item.parcelas_adiantamentos[0].valor | real}}</td>
              <td v-if="item.editando === false || !item.editando">{{item.valor ? item.valor : 0 | real}}</td>
              <td v-if="item.editando === true" class="text-center">
                <money v-model="item.valor"
                       name="valor"
                       :class="{ 'has-error' : errors.first('valor')}"
                       class="form-control text-right"
                       type="text"
                       v-validate="'required'"
                       :disabled="item.totalValueRequested > 0 || !propsEnable"
                       ></money>
              <td>{{item.parcelas_adiantamentos[0].valor - (item.valor ? item.valor : 0) | real}}</td>
              <td class="text-right" v-if="propsFase === 'Análise Financeira'">
                <div class="input-group"  :class="{ 'has-error' : errors.first('Número título')}">
                  <input type="number" v-model="item.numeroTitulo" class="form-control text-right" name="Número título" v-validate="'required'">
                </div>
              </td>
              <td class="text-right form-group required-field" v-if="propsFase === 'Análise Financeira'">
                <select :class="{ 'has-error' : errors.first('conta financeira')}"
                        name="conta financeira"
                        v-model="item.contaFinanceira"
                        class="form-control"
                        aria-hidden="true"
                        v-validate="'required'">
                  <option v-for="conta in contasFinanceiras" :value="conta.ctared">{{conta.ctared}} / {{conta.descta}}</option>
                </select>
              </td>
              <td v-if="propsFase !== 'Análise Financeira'" class="text-center">
                <i class="fa fa-edit" style="margin-left:5px" v-on:click="editItem(item)"
                   v-if="!item.editando && propsEnable"></i>
                <i class="fa fa-check" style="color: green; margin-left:5px" v-on:click="editItem(item)"
                   v-if="item.editando"></i>
                <i class="fa fa-times" style="color: red;margin-left:5px" v-on:click="cancelaEdicao(item)"
                   v-if="item.editando"></i>
              </td>
            </tr>
            </tbody>
            <tfoot style="font-weight: bold;">
            <tr v-default="atualizaCalculoGrid(item)">
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
          </fieldset>



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
    name: 'cronograma-solicitacao-adiantamento-validacao',
    data () {
      return {
        itens: this.propsItens,
        valorGuarda: 0,
        valorTotalSolicitacao: 0,
        contasFinanceiras: []
      }
    },
    props: ['propsItens', 'propsEnable', 'propsFase'],
    watch: {
      'propsItens': function () {
        this.itens = this.propsItens
        // this.$emit('parcelaAdicionada', this.itens)
      }
    },
    mounted () {
      // this.parcelas = _.cloneDeep(this.propsProjeto.parcelas)
      this.buscaContasFinanceiras()
      this.$forceUpdate()
    },
    computed: {
      // Calcula o valor disponível para adiantamento
      valorTotalDisponivel () {
        if (this.propsItens) {
          return this.propsItens.reduce((total, item) => total + (item.parcelas_adiantamentos[0].valor), 0)
        }
        return 0
      }
    },
    methods: {
      buscaContasFinanceiras () {
        axiosLaravel.get('busca_conta_financeira').then((response) => {
          this.contasFinanceiras = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      calculaValorTotalSolicitado () {
        let total = 0
        if (this.propsItens) {
          this.propsItens.forEach((item) => {
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
        if (item.valor > item.totalValueAdvance) {
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
      },
      atualizaCalculoGrid (item) {
        // Suporte 58836 - Funcao criada para forçar o recalculo da variavel Total valor solicitado
        // Recalcula o valor
        this.calculaValorTotalSolicitado()

        // Força a atualização da árvore
        this.$forceUpdate()
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
