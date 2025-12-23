<template>

  <div class="box-body">
    <!-- grid -->
    <div v-show="showgrid">
      <div class="row" ng-show="$ctrl.isNewAvaiable()">
        <div class="col-md-12">
          <button @click.stop="showgrid = !showgrid" tooltip="Adiciona um público alvo" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova equipe</button>
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
                <template slot="youngs" scope="row">{{row.value? 'Sim' : 'Não'}}</template>
                <template slot="women" scope="row">{{row.value? 'Sim' : 'Não'}}</template>
                <template slot="actions" scope="row">
                  <div>
                    <b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                    <b-button type="button" :disabled="false" @click.stop="exclui(row)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                  </div>
                </template>
              </b-table>
            </b-container>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!showgrid" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-6">

        <!--Título-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('título do curso')}">
          <label for="título do curso" class="control-label col-md-4">Título do curso:</label>
          <div class="col-md-8">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <input v-model="curso.title" name="título do curso" class="form-control text-right" type="text"
                     v-validate="'required|max:255'">
            </div>
            <span v-if="errors.first('título do curso')" class="label label-danger"> {{ errors.first('título do curso') }}</span>
          </div>
        </div>

        <!-- Quantidade de educadores -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('quantidade de educadores')}">
          <label for="quantidade de educadores" class="control-label col-md-4"> Quantidade de educadores: </label>
          <div class="col-md-3 col-xs-4">
            <div>
              <input v-model="curso.educators" name="quantidade de educadores" id="quantidade de educadores" class="form-control" type="number"
                     v-validate="'required|min_value:1|max_value:2147483647'">
            </div>
            <span v-if="errors.first('quantidade de educadores')" class="label label-danger"> {{ errors.first('quantidade de educadores') }}</span>
          </div>
        </div>

        <!-- Carga horária -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('carga horaria')}">
          <label for="carga horaria" class="control-label col-md-4">Carga horária semanal:</label>
          <div class="col-md-4">
            <div class="input-group">
              <div name="career.workload.null" approval="$ctrl.approval" state="$ctrl.approvalState" class="ng-isolate-scope">
                <input v-model="curso.workload" name="carga horaria" id="carga horaria" class="form-control text-right ng-pristine ng-scope ng-not-empty ng-valid-max ng-valid-required ng-invalid ng-invalid-min ng-touched" type="number"
                       v-validate="'required|min_value:1|max_value:2147483647'">
              </div>
              <span class="input-group-addon">Horas</span>
            </div>
            <span v-if="errors.first('carga horaria')" class="label label-danger"> {{ errors.first('carga horaria') }}</span>
          </div>
        </div>

        <!--Quantidade de turmas:-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('quantidade de turmas')}">
          <label for="quantidade de turmas" class="control-label col-md-4">Quantidade de turmas:</label>
          <div class="col-md-3 col-xs-4">
            <div>
              <input v-model="curso.classes" name="quantidade de turmas" id="quantidade de turmas" class="form-control" type="number"
                     v-validate="'required|min_value:1|max_value:2147483647'">
            </div>
            <span v-if="errors.first('quantidade de turmas')" class="label label-danger"> {{ errors.first('quantidade de turmas') }}</span>
          </div>
        </div>

        <!--Quantidade de alunos por turma:-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('quantidade de alunos por turma')}">
          <label for="quantidade de alunos por turma" class="control-label col-md-4">Quantidade de alunos por turma:</label>
          <div class="col-md-3 col-xs-4">
            <div>
              <input v-model="curso.studentsPerClass" name="quantidade de alunos por turma" id="quantidade de alunos por turma" class="form-control" type="number"
                     v-validate="'required|min_value:1|max_value:2147483647'">
            </div>
            <span v-if="errors.first('quantidade de alunos por turma')" class="label label-danger"> {{ errors.first('quantidade de alunos por turma') }}</span>
          </div>
        </div>

        <!--Público-alvo:-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('público-alvo')}">
          <label for="título do curso" class="control-label col-md-4">Público-alvo:</label>
          <div class="col-md-8">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <textarea v-model="curso.targetAudience" name="público-alvo" id="público-alvo" class="form-control ng-pristine ng-scope ng-empty ng-invalid ng-invalid-required ng-touched" rows="3"
                        v-validate="'required'">
              </textarea>
            </div>
            <span v-if="errors.first('público-alvo')" class="label label-danger"> {{ errors.first('público-alvo') }}</span>
          </div>
        </div>

        <!--Conteúdo programático mínimo:-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('conteúdo programático mínimo')}">
          <label for="conteúdo programático mínimo" class="control-label col-md-4">Conteúdo programático mínimo</label>
          <div class="col-md-8">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
                      <textarea v-model="curso.content" name="conteúdo programático mínimo" id="conteúdo programático mínimo"
                                class="form-control ng-pristine ng-scope ng-empty ng-invalid ng-invalid-required ng-touched"
                                rows="3"
                                v-validate="'required'">
                      </textarea>
            </div>
            <span v-if="errors.first('conteúdo programático mínimo')" class="label label-danger"> {{ errors.first('conteúdo programático mínimo') }}</span>
          </div>
        </div>

        <!--Perfil dos profissionais a serem contratados:-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('perfil dos profissionais a serem contratados')}">
          <label for="perfil dos profissionais a serem contratados" class="control-label col-md-4">Perfil dos profissionais a serem contratados:</label>
          <div class="col-md-8">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
                      <textarea v-model="curso.professionalProfile" name="perfil dos profissionais a serem contratados" id="perfil dos profissionais a serem contratados"
                                class="form-control ng-pristine ng-scope ng-empty ng-invalid ng-invalid-required ng-touched"
                                rows="3"
                                v-validate="'required'">
                      </textarea>
            </div>
            <span v-if="errors.first('perfil dos profissionais a serem contratados')" class="label label-danger"> {{ errors.first('perfil dos profissionais a serem contratados') }}</span>
          </div>
        </div>

        <!--Especificação dos serviços:-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('especificação dos serviços')}">
          <label for="especificação dos serviços" class="control-label col-md-4">Especificação dos serviços:</label>
          <div class="col-md-8">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
                      <textarea v-model="curso.serviceSpecification" name="especificação dos serviços" id="especificação dos serviços"
                                class="form-control ng-pristine ng-scope ng-empty ng-invalid ng-invalid-required ng-touched"
                                rows="3"
                                v-validate="'required'">
                      </textarea>
            </div>
            <span v-if="errors.first('especificação dos serviços')" class="label label-danger"> {{ errors.first('especificação dos serviços') }}</span>
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
    name: 'cursosOld',
    data () {
      return {
        showgrid: true,
        table: {
          items: this.propsCursos,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          fields: [
            { key: 'title', label: 'Título do curso', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'educators', label: 'Quantidade de educadores', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'workload', label: 'Carga horária', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'classes', label: 'Quantidade de turmas', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'studentsPerClass', label: 'Alunos por turma', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
          ]
        },
        curso: {},
        cursoTabela: {},
        editandoIndex: null
      }
    },
    props: ['propsCursos'],
    watch: {
      propsCursos: function () {
        this.table.items = this.propsCursos
      },
      'table.items': function () {
        this.$emit('cursoAdicionado', this.table.items)
      }
    },
    methods: {
      exclui (row) {
        this.table.items.splice(row.index, 1)
      },
      edita (row) {
        this.editandoIndex = row.index
        this.curso = Object.assign({}, row.item)
        this.cursoTabela = row.item
        this.showgrid = false
      },
      onCancel () {
        this.curso = {}
        this.showgrid = true
        this.editandoIndex = null
        this.$forceUpdate()
      },
      onAdd () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            // Se estiver em forma de edição então adiciona na tabela
            if (this.editandoIndex !== null) {
              // this.table.items[this.editandoIndex] = this.curso           Dessa forma não esta renderizando novamente a tabela
              for (let i in this.curso) this.cursoTabela[i] = this.curso[i]  // Assim reenderiza a tabela novamente
            } else {
              this.table.items.push(this.curso)
            }
            this.onCancel()
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
