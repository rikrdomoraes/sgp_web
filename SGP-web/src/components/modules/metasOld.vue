<template>
  <div class="box-body">
    <!-- grid -->
    <div v-show="showgrid">
      <div class="row" ng-show="$ctrl.isNewAvaiable()">
        <div class="col-md-12">
          <button @click="showgrid = !showgrid" tooltip="Adiciona um público alvo" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova Meta</button>
        </div>
      </div>
      <br>
      <!--tabela-->
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <!--<b-container fluid>-->
            <!--&lt;!&ndash; Main table element &ndash;&gt;-->
            <!--<b-table show-empty-->
            <!--stacked="md"-->
            <!--:bordered="table.bordered"-->
            <!--:items="table.items"-->
            <!--:hover="table.hover"-->
            <!--:fields="table.fields"-->
            <!--:filter="table.filter"-->
            <!--:current-page="table.currentPage"-->
            <!--:per-page="table.perPage"-->
            <!--:sort-by.sync="table.sortBy"-->
            <!--:sort-desc.sync="table.sortDesc"-->
            <!--empty-text="Nenhum registro encontrado"-->
            <!--&gt;-->
            <!--<template slot="actions" scope="row">-->
            <!--<div>-->
            <!--<b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">-->
            <!--{{ row.detailsShowing ? 'Hide' : 'Show'}} Details-->
            <!--</b-button>-->
            <!--</div>-->
            <!--</template>-->
            <!--<template slot="row-details" slot-scope="row">-->
            <!--<b-card>-->
            <!--<ul>-->
            <!--<table class="table b-table table-hover table-bordered b-table-stacked-md">-->
            <!--<tbody role="rowgroup">-->
            <!--<tr v-for="(meta) in row.item.goals" :key="key" role="row" class="b-table-has-details">-->
            <!--<td role="cell"> </td>-->
            <!--<td role="cell" class="text-center">{{meta.description}}</td>-->
            <!--<td role="cell" class="text-center">{{meta.measurementUnit}}</td>-->
            <!--<td role="cell">{{meta.quantity}}</td>-->
            <!--<td role="cell">{{meta.duration}}</td>-->
            <!--<td role="cell">{{meta.performanceIndicators}}</td>-->
            <!--<td role="cell"><b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>-->
            <!--<b-button type="button" :disabled="false" @click.stop="exclui(row)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>-->
            <!--</td>-->
            <!--</tr>-->
            <!--</tbody>-->
            <!--</table>-->
            <!--</ul>-->
            <!--</b-card>-->
            <!--</template>-->
            <!--</b-table>-->
            <!--</b-container>-->
            <table role="table" aria-busy="false" aria-colcount="7" aria-rowcount="-1" class="table b-table table-hover table-bordered b-table-stacked-md">
              <!----><!---->
              <thead class="">
              <tr>
                <th tabindex="0" aria-colindex="1"  class="sorting text-center" style="text-align: center;">Objetivo</th>
                <th tabindex="0" aria-colindex="2"  class="sorting text-center" style="text-align: center;">Meta do Projeto</th>
                <th tabindex="0" aria-colindex="3"  class="sorting text-center" style="text-align: center;">Meta Orçada</th>
                <th tabindex="0" aria-colindex="4"  class="sorting text-center" style="text-align: center;">Unidade de medida</th>
                <th tabindex="0" aria-colindex="5"  class="sorting text-center" style="text-align: center;">Duração</th>
                <th tabindex="0" aria-colindex="6"  class="sorting text-center" style="text-align: center;">Indicador</th>
                <th aria-colindex="7" class="text-center" style="text-align: center; width: 13%;">Ações</th>
              </tr>
              </thead>

              <tbody role="rowgroup" class="">
              <template v-for="(objetivo, objetivoIndex) in propsObjetivos">
                <tr v-for="(meta, metaIndex) in objetivo.goals"  role="row" class>
                  <td aria-colindex="1" data-label="Objetivo" role="cell" class="text-center">
                    <div >
                      {{objetivo.description}}
                    </div>
                  </td>
                  <td aria-colindex="2" data-label="Meta do Projeto" role="cell" class="text-center">
                    <div>
                      {{meta.description}}
                    </div>
                  </td>
                  <td aria-colindex="3" data-label="Meta Orçada" role="cell" class="text-center">
                    <div>
                      {{meta.quantity}}
                    </div>
                  </td>
                  <td aria-colindex="4" data-label="Meta Orçada" role="cell" class="text-center">
                    <div>
                      {{meta.measurementUnit}}
                    </div>
                  </td>
                  <td aria-colindex="5" data-label="Meta Orçada" role="cell" class="text-center">
                    <div>
                      {{meta.duration}}
                    </div>
                  </td>
                  <td aria-colindex="6" data-label="Meta Orçada" role="cell" class="text-center">
                    <div>
                      {{meta.performanceIndicators}}
                    </div>
                  </td>
                  <td aria-colindex="6" data-label="Meta Orçada" role="cell" class="text-center">
                    <div>
                      <button type="button" :disabled="false" @click.stop="edita(objetivoIndex, meta)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</button>
                      <button type="button" :disabled="false" @click.stop="exclui(objetivo, metaIndex)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</button>
                    </div>
                  </td>
                </tr>
              </template>
              <!--<tr aria-rowindex="1" role="row" class="">-->
              <!--<td aria-colindex="1" data-label="Objetivo" role="cell" class="text-center"><div>Não informado</div></td><td aria-colindex="2" data-label="Meta do Projeto" role="cell" class="text-center"><div></div></td><td aria-colindex="3" data-label="Meta Orçada" role="cell" class="text-center"><div></div></td><td aria-colindex="4" data-label="Unidade de medida" role="cell" class="text-center"><div></div></td><td aria-colindex="5" data-label="Duração" role="cell" class="text-center"><div></div></td><td aria-colindex="6" data-label="Indicador" role="cell" class="text-center"><div></div></td><td aria-colindex="7" data-label="Ações" role="cell" class="text-center"><div><div data-v-05436d28=""><button data-v-05436d28="" type="button" class="btn mr-2 btn-secondary btn-sm">-->
              <!--Show Details </button></div></div></td>-->
              <!--</tr>-->
              <!--<tr aria-rowindex="2" role="row" class="">-->
              <!--<td aria-colindex="1" data-label="Objetivo" role="cell" class="text-center"><div>Proporcionar a formação dos catadores e catadoras da ACAMARE, em temáticas como: Economia Solidária, Cooperativismo, Associativismo, Plano de Negócios e Noções de Informática, que contribuam para a constituição do empreendimento econômico solidário.</div></td><td aria-colindex="2" data-label="Meta do Projeto" role="cell" class="text-center"><div></div></td><td aria-colindex="3" data-label="Meta Orçada" role="cell" class="text-center"><div></div></td><td aria-colindex="4" data-label="Unidade de medida" role="cell" class="text-center"><div></div></td><td aria-colindex="5" data-label="Duração" role="cell" class="text-center"><div></div></td><td aria-colindex="6" data-label="Indicador" role="cell" class="text-center"><div></div></td><td aria-colindex="7" data-label="Ações" role="cell" class="text-center"><div><div data-v-05436d28=""><button data-v-05436d28="" type="button" class="btn mr-2 btn-secondary btn-sm">-->
              <!--Show Details             </button></div></div></td>-->
              <!--</tr>-->
              <!--<tr aria-rowindex="3" role="row" class="">-->
              <!--<td aria-colindex="1" data-label="Objetivo" role="cell" class="text-center"><div>Assessorar tecnicamente ao grupo para organização e gestão do empreendimento, além da elaboração do Plano de Negócios</div></td><td aria-colindex="2" data-label="Meta do Projeto" role="cell" class="text-center"><div></div></td><td aria-colindex="3" data-label="Meta Orçada" role="cell" class="text-center"><div></div></td><td aria-colindex="4" data-label="Unidade de medida" role="cell" class="text-center"><div></div></td><td aria-colindex="5" data-label="Duração" role="cell" class="text-center"><div></div></td><td aria-colindex="6" data-label="Indicador" role="cell" class="text-center"><div></div></td><td aria-colindex="7" data-label="Ações" role="cell" class="text-center"><div><div data-v-05436d28=""><button data-v-05436d28="" type="button" class="btn mr-2 btn-secondary btn-sm">-->
              <!--Show Details             </button></div></div></td>-->
              <!--</tr>-->
              <!--<tr aria-rowindex="4" role="row" class="">-->
              <!--<td aria-colindex="1" data-label="Objetivo" role="cell" class="text-center"><div>Construir uma Unidade de triagem de materiais recicláveis orgânicos e inorgânicos, proporcionando melhores condições de trabalho para o grupo.</div></td><td aria-colindex="2" data-label="Meta do Projeto" role="cell" class="text-center"><div></div></td><td aria-colindex="3" data-label="Meta Orçada" role="cell" class="text-center"><div></div></td><td aria-colindex="4" data-label="Unidade de medida" role="cell" class="text-center"><div></div></td><td aria-colindex="5" data-label="Duração" role="cell" class="text-center"><div></div></td><td aria-colindex="6" data-label="Indicador" role="cell" class="text-center"><div></div></td><td aria-colindex="7" data-label="Ações" role="cell" class="text-center"><div><div data-v-05436d28=""><button data-v-05436d28="" type="button" class="btn mr-2 btn-secondary btn-sm">-->
              <!--Show Details             </button></div></div></td>-->
              <!--</tr>-->
              <!--<tr aria-rowindex="5" role="row" class="">-->
              <!--<td aria-colindex="1" data-label="Objetivo" role="cell" class="text-center"><div>Adquirir equipamentos para estruturação do grupo ACAMARE ampliando assim as oportunidades de trabalho e de desenvolvimento de novos produtos.</div></td><td aria-colindex="2" data-label="Meta do Projeto" role="cell" class="text-center"><div></div></td><td aria-colindex="3" data-label="Meta Orçada" role="cell" class="text-center"><div></div></td><td aria-colindex="4" data-label="Unidade de medida" role="cell" class="text-center"><div></div></td><td aria-colindex="5" data-label="Duração" role="cell" class="text-center"><div></div></td><td aria-colindex="6" data-label="Indicador" role="cell" class="text-center"><div></div></td><td aria-colindex="7" data-label="Ações" role="cell" class="text-center"><div><div data-v-05436d28=""><button data-v-05436d28="" type="button" class="btn mr-2 btn-secondary btn-sm">-->
              <!--Show Details             </button></div></div></td>-->
              <!--</tr>-->
              <!--<tr aria-rowindex="6" role="row" class=""><td aria-colindex="1" data-label="Objetivo" role="cell" class="text-center"><div>Fortalecer a comercialização dos resíduos recicláveis coletados pelo ACAMARE através de sua participação em  eventos nacionais e internacionais.</div></td><td aria-colindex="2" data-label="Meta do Projeto" role="cell" class="text-center"><div></div></td><td aria-colindex="3" data-label="Meta Orçada" role="cell" class="text-center"><div></div></td><td aria-colindex="4" data-label="Unidade de medida" role="cell" class="text-center"><div></div></td><td aria-colindex="5" data-label="Duração" role="cell" class="text-center"><div></div></td><td aria-colindex="6" data-label="Indicador" role="cell" class="text-center"><div></div></td><td aria-colindex="7" data-label="Ações" role="cell" class="text-center"><div><div data-v-05436d28=""><button data-v-05436d28="" type="button" class="btn mr-2 btn-secondary btn-sm">-->
              <!--Show Details             </button></div></div></td></tr>-->
              <!--<tr aria-rowindex="7" role="row" class=""><td aria-colindex="1" data-label="Objetivo" role="cell" class="text-center"><div>Promover a visibilidade do grupo ACAMARE, junto à sociedade, com a criação e manutenção de blog na internet, além da produção de vídeo institucional e material gráfico informativo e educativo.</div></td><td aria-colindex="2" data-label="Meta do Projeto" role="cell" class="text-center"><div></div></td><td aria-colindex="3" data-label="Meta Orçada" role="cell" class="text-center"><div></div></td><td aria-colindex="4" data-label="Unidade de medida" role="cell" class="text-center"><div></div></td><td aria-colindex="5" data-label="Duração" role="cell" class="text-center"><div></div></td><td aria-colindex="6" data-label="Indicador" role="cell" class="text-center"><div></div></td><td aria-colindex="7" data-label="Ações" role="cell" class="text-center"><div><div data-v-05436d28=""><button data-v-05436d28="" type="button" class="btn mr-2 btn-secondary btn-sm">-->
              <!--Show Details             </button></div></div></td></tr>-->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- form -->
    <div v-if="!showgrid" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-6">

        <!-- objective -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('objetivo')}">
          <label for="objective" class="control-label col-md-4">Objetivo Específico:</label>
          <div class="col-md-8">
            <div approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <select v-model="objetivoIndex" name="objetivo" ng-options="objective.description for objective in proposta.specificObjectives" class="form-control"
                      v-validate="'required'">
                <option :value="index" v-for="(objetivo, index) in propsObjetivos">{{objetivo.description}}</option>
              </select>
            </div>
            <!--<ng-messages ng-if="frmAddGoal.$submitted" for="frmAddGoal.objective.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('objetivo')" class="label label-danger"> {{ errors.first('objetivo') }}</span>
          </div>
        </div>

        <!-- description -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('O que')}">
          <label for="description" class="control-label col-md-4">O que? </label>
          <div class="col-md-8">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <input v-model="meta.description" name="O que" class="form-control" type="text" maxlength="255"
                     v-validate="'required'">
            </div>
            <!--<ng-messages ng-if="frmAddGoal.$submitted" for="frmAddGoal.description.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 255</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('O que')" class="label label-danger"> {{ errors.first('O que') }}</span>
          </div>
        </div>

        <!-- quantity -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('quantidade')}">
          <label for="quantity" class="control-label col-md-4">Quanto?</label>
          <div class="col-md-8">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <input v-model="meta.quantity" name="quantidade" class="form-control text-right" type="number" min="1" max="2147483647"
                     v-validate="'required'">
            </div>
            <!--<ng-messages ng-if="frmAddGoal.$submitted" for="frmAddGoal.quantity.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 20</ng-message>-->
            <!--<ng-message when="max"  class="label label-danger">Valor máximo excedido</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('quantidade')" class="label label-danger"> {{ errors.first('quantidade') }}</span>
          </div>
        </div>

        <!-- measurement unit -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('unidade de medida')}">
          <label for="measurementUnit" class="control-label col-md-4">Unidade de medida:</label>
          <div class="col-md-8">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <input v-model="meta.measurementUnit" name="unidade de medida" class="form-control" type="text" maxlength="50"
                     v-validate="'required'">
            </div>
            <!--<ng-messages ng-if="frmAddGoal.$submitted" for="frmAddGoal.measurementUnit.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 50</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('unidade de medida')" class="label label-danger"> {{ errors.first('unidade de medida') }}</span>
          </div>
        </div>

        <!-- duration -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('Quanto tempo')}">
          <label for="duration" class="control-label col-md-4">Quanto tempo?</label>
          <div class="col-md-8">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <input v-model="meta.duration" name="Quanto tempo" class="form-control text-right" type="number" min="1" max="2147483647"
                     v-validate="'required'">
            </div>
            <!--<ng-messages ng-if="frmAddGoal.$submitted" for="frmAddGoal.duration.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 20</ng-message>-->
            <!--<ng-message when="max"  class="label label-danger">Valor máximo excedido</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('Quanto tempo')" class="label label-danger"> {{ errors.first('Quanto tempo') }}</span>
          </div>
        </div>

        <!-- performanceIndicators -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('Indicadores de execução')}">
          <label for="performanceIndicators" class="control-label col-md-4">Indicadores de execução:</label>
          <div class="col-md-8">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <select v-model="meta.performanceIndicators" name="Indicadores de execução" ng-options="indicator for indicator in listIndicators" class="form-control"
                      v-validate="'required'">
                <option :value="indicador" v-for="(indicador, index) in listIndicators">{{indicador}}</option>
              </select>
            </div>
            <!--<ng-messages ng-if="frmAddGoal.$submitted" for="frmAddGoal.performanceIndicators.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('Indicadores de execução')" class="label label-danger"> {{ errors.first('Indicadores de execução') }}</span>
          </div>
        </div>


        <!-- buttons -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-8 col-md-offset-4">
            <button @click="onAdd" type="button"
                    class="btn btn-primary btn-flat" id="proposal-goal-add">
              <i class="fa fa-check" aria-hidden="true"></i> Ok
            </button>
            <button @click="onCancel" type="button"
                    class="btn btn-default btn-flat" id="proposal-goal-cancel">
              <i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar
            </button>
          </div>
        </div>

      </div>
    </div>



  </div>


