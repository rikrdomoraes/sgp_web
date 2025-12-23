<template>
  <div class="box-body" style="overflow: auto" >
    <div class="row">
      <div class="col-md-12 financial-physical-schedule" style="min-width: 1155px" >
        <table class="table table-condensed table-striped table-bordered">
          <thead>
          <tr>
            <th v-if="proposta.proposalPhase !== 'ANALISE' && proposta.proposalPhase !== 'PENDENTE_EM_ANALISE'" colspan="4" style="width: 50%"  class="ng-scope">Atividade</th>
            <th v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'" colspan="5" style="width: 50%"  class="ng-scope">Atividade</th>
            <th colspan="2" class="text-center">Período</th>
            <th colspan="3" class="text-center">Total</th>
            <th>Ações</th>
          </tr>
          </thead>
          <tbody>

          <!--Tabela item-->
          <template v-for="(objetivo) in propsObjetivos">
            <template v-for="(meta) in objetivo.goals"  role="row" class>
              <template v-for="(atividade, atividadeIndex) of meta.activities" >
                <tr style="background-color: rgb(223, 228, 235);" class="ng-scope">
                  <td :colspan="proposta.proposalPhase === 'ANALISE' ? 5 : 4" class="ng-binding ng-scope">{{atividade.name}}</td>
                  <td class="text-center ng-binding">{{atividade.startPeriod}}</td>
                  <td class="text-center ng-binding">{{atividade.finalPeriod}}</td>
                  <td colspan="3" class="text-right ng-binding">{{somaTotal(atividade.items) | real}}</td>
                  <td class="ng-scope">
                    <button :disable="bloqueiaBotoes"
                            @click="addItem(atividade)"
                            type="button"
                            class="btn btn-primary btn-sm btn-flat"
                            id="financial-physical-activity-0">
                      <i class="fa fa-plus-circle"  aria-hidden="true"></i> Adicionar
                    </button>
                  </td>
                </tr>
                <tr v-if="_.has(atividade, 'items') && atividade.items.length > 0" style="background-color:#ECF0F5; font-weight:bold;" class="ng-scope">
                  <th>Recurso</th>
                  <th v-if="proposta.proposalPhase !== 'PRE_ANALISE'">Adiantável</th>
                  <th>Tipo</th>
                  <th>Item</th>
                  <th style="width: 15%;">Descrição Item</th>
                  <th v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'" style="width: 15%;">Conta Financeira</th>
                  <th style="min-width: 55px;" class="text-center">Início</th>
                  <th style="min-width: 55px;" class="text-center">Fim</th>
                  <th class="text-center">Quantidade</th>
                  <th>Valor Unitário</th>
                  <th>Valor Total</th>
                  <th>Ações</th>
                </tr>
                <tr v-for="(item, itemIndex) in atividade.items"  prefix="activityItem" suffix="item.id" row="item" class="ng-scope" style="">
                  <template v-if="!item.editando">
                    <td>
                    <span v-if="item.resourceSource === 'FUNDACAO'">
                      Fundação
                    </span>
                      <span v-else-if="item.resourceSource === 'CONTRAPARTIDA'">
                      Contrapartida
                    </span>
                      <span v-else>
                      {{item.resourceSource}}
                    </span>
                    </td>
                    <!--<td class="ng-binding">{{item.foreseeable}}</td>-->
                    <td v-if="proposta.proposalPhase !== 'PRE_ANALISE'" class="ng-binding"><span v-if="item.foreseeable == 'false' || item.foreseeable == false || item.resourceSource === 'CONTRAPARTIDA'">Não</span><span v-else>Sim</span></td>
                    <td class="ng-binding">{{item.item.type}}</td>
                    <td class="ng-binding">{{item.item.code + '/' + item.item.description}}</td>
                    <td class="ng-binding">{{item.itemDescription}}</td>
                    <td v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'" class="ng-binding">{{item.financialAccount}} - {{item.financialAccountDescription}}</td>

                    <td class="text-center ng-binding">{{item.startPeriod}}</td>
                    <td class="text-center ng-binding">{{item.finalPeriod}}</td>
                    <td class="text-center ng-binding">{{item.quantity}}</td>
                    <td class="text-center ng-binding">{{item.unitaryValue | real}}</td>
                    <td class="text-center ng-binding">{{item.totalValue | real}}</td>
                    <td>
                      <i class="fa fa-edit disabled" @click="bloqueiaBotoes ? null : editaItem(atividade, atividadeIndex, item, itemIndex)" style="margin-left:5px" id="financial-physical-edit-item-0"></i>
                      <i class="fa fa-trash ng-scope"  @click="bloqueiaBotoes ? null : deleteItem(atividade, itemIndex)" style="margin-left:5px" id="financial-physical-delete-item-0"></i>
                    </td>
                  </template>
                  <!--Formulario de item-->
                  <template v-if="item.editando">
                    <td colspan="10" style="padding:0 15px; margin-bottom:10px;">
                      <div class="box-header with-border">
                        <h3 class="box-title" style="color: cornflowerblue"> {{itemForm.itemDescription}}</h3>
                      </div>
                      <div style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">

                        <div class="row">
                          <!-- Recurso -->
                          <div class="form-group required col-md-6"
                               :class="{ 'has-error' : errors.first('recurso')}">
                            <label class="control-label col-md-4">Recurso:</label>
                            <div class="col-md-8">
                              <select v-model="itemForm.resourceSource" name="recurso" aria-label="recurso" class="form-control" v-validate="'required'">
                                <option value="FUNDACAO">Fundação</option>
                                <option value="CONTRAPARTIDA">Contrapartida</option>
                                <option value="PARCEIRO_ESTRATEGICO">P.Estratégico</option>
                              </select>
                              <span v-if="errors.first('recurso')" class="label label-danger"> {{ errors.first('recurso') }}</span>
                            </div>
                          </div>

                          <!-- Adiantavel -->
                          <div v-if="proposta.proposalPhase === 'ANALISE'" class="form-group required col-md-6"
                               :class="{ 'has-error' : errors.first('adiantavel')}">
                            <label class="control-label col-md-4">Adiantável:</label>
                            <div class="col-md-8">
                              <select :disabled="itemForm.resourceSource === 'CONTRAPARTIDA'"
                                      v-model="itemForm.foreseeable" name="adiantavel"
                                      class="form-control" required
                                      v-validate="'required'">
                                <option value="false">Não</option>
                                <option value="true">Sim</option>
                              </select>
                              <span v-if="errors.first('adiantavel')" class="label label-danger"> {{ errors.first('adiantavel') }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <!-- Tipo -->
                          <div class="form-group required col-md-6"
                               :class="{ 'has-error' : errors.first('tipo do recurso')}">
                            <label class="control-label col-md-4">Tipo:</label>
                            <div class="col-md-8">
                              <div>
                                <select v-model="itemForm.item.type" name="tipo do recurso" aria-label="tipo recurso" class="form-control"
                                        @change="buscaItems" v-validate="'required'">
                                  <option value="PRODUTO">Produto</option>
                                  <option value="SERVICO">Serviço</option>
                                </select>
                              </div>
                              <span v-if="errors.first('tipo do recurso')" class="label label-danger"> {{ errors.first('tipo do recurso') }}</span>
                            </div>
                          </div>

                          <!-- item -->
                          <div class="form-group required col-md-6"
                               :class="{ 'has-error' : errors.first('item')}">
                            <label class="control-label col-md-4">Item:</label>
                            <div class="col-md-8">
                              <div approval="finPhySchFormCtrl.approval" state="finPhySchFormCtrl.approvalState">
                                <multiselect name="item" :custom-label="itemCodigo" v-model="itemForm.item" :options="items" :close-on-select='true' :hide-selected="true" :preserve-search="false" placeholder="Escolha um item" label="description" track-by="code" :preselect-first="true"
                                             v-validate="'required'" @open="buscaItems">
                                  <template slot="option" slot-scope="props">
                                    <div class="option__desc"><span class="option__title">{{ props.option.code }} / {{ props.option.description }}</span></div>
                                  </template>
                                </multiselect>

                              </div>
                              <span v-if="errors.first('item')" class="label label-danger"> {{ errors.first('item') }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <!-- Descrição Item -->
                          <div class="form-group required col-md-6"
                               :class="{ 'has-error' : errors.first('descrição item')}">
                            <label class="control-label col-md-4">Descrição Item:</label>
                            <div class="col-md-8">
                              <div>
                                <input type="text" v-model="itemForm.itemDescription" name="descrição item" maxlength="255" aria-label="Descrição do item"
                                       class="form-control" v-validate="'required'"/>
                              </div>
                              <span v-if="errors.first('descrição item')" class="label label-danger"> {{ errors.first('descrição item') }}</span>
                            </div>
                          </div>

                          <!-- Conta Financeira-->
                          <!--Monstra somente na fase de analise-->
                          <div v-if="proposta.proposalPhase === 'ANALISE' || proposta.proposalPhase === 'PENDENTE_EM_ANALISE'" class="form-group required col-md-6"
                               :class="{ 'has-error' : errors.first('conta financeira')}">
                            <label class="control-label col-md-4">Conta Financeira:</label>
                            <div class="col-md-8">
                              <multiselect name="conta financeira" :custom-label="itemCodigo" v-model="financialAccountObject"
                                           :options="contasFinanceiras" :close-on-select='true' :hide-selected="true" :preserve-search="false"
                                           placeholder="Escolha um item" label="description" track-by="code" :preselect-first="false" @select="selecionaConta" @close="delete this.itemForm.financialAccountObject"
                                           v-validate="'required'">
                                <template slot="option" slot-scope="props">
                                  <div class="option__desc"><span class="option__title">{{ props.option.code }} / {{ props.option.description }}</span></div>
                                </template>
                              </multiselect>
                              <span v-if="errors.first('conta financeira')" class="label label-danger"> {{ errors.first('conta financeira') }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <!-- Início -->
                          <div class="form-group required col-md-6"
                               :class="{ 'has-error' : errors.first('inicio')}">
                            <label class="control-label col-md-4">Início:</label>
                            <div class="col-md-8">
                              <div>
                                <input type="number" v-model="itemForm.startPeriod" name="inicio" maxlength="2" aria-label="Inicio do período"
                                       class="form-control text-right" :min="atividade.startPeriod" :max="atividade.finalPeriod"
                                       ng-change="finPhySchFormCtrl.onChangePeriod(finPhySchForm.startPeriod, finPhySchForm.finalPeriod)"
                                       v-validate="'required'"/>
                              </div>
                              <span v-if="errors.first('inicio')" class="label label-danger"> {{ errors.first('inicio') }}</span>
                            </div>
                          </div>

                          <!-- finalPeriod -->
                          <div class="form-group required col-md-6"
                               :class="{ 'has-error' : errors.first('fim')}">
                            <label class="control-label col-md-4">Fim:</label>
                            <div class="col-md-8">
                              <div>
                                <input type="number" v-model="itemForm.finalPeriod" name="fim" maxlength="2" aria-label="Fim do período"
                                       class="form-control text-right" :min="atividade.startPeriod" :max="atividade.finalPeriod"
                                       v-validate="'required'"/>
                              </div>
                              <span v-if="errors.first('fim')" class="label label-danger"> {{ errors.first('fim') }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <!-- quantity -->
                          <div class="form-group required col-md-6"
                               :class="{ 'has-error' : errors.first('quantidade')}">
                            <label class="control-label col-md-4">Quantidade:</label>
                            <div class="col-md-8">
                              <div>
                                <input type="number" v-model="itemForm.quantity" name="quantidade" min="1" maxlength="6" aria-label="Quantidade do recurso"
                                       class="form-control text-right" v-validate="'required'" @change="valorTotal(itemForm)"/>
                              </div>
                              <span v-if="errors.first('quantidade')" class="label label-danger"> {{ errors.first('quantidade') }}</span>
                            </div>
                          </div>

                          <!-- unitaryValue -->
                          <div class="form-group required col-md-6"
                               :class="{ 'has-error' : errors.first('valor unitario')}">
                            <label class="control-label col-md-4">Valor Unitário:</label>
                            <div class="col-md-8">
                              <div>
                                <money v-model="itemForm.unitaryValue" class="form-control text-right" name="valor unitario"
                                       v-validate="'required|min_value:1'" @change="valorTotal(itemForm)"></money>
                                <!--<input type="number" v-model="item.unitaryValue" class="form-control text-right" name="valor unitario"-->
                                <!--v-validate="'required|max:25'" maxlength="25">-->
                              </div>
                              <span v-if="errors.first('valor unitario')" class="label label-danger"> {{ errors.first('valor unitario') }}</span>
                            </div>
                          </div>
                        </div>
                        <!-- buttons -->
                        <div class="form-group" style="margin-bottom:0">
                          <div class="col-md-8 col-md-offset-4">
                            <button @click="onAdd(atividade, item, itemIndex)" type="button"
                                    class="btn btn-primary btn-flat" id="financial-physical-save-item">
                              <i class="fa fa-check" aria-hidden="true"></i> Ok
                            </button>
                            <span @click.once="cancelaItem(atividade, item, itemIndex)" type="button"
                                  class="btn btn-default btn-flat" id="financial-physical-cancel-item">
                            <i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar
                          </span>
                          </div>
                        </div>

                      </div> <!-- /form -->
                    </td>
                  </template>
                </tr>
              </template>
            </template>
          </template>


          </tbody>
          <tfoot style="font-weight: bold">

          <tr ng-if="finPhySchFormCtrl.showApprovalField != 'TRUE'" class="ng-scope">
            <td colspan="6">Total Fundação</td>
            <td colspan="3" class="text-right ng-binding" style="border-left: none;">{{totalFundacao() | real}}</td>
            <td></td>
          </tr><!-- end ngIf: finPhySchFormCtrl.showApprovalField != 'TRUE' -->
          <!-- ngIf: finPhySchFormCtrl.showApprovalField != 'TRUE' && finPhySchFormCtrl.approvalState == 'APPROVER_TYPE' || finPhySchFormCtrl.approvalState == 'VIEW_TYPE' -->
          <!-- ngIf: finPhySchFormCtrl.showApprovalField != 'TRUE' --><tr ng-if="finPhySchFormCtrl.showApprovalField != 'TRUE'" class="ng-scope">
            <td colspan="6">Total Contrapartida</td>
            <td colspan="3" class="text-right ng-binding" style="border-left: none;">{{totalContraPartida() | real}}</td>
            <td></td>
          </tr><!-- end ngIf: finPhySchFormCtrl.showApprovalField != 'TRUE' -->
          <!-- ngIf: finPhySchFormCtrl.showApprovalField != 'TRUE' --><tr ng-if="finPhySchFormCtrl.showApprovalField != 'TRUE'" class="ng-scope">
            <td colspan="6">Total do Projeto</td>
            <td colspan="3" class="text-right ng-binding">{{totalFundacao() + totalContraPartida() | real}}</td>
            <td></td>
          </tr><!-- end ngIf: finPhySchFormCtrl.showApprovalField != 'TRUE' -->
          </tfoot>
        </table>
      </div>
    </div>
  </div>



</template>

<script>
  const itemFormOrigial = {
    balance: null,
    createdAt: null,
    finalPeriod: null,
    financialBalance: null,
    foreseeable: null,
    id: null,
    item: {
      code: null,
      description: null,
      measureUnit: null,
      status: null,
      type: null
    },
    itemDescription: null,
    quantity: null,
    resourceSource: null,
    startPeriod: null,
    totalValue: null,
    unitaryValue: 0,
    updatedAt: null
  }
  export default {
    name: 'cronogramaOld',
    data () {
      return {
        showForm: false,
        bloqueiaBotoes: false, // Bloqueia botões quando estiver editando
        financialAccountObject: {},
        objetivos: [],
        atividade: {},
        itemForm: {
          item: [],
          foreseeable: null
        },
        componentKey: 0,
        itemTabela: {},
        items: [],
        formasContratacao: [],
        contasFinanceiras: [],
        editando: false,
        adicionando: false,
        // atividades: [],
        atividadeTabela: {}, // Guarda o valor do objeto atividade antes da edição
        rules: `required|min_value:1|max_value:${this.meses}`
      }
    },
    props: {
      propsObjetivos: {
        type: Array,
        default: function () {
          return []
        }
      },
      atividades: {
        type: Array,
        default: function () {
          return []
        }
      },
      proposta: Object,
      meses: Number,
      projetoDuplicacao: Number},
    computed: {
      valorTotal (itemForm) {
        itemForm.itemForm.totalValue = itemForm.itemForm.quantity * itemForm.itemForm.unitaryValue
        return itemForm.itemForm
      }
    },
    watch: {
      propsObjetivos () { // Observa o objeto caso ele altere. envia um emit para atualizar o objeto pai
        // this.$emit('itemAdicionado', this.propsObjetivos)
      },
      valorTotal (itemForm) {
        itemForm.itemForm.totalValue = itemForm.itemForm.quantity * itemForm.itemForm.unitaryValue
        return itemForm.itemForm
      },
      projetoDuplicacao () {
        this.buscaContasFinanceiras()
      },
      meses () {
      },
      atividades () {
        this.componentKey += 1
        // this.$forceUpdate()
      }
    },
    created: function () {
      // this.table.items = this.atividades
      this.buscaContasFinanceiras()
    },
    methods: {
      itemCodigo ({code, description}) {
        return `${code} / ${description}`
      },
      buscaItems () {
        this.items = []
        if (Object.keys(this.itemForm.item).length > 0) {
          axios.post('/proxy/project/items', {type: this.itemForm.item.type, filter: ''}).then((response) => {
            this.items = response.data.value
            // this.itemForm.item = {}
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      },
      buscaContasFinanceiras () {
        if (this.projetoDuplicacao) {
          axios.get('proxy/project/financial-accounts/' + this.projetoDuplicacao).then((response) => {
            this.contasFinanceiras = response.data.value
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      },
      cancelaItem (atividade, item, itemIndex) {
        if (this.editando !== true) {
          atividade.items.pop()
        }
        this.itemForm = Object.assign({}, itemFormOrigial)
        this.itemTabela = {}
        this.editando = false
        item.editando = false
        this.bloqueiaBotoes = false
        // this.$forceUpdate()
      },
      onAdd (atividade, item, itemIndex) {
        if (item.item.type === null) {
          this.$validator.errors.add('item', 'item não prenchido') // Adiciona erro no errobag
        } else {
          this.$validator.errors.remove('item', 'item não prenchido') // Retira erro no errobag
        }
        this.$validator.validateAll().then((result) => {
          if (result) {
            // Se estiver NÃO estiver em forma de edição então adiciona na tabela
            if (this.editando === true) {
              // aqui copia todos os atributos que esta no formulário para objeto atividade que esta dentro dos items
              // de outra forma iria só apontar para endereço de memória e
              // não é isso que queremos queremos mesmo copiar os atributos para o objeto já existente
              for (let i in this.itemForm) this.itemTabela[i] = this.itemForm[i]
            } else {
              atividade.items.pop()
              let item = Object.assign({}, this.itemForm)
              item.editando = false
              atividade.items.push(item) // adiciona nova atividade na item escolhida
            }
            this.itemForm = Object.assign({}, itemFormOrigial)
            this.itemTabela = {}
            this.editando = false
            item.editando = false
            this.bloqueiaBotoes = false
            // this.$emit('itemAdicionado', this.propsObjetivos)
            this.$forceUpdate()
          }
        })
      },
      exclui (meta, atividadeIndex) {
        meta.activities.splice(atividadeIndex, 1) // retira a meta selecionada do array goals do objetivo específico
      },
      somaTotal (items) {
        if (items.length > 0) {
          return items.reduce((total, item) => {
            return total + item.totalValue
          }, 0)
        }
      },
      totalFundacao () {
        let totalFundacao = 0
        this.atividades.forEach((atividade) => {
          atividade.items.forEach((item) => {
            if (item.resourceSource === 'FUNDACAO') {
              totalFundacao = totalFundacao + item.totalValue
            }
          })
        })
        return totalFundacao
      },
      totalContraPartida () {
        let totalContraPartida = 0
        this.atividades.forEach((atividade) => {
          atividade.items.forEach((item) => {
            if (item.resourceSource === 'CONTRAPARTIDA') {
              totalContraPartida = totalContraPartida + item.totalValue
            }
          })
        })
        return totalContraPartida
      },
      editaItem (atividade, atividadeIndex, item, itemIndex) {
        this.itemForm = Object.assign({}, item)
        this.financialAccountObject = this.contasFinanceiras.find(conta => conta.code === this.itemForm.financialAccount)
        this.itemTabela = item
        item.editando = true
        this.editando = true
        this.bloqueiaBotoes = true
        this.$forceUpdate() // Força Vue a render o componente inteiro
      },
      addItem (atividade) {
        this.itemForm = Object.assign({}, itemFormOrigial)
        this.itemForm.editando = true
        atividade.items.push(Object.assign({}, this.itemForm))
      },
      deleteItem (atividade, itemIndex) {
        atividade.items.splice(itemIndex, 1)
      },
      selecionaConta (conta) {
        this.itemForm.financialAccount = conta.code
        this.itemForm.financialAccountDescription = conta.description
      }
    }
  }
</script>

<style>
  .multiselect, .multiselect__input, .multiselect__single {
    font-size: 14px !important;
  }

</style>
