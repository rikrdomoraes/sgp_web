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
              <th v-if="propsValidacao.discriminatorValue === 'PAYMENT_APPROVAL'">Tipo</th>
              <th>Quantidade</th>
              <th>Valor Total</th>
              <th>Quantidade a solicitar</th>

              <!-- Titulos referentes ao campo 'quantityRequest' -->
              <th>Valor a solicitar</th>
              <!--<th v-if="finPhySchSolCtrl.solicitation == 'COUNTERPART'">Economicidade</th>-->

              <th>Quantidade a comprovar</th>

              <!-- Titulos referentes ao campo 'quantityProve' -->
              <th>Valor a comprovar</th>
              <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in propsNota.receiptItems">
              <td>{{item.item.description}}</td>
              <td v-if="propsValidacao.discriminatorValue === 'PAYMENT_APPROVAL'">{{item.item.type}}</td>
              <td class="text-center">{{buscaItemProjeto(item).quantity}}</td>
              <td class="text-center">{{buscaItemProjeto(item).totalValue | real}}</td>
              <td v-if="item.editing === false || !item.editing" class="text-center">{{item.quantity}}</td>
              <td v-if="item.editing === true" class="text-center"> <input v-model="item.quantity" name="quantidade a solicitar" class="form-control text-right" type="text">
              </td>
              <td v-if="item.editing === false || !item.editing" class="text-center">{{item.totalValue | real}}</td>
              <td v-if="item.editing === true" class="text-center"><money v-model="item.totalValue" name="quantidade a solicitar" class="form-control text-right" type="text"></money>
              </td>
              <td class="text-center">{{buscaItemProjeto(item).quantity - buscaItemProjeto(item).quantityRequested}}</td>
              <td class="text-center">{{buscaItemProjeto(item).totalValue - buscaItemProjeto(item).totalValueRequested | real}}</td>
              <td class="text-center">
                <i v-if="item.editing === false || !item.editing" class="fa fa-edit" @click="editItem(item)" style="margin-left:5px"></i>
                <i v-if="item.editing === true" class="fa fa-check" @click="editItem(item)" style="color: green; margin-left: 5px; cursor: pointer;"></i>
              </td>

              <!--<td ng-if="!item.edit" class="text-right">{{item.quantityRequest}}</td>-->
              <!--<td ng-if="!item.edit" class="text-right">{{item.valueRequest | currency}}</td>-->

              <!--&lt;!&ndash; Edição da quantidade&ndash;&gt;-->
              <!--<td ng-if="item.edit" class="text-right">-->
                <!--<div class="input-group" :class="{ 'has-error' : errors.first('dataInicial')}">-->
                  <!--<div name="{{'receipt.'+finPhySchSolCtrl.receipt.id+'.quantityRequest.'+item.id}}">-->
                    <!--<input type="text" ng-model="finPhySchSolCtrl.requestItem.quantityRequest" class="form-control text-right" name="quantityRequest"-->
                           <!--aria-label="Quantidade a solicitar"-->
                           <!--v-validate="'required'">-->
                  <!--</div>-->
                <!--</div>-->
              <!--</td>-->

              <!--<td ng-if="item.edit" class="text-right">-->
                <!--<div class="input-group"  ng-class="{'has-error': finPhySchSolicForm.$submitted && finPhySchSolicForm.valueRequest.$invalid}">-->
                  <!--<ssm-approval-validation name="{{'receipt.'+finPhySchSolCtrl.receipt.id+'.valueRequest.'+item.id}}" approval="finPhySchSolCtrl.approval" state="finPhySchSolCtrl.approvalState">-->
                    <!--<input type="text" ng-model="finPhySchSolCtrl.requestItem.valueRequest" class="form-control text-right" name="valueRequest"-->
                           <!--ui-number-mask="2" min="{{finPhySchSolCtrl.minValue}}" max="{{finPhySchSolCtrl.requestItem.balanceValue}}"-->
                           <!--ng-change="finPhySchSolCtrl.onChangeValueRequest(finPhySchSolCtrl.requestItem)" required>-->
                  <!--</ssm-approval-validation>-->
                <!--</div>-->
              <!--</td>-->


              <!--<td ng-if="finPhySchSolCtrl.solicitation == 'COUNTERPART'" class="text-center">-->
                <!--<label class="checkbox-inline new-control new-control-checkbox" style="margin-bottom: 10px;">-->
                  <!--<input ng-disabled="finPhySchSolCtrl.approvalState != 'APPROVER_TYPE'" type="checkbox"  ng-model="item.economicity">-->
                  <!--<div class="new-control-indicator"></div>-->
                <!--</label>-->
              <!--</td>-->

              <!--<td ng-if="!item.edit" class="text-right">{{item.quantityProve }}</td>-->
              <!--<td ng-if="!item.edit" class="text-right">{{item.valueProve | currency}}</td>-->

              <!--<td ng-if="item.edit" class="text-right">{{finPhySchSolCtrl.requestItem.quantityProve}}</td>-->
              <!--<td ng-if="item.edit" class="text-right">{{finPhySchSolCtrl.requestItem.valueProve | currency}}</td>-->

              <!--<td class="text-center">-->
                <!--<i class="fa fa-edit" ng-click="finPhySchSolCtrl.editItem(item)" style="margin-left:5px"-->
                   <!--ng-show="!finPhySchSolCtrl.editing && !item.edit && !item.economicity && finPhySchSolCtrl.approvalState != 'VIEW_TYPE'"></i>-->
                <!--<i class="fa fa-edit" uib-tooltip="Já existe um item em edição" style="color: #9E9E9E;margin-left:5px"-->
                   <!--ng-show="finPhySchSolCtrl.editing && !item.edit && !item.economicity && finPhySchSolCtrl.approvalState != 'VIEW_TYPE'"></i>-->
