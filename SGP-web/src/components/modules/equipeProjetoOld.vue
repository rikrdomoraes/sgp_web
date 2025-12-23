<template>
  <div class="box-body">
    <!-- grid -->
    <div v-show="showgrid">
      <div class="row" ng-show="$ctrl.isNewAvaiable()">
        <div class="col-md-12">
          <button @click="showgrid = !showgrid" tooltip="Adiciona um público alvo" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova equipe</button>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
      <br>
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <b-container fluid>
              <!-- Main table element -->
              <b-table show-empty
                       stacked="md"
                       :bordered="table.bordered"
                       :items="table.items"
                       :hover="table.hover"
                       :fields="table.fields"
                       :filter="table.filter"
                       :current-page="table.currentPage"
                       :per-page="table.perPage"
                       :sort-by.sync="table.sortBy"
                       :sort-desc.sync="table.sortDesc"
                       empty-text="Nenhum registro encontrado"
              >
                <template slot="remunerated" scope="row">{{row.value? 'Sim' : 'Não'}}</template>
                <template slot="actions" scope="row">
                  <div>
                    <b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                    <b-button type="button" :disabled="false" @click.stop="exclui(row)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                  </div>
                </template>
              </b-table>

              <b-row>
                <b-col md="12" class="my-1" right>
                  <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="" />
                </b-col>
              </b-row>

            </b-container>
          </div>
        </div>
      </div>
    </div>

    <!--Form-->
    <div v-if="!showgrid" ng-disable="!$ctrl.show.form" ng-form="frmAddProjectTeam" ssm-isolated-form style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-6">

        <!--Quantidade-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('quantidade')}">
          <label for="quantity" class="control-label col-md-4">Quantidade:</label>
          <div class="col-md-4">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <input v-model="equipe.quantity" name="quantidade" class="form-control text-right" type="number" min="1" max="2147483647"
                     v-validate="'required'">
            </div>
            <!--<ng-messages ng-if="frmAddProjectTeam.$submitted" for="frmAddProjectTeam.quantity.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--<ng-message when="min" class="label label-danger">Valor mínimo de: 1</ng-message>-->
            <!--<ng-message when="max"  class="label label-danger">Valor máximo excedido</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('quantidade')" class="label label-danger"> {{ errors.first('quantidade') }}</span>
          </div>
        </div>
        <!-- Cargo -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('cargo')}">
          <label for="role" class="control-label col-md-4">Cargo no projeto:</label>
          <div class="col-md-6">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <input v-model="equipe.role" name="cargo" class="form-control" type="text" maxlength="255"
                     v-validate="'required'">
            </div>
            <!--<ng-messages ng-if="frmAddProjectTeam.$submitted" for="frmAddProjectTeam.role.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 255</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('cargo')" class="label label-danger"> {{ errors.first('cargo') }}</span>
          </div>
        </div>
        <!-- desiredProfile -->
        <div class="form-group"
             :class="{ 'has-error' : errors.first('perfil profissional pretendido')}">
          <label for="desiredProfile" class="control-label col-md-4">Perfil profissional pretendido:</label>
          <div class="col-md-8">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <input v-model="equipe.desiredProfile" name="perfil profissional pretendido" class="form-control" type="text" maxlength="255">
            </div>
            <!--<ng-messages ng-if="frmAddProjectTeam.$submitted" for="frmAddProjectTeam.desiredProfile.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--<ng-message when="maxlength" class="label label-danger">Tamanho máximo de caracteres: 255</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('perfil profissional pretendido')" class="label label-danger"> {{ errors.first('perfil profissional pretendido') }}</span>
          </div>
        </div>

        <!-- Forma Contratação -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('forma de contratação')}">
          <label for="hiringMethod" class="control-label col-md-4">Forma de contratação:</label>
          <div class="col-md-4">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <select v-model="equipe.hiringMethod" name="forma de contratação" class="form-control" v-validate="'required'">
                <option :value="forma.name" v-for="forma in formasContratacao">{{forma.description}}</option>
              </select>
            </div>
            <!--<ng-messages ng-if="frmAddProjectTeam.$submitted" for="frmAddProjectTeam.hiringMethod.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('forma de contratação')" class="label label-danger"> {{ errors.first('forma de contratação') }}</span>
          </div>
        </div>

        <!-- Carga horária -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('carga horaria')}">
          <label for="workload" class="control-label col-md-4">Carga horária semanal:</label>
          <div class="col-md-4">
            <div class="input-group">
              <div approval="$ctrl.approval" state="$ctrl.approvalState">
                <input v-model="equipe.workload" name="carga horaria" class="form-control text-right" type="number" min="1" max="2147483647"
                       v-validate="'required'">
              </div>
              <span class="input-group-addon">Horas</span>
            </div>
            <!--<ng-messages ng-if="frmAddProjectTeam.$submitted" for="frmAddProjectTeam.workload.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--<ng-message when="min" class="label label-danger">Valor mínimo de: 1</ng-message>-->
            <!--<ng-message when="max"  class="label label-danger">Valor máximo excedido</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('carga horaria')" class="label label-danger"> {{ errors.first('carga horaria') }}</span>
          </div>
        </div>

        <!-- remunerado pelo projeto -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('remunerado pelo projeto')}">
          <label for="remunerated" class="control-label col-md-4">É remunerado pelo projeto?</label>
          <div class="col-md-3 col-xs-4">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <select v-model="equipe.remunerated" name="remunerado pelo projeto" class="form-control" v-validate="'required'">
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </select>
            </div>
            <!--<ng-messages ng-if="frmAddProjectTeam.$submitted" for="frmAddProjectTeam.remunerated.$error" role="alert">-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('remunerado pelo projeto')" class="label label-danger"> {{ errors.first('remunerado pelo projeto') }}</span>
          </div>
        </div>

        <!-- activityResume -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('Resudo das atividades')}">
          <label for="activityResume" class="control-label col-md-4">Resumo das atividades:</label>
          <div class="col-md-8">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <textarea v-model="equipe.activityResume" name="Resudo das atividades" class="form-control" rows="3"
                        v-validate="'required'">
                {{equipe.activityResume}}
              </textarea>
            </div>
            <!--<ng-messages ng-if="frmAddProjectTeam.$submitted" for="frmAddProjectTeam.activityResume.$error" role="alert">-->
            <!--<ng-message when="required"  class="label label-danger">Campo requerido</ng-message>-->
            <!--<ng-message when="validateChange" class="label label-danger">É necessário corrigir o campo</ng-message>-->
            <!--</ng-messages>-->
            <span v-if="errors.first('Resudo das atividades')" class="label label-danger"> {{ errors.first('Resudo das atividades') }}</span>
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
    name: 'equipe-projetoOld',
    data () {
      return {
        showgrid: true,
        table: {
          items: this.propsEquipes,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          totalRows: 0,
          perPage: 10,
          fields: [
            { key: 'quantity', label: 'Quantidade', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'role', label: 'Cargo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'activityResume', label: 'Resumo das atividades', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'desiredProfile', label: 'Perfil profissional', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'hiringMethod', label: 'Forma de contratação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'workload', label: 'Carga horária semanal', thStyle: 'text-align: center', class: 'text-center' },
            { key: 'remunerated', label: 'Remuneração pelo projeto?', thStyle: 'text-align: center', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }

          ]
        },
        equipe: {},
        equipeTabela: {},
        formasContratacao: [],
        editandoIndex: null
      }
    },
    props: ['propsEquipes'],
    watch: {
      propsEquipes: function () {
        this.table.items = this.propsEquipes
        this.table.totalRows = this.table.items.length
      },
      'table.items': function () {
        this.$emit('equipeAdicionada', this.table.items)
      }
    },
    mounted: function () {
      this.buscaEquipesDoProjeto()
      this.buscaFormaContratacao()
    },
    methods: {
      buscaEquipesDoProjeto () {
      },
      buscaFormaContratacao () {
        axios.get('proxy/project/proposal/project-team/hiring-method').then((response) => {
          this.formasContratacao = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onCancel () {
        this.equipe = {}
        this.showgrid = true
        this.editandoIndex = null
      },
      onAdd () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            // Se estiver em forma de edição então adiciona na tabela
            if (this.editandoIndex !== null) {
              for (let i in this.equipe) this.equipeTabela[i] = this.equipe[i]
            } else {
              this.table.items.push(this.equipe)
            }
            this.onCancel()
          }
        })
      },
      exclui (row) {
        this.table.items.splice(row.index, 1)
      },
      edita (row) {
        this.editandoIndex = row.index
        this.equipe = Object.assign({}, row.item)
        this.equipeTabela = row.item
        this.showgrid = false
      }
    }
  }
</script>

<style scoped>

</style>
