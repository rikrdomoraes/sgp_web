<template>
  <div class="box-body">
    <!-- grid -->
    <div v-show="showgrid">
      <div class="row" ng-show="$ctrl.isNewAvaiable()">
        <div class="col-md-12">
          <button @click="showgrid = !showgrid" tooltip="Adiciona um público alvo" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova Atividade</button>
        </div>
      </div>
      <br>
      <!--tabela-->
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <table role="table" aria-busy="false" aria-colcount="7" aria-rowcount="-1" class="table b-table table-hover table-bordered b-table-stacked-md">
              <thead class="">
              <tr>
                <th tabindex="0" aria-colindex="1"  class="sorting text-center" style="text-align: center;">Meta</th>
                <th tabindex="0" aria-colindex="2"  class="sorting text-center" style="text-align: center;">Nome da atividade</th>
                <th tabindex="0" aria-colindex="3"  class="sorting text-center" style="text-align: center;">Documento comprobatório</th>
                <th tabindex="0" aria-colindex="4"  class="sorting text-center" style="text-align: center;">Início</th>
                <th tabindex="0" aria-colindex="5"  class="sorting text-center" style="text-align: center;">Fim</th>
                <th aria-colindex="6" class="text-center" style="text-align: center; width: 13%;">Ações</th>
              </tr>
              </thead>

              <tbody role="rowgroup" class="">
              <template v-for="(objetivo, objetivoIndex) in propsObjetivos">
                <template v-for="(meta, metaIndex) in objetivo.goals"  role="row" class>
                  <tr v-for="(atividade, atividadeIndex) in meta.activities"  role="row" class>
                    <td aria-colindex="1" data-label="Meta" role="cell" class="text-center">
                      <div >
                        {{meta.description}}
                      </div>
                    </td>
                    <td aria-colindex="2" data-label="Nome da atividade" role="cell" class="text-center">
                      <div>
                        {{atividade.name}}
                      </div>
                    </td>
                    <td aria-colindex="3" data-label="Documento comprobatório" role="cell" class="text-center">
                      <div>
                        {{atividade.supportingDocument}}
                      </div>
                    </td>
                    <td aria-colindex="4" data-label="Início" role="cell" class="text-center">
                      <div>
                        {{atividade.startPeriod}}
                      </div>
                    </td>
                    <td aria-colindex="5" data-label="Fim" role="cell" class="text-center">
                      <div>
                        {{atividade.finalPeriod}}
                      </div>
                    </td>
                    <td aria-colindex="6" data-label="Ações" role="cell" class="text-center">
                      <div>
                        <button type="button" :disabled="false" @click.stop="edita(atividade, meta)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</button>
                        <button type="button" :disabled="false" @click.stop="exclui(meta, atividadeIndex)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</button>
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
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
             :class="{ 'has-error' : errors.first('meta')}">
          <label for="objective" class="control-label col-md-4">Metas:</label>
          <div class="col-md-8">
            <div approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <select v-model="meta" name="meta" class="form-control"
                      v-validate="'required'">
                <option :value="meta" v-for="(meta, index) in metas">{{meta.description}}</option>
              </select>
            </div>
            <span v-if="errors.first('meta')" class="label label-danger"> {{ errors.first('meta') }}</span>
          </div>
        </div>

        <!-- description -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('nome da atividade')}">
          <label for="description" class="control-label col-md-4">Nome da atividade: </label>
          <div class="col-md-8">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <input v-model="atividadeForm.name" name="nome da atividade" class="form-control" id="proposal-activity-name"
                     type="text" maxlength="255" v-validate="'required'">
            </div>
            <span v-if="errors.first('nome da atividade')" class="label label-danger"> {{ errors.first('nome da atividade') }}</span>
          </div>
        </div>

        <!-- quantity -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('Documento comprobatório')}">
          <label for="quantity" class="control-label col-md-4">Documento comprobatório: </label>
          <div class="col-md-8">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <input v-model="atividadeForm.supportingDocument" name="Documento comprobatório" class="form-control" type="text" maxlength="255"
                     v-validate="'required'">
            </div>
            <span v-if="errors.first('Documento comprobatório')" class="label label-danger"> {{ errors.first('Documento comprobatório') }}</span>
          </div>
        </div>

        <!-- measurement unit -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('Período de início')}">
          <label for="measurementUnit" class="control-label col-md-4">Período de início: </label>
          <div class="col-md-8">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <input v-model="atividadeForm.startPeriod" name="Período de início" class="form-control text-right" type="number" min="1"
                     ng-change="addActivityCtrl.onChangePeriod(frmAddActivity.startPeriod, frmAddActivity.finalPeriod)"
                     v-validate="'required|min_value:1|max_value:' + meses">
            </div>
            <span v-if="errors.first('Período de início')" class="label label-danger"> {{ errors.first('Período de início') }}</span>
          </div>
        </div>

        <!-- duration -->
        <div  class="form-group required-field"
              :class="{ 'has-error' : errors.first('Período de fim')}">
          <label for="duration" class="control-label col-md-4">Período de fim: </label>
          <div class="col-md-8">
            <div  approval="addGoalCtrl.approval" state="addGoalCtrl.approvalState">
              <input v-model="atividadeForm.finalPeriod" name="Período de fim" class="form-control text-right" type="number" min="1" ng-max="addActivityCtrl.periods"
                     ng-change="addActivityCtrl.onChangePeriod(frmAddActivity.startPeriod, frmAddActivity.finalPeriod)"
                     v-validate="'required|min_value:1|max_value:' + meses">
            </div>
            <span v-if="errors.first('Período de fim')" class="label label-danger"> {{ errors.first('Período de fim') }}</span>
          </div>
        </div>

        <!-- buttons -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-8 col-md-offset-4">
            <button @click="onAdd(meta, atividadeForm)" type="button"
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
    name: 'atividades',
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
        meta: {},
        formasContratacao: [],
        editando: null,
        atividadeForm: {
          finalPeriod: null,
          items: [],
          name: '',
          startPeriod: null,
          supportingDocument: ''
        }, // formulário de edição e nova meta os dados serão guardados aqui
        atividadeTabela: {}, // Guarda o valor do objeto atividade antes da edição
        metaIndex: null,
        rules: `required|min_value:1|max_value:${this.meses}`
      }
    },
    props: ['propsObjetivos', 'meses'],
    computed: {
      metas () {
        let metas = []
        this.propsObjetivos.forEach((objetivo) => {
          objetivo.goals.forEach((meta) => {
            metas.push(meta)
          })
        })
        return metas
      }
    },
    watch: {
      propsObjetivos: function () {
        this.table.items = this.propsObjetivos
      },
      'table.items': function () {
        this.$emit('metaAdicionada', this.table.items)
        this.$emit('atv', this.propsObjetivos)
      }
    },
    mounted: function () {
    },
    methods: {
      onCancel () {
        this.meta = {}
        this.atividadeForm = {}
        this.showgrid = true
        this.editando = null
      },
      onAdd (meta) {
        this.$validator.validateAll().then((result) => {
          if (result) {
            // Se estiver NÃO estiver em forma de edição então adiciona na tabela
            if (this.editando === true) {
              // aqui copia todos os atributos que esta no formulário para objeto atividade que esta dentro das metas
              // de outra forma iria só apontar para endereço de memória e
              // não é isso que queremos queremos mesmo copiar os atributos para o objeto já existente
              for (let i in this.atividadeForm) this.atividadeTabela[i] = this.atividadeForm[i]
            } else {
              if (!meta.hasOwnProperty('activities')) {
                meta.activities = []
              }
              meta.activities.push(this.atividadeForm) // adiciona nova atividade na meta escolhida
            }
            this.onCancel()
          }
        })
      },
      exclui (meta, atividadeIndex) {
        meta.activities.splice(atividadeIndex, 1) // retira a meta selecionada do array goals do objetivo específico
      },
      edita (atividade, meta) {
        this.meta = meta
        // cria um novo objeto atividade, se fizesse só '=' iria somente apontar para o ponto da memoria, mas
        // queremos realmente criar um outro objeto
        this.atividadeForm = Object.assign({}, atividade)
        // Aqui apontamos a nova variavel global para a atividade que esta no objeto meta que estamos trabalhando
        this.atividadeTabela = atividade
        this.showgrid = false
        this.editando = true
      }
    }
  }
</script>

<style scoped>

</style>