<!---->
                <!--<i class="fa fa-check" ng-click="finPhySchSolCtrl.saveItem(finPhySchSolicForm, item)" style="color: green; margin-left:5px"-->
                   <!--ng-show="item.edit  && finPhySchSolCtrl.approvalState != 'VIEW_TYPE'"></i>-->
                <!--<i class="fa fa-times" ng-click="finPhySchSolCtrl.cancelItem(item)"  style="color: red;margin-left:5px"-->
                   <!--ng-show="item.edit  && finPhySchSolCtrl.approvalState != 'VIEW_TYPE'"></i>-->
              <!--</td>-->
            </tr>
            </tbody>
            <tfoot style="font-weight: bold;">
            <tr v-if="propsValidacao.discriminatorValue === 'PAYMENT_APPROVAL'">
              <td colspan="4" style="border-right: none;">Valor total de recursos do beneficiário: </td>
              <td colspan="4" class="text-right" style="border-left: none;">{{valorTotalRecursosBeneficiario| real}}</td>
              <td></td>
            </tr>
            <tr v-if="propsValidacao.discriminatorValue === 'PAYMENT_APPROVAL'">
              <td colspan="4" style="border-right: none;">Valor total da solicitação:	</td>
              <td colspan="4" class="text-right" style="border-left: none;">{{valorTotalSolicitacao| real}}</td>
              <td></td>
            </tr>
            <tr v-if="propsValidacao.discriminatorValue === 'PAYMENT_APPROVAL'">
              <td colspan="4" style="border-right: none;">Saldo financeiro do projeto:	</td>
              <td colspan="4" class="text-right" style="border-left: none;">{{saldoFinanceiroProjeto | real}}</td>
              <td></td>
            </tr>
            </tfoot>
          </table>




          <!--<b-container fluid>-->
            <!--&lt;!&ndash; Main table element &ndash;&gt;-->
            <!--<b-table show-empty-->
                     <!--striped-->
                     <!--stacked="md"-->
                     <!--:bordered="table.bordered"-->
                     <!--:items="table.items"-->
                     <!--:fields="table.fields"-->
                     <!--:filter="table.filter"-->
                     <!--:current-page="table.currentPage"-->
                     <!--:per-page="table.perPage"-->
                     <!--:sort-by.sync="table.sortBy"-->
                     <!--:sort-desc.sync="table.sortDesc"-->
                     <!--empty-text="Nenhum registro encontrado"-->
            <!--&gt;-->
              <!--<template slot="createdAt" scope="row">{{row.value | moment("L")}}</template>-->
              <!--<template slot="item" scope="row">{{row.item.item.description}}</template>-->
              <!--<template slot="type" scope="row">{{row.item.item.type}}</template>-->
              <!--<template slot="totalValue" scope="row">{{row.value | real}}</template>-->
              <!--<template slot="quantidadeTotal" scope="row">{{buscaItemProjeto(row.item).quantity}}</template>-->
              <!--<template slot="valorTotal" scope="row">{{buscaItemProjeto(row.item).totalValue | real}}</template>-->
              <!--<template slot="quantidadeComprovar" scope="row">{{buscaItemProjeto(row.item).quantity - buscaItemProjeto(row.item).quantityRequested}}</template>-->
              <!--<template slot="valorComprovar" scope="row">{{buscaItemProjeto(row.item).totalValue - buscaItemProjeto(row.item).totalValueRequested | real}}</template>-->
              <!--<template slot="actions" scope="row">-->
                <!--<div>-->
                  <!--<i class="fa fa-edit" @click="editItem(row.item)" style="margin-left:5px"-->
                     <!--ng-show="!finPhySchSolCtrl.editing && !item.edit && !item.economicity && finPhySchSolCtrl.approvalState != 'VIEW_TYPE'"></i>-->
                <!--</div>-->
              <!--</template>-->
            <!--</b-table>-->
          <!--</b-container>-->

        </div>
      </div>

      <!--<div v-if="propsValidacao.discriminatorValue === 'PAYMENT_APPROVAL'" class="row" style="overflow:auto;">-->
        <!--<div class="col-md-12 financial-physical-schedule">-->

          <!--<table class="table table-condensed table-striped table-bordered" style="min-width=750px">-->
            <!--<thead>-->
            <!--<tr>-->
              <!--<th>Recurso</th>-->
              <!--<th>Fase</th>-->
              <!--<th>Valor total da fase</th>-->
              <!--<th>Valor total de adiantamento por fase</th>-->
              <!--<th>Valor total já adiantado</th>-->
              <!--<th>Saldo de adiantamento restante por fase</th>-->
            <!--</tr>-->
            <!--</thead>-->
            <!--<tbody>-->
            <!--<tr v-for="resource in resources" ng-show="finPhySchSolCtrl.showItem(resource)">-->
              <!--<td>{{resource.resourceSource=='FUNDACAO' ? 'Fundação' : 'Parceiro Estratégico'}}</td>-->
              <!--<td class="text-right">{{resource.resourceSource=='FUNDACAO' ? 1 : 5}}</td>-->
              <!--<td class="text-right">{{resource.totalValue | currency}}</td>-->
              <!--<td class="text-right">{{resource.totalValueAdvance | currency}}</td>-->
              <!--<td class="text-right">{{resource.totalValueAdvanceRequested | currency}}</td>-->
              <!--<td class="text-right">{{(resource.totalValueAdvance - resource.totalValueAdvanceRequested) | currency}}</td>-->
            <!--</tr>-->
            <!--</tbody>-->

          <!--</table>-->

        <!--</div>-->
      <!--</div>-->


    </div> <!-- ./box-body -->
  </div> <!-- ./box -->

