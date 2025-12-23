<template>
  <div class="box-body">
    <!-- grid -->
    <div v-show="showgrid">
      <div class="row">
        <div class="col-md-12">
          <button v-if="formEditavel" @click="showgrid = !showgrid" tooltip="Adiciona um público alvo" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova equipe</button>
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
      <br v-if="formEditavel">
      <div class="row">
        <div class="">
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
                <!--<template slot="bt_remunerado" scope="row">{{row.value ? 'Sim' : 'Não'}}</template>-->
                <template slot="bt_remunerado" scope="row">{{('' + row.value) === '1' ? 'Sim' : 'Não'}}</template>
                <template slot="actions" scope="row">
                  <div v-if="formEditavel">
                    <b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                    <b-button type="button" :disabled="false"
                              v-confirm="{ok: retorno => exclui(row), cancel: doNothing,
                           message: 'Deseja <b>APAGAR</b> o item ' + row.item.ds_cargo + ' ?'}"
                              class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                  </div>
                </template>
              </b-table>

              <b-row v-if="table.items.length > table.perPage">
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
    <div v-if="!showgrid" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="col-md-12">
        <!-- Cargo -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('cargo')}">
          <label for="role" class="control-label col-md-2">Cargo no projeto:</label>
          <div class="col-md-3">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <input v-model="equipe.ds_cargo" name="cargo" class="form-control" type="text" maxlength="255" data-vv-as="Cargo no Projeto"
                     v-validate="'required'">
            </div>
            <span v-if="errors.first('cargo')" class="label label-danger"> {{ errors.first('cargo') }}</span>
          </div>
        </div>

        <!--Quantidade-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('quantidade')}">
          <label for="quantidade" class="control-label col-md-2">Quantidade:</label>
          <div class="col-md-2">
            <div approval="$ctrl.approval" state="$ctrl.approvalState">
              <input v-model="equipe.nr_quantidade" name="quantidade" class="form-control text-right" type="number" min="1" max="2147483647" data-vv-as="Quantidade"
                     v-validate="'required'">
            </div>
            <span v-if="errors.first('quantidade')" class="label label-danger"> {{ errors.first('quantidade') }}</span>
          </div>
        </div>
        <!-- Perfil profissão -->
        <div class="form-group"
             :class="{ 'has-error' : errors.first('perfil profissional pretendido')}">
          <label for="perfilProf" class="control-label col-md-2">Perfil profissional pretendido:</label>
          <div class="col-md-4">
            <div>
              <input v-model="equipe.ds_perfil_desejado" placeholder="Informar a escolaridade" data-vv-as="Perfil profissional pretendido" name="perfil profissional pretendido" class="form-control" type="text" maxlength="255">
            </div>
            <span v-if="errors.first('perfil profissional pretendido')" class="label label-danger"> {{ errors.first('perfil profissional pretendido') }}</span>
          </div>
        </div>

        <!-- Forma Contratação -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('forma de contratação')}">
          <label for="formaContratacao" class="control-label col-md-2">Forma de contratação:</label>
          <div class="col-md-2">
            <div>
              <select @select="buscaFormaContratacao" v-model="equipe.ds_forma_contratacao" name="forma de contratação" class="form-control" v-validate="'required'" data-vv-as="Forma de contratação">
                <option :value="forma" v-for="forma in formasContratacao">{{forma}}</option>
              </select>
            </div>
            <span v-if="errors.first('forma de contratação')" class="label label-danger"> {{ errors.first('forma de contratação') }}</span>
          </div>
        </div>

        <!-- Carga horária -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('carga horaria')}">
          <label for="cargaHoraria" class="control-label col-md-2">Carga horária semanal:</label>
          <div class="col-md-2">
            <div class="input-group">
              <div>
                <input v-model="equipe.dc_carga_horaria" name="carga horaria" class="form-control text-right" type="number" min="1" max="2147483647" data-vv-as="Carga horária semanal"
                       v-validate="'required'">
              </div>
              <span class="input-group-addon">Horas</span>
            </div>
            <span v-if="errors.first('carga horaria')" class="label label-danger"> {{ errors.first('carga horaria') }}</span>
          </div>
        </div>

        <!-- remunerado pelo projeto -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('remunerado pelo projeto')}">
          <label for="remunerado" class="control-label col-md-2">É remunerado pelo projeto?</label>
          <div class="col-md-3">
            <div>
              <select v-model="equipe.bt_remunerado" name="remunerado pelo projeto" class="form-control" v-validate="'required'" data-vv-as="É remunerado pelo projeto?">
                <option value="0">Não</option>
                <option value="1">Sim</option>
              </select>
            </div>
            <span v-if="errors.first('remunerado pelo projeto')" class="label label-danger"> {{ errors.first('remunerado pelo projeto') }}</span>
          </div>
        </div>

        <!-- resumoAtividade -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('Resumo das atividades')}">
          <label for="resumoAtividade" class="control-label col-md-2">Resumo das atividades:</label>
          <div class="col-md-8">
            <div>
              <textarea v-resizable v-model="equipe.ds_resumo_atividades" name="Resumo das atividades" placeholder="Descreva as principais atividades que serão executadas no projeto por esse(s) proficional(is)" class="form-control" rows="3"
                        v-validate="'required'" data-vv-as="Resumo das atividades">
                {{equipe.ds_resumo_atividades}}
              </textarea>
            </div>
            <span v-if="errors.first('Resumo das atividades')" class="label label-danger"> {{ errors.first('Resumo das atividades') }}</span>
          </div>
        </div>

        <!-- Botões -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-8 col-md-offset-2">
            <button @click="onAdd" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
            <button @click="onCancel" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'equipe-projeto',
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
            perPage: 100,
            fields: [
              { key: 'nr_quantidade', label: 'Quantidade', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'ds_cargo', label: 'Cargo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'ds_resumo_atividades', label: 'Resumo das atividades', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'ds_perfil_desejado', label: 'Perfil profissional', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'ds_forma_contratacao', label: 'Forma de contratação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'dc_carga_horaria', label: 'Carga horária semanal', thStyle: 'text-align: center', class: 'text-center' },
              { key: 'bt_remunerado', label: 'Remuneração pelo projeto?', thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }

            ]
          },
          formEditavel: false,
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
        this.formEditavel = !_.has(this.$route.params, 'numero')
        if (!this.formEditavel) {
          this.table.fields = _.remove(this.table.fields, function (f) {
            return f.key !== 'actions'
          })
        }
      },
      methods: {
        buscaEquipesDoProjeto () {
        },
        buscaFormaContratacao () {
          axiosLaravel.get('formas-contratacao').then((response) => {
            this.formasContratacao = response.data
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
  .input-group-addon {
    border: 0 !important;
    background: transparent !important;
  }
</style>
