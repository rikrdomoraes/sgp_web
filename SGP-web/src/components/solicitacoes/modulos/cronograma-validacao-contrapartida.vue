<template>
  <div class="box box-widget" >
    <div class="box-header with-border">
      <h3 class="box-title">Cronograma Físico-Financeiro</h3>
    </div>

    <div class="box-body" >
      <div class="row" style="overflow:auto;">
        <div class="col-md-12 financial-physical-schedule">

          <table class="table table-condensed table-bordered">
            <thead>
            <tr>
              <th>Item</th>
              <th>Quantidade</th>
              <th>Valor Total</th>
              <th>Quantidade a solicitar</th>

              <!-- Titulos referentes ao campo 'quantityRequest' -->
              <th>Valor a solicitar</th>

              <th>Economicidade</th>

              <th>Quantidade a comprovar</th>

              <!-- Titulos referentes ao campo 'quantityProve' -->
              <th>Valor a comprovar</th>
              <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in propsNota.receiptItems">
              <!--Campo item-->
              <td>{{item.item.description}}</td>
              <!--CAmpo Quantidade-->
              <td class="text-center">{{buscaItemProjeto(item).quantity}}</td>
              <!--Valor total-->
              <td class="text-center">{{buscaItemProjeto(item).totalValue | real}}</td>
              <!--Quantidade a solicitar-->
              <td v-if="item.editing === false || !item.editing" class="text-center">{{item.quantity}}</td>
              <td v-if="item.editing === true" class="text-center"> <input v-model="item.quantity" name="quantidade a solicitar" class="form-control text-right" type="text">
              </td>

              <!--Valor a comprovar-->
              <td v-if="item.editing === false || !item.editing" class="text-center">{{item.totalValue | real}}</td>
              <td v-if="item.editing === true" class="text-center"><money v-model="item.totalValue" name="quantidade a solicitar" class="form-control text-right" type="text"></money>
              </td>
              <!--Economicidade-->
              <td class="text-center">
                <label class="checkbox-inline new-control new-control-checkbox" style="margin-bottom: 10px;">
                  <input ng-disabled="finPhySchSolCtrl.approvalState != 'APPROVER_TYPE'" type="checkbox"  v-model="item.economicity">
                  <div class="new-control-indicator"></div>
                </label>
              </td>
              <!--Quantidade a comprovar-->
              <td class="text-center">{{buscaItemProjeto(item).quantity - (buscaItemProjeto(item).quantityRequested - item.quantity) - item.quantity}}</td>
              <!--	Valor a comprovar-->
              <td class="text-center">{{buscaItemProjeto(item).totalValue - (buscaItemProjeto(item).totalValueRequested - item.totalValue) - item.totalValue | real}}</td>
              <!--Ação-->
              <td class="text-center">
                <i v-if="(item.editing === false || !item.editing) && item.economicity === false" class="fa fa-edit" @click="editItem(item)" style="margin-left:5px"></i>
                <i v-if="item.editing === true" class="fa fa-check" @click="editItem(item)" style="color: green; margin-left: 5px; cursor: pointer;"></i>
              </td>


            </tr>
            </tbody>
            <tfoot style="font-weight: bold;">
            <tr>
              <td colspan="4" style="border-right: none;">Saldo atual da contrapartida:: </td>
              <td colspan="4" class="text-right" style="border-left: none;">{{SaldoAtualDaContrapartida| real}}</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="4" style="border-right: none;">Valor total da solicitação:	</td>
              <td colspan="4" class="text-right" style="border-left: none;">{{valorTotalSolicitacao| real}}</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="4" style="border-right: none;">Saldo da contrapartida::	</td>
              <td colspan="4" class="text-right" style="border-left: none;">{{saldoFinanceiroProjeto | real}}</td>
              <td></td>
            </tr>
            </tfoot>
          </table>

        </div>
      </div>

    </div>
  </div>

</template>

<script>
    export default {
      name: 'cronograma-solicitacao',
      data () {
        return {
          itemsProjetoIgualNota: []
        }
      },
      props: ['propsNota', 'propsValidacao'],
      computed: {
        valorTotalSolicitacao () {
          return this.propsNota.receiptItems.reduce((total, item) => total + item.totalValue, 0)
        },
        codeItemsNota () {
          return this.propsNota.receiptItems.map(item => {
            return item.item.code
          })
        },
        saldoFinanceiroProjeto () {
          return this.itemsProjetoIgualNota.reduce((total, item) => total + (item.totalValue - item.totalValueRequested), 0)
        },
        SaldoAtualDaContrapartida () {
          let total = 0
          if (this.propsValidacao.counterpartRequest) {
            this.propsValidacao.counterpartRequest.project.projectItems.forEach(item => {
              if (this.codeItemsNota.includes(item.item.code)) {
                total += item.totalValueRequested
                this.itemsProjetoIgualNota.push(item)
              }
            })
          }
          return total
        }
      },
      watch: {},
      mounted () {},
      methods: {
        editItem (item) {
          if (!item.editing) {
            item.editing = true
          } else {
            item.editing = !item.editing
          }
          this.$forceUpdate()
        },
        buscaItemProjeto (item) {
          let itemDoProjeto = this.propsValidacao.counterpartRequest.project.projectItems.filter(itemProjeto => {
            return itemProjeto.item.code === item.item.code
          }, 0)
          return itemDoProjeto[0]
        }
      }
    }
</script>

<style scoped>

</style>