</template>

<script>
    export default {
      name: 'cronograma-solicitacao',
      data () {
        return {
          table: {
            items: [],
            totalRows: 0,
            filter: null,
            hover: true,
            bordered: true,
            currentPage: 1,
            sortBy: 'createdAt',
            sortDesc: true,
            perPage: 10,
            fields: [
              { key: 'item', label: 'Item', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'type', label: 'Tipo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'quantidadeTotal', label: 'Quantidade Total', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'valorTotal', label: 'Valor Total', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'quantity', label: 'Quantidade a solicitar', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'totalValue', label: 'Valor a solicitar', thStyle: 'text-align: center', class: 'text-center' },
              { key: 'quantidadeComprovar', label: 'Quantidade a comprovar', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'valorComprovar', label: 'Valor a comprovar', thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
            ]
          },
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
        valorTotalRecursosBeneficiario () {
          let total = 0
          if (this.propsValidacao.paymentRequest) {
            this.propsValidacao.paymentRequest.project.projectItems.forEach(item => {
              if (this.codeItemsNota.includes(item.item.code)) {
                total += item.totalValue
                this.itemsProjetoIgualNota.push(item)
              }
            })
          }
          return total
        }
      },
      watch: {
        propsNota () {
          this.table.items = this.propsNota.receiptItems
        }
      },
      mounted () {
        if (this.propsNota.receiptItems && this.propsNota.receiptItems.length > 0) {
          this.table.items = this.propsNota.receiptItems
        }
      },
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
          let itemDoProjeto = this.propsValidacao.paymentRequest.project.projectItems.filter(itemProjeto => {
            return itemProjeto.item.code === item.item.code
          }, 0)
          return itemDoProjeto[0]
        }
      }
    }
</script>

<style scoped>

</style>
