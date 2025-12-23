<template>
  <!-- states -->
  <div>
  <div class="box-body">
    <!-- grid -->
    <div>
      <div class="row" v-if="!disable">
        <div class="col-md-12">
          <button @click="onNew()" tooltip="Adiciona um dirigente" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo dirigente</button>
          <!--<g-button-ujarak color="dark-primary" size="button&#45;&#45;size-sm" @click.native="onNew()" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo dirigente </g-button-ujarak>-->
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
      <br>
    <!-- form -->
  <div class="row">
    <div class="table-responsive">
      <b-container fluid>
        <!-- Main table element -->
        <b-table how-empty
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
          <template slot="initialMandateDate" scope="row">{{row.value | moment("L")}}</template>
          <template slot="endMandateDate" scope="row">{{row.value | moment("L")}}</template>
          <template slot="actions" scope="row">
            <div v-if="disable">
              <b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Detalhar</b-button>
            </div>
            <div v-else>
              <b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
              <b-button type="button" :disabled="false" @click.stop="exclui(row)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
            </div>
          </template>
          <template slot="active" scope="row">
            <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>
          </template>
        </b-table>
      </b-container>
    </div>
  </div>
  </div>
  </div>
  <div v-show="state === 'FORM'" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp" name="frmAddChief">
    <fieldset :disabled="disable">
      <fieldset >
        <legend>Dados pessoais:</legend>
        <div class="row">
          <div class="col-md-6">
            <!-- name -->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('Nome do dirigente')}">
              <label for="Nome do dirigente" class="control-label col-md-4">Nome:</label>
              <div class="col-md-8">
                  <input v-model="dirigentes.name" name="Nome do dirigente" class="form-control" type="text" v-validate="'required|min:1|max:255'" ref="Nome do dirigente">
                  <span v-if="errors.first('Nome do dirigente')" class="label label-danger"> {{ errors.first('Nome do dirigente') }}</span>
              </div>
            </div>
            </div>
          </div>

        <div class="row">
          <div class="col-md-6">

            <!-- cpf -->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('CPF')}">
              <label for="CPF" class="control-label col-md-4">CPF:</label>
              <div class="col-md-6 col-lg-4">
                <the-mask v-model="dirigentes.cpf" ref="CPF"
                          name="CPF" class="form-control" type="text"
                          :mask="'###.###.###-##'" v-validate="'cpf|required'">
                </the-mask>
                <span v-if="errors.first('CPF')" class="label label-danger"> {{('O campo CPF do Dirigente é obrigatório') }}</span>
              </div>
            </div>
            <!-- email -->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('email')}">
              <label for="email" class="control-label col-md-4">E-mail:</label>
              <div class="col-md-8">
                <input v-model="dirigentes.email" name="email" class="form-control" type="text" v-validate="'required'">
                <span v-if="errors.first('email')" class="label label-danger"> {{('O campo Email do Dirigente é obrigatório') }}</span>
              </div>
            </div>

          </div>
        </div>
        <div class="row">



          </div>
      </fieldset>
      <fieldset>
        <legend>Período do mandato:</legend>
        <div class="row">
          <div class="col-md-6">

            <!-- initialMandateDate -->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('Data Inicial')}">
              <label for="Data Inicial" class="control-label col-md-4">Data Inicial:</label>
              <div class="col-md-6 col-lg-4">
                <div class="input-group">
                  <datepicker name="Data Inicial" ref="Data Inicial" v-model="dirigentes.initialMandateDate" input-class="form-control datepicker"
                              :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                              format="dd/MM/yyyy" v-validate="'required'">
                  </datepicker>
                  <span v-if="errors.first('Data Inicial')" class="label label-danger"> {{('O campo Data Início Mandato é obrigatório') }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">

            <!-- endMandateDate -->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('Data Final')}">
              <label for="endMandateDate" class="control-label col-md-4">Data Final:</label>
              <div class="col-md-6 col-lg-4">
                <div class="input-group">
                  <datepicker name="Data Final" ref="Data Final"  v-model="dirigentes.endMandateDate" input-class="form-control datepicker"
                              :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                              format="dd/MM/yyyy" v-validate="'required'">
                  </datepicker>
                  <span v-if="errors.first('Data Final')" class="label label-danger"> {{('O campo Data Final Mandato é obrigatório') }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="row">
          <div class="col-md-6">

            <!-- positionMandate -->
            <div class="form-group required-field">
              <label for="positionMandate" class="control-label col-md-4">Cargo:</label>
              <div class="col-md-8">
                <select v-model="dirigentes.positionMandate"
                        name="positionMandate"
                        class="form-control">
                  <option v-for="mandato in mandatos"
                          :value="dirigentes.positionMandate" >{{mandato.code + ' / ' + mandato.description}}</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </fieldset>
      <fieldset>
          <div class="col-md-6">

            <!-- buttons -->
            <div class="form-group" style="margin-bottom:0">
              <div class="col-md-12">
                <button @click="onAdd(frmAddChief)" type="button" class="btn btn-primary btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                <button @click="onCancel(frmAddChief)" type="button" class="btn btn-default btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
              </div>
            </div>

          </div>
      </fieldset>
    </fieldset>
  </div>
  </div>
</template>
<script>
    import UploadDocumentos from '../modules/uploadDocumentos'
    export default {
      components: {
        UploadDocumentos
      },
      name: 'dirigentes',
      data () {
        return {
          showgrid: true,
          state: 'GRID',
          chiefs: [],
          curIndex: 0,
          dirigentes: {},
          mandatos: {},
          mandato: {},
          editandoIndex: null,
          campoErro: null,
          table: {
            items: this.entDirigentes,
            filter: null,
            hover: true,
            bordered: true,
            currentPage: 1,
            perPage: 10,
            fields: [
              {key: 'name', label: 'Dirigente', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'initialMandateDate', label: 'Inicio do mandato', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'endMandateDate', label: 'Vigência do mandato', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
              {key: 'active', label: 'Ativo', thStyle: 'text-align: center; width: 13%', class: 'text-center'},
              { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
            ]
          }
        }
      },
      props: ['entDirigentes', 'disable'],
      watch: {
        entDirigentes: function () {
          this.table.items = this.entDirigentes
          this.desativado = this.disable
        },
        'table.items': function () {
          this.$emit('dirigenteAdicionado', this.table.items)
        }
      },
      created () {
        this.loadPositionMandate()
      },
      methods: {
        onNew () {
          this.dirigentes = {}
          this.state = 'FORM'
          this.curIndex = -1
        },
        loadPositionMandate () {
          axios.get('/proxy/project/position-mandate').then((response) => {
            this.mandatos = response.data.value
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        onCancel () {
          this.state = 'GRID'
          this.curIndex = -1
        },
        onAdd () {
          this.$validator.validateAll().then((result) => {
            if (result) {
              if (this.editandoIndex !== null) {
                for (let i in this.dirigentes) this.chiefs[i] = this.dirigentes[i]
              } else {
                this.table.items.push(this.dirigentes)
              }
              this.$forceUpdate()
              this.onCancel()
              sessionStorage.removeItem('param')
            } else {
              this.errors.items.forEach((item) => {
                this.campoErro = item.field
                this.$snotify.error(item.msg, '', this.$root._data.error, this.$refs[this.campoErro].focus())
              })
            }
          })
        },
        edita (row) {
          this.state = 'FORM'
          this.editandoIndex = row.index
          this.dirigentes = Object.assign({}, row.item)
          this.dirigentes = row.item
        },
        exclui (row) {
          this.table.items.splice(row.index, 1)
        }
      }
    }
</script>

<style scoped>

</style>
