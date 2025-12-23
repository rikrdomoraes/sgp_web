<template>
  <div class="box-body">
    <!-- grid -->
    <div v-show="showgrid">
      <div class="row" ng-show="$ctrl.isNewAvaiable()">
        <div class="col-md-12">
          <button @click="showgrid = !showgrid" tooltip="Adiciona um público alvo" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo Objetivo Específico</button>
        </div>
      </div>
      <br>
      <!--tabela-->
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">

            <div  class="container-fluid">
              <table role="table" aria-busy="false" aria-colcount="2" aria-rowcount="-1" class="table b-table table-hover table-bordered b-table-stacked-md">
                <thead class="">
                <tr>
                  <th tabindex="0" aria-colindex="1" aria-label="Click to sort Descending" aria-sort="ascending" class="sorting sorting_asc text-center" style="text-align: center;">Objetivo específico</th>
                  <th aria-colindex="2" class="text-center" style="text-align: center; width: 13%;">Ações</th>
                </tr>
                </thead><!---->
                <tbody role="rowgroup" class="">
                <tr v-for="(item, index) in table.items" aria-rowindex="1" role="row" class="">
                  <td aria-colindex="1" data-label="Objetivo específico" role="cell" class="text-center">
                    <div>{{item.description}}</div>
                  </td>
                  <td aria-colindex="2" data-label="Ações" role="cell" class="text-center">
                    <div>
                      <div >
                        <button type="button" :disabled="false" @click.stop="edita(item, index )" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</button>
                        <button type="button" :disabled="false" @click.stop="exclui(item, index)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</button>
                      </div>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Form-->
    <div v-if="!showgrid" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-6">

        <!--Descrição-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('descrição')}">
          <label for="description" class="control-label col-md-4">Descrição:</label>
          <div class="col-md-8">
            <div approval="addSpeObjCtrl.approval" state="addSpeObjCtrl.approvalState">
              <input v-model="objective.description" name="descrição" class="form-control" type="text" maxlength="255"
                     v-validate="'required'">
            </div>
            <span v-if="errors.first('descrição')" class="label label-danger"> {{ errors.first('descrição') }}</span>
          </div>
        </div>
        <!-- Botões -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-8 col-md-offset-4">
            <button @click="onAdd" type="button"
                    class="btn btn-primary btn-flat" id="proposal-team-add">
              <i class="fa fa-check" aria-hidden="true"></i> Ok
            </button>
            <button @click="onCancel" type="button"
                    class="btn btn-default btn-flat" id="proposal-team-cancel">
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
    name: 'objetivoEspecificoOld',
    data () {
      return {
        showgrid: true,
        table: {
          items: this.propsObjetivos
        },
        objective: {},
        objectiveTable: {},
        formasContratacao: [],
        editandoIndex: null
      }
    },
    props: ['propsObjetivos'],
    watch: {
      propsObjetivos: function () {
        this.table.items = this.propsObjetivos
      },
      'table.items': function () {
        this.$emit('objetivoAdicionado', this.table.items)
      }
    },
    mounted: function () {
    },
    methods: {
      onCancel () {
        this.objective = {}
        this.showgrid = true
        this.editandoIndex = null
      },
      onAdd () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            // Se estiver em forma de edição então adiciona na tabela
            if (this.editandoIndex !== null) {
              // this.table.items[this.editandoIndex] = this.objective
              for (let i in this.objective) this.objectiveTable[i] = this.objective[i]
            } else {
              this.table.items.push(this.objective)
            }
            this.onCancel()
          }
        })
      },
      exclui (item, index) {
        if (item.goals && item.goals.length > 0) {
          this.$snotify.error('Objetivo não pode se excluido pois possui metas vinculadas')
          return
        }
        this.table.items.splice(index, 1)
      },
      edita (item, index) {
        this.editandoIndex = index
        this.objective = Object.assign({}, item)
        this.objectiveTable = item
        this.showgrid = false
      }
    }
  }
</script>

<style scoped>

</style>