</template>

<script>
  export default {
    name: 'metasOld',
    data () {
      return {
        showgrid: true,
        table: {
          items: this.propsObjetivos,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          fields: [
            { key: 'description', label: 'Objetivo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'goals.description', label: 'Meta do Projeto', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'goals.quantity', label: 'Meta Orçada', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'goals.measurementUnit', label: 'Unidade de medida', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'goals.duration', label: 'Duração', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'goals.performanceIndicators', label: 'Indicador', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }

          ]
        },
        objective: {},
        formasContratacao: [],
        editando: false,
        meta: {}, // formulário de edição e nova meta os dados serão guardados aqui
        metaTabela: {},
        objetivoIndex: null,
        listIndicators: [
          'Capacitação realizada',
          'Consultoria/assessoria contratada',
          'Máquina/equipamento adquirido',
          'Obra concluída',
          'Produto adquirido',
          'Seguro contratado',
          'Serviço realizado',
          'Veículo adquirido'
        ]
      }
    },
    props: ['propsObjetivos'],
    watch: {
      propsObjetivos: function () {
        this.table.items = this.propsObjetivos
        this.table.items = this.buscaMetas(this.table.items)
      },
      'table.items': function () {
        this.$emit('metaAdicionada', this.table.items)
      }
    },
    mounted: function () {
    },
    methods: {
      buscaMetas (itens) {
        for (let i in itens) {
          if (itens[i].description === 'Não informado') {
            for (let j in itens[i].goals) {
              if (!itens[i].goals[j].hasOwnProperty('measurementUnit')) {
                itens[i].goals.splice(j, 1)
              }
            }
          }
        }
        return itens
      },
      onCancel () {
        this.meta = {}
        this.objetivoIndex = null
        this.showgrid = true
        this.editando = false
      },
      onAdd () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            // Se NÃO estiver em forma de edição então adiciona na tabela
            if (this.editando === true) {
              for (let i in this.meta) this.metaTabela[i] = this.meta[i]
            } else {
              if (!this.table.items[this.objetivoIndex].hasOwnProperty('goals')) {
                this.table.items[this.objetivoIndex].goals = []
              }
              this.table.items[this.objetivoIndex].goals.push(this.meta)
              this.$forceUpdate()
            }
            this.onCancel()
          }
        })
      },
      exclui (objetivo, metaIndex) {
        if (objetivo.goals[metaIndex].activities.length > 0) {
          this.$snotify.error('Meta não pode se excluida pois possui atividades vinculadas')
          return
        }
        objetivo.goals.splice(metaIndex, 1) // retira a meta selecionada do array goals do objetivo específico
      },
      edita (objetivoIndex, meta) {
        this.objetivoIndex = objetivoIndex
        this.meta = Object.assign({}, meta)
        this.metaTabela = meta
        this.showgrid = false
        this.editando = true
      }
    }
  }
</script>

<style scoped>

</style>
